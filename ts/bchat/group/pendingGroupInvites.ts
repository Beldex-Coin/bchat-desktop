import { HexKeyPair } from '../../receiver/keypairs';
import { Storage } from '../../util/storage';

/**
 * Everything needed to (re)send the invites of a secret group we created, persisted until every
 * member got one. While a group has one of these, it has no saved encryption keypair and so can't
 * be sent to (see createClosedGroup() in receiver/closedGroups.ts). Persisting it is what lets the
 * user retry after dismissing the "Retry invitations" dialog or restarting the app.
 */
export type PendingGroupInvites = {
  groupPublicKey: string;
  groupName: string;
  // the full member list, sent in every invite
  members: Array<string>;
  // who still needs to be (re)sent an invite
  membersToInvite: Array<string>;
  admins: Array<string>;
  keypair: HexKeyPair;
  expireTimer: number;
  // id of the "group created" update message, used as the invites' identifier
  dbMessageId: string;
};

const storageKey = (groupPublicKey: string) => `pendingSecretGroupInvites-${groupPublicKey}`;

export function getPendingGroupInvites(groupPublicKey: string): PendingGroupInvites | undefined {
  const stored = Storage.get(storageKey(groupPublicKey));
  if (typeof stored !== 'string') {
    return undefined;
  }
  try {
    return JSON.parse(stored) as PendingGroupInvites;
  } catch (e) {
    window?.log?.warn('getPendingGroupInvites: invalid stored value for', groupPublicKey);
    return undefined;
  }
}

export async function savePendingGroupInvites(pending: PendingGroupInvites) {
  await Storage.put(storageKey(pending.groupPublicKey), JSON.stringify(pending));
}

export async function removePendingGroupInvites(groupPublicKey: string) {
  if (Storage.get(storageKey(groupPublicKey)) !== undefined) {
    await Storage.remove(storageKey(groupPublicKey));
  }
}
