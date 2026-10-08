/* eslint-disable no-await-in-loop */
/* eslint-disable more/no-then */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { PubKey } from '../../types';
import * as snodePool from './snodePool';
import { ERROR_CODE_NO_CONNECT, retrieveNextMessages } from './SNodeAPI';
import { SignalService } from '../../../protobuf';
import * as Receiver from '../../../receiver/receiver';
import _, { concat } from 'lodash';
import {
  getLastHashBySnode,
  getSeenMessagesByHashList,
  saveSeenMessageHashes,
  Snode,
  updateLastHash,
} from '../../../data/data';

import { StringUtils, UserUtils } from '../../utils';
import { ConversationModel } from '../../../models/conversation';
import { DURATION, SWARM_POLLING_TIMEOUT } from '../../constants';
import { getConversationController } from '../../conversations';
import { perfEnd, perfStart } from '../../utils/Performance';
import { ed25519Str } from '../../onions/onionPath';
import { updateIsOnline } from '../../../state/ducks/onion';
import { retryAllFailedSendsOnReconnect } from '../../sending/FailedSendRetry';
import { getHasSeenHF170, getHasSeenHF180 } from './hfHandling';

interface Message {
  hash: string;
  expiration: number;
  data: string;
}

// Some websocket nonsense
export function processMessage(message: string, options: any = {}, messageHash: string) {
  try {
    const dataPlaintext = new Uint8Array(StringUtils.encode(message, 'base64'));
    const messageBuf = SignalService.WebSocketMessage.decode(dataPlaintext);
    if (messageBuf.type === SignalService.WebSocketMessage.Type.REQUEST) {
      Receiver.handleRequest(messageBuf.request?.body, options, messageHash);
    }
  } catch (error) {
    const info = {
      message,
      error: error.message,
    };
    window?.log?.warn('HTTP-Resources Failed to handle message:', info);
  }
}

// main_renderer.tsx registers its onOnline() here, so that a successful poll while
// window.isOnline is false runs the exact same recovery as the browser's 'online' event would have
// (see the success path in pollNodeForKey() below). Kept as a callback rather than an import to
// avoid a dependency from this module back onto main_renderer.
let pollReconnectHandler: (() => void) | undefined;
export function setPollReconnectHandler(handler: (() => void) | undefined) {
  pollReconnectHandler = handler;
}

/**
 * While marked offline, pollForAllKeys() still polls our own swarm once every this many runs
 * (about a minute), in case the browser wrongly thinks we are offline.
 */
export const OFFLINE_PROBE_EVERY_TICKS = 12;

const POLL_SUCCEEDED = 'succeeded';
const POLL_FAILED = 'failed';
const POLL_FAILED_NO_CONNECTION = 'failed-no-connection';
type PollOutcome = typeof POLL_SUCCEEDED | typeof POLL_FAILED | typeof POLL_FAILED_NO_CONNECTION;

/**
 * The longest we wait between two polls while our swarm keeps failing (like Android's 15s cap).
 */
export const POLL_BACKOFF_MAX = 15 * DURATION.SECONDS;

/**
 * The delay before the next poll after `failures` polls of our own swarm failed in a row: the
 * normal interval, doubled on each failure up to POLL_BACKOFF_MAX.
 */
export function getPollBackoffDelay(failures: number) {
  return Math.min(SWARM_POLLING_TIMEOUT.ACTIVE * 2 ** failures, POLL_BACKOFF_MAX);
}

let instance: SwarmPolling | undefined;
export const getSwarmPollingInstance = () => {
  if (!instance) {
    instance = new SwarmPolling();
  }
  return instance;
};

export class SwarmPolling {
  private groupPolling: Array<{ pubkey: PubKey; lastPolledTimestamp: number }>;
  private readonly lastHashes: Record<string, Record<string, Record<number, string>>>;
  private offlineRuns: number;
  private ownSwarmFailures: number;

  constructor() {
    this.groupPolling = [];
    this.lastHashes = {};
    this.offlineRuns = 0;
    this.ownSwarmFailures = 0;
  }

  public async start(waitForFirstPoll = false): Promise<void> {
    this.loadGroupIds();
    if (waitForFirstPoll) {
      await this.pollForAllKeys();
    } else {
      void this.pollForAllKeys();
    }
  }

  /**
   * Used fo testing only
   */
  public resetSwarmPolling() {
    this.groupPolling = [];
  }

  public forcePolledTimestamp(pubkey: PubKey, lastPoll: number) {
    this.groupPolling = this.groupPolling.map(group => {
      if (PubKey.isEqual(pubkey, group.pubkey)) {
        return {
          ...group,
          lastPolledTimestamp: lastPoll,
        };
      }
      return group;
    });
  }

  public addGroupId(pubkey: PubKey) {
    if (this.groupPolling.findIndex(m => m.pubkey.key === pubkey.key) === -1) {
      window?.log?.info('Swarm addGroupId: adding pubkey to polling', pubkey.key);
      this.groupPolling.push({ pubkey, lastPolledTimestamp: 0 });
    }
  }

  public removePubkey(pk: PubKey | string) {
    const pubkey = PubKey.cast(pk);
    window?.log?.info('Swarm removePubkey: removing pubkey from polling', pubkey.key);
    this.groupPolling = this.groupPolling.filter(group => !pubkey.isEqual(group.pubkey));
  }

  /**
   * Only public for testing purpose.
   *
   * Currently, a group with an
   *  -> an activeAt less than 2 days old is considered active and polled often (every 5 sec)
   *  -> an activeAt less than 1 week old is considered medium_active and polled a bit less (every minute)
   *  -> an activeAt more than a week old is considered inactive, and not polled much (every 2 minutes)
   */
  public getPollingTimeout(convoId: PubKey) {
    const convo = getConversationController().get(convoId.key);
    if (!convo) {
      return SWARM_POLLING_TIMEOUT.INACTIVE;
    }
    const activeAt = convo.get('active_at');
    if (!activeAt) {
      return SWARM_POLLING_TIMEOUT.INACTIVE;
    }

    const currentTimestamp = Date.now();

    // consider that this is an active group if activeAt is less than two days old
    if (currentTimestamp - activeAt <= DURATION.DAYS * 2) {
      return SWARM_POLLING_TIMEOUT.ACTIVE;
    }

    if (currentTimestamp - activeAt <= DURATION.DAYS * 7) {
      return SWARM_POLLING_TIMEOUT.MEDIUM_ACTIVE;
    }
    return SWARM_POLLING_TIMEOUT.INACTIVE;
  }

  /**
   * Only public for testing
   */
  public async pollForAllKeys() {
    const ourPubkey = UserUtils.getOurPubKeyFromCache();
    if (!window.getGlobalOnlineStatus()) {
      window?.log?.error('pollForAllKeys: offline');
      // Only main_renderer.tsx's onOnline() brings us back online, on the browser's 'online'
      // event. If that event never comes, we would never poll again until a restart.
      this.offlineRuns += 1;
      if (navigator.onLine && pollReconnectHandler) {
        // the browser already says we are online: the event was missed
        window?.log?.warn('pollForAllKeys: navigator is online but we are not; reconnecting');
        pollReconnectHandler();
      } else if (this.offlineRuns % OFFLINE_PROBE_EVERY_TICKS === 0) {
        // the browser can also be wrong about being offline: a poll that works reconnects us
        // (see pollNodeForKey()). Failures while navigator.onLine is false don't count against
        // the snodes, so this can't get them dropped during a real outage.
        void this.pollOnceForKey(ourPubkey, false, 0);
      }
      // Important to set up a new polling
      setTimeout(this.pollForAllKeys.bind(this), SWARM_POLLING_TIMEOUT.ACTIVE);
      return;
    }
    this.offlineRuns = 0;
    // we always poll as often as possible for our pubkey
    const directPromises = Promise.all([
      this.pollOnceForKey(ourPubkey, false, 0),
      // this.pollOnceForKey(ourPubkey, false, 5), // uncomment, and test me once we store the config messages to the namespace 5
    ]).then(([outcome]) => {
      // Back off while our swarm keeps failing, so a bad patch isn't hammered every 5s. Not when
      // our own connection is down: we're marked offline then, and polling stops anyway.
      if (outcome === POLL_SUCCEEDED) {
        this.ownSwarmFailures = 0;
      } else if (outcome === POLL_FAILED) {
        this.ownSwarmFailures += 1;
      }
    });

    const now = Date.now();
    const groupPromises = this.groupPolling.map(async group => {
      const convoPollingTimeout = this.getPollingTimeout(group.pubkey);

      const diff = now - group.lastPolledTimestamp;

      const loggingId =
        getConversationController()
          .get(group.pubkey.key)
          ?.idForLogging() || group.pubkey.key;

      if (diff >= convoPollingTimeout) {
        const hardfork190Happened = await getHasSeenHF170();
        const hardfork191Happened = await getHasSeenHF180();
        window?.log?.info(
          `Polling for ${loggingId}; timeout: ${convoPollingTimeout}; diff: ${diff} ; hardfork190Happened: ${hardfork190Happened}; hardfork191Happened: ${hardfork191Happened} `
        );

        if (hardfork190Happened && !hardfork191Happened) {
          // during the transition period, we poll from both namespaces (0 and -10) for groups
          return Promise.all([
            this.pollOnceForKey(group.pubkey, true, undefined),
            this.pollOnceForKey(group.pubkey, true, -10),
          ]).then(() => undefined);
        }

        if (hardfork190Happened && hardfork191Happened) {
          // after the transition period, we poll from the namespace -10 only for groups
          return this.pollOnceForKey(group.pubkey, true, -10);
        }

        // before any of those hardforks, we just poll from the default namespace being 0
        return this.pollOnceForKey(group.pubkey, true, 0);
      }
      window?.log?.info(
        `Not polling for ${loggingId}; timeout: ${convoPollingTimeout} ; diff: ${diff}`
      );

      return Promise.resolve();
    });
    try {
      await Promise.all(concat([directPromises], groupPromises));
    } catch (e) {
      window?.log?.info('pollForAllKeys exception: ', e);
      throw e;
    } finally {
      const delay = getPollBackoffDelay(this.ownSwarmFailures);
      if (delay !== SWARM_POLLING_TIMEOUT.ACTIVE) {
        window?.log?.info(
          `pollForAllKeys: our swarm failed ${this.ownSwarmFailures} times in a row; next poll in ${delay}ms`
        );
      }
      setTimeout(this.pollForAllKeys.bind(this), delay);
    }
  }

  /**
   * Only exposed as public for testing
   */
  public async pollOnceForKey(
    pubkey: PubKey,
    isGroup: boolean,
    namespace?: number
  ): Promise<PollOutcome> {
    const pkStr = pubkey.key;

    const firstNode = this.pickNodeToPoll(await snodePool.getSwarmFor(pkStr));
    let result = firstNode ? await this.pollNodeForKey(firstNode, pubkey, namespace) : null;

    // Retrying the node that just failed mostly fails again (it's timing out, refusing us, or
    // was just dropped from the swarm), so try another member of the swarm in this same cycle
    // instead, like Android does. Not when our own connection is down: every node would fail.
    if (firstNode && result === POLL_FAILED) {
      const otherNodes = (await snodePool.getSwarmFor(pkStr)).filter(
        n => n.pubkey_ed25519 !== firstNode.pubkey_ed25519
      );
      const secondNode = this.pickNodeToPoll(otherNodes);
      if (secondNode) {
        window?.log?.info(
          `pollOnceForKey: ${ed25519Str(firstNode.pubkey_ed25519)} failed, trying ${ed25519Str(
            secondNode.pubkey_ed25519
          )}`
        );
        result = await this.pollNodeForKey(secondNode, pubkey, namespace);
      }
    }

    const pollSucceeded = Array.isArray(result);
    const messages: Array<any> = Array.isArray(result) ? _.uniqBy(result, (x: any) => x.hash) : [];

    // if every node we tried returned an error, no need to update the lastPolledTimestamp
    if (isGroup && pollSucceeded) {
      window?.log?.info(
        `Polled for group(${ed25519Str(pubkey.key)}):, got ${messages.length} messages back.`
      );
      let lastPolledTimestamp = Date.now();
      if (messages.length >= 95) {
        // if we get 95 messages or more back, it means there are probably more than this
        // so make sure to retry the polling in the next 5sec by marking the last polled timestamp way before that it is really
        // this is a kind of hack
        lastPolledTimestamp = Date.now() - SWARM_POLLING_TIMEOUT.INACTIVE - 5 * 1000;
      }
      // update the last fetched timestamp
      this.groupPolling = this.groupPolling.map(group => {
        if (PubKey.isEqual(pubkey, group.pubkey)) {
          return {
            ...group,
            lastPolledTimestamp,
          };
        }
        return group;
      });
    } else if (isGroup) {
      window?.log?.info(
        `Polled for group(${ed25519Str(
          pubkey.key
        )}):, but no snode returned something else than null.`
      );
    }

    perfStart(`handleSeenMessages-${pkStr}`);

    const newMessages = await this.handleSeenMessages(messages);

    perfEnd(`handleSeenMessages-${pkStr}`, 'handleSeenMessages');

    newMessages.forEach((m: Message) => {
      const options = isGroup ? { conversationId: pkStr } : {};
      processMessage(m.data, options, m.hash);
    });

    if (pollSucceeded) {
      return POLL_SUCCEEDED;
    }
    // no node to poll (an empty swarm) counts as a failure of the swarm
    return result === POLL_FAILED_NO_CONNECTION ? POLL_FAILED_NO_CONNECTION : POLL_FAILED;
  }

  /**
   * Prefer a node we already polled (we have its last hash), otherwise pick a random one.
   */
  private pickNodeToPoll(swarmSnodes: Array<Snode>): Snode | undefined {
    const alreadyPolled = swarmSnodes.filter((n: Snode) => this.lastHashes[n.pubkey_ed25519]);
    return _.sample(alreadyPolled) || _.sample(swarmSnodes);
  }

  // Fetches messages for `pubkey` from `node` potentially updating
  // the lash hash record
  private async pollNodeForKey(
    node: Snode,
    pubkey: PubKey,
    namespace?: number
  ): Promise<Array<any> | typeof POLL_FAILED | typeof POLL_FAILED_NO_CONNECTION> {
    const edkey = node.pubkey_ed25519;

    const pkStr = pubkey.key;

    try {
      const prevHash = await this.getLastHash(edkey, pkStr, namespace || 0);
      const result = await retrieveNextMessages(node, prevHash, pkStr, namespace);
      const lastMessage = _.last(result);
      if (lastMessage) {
        await this.updateLastHash({
          edkey: edkey,
          pubkey,
          namespace: namespace || 0,
          hash: lastMessage.hash,
          expiration: lastMessage.expiration,
        });
      }

      // A poll just round-tripped to a snode and back - that's hard evidence we have real
      // connectivity again, independent of (and more reliable than) the browser's online/offline
      // events that main_renderer.tsx's onOnline() otherwise depends on for
      // retryAllFailedSendsOnReconnect(). Those events are known to be flaky on some platforms
      // (delayed, missed, or not fired at all), which left failed sends stuck with no way to
      // recover until a manual resend if that was the only trigger. Mirror the same recovery
      // here as a second, platform-independent path.
      //
      // This has to key off window.isOnline, not the redux flag: retrieveNextMessages() has
      // already set redux back to true by the time we get here, so a redux check would never fire.
      // And window.isOnline is what actually gates sends, resends and the retry sweep - it's only
      // ever set by connect()/disconnect(), so if the 'online' event was missed, nothing else
      // would ever set it back to true. The global online status is checked too: it goes false
      // a second before disconnect() sets window.isOnline, and stops all other polling.
      if (!window.isOnline || window.getGlobalOnlineStatus?.() === false) {
        window?.log?.info('pollNodeForKey: poll succeeded while marked offline; reconnecting');
        window.inboxStore?.dispatch(updateIsOnline(true));
        if (pollReconnectHandler) {
          pollReconnectHandler();
        } else {
          window.isOnline = true;
          void retryAllFailedSendsOnReconnect();
        }
      }

      return result;
    } catch (e) {
      // Only the success path above is allowed to declare us back online. Any other failure
      // (421 swarm change, decode error, bad path, clock skew...) is not proof the network
      // works, and treating it as such would kick off a resend sweep that burns retry attempts.
      if (
        e.message === ERROR_CODE_NO_CONNECT &&
        window.inboxStore?.getState().onionPaths.isOnline
      ) {
        window.inboxStore?.dispatch(updateIsOnline(false));
      }
      window?.log?.info('pollNodeForKey failed with', e.message);
      if (e.message === ERROR_CODE_NO_CONNECT) {
        return POLL_FAILED_NO_CONNECTION;
      }
      // getLastHash() cached an entry for this node before the request, which would make
      // pickNodeToPoll() treat it as a node that works and pick it again next cycle. Forget it,
      // so a node that just answered is preferred. This only costs a db read of its last hash.
      delete this.lastHashes[edkey];
      return POLL_FAILED;
    }
  }

  private loadGroupIds() {
    const convos = getConversationController().getConversations();

    const mediumGroupsOnly = convos.filter(
      (c: ConversationModel) =>
        c.isMediumGroup() && !c.isBlocked() && !c.get('isKickedFromGroup') && !c.get('left')
    );

    mediumGroupsOnly.forEach((c: any) => {
      this.addGroupId(new PubKey(c.id));
    });
  }

  private async handleSeenMessages(messages: Array<Message>): Promise<Array<Message>> {
    if (!messages.length) {
      return [];
    }

    const incomingHashes = messages.map((m: Message) => m.hash);

    const dupHashes = await getSeenMessagesByHashList(incomingHashes);
    const newMessages = messages.filter((m: Message) => !dupHashes.includes(m.hash));

    if (newMessages.length) {
      const newHashes = newMessages.map((m: Message) => ({
        expiresAt: m.expiration,
        hash: m.hash,
      }));
      await saveSeenMessageHashes(newHashes);
    }
    return newMessages;
  }

  private async updateLastHash({
    edkey,
    expiration,
    hash,
    namespace,
    pubkey,
  }: {
    edkey: string;
    pubkey: PubKey;
    namespace: number;
    hash: string;
    expiration: number;
  }): Promise<void> {
    const pkStr = pubkey.key;

    await updateLastHash({
      convoId: pkStr,
      snode: edkey,
      hash,
      expiresAt: expiration,
      namespace,
    });

    if (!this.lastHashes[edkey]) {
      this.lastHashes[edkey] = {};
    }
    if (!this.lastHashes[edkey][pkStr]) {
      this.lastHashes[edkey][pkStr] = {};
    }
    this.lastHashes[edkey][pkStr][namespace] = hash;
  }

  private async getLastHash(nodeEdKey: string, pubkey: string, namespace: number): Promise<string> {
    if (!this.lastHashes[nodeEdKey]?.[pubkey]?.[namespace]) {
      const lastHash = await getLastHashBySnode(pubkey, nodeEdKey, namespace);

      if (!this.lastHashes[nodeEdKey]) {
        this.lastHashes[nodeEdKey] = {};
      }

      if (!this.lastHashes[nodeEdKey][pubkey]) {
        this.lastHashes[nodeEdKey][pubkey] = {};
      }
      this.lastHashes[nodeEdKey][pubkey][namespace] = lastHash || '';
      return this.lastHashes[nodeEdKey][pubkey][namespace];
    }
    // return the cached value
    return this.lastHashes[nodeEdKey][pubkey][namespace];
  }
}
