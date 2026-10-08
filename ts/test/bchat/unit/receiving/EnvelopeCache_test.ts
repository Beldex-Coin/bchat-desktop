import { expect } from 'chai';
import Sinon from 'sinon';

import { TTL_DEFAULT } from '../../../../bchat/constants';
import { StringUtils } from '../../../../bchat/utils';
import { SignalService } from '../../../../protobuf';
import { getAllFromCache, getAllFromCacheForSource } from '../../../../receiver/cache';
import { TestUtils } from '../../../test-utils';

function stubCache(items: Array<Record<string, any>>) {
  TestUtils.stubData('getUnprocessedCount').resolves(items.length);
  TestUtils.stubData('getAllUnprocessed').resolves(items);
}

describe('getAllFromCache', () => {
  TestUtils.stubWindowLog();

  let removeUnprocessed: Sinon.SinonStub;
  let updateUnprocessedAttempts: Sinon.SinonStub;

  beforeEach(() => {
    removeUnprocessed = TestUtils.stubData('removeUnprocessed').resolves();
    updateUnprocessedAttempts = TestUtils.stubData('updateUnprocessedAttempts').resolves();
  });

  afterEach(() => {
    Sinon.restore();
  });

  it('removes an envelope on its 10th attempt', async () => {
    stubCache([{ id: 'one-to-one', attempts: 9, timestamp: Date.now() }]);

    await getAllFromCache();

    expect(removeUnprocessed.calledOnceWith('one-to-one')).to.equal(true);
  });

  it('bumps the attempts of an envelope below 10 attempts', async () => {
    stubCache([{ id: 'one-to-one', attempts: 3, timestamp: Date.now() }]);

    await getAllFromCache();

    expect(updateUnprocessedAttempts.calledOnceWith('one-to-one', 4)).to.equal(true);
    expect(removeUnprocessed.called).to.equal(false);
  });

  it('keeps an undecrypted group envelope past 10 attempts while it is younger than the TTL', async () => {
    stubCache([
      {
        id: 'group-waiting-for-key',
        senderIdentity: 'sender',
        attempts: 25,
        timestamp: Date.now() - TTL_DEFAULT.TTL_MAX + 60 * 1000,
      },
    ]);

    await getAllFromCache();

    expect(removeUnprocessed.called).to.equal(false);
    expect(updateUnprocessedAttempts.calledOnceWith('group-waiting-for-key', 26)).to.equal(true);
  });

  it('removes an undecrypted group envelope once it is older than the TTL', async () => {
    stubCache([
      {
        id: 'group-waiting-for-key',
        senderIdentity: 'sender',
        attempts: 2,
        timestamp: Date.now() - TTL_DEFAULT.TTL_MAX - 60 * 1000,
      },
    ]);

    await getAllFromCache();

    expect(removeUnprocessed.calledOnceWith('group-waiting-for-key')).to.equal(true);
  });

  it('still removes an already decrypted group envelope on its 10th attempt', async () => {
    stubCache([
      {
        id: 'group-decrypted',
        senderIdentity: 'sender',
        decrypted: 'abc',
        attempts: 9,
        timestamp: Date.now(),
      },
    ]);

    await getAllFromCache();

    expect(removeUnprocessed.calledOnceWith('group-decrypted')).to.equal(true);
  });
});

describe('getAllFromCacheForSource', () => {
  TestUtils.stubWindowLog();

  let updateUnprocessedAttempts: Sinon.SinonStub;

  // like receiver.ts caches a group message: the envelope's source is the group, and
  // senderIdentity the member who sent it
  function cachedGroupMessage(id: string, groupId: string) {
    const envelope = SignalService.Envelope.encode({
      type: SignalService.Envelope.Type.CLOSED_GROUP_MESSAGE,
      source: groupId,
      timestamp: Date.now(),
    }).finish();
    return {
      id,
      envelope: StringUtils.decode(envelope, 'base64'),
      senderIdentity: 'member',
      attempts: 1,
      timestamp: Date.now(),
    };
  }

  beforeEach(() => {
    TestUtils.stubData('removeUnprocessed').resolves();
    updateUnprocessedAttempts = TestUtils.stubData('updateUnprocessedAttempts').resolves();
  });

  afterEach(() => {
    Sinon.restore();
  });

  it('only returns the cached messages of that group, not those of other groups', async () => {
    stubCache([cachedGroupMessage('ours', 'group-a'), cachedGroupMessage('other', 'group-b')]);

    const items = await getAllFromCacheForSource('group-a');

    expect(items.map(item => item.id)).to.deep.equal(['ours']);
  });

  it('only bumps the attempts of the messages it returns', async () => {
    stubCache([cachedGroupMessage('ours', 'group-a'), cachedGroupMessage('other', 'group-b')]);

    await getAllFromCacheForSource('group-a');

    expect(updateUnprocessedAttempts.calledOnceWith('ours', 2)).to.equal(true);
  });

  it('uses the source saved once a message was decrypted', async () => {
    stubCache([
      { ...cachedGroupMessage('decrypted', 'group-a'), source: 'group-a', decrypted: 'x' },
    ]);

    const items = await getAllFromCacheForSource('group-a');

    expect(items.map(item => item.id)).to.deep.equal(['decrypted']);
  });

  it('leaves out a cached message whose envelope cannot be read', async () => {
    stubCache([{ id: 'broken', envelope: 'not an envelope', attempts: 1, timestamp: Date.now() }]);

    const items = await getAllFromCacheForSource('group-a');

    expect(items).to.deep.equal([]);
  });
});
