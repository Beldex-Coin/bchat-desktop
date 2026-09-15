import { getMessageById } from '../../data/data';

/**
 * In-memory registry of messages currently sitting in the "failed to send" state
 * (Message.hasErrors()). Android automatically retries a failed send on a persistent,
 * exponential-backoff job queue, so a send that fails because the network briefly dropped
 * just succeeds on its next scheduled attempt once connectivity returns - no user action
 * needed. Desktop had no equivalent: a failed send stayed failed until the user manually
 * used the "Resend" entry in the message's right-click menu (Message.retrySend()).
 *
 * This registry + retryAllFailedSendsOnReconnect() closes that gap for the common case (the
 * app stays running across the network blip): we track every message as it fails, and replay
 * Message.retrySend() - the same code path the manual "Resend" menu item already uses - for
 * each of them as soon as we detect we're back online (see onOnline() in main_renderer.tsx).
 *
 * This is intentionally the lightweight fix: it does not persist across an app restart the
 * way Android's DB-backed job queue does. A message that fails and the app is closed before
 * we come back online will still need a manual resend, same as today.
 */
const failedSendMessageIds = new Set<string>();

const RETRY_STAGGER_MS = 500;

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
}

/**
 * Retries every message currently tracked as failed, one at a time with a short stagger so
 * reconnecting doesn't fire a burst of sends all at once. Safe to call anytime (e.g. on every
 * 'online' event) - it's a no-op when nothing is tracked, and Message.retrySend() itself is a
 * no-op if we're not actually online yet.
 */
export async function retryAllFailedSendsOnReconnect() {
  if (!failedSendMessageIds.size) {
    return;
  }

  const idsToRetry = [...failedSendMessageIds];
  window?.log?.info(
    `retryAllFailedSendsOnReconnect: attempting to resend ${idsToRetry.length} failed message(s) after reconnect`
  );

  // eslint-disable-next-line no-restricted-syntax
  for (const messageId of idsToRetry) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const message = await getMessageById(messageId);
      if (!message || !message.hasErrors()) {
        // already resolved some other way (manual resend, deleted, ...) - stop tracking it
        untrackFailedSend(messageId);
        // eslint-disable-next-line no-continue
        continue;
      }
      // eslint-disable-next-line no-await-in-loop
      await message.retrySend();
      // on success, Message.retrySend() -> MessageSentHandler.handleMessageSentSuccess()
      // untracks it; on failure it stays tracked (or gets re-tracked) for the next reconnect.
    } catch (e) {
      window?.log?.warn(`retryAllFailedSendsOnReconnect: failed to retry ${messageId}`, e);
    }
    // eslint-disable-next-line no-await-in-loop
    await new Promise(resolve => global.setTimeout(resolve, RETRY_STAGGER_MS));
  }
}
