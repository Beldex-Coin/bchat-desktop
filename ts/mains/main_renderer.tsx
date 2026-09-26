import _ from 'lodash';
import { MessageModel } from '../models/message';
import { isMacOS } from '../OS';
import { queueAllCached } from '../receiver/receiver';
import { getConversationController } from '../bchat/conversations';
import { AttachmentDownloads, ToastUtils } from '../bchat/utils';
import { getOurPubKeyStrFromCache } from '../bchat/utils/User';
import { BlockedNumberController } from '../util';
import { ExpirationTimerOptions } from '../util/expiringMessages';
import { Notifications } from '../util/notifications';
import { Registration } from '../util/registration';
import { isSignInByLinking, Storage } from '../util/storage';
import * as Data from '../data/data';
import Backbone from 'backbone';
import { BchatRegistrationView } from '../components/registration/BchatRegistrationView';
import { BchatInboxView } from '../components/BchatInboxView';
import { deleteAllLogs } from '../node/logs';
import {
  retryAllFailedSendsOnReconnect,
  startFailedSendRetryTimer,
} from '../bchat/sending/FailedSendRetry';
import { snodeHttpsAgent } from '../bchat/apis/snode_api/onions';
// import ReactDOM from 'react-dom';
// import React from 'react';

import nativeEmojiData from '@emoji-mart/data';
import { initialiseEmojiData } from '../util/emoji';
import { loadEmojiPanelI18n } from '../util/i18n';
import { OpenGroupData } from '../data/opengroups';
import { createRoot, Root } from 'react-dom/client';
import { applyDocumentDirection } from '../util/applyDocumentDirection';


let root: Root | null = null;

function getRoot(): Root | null {
  const container = document.getElementById('root');
  if (!container) {
    console.error('Root container not found');
    return null;
  }

  if (!root) {
    root = createRoot(container);
  }

  return root;
}

// Globally disable drag and drop
document.body.addEventListener(
  'dragover',
  e => {
    e.preventDefault();
    e.stopPropagation();
  },
  false
);
document.body.addEventListener(
  'drop',
  e => {
    e.preventDefault();
    e.stopPropagation();
  },
  false
);

// Load these images now to ensure that they don't flicker on first use
const images = [];
function preload(list: Array<string>) {
  for (let index = 0, max = list.length; index < max; index += 1) {
    const image = new Image();
    image.src = `./images/${list[index]}`;
    images.push(image);
  }
}
preload([
  'alert-outline.svg',
  'check.svg',
  'error.svg',
  'file-gradient.svg',
  'file.svg',
  'image.svg',
  'microphone.svg',
  'movie.svg',
  'open_link.svg',
  'play.svg',
  'save.svg',
  'shield.svg',
  'timer.svg',
  'video.svg',
  'warning.svg',
  'x.svg',
]);

// We add this to window here because the default Node context is erased at the end
//   of preload.js processing
window.setImmediate = window.nodeSetImmediate;
window.globalOnlineStatus = true; // default to true as we don't get an event on app start
window.getGlobalOnlineStatus = () => window.globalOnlineStatus;

window.log.info('background page reloaded');
window.log.info('environment:', window.getEnvironment());

let newVersion = false;

window.document.title = window.getTitle();

// Whisper.events =
// window.Whisper.events = WhisperEvents ?
const WhisperEvents = _.clone(Backbone.Events);
window.Whisper = window.Whisper || {};
window.Whisper.events = WhisperEvents;
window.log.info('Storage fetch');

void Storage.fetch();

function mapOldThemeToNew(theme: string) {
  switch (theme) {
    case 'dark':
    case 'light':
      return theme;
    case 'android-dark':
      return 'dark';
    case 'android':
    case 'ios':
    default:
      return 'light';
  }
}

// We need this 'first' check because we don't want to start the app up any other time
//   than the first time. And storage.fetch() will cause onready() to fire.
let first = true;
// eslint-disable-next-line @typescript-eslint/no-misused-promises
Storage.onready(async () => {
  if (!first) {
    return;
  }
  first = false;
  // Update zoom
  window.updateZoomFactor();

  // Ensure accounts created prior to 1.0.0-beta8 do have their
  // 'primaryDevicePubKey' defined.

  if (Registration.isDone() && !Storage.get('primaryDevicePubKey')) {
    await Storage.put('primaryDevicePubKey', getOurPubKeyStrFromCache());
  }

  // These make key operations available to IPC handlers created in preload.js
  window.Events = {
    getThemeSetting: () => Storage.get('theme-setting', 'dark'),
    setThemeSetting: async (value: any) => {
      await Storage.put('theme-setting', value);
    },
    getHideMenuBar: () => Storage.get('hide-menu-bar'),
    setHideMenuBar: async (value: boolean) => {
      await Storage.put('hide-menu-bar', value);
      window.setAutoHideMenuBar(false);
      window.setMenuBarVisibility(!value);
    },

    getSpellCheck: () => Storage.get('spell-check', true),
    setSpellCheck: async (value: boolean) => {
      await Storage.put('spell-check', value);
    },

    shutdown: async () => {
      // Stop background processing
      AttachmentDownloads.stop();
      // Stop processing incoming messages
      // FIXME audric stop polling opengroupv2 and swarm nodes

      // Shut down the data interface cleanly
      await Data.shutdown();
    },
  };

  const currentVersion = window.getVersion();
  const lastVersion = Storage.get('version');
  newVersion = !lastVersion || currentVersion !== lastVersion;
  await Storage.put('version', currentVersion);

  if (newVersion) {
    window.log.info(`New version detected: ${currentVersion}; previous: ${lastVersion}`);

    await Data.cleanupOrphanedAttachments();

    await deleteAllLogs();
  }

  const themeSetting = window.Events.getThemeSetting();
  const newThemeSetting = mapOldThemeToNew(themeSetting);
  window.Events.setThemeSetting(newThemeSetting);

  try {
    initialiseEmojiData(nativeEmojiData);
    await AttachmentDownloads.initAttachmentPaths();

    await Promise.all([
      getConversationController().load(),
      BlockedNumberController.load(),
      OpenGroupData.opengroupRoomsLoad(),
      loadEmojiPanelI18n(),
    ]);
  } catch (error) {
    window.log.error(
      'main_start.js: ConversationController failed to load:',
      error && error.stack ? error.stack : error
    );
  } finally {
    void start();
  }
});

async function manageExpiringData() {
  await Data.cleanSeenMessages();
  await Data.cleanLastHashes();
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  setTimeout(manageExpiringData, 1000 * 60 * 60);
}

async function start() {
  applyDocumentDirection((window.i18n as any).getLocale());
  void manageExpiringData();
  window.dispatchEvent(new Event('storage_ready'));

  window.log.info('Cleanup: starting...');

  const results = await Promise.all([Data.getOutgoingWithoutExpiresAt()]);

  // Combine the models
  const messagesForCleanup = results.reduce(
    (array, current) => array.concat((current as any).toArray()),
    []
  );

  window.log.info(`Cleanup: Found ${messagesForCleanup.length} messages for cleanup`);
  await Promise.all(
    messagesForCleanup.map(async (message: MessageModel) => {
      const sentAt = message.get('sent_at');

      if (message.hasErrors()) {
        return;
      }

      window.log.info(`Cleanup: Deleting unsent message ${sentAt}`);
      await Data.removeMessage(message.id);
    })
  );
  window.log.info('Cleanup: complete');

  window.log.info('listening for registration events');
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  WhisperEvents.on('registration_done', async () => {
    window.log.info('handling registration event');

    // Disable link previews as default per Kee
    Storage.onready(async () => {
      await Storage.put('link-preview-setting', false);
    });

    await connect();
  });

  function openInbox() {
    const hideMenuBar = Storage.get('hide-menu-bar', true) as boolean;
    window.setAutoHideMenuBar(hideMenuBar);
    window.setMenuBarVisibility(!hideMenuBar);
    // eslint-disable-next-line more/no-then
    void getConversationController()
      .loadPromise()
      ?.then(() => {
        getRoot()?.render(<BchatInboxView />);
        // ReactDOM.render(<BchatInboxView />, document.getElementById('root'));
      });
  }

  function openStandAlone() {
    getRoot()?.render(<BchatRegistrationView />);
    // ReactDOM.render(<BchatRegistrationView />, document.getElementById('root'));
  }
  ExpirationTimerOptions.initExpiringMessageListener();

  if (Registration.isDone() && !isSignInByLinking()) {
    await connect();
    openInbox();
  } else {
    openStandAlone();
  }

  window.addEventListener('focus', () => {
    Notifications.clear();
  });
  window.addEventListener('unload', () => {
    Notifications.fastClear();
  });

  // Set user's launch count.
  const prevLaunchCount = window.getSettingValue('launch-count');
  const launchCount = !prevLaunchCount ? 1 : prevLaunchCount + 1;
  window.setSettingValue('launch-count', launchCount);

  // On first launch
  if (launchCount === 1) {
    // Initialise default settings
    window.setSettingValue('hide-menu-bar', true);
    window.setSettingValue('link-preview-setting', false);
  }

  window.setTheme = newTheme => {
    window.Events.setThemeSetting(newTheme);
  };

  window.toggleMenuBar = () => {
    const current = window.getSettingValue('hide-menu-bar');
    if (current === undefined) {
      window.Events.setHideMenuBar(false);
      return;
    }

    window.Events.setHideMenuBar(!current);
  };

  window.toggleSpellCheck = () => {
    const currentValue = window.getSettingValue('spell-check');
    // if undefined, it means 'default' so true. but we have to toggle it, so false
    // if not undefined, we take the opposite
    const newValue = currentValue !== undefined ? !currentValue : false;
    window.Events.setSpellCheck(newValue);
    ToastUtils.pushRestartNeeded();
  };

  window.toggleMediaPermissions = async () => {
    const value = window.getMediaPermissions();

    if (value === true) {
      const valueCallPermissions = window.getCallMediaPermissions();
      if (valueCallPermissions) {
        window.log.info('toggleMediaPermissions : forcing callPermissions to false');

        await window.toggleCallMediaPermissionsTo(false);
      }
    }

    if (value === false && isMacOS()) {
      window.askForMediaAccess();
    }
    window.setMediaPermissions(!value);
  };

  window.toggleCallMediaPermissionsTo = async enabled => {
    const previousValue = window.getCallMediaPermissions();
    if (previousValue === enabled) {
      return;
    }
    if (previousValue === false) {
      // value was false and we toggle it so we turn it on
      if (isMacOS()) {
        window.askForMediaAccess();
      }
      window.log.info('toggleCallMediaPermissionsTo : forcing audio/video to true');
      // turning ON "call permissions" forces turning on "audio/video permissions"
      window.setMediaPermissions(true);
    }
    window.setCallMediaPermissions(enabled);
  };
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  window.openFromNotification = async conversationKey => {
    window.showWindow();
    if (conversationKey) {
      // do not put the messageId here so the conversation is loaded on the last unread instead
      await window.openConversationWithMessages({ conversationKey, messageId: null });
    } else {
      openInbox();
    }
  };

  WhisperEvents.on('openInbox', () => {
    openInbox();
  });
}
// window.removeEventListener('offline', onOffline);
//   window.addEventListener('online', onOnline);
let disconnectTimer: NodeJS.Timeout | null = null;

// How long to wait after the browser's 'online' event before attempting the failed-send retry
// below - see its comment.
const ONLINE_RETRY_DELAY_MS = 5000;

function onOffline() {
  window.log.info('offline');
  window.globalOnlineStatus = false;

  window.removeEventListener('offline', onOffline);
  window.addEventListener('online', onOnline);

  // We've received logs from Linux where we get an 'offline' event, then 30ms later
  //   we get an online event. This waits a bit after getting an 'offline' event
  //   before disconnecting the socket manually.
  disconnectTimer = global.setTimeout(disconnect, 1000);
}

function onOnline() {
  window.log.info('online');
  window.globalOnlineStatus = true;

  window.removeEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  if (disconnectTimer) {
    window.log.warn('Already online. Had a blip in online/offline status.');
    clearTimeout(disconnectTimer);
    disconnectTimer = null;
    // we were still within the 1s debounce below onOffline() before actually disconnecting,
    // so any in-flight sends never really lost their connection - nothing to retry.
    return;
  }
  if (disconnectTimer) {
    clearTimeout(disconnectTimer);
    disconnectTimer = null;
  }

  void connect();
  // Retry any message that failed to send while we were offline - mirrors bchat-android's
  // automatic resend-on-reconnect behavior, which desktop otherwise has no equivalent of
  // (a failed send here previously just sat there until the user manually clicked "Resend").
  //
  // Retrying the instant this event fires is too eager: the OS can report "online" before DNS
  // or the actual network path is ready, so an immediate attempt often just fails again with
  // nothing left to try it a second time (the periodic sweep in FailedSendRetry.ts is the
  // backstop for that, but there's no reason not to give this its own best shot first). Wait a
  // few seconds to give the connection a chance to actually come up before trying.
  global.setTimeout(() => {
    void retryAllFailedSendsOnReconnect();
  }, ONLINE_RETRY_DELAY_MS);
}

function disconnect() {
  window.log.info('disconnect');

  // Clear timer, since we're only called when the timer is expired
  disconnectTimer = null;
  AttachmentDownloads.stop();

  // We're genuinely offline at this point (the 1s debounce in onOffline() above already ruled
  // out a brief online/offline blip). Any socket snodeHttpsAgent had pooled for keepAlive reuse
  // is now presumed dead - the laptop may have slept, or the network path changed entirely - so
  // destroy them now rather than waiting to discover that the hard way (a hang, or an
  // ECONNRESET wrongly blamed on the node) on the first request after we reconnect. A fresh
  // socket/TLS handshake will be made for the next request either way.
  snodeHttpsAgent.destroy();

  // connect() sets this back to true only once it's actually finished reconnecting - this is its
  // mirror image. Without it, window.isOnline only ever gets set once (to true, on the very first
  // connect()) and never back to false, which makes the "are we offline" checks that read it
  // (conversation.ts's sendMessage(), message.ts's retrySend()) effectively dead: they can't ever
  // see us as offline after the app's initial startup, no matter how long the connection has
  // actually been down.
  window.isOnline = false;
}

let connectCount = 0;
async function connect() {
  window.log.info('connect');
  if (connectCount === 0) {
    // Runs independently of the online/offline detection bootstrapped below - see
    // FailedSendRetry.ts's file comment for why a periodic sweep is needed at all in addition
    // to onOnline()'s fast-path retry.
    startFailedSendRetryTimer();
  }
  // Bootstrap our online/offline detection, only the first time we connect
  if (connectCount === 0 && navigator.onLine) {
    window.addEventListener('offline', onOffline);
  }
  if (connectCount === 0 && !navigator.onLine) {
    window.log.warn('Starting up offline; will connect when we have network access');
    window.addEventListener('online', onOnline);
    onEmpty(); // this ensures that the loading screen is dismissed
    return;
  }

  if (!Registration.everDone()) {
    return;
  }

  connectCount += 1;
  Notifications.disable(); // avoid notification flood until empty
  setTimeout(() => {
    Notifications.enable();
  }, 10 * 1000); // 10 sec

  await queueAllCached();
  await AttachmentDownloads.start({
    logger: window.log,
  });

  window.isOnline = true;
}

function onEmpty() {
  window.readyForUpdates();

  Notifications.enable();
}

class TextScramble {
  private frame: any;
  private queue: any;
  private readonly el: any;
  private readonly chars: any;
  private resolve: any;
  private frameRequest: any;

  constructor(el: any) {
    this.el = el;
    this.chars = '0123456789abcdef';
    this.update = this.update.bind(this);
  }

  public async setText(newText: string) {
    const oldText = this.el.value;
    const length = Math.max(oldText.length, newText.length);
    // eslint-disable-next-line no-return-assign, no-promise-executor-return
    const promise = new Promise(resolve => (this.resolve = resolve));
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const startNumber = Math.floor(Math.random() * 40);
      const end = startNumber + Math.floor(Math.random() * 40);
      this.queue.push({
        from,
        to,
        start: startNumber,
        end,
      });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  public update() {
    let output = '';
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      const { from, to, start: startNumber, end } = this.queue[i];
      let { char } = this.queue[i];

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= startNumber) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += char;
      } else {
        output += from;
      }
    }

    this.el.value = output;

    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  public randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}
window.bchat = window.bchat || {};

window.bchat.setNewBchatID = (BchatID: string) => {
  const el = document.querySelector('.bchat-id-editable-textarea');
  const fx = new TextScramble(el);
  if (el) {
    (el as any).value = BchatID;
  }
  void fx.setText(BchatID);
};
