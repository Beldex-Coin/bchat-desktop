import { EnvelopePlus } from './types';
import { StringUtils } from '../bchat/utils';
import _ from 'lodash';
import { TTL_DEFAULT } from '../bchat/constants';
import { SignalService } from '../protobuf';
import {
  getAllUnprocessed,
  getUnprocessedById,
  getUnprocessedCount,
  removeAllUnprocessed,
  removeUnprocessed,
  saveUnprocessed,
  UnprocessedParameter,
  updateUnprocessedAttempts,
  updateUnprocessedWithData,
} from '../data/data';

export async function removeFromCache(envelope: EnvelopePlus) {
  const { id } = envelope;
  // window?.log?.info(`removing from cache envelope: ${id}`);
  return removeUnprocessed(id);
}

export async function addToCache(
  envelope: EnvelopePlus,
  plaintext: ArrayBuffer,
  messageHash: string
) {
  const { id } = envelope;
  // window?.log?.info(`adding to cache envelope: ${id}`);

  const encodedEnvelope = StringUtils.decode(plaintext, 'base64');
  const data: UnprocessedParameter = {
    id,
    version: 2,
    envelope: encodedEnvelope,
    messageHash,
    timestamp: Date.now(),
    attempts: 1,
  };

  if (envelope.senderIdentity) {
    data.senderIdentity = envelope.senderIdentity;
  }
  return saveUnprocessed(data);
}

async function fetchAllFromCache(): Promise<Array<any>> {
  const count = await getUnprocessedCount();

  if (count > 1500) {
    await removeAllUnprocessed();
    window?.log?.warn(`There were ${count} messages in cache. Deleted all instead of reprocessing`);
    return [];
  }

  const items = await getAllUnprocessed();
  return items;
}

/**
 * A closed group message we could not decrypt yet is waiting for an encryption keypair, which can
 * arrive much later than 10 reloads of the cache. Those are kept until the message would have
 * expired on the network anyway, instead of being dropped after a number of attempts.
 */
function isWaitingForGroupKeypair(item: any) {
  return !!item.senderIdentity && !item.decrypted;
}

async function bumpAttemptsOrRemove(item: any) {
  const attempts = _.toNumber(item.attempts || 0) + 1;
  const shouldRemove = isWaitingForGroupKeypair(item)
    ? Date.now() - _.toNumber(item.timestamp || 0) > TTL_DEFAULT.TTL_MAX
    : attempts >= 10;

  try {
    if (shouldRemove) {
      window?.log?.warn('getAllFromCache final attempt for envelope', item.id);
      await removeUnprocessed(item.id);
    } else {
      await updateUnprocessedAttempts(item.id, attempts);
    }
  } catch (error) {
    window?.log?.error(
      'getAllFromCache error updating item after load:',
      error && error.stack ? error.stack : error
    );
  }

  return item;
}

export async function getAllFromCache() {
  window?.log?.info('getAllFromCache');
  const items = await fetchAllFromCache();

  window?.log?.info('getAllFromCache loaded', items.length, 'saved envelopes');

  return Promise.all(_.map(items, bumpAttemptsOrRemove));
}

export async function getAllFromCacheForSource(source: string) {
  const items = await fetchAllFromCache();

  const itemsFromSource = items.filter(item => getCachedEnvelopeSource(item) === source);

  window?.log?.info('getAllFromCacheForSource loaded', itemsFromSource.length, 'saved envelopes');

  return Promise.all(_.map(itemsFromSource, bumpAttemptsOrRemove));
}

/**
 * The source of a cached envelope: the group for a closed group message (its senderIdentity is
 * the member who sent it). `source` is only saved once the message is decrypted, so read it from
 * the envelope otherwise. Undefined if the envelope can't be read.
 */
function getCachedEnvelopeSource(item: any): string | undefined {
  if (item.source) {
    return item.source;
  }
  try {
    const envelopeArray = new Uint8Array(StringUtils.encode(item.envelope, 'base64'));
    return SignalService.Envelope.decode(envelopeArray).source || undefined;
  } catch (e) {
    return undefined;
  }
}

export async function updateCache(envelope: EnvelopePlus, plaintext: ArrayBuffer): Promise<void> {
  const { id } = envelope;
  const item = await getUnprocessedById(id);
  if (!item) {
    window?.log?.error(`updateCache: Didn't find item ${id} in cache to update`);
    return;
  }

  item.source = envelope.source;

  // For medium-size closed groups
  if (envelope.senderIdentity) {
    item.senderIdentity = envelope.senderIdentity;
  }

  item.decrypted = StringUtils.decode(plaintext, 'base64');

  return updateUnprocessedWithData(item.id, item);
}
