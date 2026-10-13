import { expect } from 'chai';
import Sinon from 'sinon';

import { getConversationController } from '../../../../bchat/conversations';
import { UserUtils } from '../../../../bchat/utils';
import {
  muteConversationFor,
  setNotificationForConvoId,
} from '../../../../interactions/conversationInteractions';
import { ConversationModel, ConversationTypeEnum } from '../../../../models/conversation';
import { MessageModel } from '../../../../models/message';
import { Notifications } from '../../../../util/notifications';
import { TestUtils } from '../../../test-utils';

describe('timed mute', () => {
  const HOUR = 60 * 60 * 1000;
  let clock: Sinon.SinonFakeTimers;

  beforeEach(() => {
    TestUtils.stubWindowLog();
    TestUtils.stubWindow('inboxStore', undefined);
    Sinon.stub(UserUtils, 'getOurPubKeyStrFromCache').returns(TestUtils.generateFakePubKeyStr());
    TestUtils.stubData('saveConversation').resolves();
    TestUtils.stubData('updateConversation').resolves();
    clock = Sinon.useFakeTimers({ now: 1_000_000_000_000, toFake: ['Date', 'setTimeout', 'clearTimeout'] });
  });

  afterEach(() => {
    clock.restore();
    Sinon.restore();
  });

  function makeConvo(attrs: Record<string, any> = {}) {
    return new ConversationModel({
      id: TestUtils.generateFakePubKeyStr(),
      type: ConversationTypeEnum.PRIVATE,
      isApproved: true,
      lastMessage: null,
      isPinned: false,
      ...attrs,
    });
  }

  describe('getEffectiveNotificationSetting', () => {
    it('is the stored setting when not muted', () => {
      expect(makeConvo().getEffectiveNotificationSetting()).to.equal('all');
    });

    it('is disabled while a timed mute runs, then the stored setting again', () => {
      const convo = makeConvo({
        triggerNotificationsFor: 'mentions_only',
        mutedUntil: Date.now() + HOUR,
      });

      expect(convo.getEffectiveNotificationSetting()).to.equal('disabled');

      clock.tick(HOUR + 1);

      expect(convo.getEffectiveNotificationSetting()).to.equal('mentions_only');
    });
  });

  describe('conversation props', () => {
    it('shows a timed mute as disabled, with its end time', () => {
      const mutedUntil = Date.now() + HOUR;
      const props = makeConvo({ mutedUntil }).getConversationModelProps();

      expect(props.currentNotificationSetting).to.equal('disabled');
      expect(props.mutedUntil).to.equal(mutedUntil);
    });

    it('drops an expired timed mute', () => {
      const props = makeConvo({ mutedUntil: Date.now() - 1 }).getConversationModelProps();

      expect(props.currentNotificationSetting).to.equal(undefined);
      expect(props.mutedUntil).to.equal(undefined);
    });

    it('keeps the picked length while the timed mute runs, and drops it after', () => {
      const props = makeConvo({
        mutedUntil: Date.now() + HOUR,
        mutedForMs: 24 * HOUR,
      }).getConversationModelProps();
      const expired = makeConvo({
        mutedUntil: Date.now() - 1,
        mutedForMs: 24 * HOUR,
      }).getConversationModelProps();

      expect(props.mutedForMs).to.equal(24 * HOUR);
      expect(expired.mutedForMs).to.equal(undefined);
    });

    it('refreshes the UI when the timed mute ends', () => {
      const convo = makeConvo({ mutedUntil: Date.now() + HOUR });
      const refresh = Sinon.stub(convo, 'triggerUIRefresh');

      clock.tick(HOUR + 1000);

      expect(refresh.called).to.equal(true);
    });

    it('still refreshes the UI when the timer fires before the wall clock reached the end', () => {
      const convo = makeConvo({ mutedUntil: Date.now() + HOUR });
      // the wall clock got set back a bit (NTP) after the mute started
      clock.setSystemTime(Date.now() - 2000);
      const refreshedProps: Array<any> = [];
      Sinon.stub(convo, 'triggerUIRefresh').callsFake(() => {
        refreshedProps.push(convo.getConversationModelProps());
      });

      clock.tick(HOUR + 1000);
      clock.tick(60 * 1000);

      expect(refreshedProps.length).to.be.greaterThan(0);
      expect(refreshedProps[refreshedProps.length - 1].mutedUntil).to.equal(undefined);
    });

    it('refreshes the UI soon after the wall clock passed the end, even if timers lag', () => {
      const mutedUntil = Date.now() + HOUR;
      const convo = makeConvo({ mutedUntil });
      const refresh = Sinon.stub(convo, 'triggerUIRefresh');

      // the wall clock moved past the end while the timers barely ran
      clock.setSystemTime(mutedUntil + 1);
      clock.tick(60 * 1000);

      expect(refresh.called).to.equal(true);
    });

    it('stops checking the timed mute once the timer is cleared (convo removed)', () => {
      const convo = makeConvo({ mutedUntil: Date.now() + HOUR });
      const refresh = Sinon.stub(convo, 'triggerUIRefresh');

      convo.clearMuteExpiryTimer();
      clock.tick(HOUR + 60 * 1000);

      expect(refresh.called).to.equal(false);
    });
  });

  describe('notify', () => {
    let addNotification: Sinon.SinonStub;

    beforeEach(() => {
      addNotification = Sinon.stub(Notifications, 'addNotification');
      Sinon.stub(getConversationController(), 'getOrCreateAndWait').resolves({
        getTitle: () => 'sender',
      } as any);
    });

    function incomingMessage(body?: string) {
      return ({
        id: `message-${Math.random()}`,
        isIncoming: () => true,
        get: (key: string) => (key === 'body' ? body : undefined),
        toJSON: () => ({ sent_at: Date.now() }),
        getNotificationText: () => body ?? 'hi',
      } as unknown) as MessageModel;
    }

    it('does not notify while a timed mute runs, and notifies again once it ended', async () => {
      const convo = makeConvo({ mutedUntil: Date.now() + HOUR });
      Sinon.stub(convo, 'getNotificationIcon').resolves(undefined);

      await convo.notify(incomingMessage());
      expect(addNotification.called).to.equal(false);

      clock.tick(HOUR + 1);
      await convo.notify(incomingMessage());
      expect(addNotification.calledOnce).to.equal(true);
    });

    it('notifies a mention, but not a plain message, when set to mentions_only', async () => {
      const myPubkey = UserUtils.getOurPubKeyStrFromCache();
      const convo = makeConvo({ triggerNotificationsFor: 'mentions_only' });
      Sinon.stub(convo, 'getNotificationIcon').resolves(undefined);

      await convo.notify(incomingMessage(`hey @${myPubkey} look`));
      expect(addNotification.calledOnce).to.equal(true);

      await convo.notify(incomingMessage('just chatting'));
      // the plain message is skipped, so the count stays at one
      expect(addNotification.calledOnce).to.equal(true);
    });

    it('evaluates every message (no debounce) so a burst cannot drop an earlier mention', () => {
      const convo = makeConvo({ triggerNotificationsFor: 'mentions_only' });
      const notifyStub = Sinon.stub(convo, 'notify').resolves();
      const first = incomingMessage('@mention-of-me');
      const second = incomingMessage('plain message right after');

      convo.notifyIncomingMessage(first);
      convo.notifyIncomingMessage(second);

      expect(notifyStub.callCount).to.equal(2);
      expect(notifyStub.firstCall.args[0]).to.equal(first);
      expect(notifyStub.secondCall.args[0]).to.equal(second);
    });

    it('logs a failed notification instead of leaving the error unhandled', async () => {
      const convo = makeConvo();
      Sinon.stub(convo, 'notify').rejects(new Error('boom'));
      const warn = Sinon.stub(window.log, 'warn');

      convo.notifyIncomingMessage(incomingMessage());
      await Promise.resolve();
      await Promise.resolve();

      expect(warn.calledOnce).to.equal(true);
      expect(warn.firstCall.args[1]).to.equal('boom');
    });

    it('skips the message request lookups when the convo is muted', async () => {
      const convo = makeConvo({ isApproved: false, mutedUntil: Date.now() + HOUR });
      const getConversations = Sinon.spy(getConversationController(), 'getConversations');

      await convo.notify(incomingMessage());

      expect(getConversations.called).to.equal(false);
      expect(addNotification.called).to.equal(false);
    });
  });

  describe('setting it', () => {
    let convo: ConversationModel;

    beforeEach(() => {
      convo = makeConvo({ triggerNotificationsFor: 'mentions_only' });
      Sinon.stub(getConversationController(), 'get').returns(convo);
    });

    it('mutes for the given duration and keeps the stored setting for afterwards', async () => {
      await muteConversationFor(convo.id, 2 * HOUR);

      expect(convo.get('mutedUntil')).to.equal(Date.now() + 2 * HOUR);
      expect(convo.get('triggerNotificationsFor')).to.equal('mentions_only');
    });

    it('saves the picked length, and clears it when a notification setting is picked', async () => {
      await muteConversationFor(convo.id, 24 * HOUR);
      expect(convo.get('mutedForMs')).to.equal(24 * HOUR);

      // 20 hours later the menu must still show "24 hours", not a shorter length
      clock.tick(20 * HOUR);
      expect(convo.getConversationModelProps().mutedForMs).to.equal(24 * HOUR);

      await setNotificationForConvoId(convo.id, 'all');
      expect(convo.get('mutedForMs')).to.equal(undefined);
    });

    it('ends a timed mute started from "Always" with notifications on', async () => {
      convo.set({ triggerNotificationsFor: 'disabled' });

      await muteConversationFor(convo.id, 8 * HOUR);
      expect(convo.getEffectiveNotificationSetting()).to.equal('disabled');

      clock.tick(8 * HOUR + 1);
      expect(convo.getEffectiveNotificationSetting()).to.equal('all');
    });

    it('clears a timed mute when a notification setting is picked', async () => {
      await muteConversationFor(convo.id, HOUR);

      await setNotificationForConvoId(convo.id, 'mentions_only');

      expect(convo.get('mutedUntil')).to.equal(undefined);
      expect(convo.getEffectiveNotificationSetting()).to.equal('mentions_only');
    });
  });
});
