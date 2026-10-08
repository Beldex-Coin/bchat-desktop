import { expect } from 'chai';
import crypto from 'crypto';
import Sinon from 'sinon';

import { getConversationController } from '../../../../bchat/conversations';
import { PubKey } from '../../../../bchat/types';
import { UserUtils } from '../../../../bchat/utils';
import { fromHexToArray } from '../../../../bchat/utils/String';
import { SignalService } from '../../../../protobuf';
import * as ClosedGroups from '../../../../receiver/closedGroups';
import * as ContentMessage from '../../../../receiver/contentMessage';
import * as Receiver from '../../../../receiver/receiver';
import { BlockedNumberController } from '../../../../util';
import { TestUtils } from '../../../test-utils';

const { Type } = SignalService.DataMessage.ClosedGroupControlMessage;

describe('closed group keypair received: replaying cached group messages', () => {
  const ourNumber = TestUtils.generateFakePubKeyStr();
  const admin = TestUtils.generateFakePubKeyStr();
  let groupId: string;
  let replay: Sinon.SinonStub;

  const randomKeyPair = () => ({
    publicKey: new Uint8Array(crypto.randomBytes(33)),
    privateKey: new Uint8Array(crypto.randomBytes(32)),
  });

  beforeEach(() => {
    // the keypairs are cached per group in closedGroups.ts, so use a new group for every test
    groupId = TestUtils.generateFakePubKeyStr();

    TestUtils.stubWindowLog();
    Sinon.stub(UserUtils, 'getOurPubKeyFromCache').returns(PubKey.cast(ourNumber));
    Sinon.stub(UserUtils, 'getIdentityKeyPair').resolves({
      pubKey: new Uint8Array(33).buffer,
      privKey: new Uint8Array(32).buffer,
    } as any);
    Sinon.stub(BlockedNumberController, 'isGroupBlocked').returns(false);

    const groupConvo = {
      isMediumGroup: () => true,
      isApproved: () => true,
      get: (key: string) => (key === 'groupAdmins' ? [admin] : undefined),
      updateExpireTimer: async () => undefined,
    };
    Sinon.stub(getConversationController(), 'get').returns(groupConvo as any);

    TestUtils.stubData('getAllEncryptionKeyPairsForGroup').resolves([]);
    TestUtils.stubData('addClosedGroupEncryptionKeyPair').resolves();
    TestUtils.stubData('removeUnprocessed').resolves();
    replay = Sinon.stub(Receiver, 'queueAllCachedFromSource').resolves();
  });

  afterEach(() => {
    Sinon.restore();
  });

  function keyPairUpdate(keyPair: { publicKey: Uint8Array; privateKey: Uint8Array }) {
    Sinon.stub(ContentMessage, 'decryptWithBchatProtocol').resolves(
      SignalService.KeyPair.encode(keyPair).finish() as any
    );
    const envelope: any = {
      id: `envelope-${Math.random()}`,
      type: SignalService.Envelope.Type.CLOSED_GROUP_MESSAGE,
      source: groupId,
      senderIdentity: admin,
    };
    const groupUpdate = new SignalService.DataMessage.ClosedGroupControlMessage({
      type: Type.ENCRYPTION_KEY_PAIR,
      publicKey: fromHexToArray(groupId),
      wrappers: [{ publicKey: fromHexToArray(ourNumber), encryptedKeyPair: new Uint8Array(1) }],
    });
    return ClosedGroups.handleClosedGroupControlMessage(envelope, groupUpdate);
  }

  function newGroupMessage(keyPair: { publicKey: Uint8Array; privateKey: Uint8Array }) {
    const envelope: any = { id: `envelope-${Math.random()}`, source: admin };
    const groupUpdate = new SignalService.DataMessage.ClosedGroupControlMessage({
      type: Type.NEW,
      name: 'group',
      publicKey: fromHexToArray(groupId),
      members: [fromHexToArray(ourNumber), fromHexToArray(admin)],
      admins: [fromHexToArray(admin)],
      encryptionKeyPair: keyPair,
    });
    return ClosedGroups.handleNewSecretGroup(envelope, groupUpdate);
  }

  it('replays the cached messages of the group when a new keypair update arrives', async () => {
    await keyPairUpdate(randomKeyPair());

    expect(replay.calledOnceWith(groupId)).to.equal(true);
  });

  it('does not replay when the keypair update has a keypair we already have', async () => {
    const keyPair = randomKeyPair();
    await keyPairUpdate(keyPair);
    replay.resetHistory();
    (ContentMessage.decryptWithBchatProtocol as Sinon.SinonStub).restore();

    await keyPairUpdate(keyPair);

    expect(replay.called).to.equal(false);
  });

  it('replays the cached messages when a new group message for a group we have brings a new keypair', async () => {
    await newGroupMessage(randomKeyPair());

    expect(replay.calledOnceWith(groupId)).to.equal(true);
  });

  it('does not replay when a new group message for a group we have brings a keypair we already have', async () => {
    const keyPair = randomKeyPair();
    await newGroupMessage(keyPair);
    replay.resetHistory();

    await newGroupMessage(keyPair);

    expect(replay.called).to.equal(false);
  });
});
