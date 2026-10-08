import { expect } from 'chai';
import Sinon from 'sinon';

import { MessageModel } from '../../../../models/message';
import { TestUtils } from '../../../test-utils';

describe('MessageModel.setToExpireNoCommit', () => {
  TestUtils.stubWindowLog();

  afterEach(() => {
    Sinon.restore();
  });

  function makeMessage(attrs: Record<string, any> = {}) {
    const convoId = TestUtils.generateFakePubKeyStr();
    return new MessageModel({
      conversationId: convoId,
      source: convoId,
      type: 'incoming',
      ...attrs,
    });
  }

  it('sets expires_at from the expiration start and timer without committing', () => {
    const message = makeMessage({ expireTimer: 30 });
    const commit = Sinon.stub(message, 'commit').resolves(message.id);
    message.set({ expirationStartTimestamp: 1000 });

    const changed = message.setToExpireNoCommit();

    expect(changed).to.equal(true);
    expect(message.get('expires_at')).to.equal(1000 + 30 * 1000);
    expect(commit.called).to.equal(false);
  });

  it('does nothing for a message without a disappearing timer', () => {
    const message = makeMessage();
    message.set({ expirationStartTimestamp: 1000 });

    expect(message.setToExpireNoCommit()).to.equal(false);
    expect(message.get('expires_at')).to.equal(undefined);
  });

  it('does nothing before the expiration has started', () => {
    const message = makeMessage({ expireTimer: 30 });

    expect(message.setToExpireNoCommit()).to.equal(false);
    expect(message.get('expires_at')).to.equal(undefined);
  });

  it('keeps an existing expires_at unless forced', () => {
    const message = makeMessage({ expireTimer: 30 });
    message.set({ expirationStartTimestamp: 1000, expires_at: 5 });

    expect(message.setToExpireNoCommit()).to.equal(false);
    expect(message.get('expires_at')).to.equal(5);

    expect(message.setToExpireNoCommit(true)).to.equal(true);
    expect(message.get('expires_at')).to.equal(1000 + 30 * 1000);
  });
});
