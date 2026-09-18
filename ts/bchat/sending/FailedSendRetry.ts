import { getMessageById } from '../../data/data';

/**
 * In-memory registry of messages currently sitting in the "failed to send" state
 * (Message.hasErrors()). Android automatically retries a failed send on a persistent,
 * exponential-backoff job queue, so a send that fails because the network briefly dropped
 * just succeeds on its next scheduled attempt once connectivity returns - no user action
 * needed. Desktop had no equivalent: a failed send stayed failed until the user manually
 * used the "Resend" entry in the message's right-click menu (Message.retrySend()).
 *
 * This registry + retryAllFailedSendsOnReconnect() closes that gap. There are two triggers:
 *
 *  1. A periodic sweep (startFailedSendRetryTimer(), every RETRY_SWEEP_INTERVAL_MS) that runs
 *     independently of any online/offline detection. Most send failures (a single node down, a
 *     timeout) happen while the OS still reports us as online, so nothing ever tells us to
 *     retry - only this timer does. If a retry attempt itself fails, the message is simply
 *     still tracked (or re-tracked) for the next tick, so we keep trying periodically rather
 *     than giving up after one attempt.
 *  2. A couple of fast-path triggers for when we have a stronger, more immediate signal that
 *     connectivity likely just came back - see onOnline() in main_renderer.tsx (delayed a few
 *     seconds so DNS/the connection has time to actually come up) and pollNodeForKey() in
 *     swarmPolling.ts (triggered by an actual successful round trip to a snode, which is
 *     stronger evidence than either the OS's online event or a fixed delay). These just mean we
 *     don't have to wait for the next periodic tick when we already have a good reason to
 *     believe now is a good time to retry; the periodic sweep is what makes retrying reliable
 *     even when neither of these fires.
 *
 * This is intentionally the lightweight fix: it does not persist across an app restart the
 * way Android's DB-backed job queue does. A message that fails and the app is closed before
 * we come back online will still need a manual resend, same as today.
 *
 * A message is auto-retried at most MAX_AUTO_RETRY_ATTEMPTS_PER_MESSAGE times before this gives
 * up on it (see that constant below) - some send failures can never succeed no matter how many
 * times they're retried (an invalid conversation type, an unsupported legacy group, ...), and
 * without a cap those get retried by every sweep tick forever.
 */
const failedSendMessageIds = new Set<string>();

// How many times the sweep below (retryAllFailedSendsOnReconnect()) will automatically retry a
// given message before giving up on it for good. This exists because trackFailedSend() (see its
// callers - conversation.ts's sendMessageJob() catch, message.ts's retrySend() catch, and
// MessageSentHandler.handleMessageSentFailure()) has no reliable way to tell a transient failure
// (a node down, a timeout) apart from one that can never succeed no matter how many times it's
// retried (an invalid conversation type, an unsupported legacy group, ...) - those callers just
// track every error uniformly, since correctly classifying every possible throw across the send
// pipeline would be far more fragile than simply bounding how many times we auto-retry. Without
// this, a message that fails for a permanent reason gets retried by every periodic sweep tick (or
// reconnect) forever. A message that hits this cap just stops being auto-retried - it's still
// shown as failed in the conversation, and a manual "Resend" (Message.retrySend(), called
// directly from the right-click menu, not through this registry) is completely unaffected.
const MAX_AUTO_RETRY_ATTEMPTS_PER_MESSAGE = 10;

// How many times each currently-tracked message has actually been handed to Message.retrySend()
// by the sweep below. Only ever touched here: incremented right before retrySend() is called, and
// cleared whenever the message stops being tracked (untrackFailedSend()/clearFailedSendRegistry())
// - including when it's given up on for hitting the cap - so a message that later fails again
// fresh (e.g. after a successful manual resend, or after being deleted and unrelated to before)
// starts with a clean budget rather than being permanently barred. Deliberately NOT touched by
// trackFailedSend() itself: that function is called both for a message's first-ever failure and
// for a sweep-triggered retry attempt failing again, and it can't tell those apart - resetting the
// count there would let a message dodge the cap forever simply by continuing to fail.
const autoRetryAttemptCounts = new Map<string, number>();

const RETRY_STAGGER_MS = 500;

// How often the periodic backstop sweep below checks for anything to retry. Independent of any
// online/offline signal - see the file comment above for why that independence matters.
const RETRY_SWEEP_INTERVAL_MS = 30 * 1000;

// Guards against two triggers (e.g. the periodic timer and a poll-success trigger) starting an
// overlapping sweep - a message send can itself take a while, so without this a second trigger
// firing mid-sweep would just retry the same still-in-flight messages again.
let sweepInProgress = false;

let retryTimerStarted = false;

/**
 * Starts the periodic backstop sweep (see the file comment above). Safe to call more than once -
 * only the first call actually starts the timer. Call this once during app startup, not on
 * module import, so importing this file (e.g. from a test) doesn't leave a real timer running.
 */
export function startFailedSendRetryTimer() {
  if (retryTimerStarted) {
    return;
  }
  retryTimerStarted = true;
  global.setInterval(() => {
    void retryAllFailedSendsOnReconnect();
  }, RETRY_SWEEP_INTERVAL_MS);
}

export function trackFailedSend(messageId: string | undefined | null) {
  if (!messageId) {
    return;
  }
  failedSendMessageIds.add(messageId);
}

export function untrackFailedSend(messageId: string | undefined | null) {
  if (!messageId) {
    return;
  }
  failedSendMessageIds.delete(messageId);
  autoRetryAttemptCounts.delete(messageId);
}

/**
 * Clears every message id currently tracked as failed, without touching whatever is on those
 * messages themselves (they may not even exist anymore - the DB is what's authoritative). This
 * Set is otherwise never cleared on its own: nothing removes an id from it except a later
 * successful send or being resolved away by a sweep (see retryAllFailedSendsOnReconnect()).
 * Call this whenever the messages it refers to have just stopped being ours to worry about -
 * the account was deleted (DeleteAccountModal.tsx's deleteDbLocally()) or restored/relinked
 * (accountManager.ts's createAccount(), used by both recovery and device-linking sign-in).
 * Without this, a sweep after either of those could call getMessageById() for a message id from
 * a previous account and, depending on timing, retry-send something that isn't the current
 * user's to send.
 */
export function clearFailedSendRegistry() {
  failedSendMessageIds.clear();
  autoRetryAttemptCounts.clear();
}

/**
 * Retries every message currently tracked as failed, one at a time with a short stagger so
 * reconnecting doesn't fire a burst of sends all at once. Safe to call anytime, from any of the
 * triggers described in the file comment above - it's a no-op when nothing is tracked, a no-op
 * if a sweep is already in progress (rather than running a second one concurrently), and
 * Message.retrySend() itself is a no-op if we're not actually online yet.
 */
export async function retryAllFailedSendsOnReconnect() {
  if (!failedSendMessageIds.size || sweepInProgress) {
    return;
  }
  sweepInProgress = true;

  try {
    const idsToRetry = [...failedSendMessageIds];
    window?.log?.info(
      `retryAllFailedSendsOnReconnect: attempting to resend ${idsToRetry.length} failed message(s) after reconnect`
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const messageId of idsToRetry) {
      try {
        const attemptsSoFar = autoRetryAttemptCounts.get(messageId) ?? 0;
        if (attemptsSoFar >= MAX_AUTO_RETRY_ATTEMPTS_PER_MESSAGE) {
          // Used up its automatic retry budget without ever resolving - almost certainly a
          // permanent failure that trackFailedSend()'s callers couldn't tell apart from a
          // transient one up front (see MAX_AUTO_RETRY_ATTEMPTS_PER_MESSAGE above). Stop
          // auto-retrying it rather than doing this forever; it stays visible as failed and can
          // still be resent manually.
          window?.log?.warn(
            `retryAllFailedSendsOnReconnect: giving up auto-retrying ${messageId} after ${attemptsSoFar} attempts`
          );
          untrackFailedSend(messageId);
          // eslint-disable-next-line no-continue
          continue;
        }

        // eslint-disable-next-line no-await-in-loop
        const message = await getMessageById(messageId);
        if (!message || !message.hasErrors()) {
          // already resolved some other way (manual resend, deleted, ...) - stop tracking it
          untrackFailedSend(messageId);
          // eslint-disable-next-line no-continue
          continue;
        }
        autoRetryAttemptCounts.set(messageId, attemptsSoFar + 1);
        // eslint-disable-next-line no-await-in-loop
        await message.retrySend();
        // on success, Message.retrySend() -> MessageSentHandler.handleMessageSentSuccess()
        // untracks it (and so clears its attempt count too); on failure it stays tracked (or gets
        // re-tracked) for the next sweep - whether that's the next periodic tick or another
        // fast-path trigger - until it either resolves or hits the cap above.
      } catch (e) {
        window?.log?.warn(`retryAllFailedSendsOnReconnect: failed to retry ${messageId}`, e);
      }
      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => global.setTimeout(resolve, RETRY_STAGGER_MS));
    }
  } finally {
    sweepInProgress = false;
  }
}
