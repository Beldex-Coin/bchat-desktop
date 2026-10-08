import { expect } from 'chai';
import Sinon from 'sinon';

import { ReadReceiptMessage } from '../../../../bchat/messages/outgoing/controlMessage/receipt/ReadReceiptMessage';
import { TypingMessage } from '../../../../bchat/messages/outgoing/controlMessage/TypingMessage';
import { MessageSender } from '../../../../bchat/sending';
import {
  MAX_FAILED_SENDS_KEPT_FOR_RETRY,
  MessageQueue,
} from '../../../../bchat/sending/MessageQueue';
import { MessageSentHandler } from '../../../../bchat/sending/MessageSentHandler';
import { PubKey } from '../../../../bchat/types';
import { PromiseUtils, UserUtils } from '../../../../bchat/utils';
import { TestUtils } from '../../../test-utils';
import { PendingMessageCacheStub } from '../../../test-utils/stubs';

describe('MessageQueue: keeping failed read receipts for a later retry', () => {
  let pendingMessageCache: PendingMessageCacheStub;
  let queue: MessageQueue;
  let sendStub: Sinon.SinonStub;
  let device: PubKey;

  beforeEach(() => {
    TestUtils.stubWindowLog();
    Sinon.stub(UserUtils, 'getOurPubKeyStrFromCache').returns(TestUtils.generateFakePubKeyStr());
    sendStub = Sinon.stub(MessageSender, 'send');
    Sinon.stub(MessageSentHandler, 'handleMessageSentFailure').resolves();
    Sinon.stub(MessageSentHandler, 'handleMessageSentSuccess').resolves();

    pendingMessageCache = new PendingMessageCacheStub();
    queue = new MessageQueue(pendingMessageCache);
    device = TestUtils.generateFakePubKey();
  });

  afterEach(() => {
    Sinon.restore();
  });

  const readReceipt = () => new ReadReceiptMessage({ timestamp: Date.now(), timestamps: [1, 2] });

  // processPending() starts the sends without waiting for them
  async function processAndWaitForSendCount(count: number) {
    await queue.processPending(device);
    await PromiseUtils.waitUntil(() => sendStub.callCount >= count, 1000);
    // let the job's finally block run
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  it('keeps a read receipt that failed to send in the pending cache, and sends it again on the next processPending', async () => {
    sendStub.rejects(new Error('network down'));
    await pendingMessageCache.add(device, readReceipt());

    await processAndWaitForSendCount(1);

    const kept = await pendingMessageCache.getForDevice(device);
    expect(kept).to.have.length(1);
    expect(kept[0].failedSends).to.equal(1);

    sendStub.resolves({ wrappedEnvelope: new Uint8Array(), effectiveTimestamp: Date.now() });
    await processAndWaitForSendCount(2);

    expect(await pendingMessageCache.getForDevice(device)).to.have.length(0);
  });

  it(`drops a read receipt after ${MAX_FAILED_SENDS_KEPT_FOR_RETRY} failed sends`, async () => {
    sendStub.rejects(new Error('network down'));
    await pendingMessageCache.add(device, readReceipt());

    for (let i = 1; i <= MAX_FAILED_SENDS_KEPT_FOR_RETRY; i++) {
      // eslint-disable-next-line no-await-in-loop
      await processAndWaitForSendCount(i);
    }

    expect(await pendingMessageCache.getForDevice(device)).to.have.length(0);
  });

  it('does not keep a typing indicator that failed to send', async () => {
    sendStub.rejects(new Error('network down'));
    await pendingMessageCache.add(
      device,
      new TypingMessage({ timestamp: Date.now(), isTyping: true, typingTimestamp: Date.now() })
    );

    await processAndWaitForSendCount(1);

    expect(await pendingMessageCache.getForDevice(device)).to.have.length(0);
  });

  it('does not keep a visible message that failed to send', async () => {
    sendStub.rejects(new Error('network down'));
    await pendingMessageCache.add(device, TestUtils.generateVisibleMessage());

    await processAndWaitForSendCount(1);

    expect(await pendingMessageCache.getForDevice(device)).to.have.length(0);
  });
});
