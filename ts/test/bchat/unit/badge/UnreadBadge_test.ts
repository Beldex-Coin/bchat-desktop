import { expect } from 'chai';
import Sinon from 'sinon';

// loads the selectors' dependencies in an order that works, like selectors/conversations_test.ts
import '../../../../models/conversation';
import { applyUnreadBadge, getBadgeOverlayText } from '../../../../node/unreadBadge';
import { getUnreadBadgeCount } from '../../../../state/selectors/conversations';

describe('unread badge', () => {
  describe('getUnreadBadgeCount', () => {
    function stateWith(conversations: Array<Record<string, any>>) {
      const conversationLookup: Record<string, any> = {};
      conversations.forEach((c, i) => {
        conversationLookup[`convo${i}`] = { id: `convo${i}`, isApproved: true, ...c };
      });
      return { conversations: { conversationLookup } } as any;
    }

    it('adds up the unread messages, without the cap of the left pane counter', () => {
      const state = stateWith([{ unreadCount: 7 }, { unreadCount: 8, isPrivate: true }, {}]);

      expect(getUnreadBadgeCount(state)).to.equal(15);
    });

    it('leaves out muted conversations, blocked contacts and message requests', () => {
      const state = stateWith([
        { unreadCount: 1 },
        { unreadCount: 10, currentNotificationSetting: 'disabled' },
        { unreadCount: 20, isBlocked: true },
        { unreadCount: 40, isPrivate: true, isApproved: false },
      ]);

      expect(getUnreadBadgeCount(state)).to.equal(1);
    });

    it('counts conversations notifying for mentions only', () => {
      const state = stateWith([{ unreadCount: 3, currentNotificationSetting: 'mentions_only' }]);

      expect(getUnreadBadgeCount(state)).to.equal(3);
    });
  });

  describe('getBadgeOverlayText', () => {
    it('is the count up to 9, then 9+', () => {
      expect(getBadgeOverlayText(0)).to.equal('');
      expect(getBadgeOverlayText(1)).to.equal('1');
      expect(getBadgeOverlayText(9)).to.equal('9');
      expect(getBadgeOverlayText(10)).to.equal('9+');
    });
  });

  describe('applyUnreadBadge', () => {
    function fakes() {
      const app = { setBadgeCount: Sinon.stub(), dock: { setBadge: Sinon.stub() } };
      const mainWindow = { setOverlayIcon: Sinon.stub() };
      const createImage = Sinon.stub().returns('image');
      return { app, mainWindow, createImage };
    }

    it('sets the dock badge on macOS, and clears it at 0', () => {
      const { app, mainWindow, createImage } = fakes();
      applyUnreadBadge({ platform: 'darwin', count: 12, app, mainWindow, createImage });
      applyUnreadBadge({ platform: 'darwin', count: 0, app, mainWindow, createImage });

      expect(app.dock.setBadge.firstCall.args).to.deep.equal(['12']);
      expect(app.dock.setBadge.secondCall.args).to.deep.equal(['']);
    });

    it('sets the launcher badge count on Linux', () => {
      const { app, mainWindow, createImage } = fakes();
      applyUnreadBadge({ platform: 'linux', count: 3, app, mainWindow, createImage });

      expect(app.setBadgeCount.calledOnceWith(3)).to.equal(true);
    });

    it('sets the taskbar overlay icon on Windows, and removes it at 0', () => {
      const { app, mainWindow, createImage } = fakes();
      applyUnreadBadge({
        platform: 'win32',
        count: 4,
        overlayDataUrl: 'data:image/png;base64,AA==',
        app,
        mainWindow,
        createImage,
      });
      applyUnreadBadge({ platform: 'win32', count: 0, app, mainWindow, createImage });

      expect(createImage.calledOnceWith('data:image/png;base64,AA==')).to.equal(true);
      expect(mainWindow.setOverlayIcon.firstCall.args[0]).to.equal('image');
      expect(mainWindow.setOverlayIcon.secondCall.args[0]).to.equal(null);
    });

    it('does nothing on Windows without a main window', () => {
      const { app, createImage } = fakes();

      expect(() =>
        applyUnreadBadge({
          platform: 'win32',
          count: 4,
          overlayDataUrl: 'data:',
          app,
          mainWindow: null,
          createImage,
        })
      ).to.not.throw();
    });
  });
});
