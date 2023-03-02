import React, { useEffect, useState } from 'react';
import { getConversationController } from '../../bchat/conversations';
import { syncConfigurationIfNeeded } from '../../bchat/utils/syncUtils';

import {
  generateAttachmentKeyIfEmpty,
  getAllOpenGroupV1Conversations,
  getItemById,
  hasSyncedInitialConfigurationItem,
  lastAvatarUploadTimestamp,
  removeConversation,
} from '../../data/data';
import { getMessageQueue } from '../../bchat/sending';
import { useDispatch, useSelector } from 'react-redux';
// tslint:disable: no-submodule-imports
import useInterval from 'react-use/lib/useInterval';
import useTimeoutFn from 'react-use/lib/useTimeoutFn';

import { getOurNumber } from '../../state/selectors/user';
import {
  getOurPrimaryConversation,
  getUnreadMessageCount,
} from '../../state/selectors/conversations';
import { applyTheme } from '../../state/ducks/theme';
import { getFocusedSection } from '../../state/selectors/section';
// import { clearSearch } from '../../state/ducks/search';
import {
  SectionType,
  setOverlayMode,
  showLeftPaneSection,
  showSettingsSection,
  // showSettingsSection,
} from '../../state/ducks/section';

import { cleanUpOldDecryptedMedias } from '../../bchat/crypto/DecryptedAttachmentsManager';

import { DURATION } from '../../bchat/constants';
import { conversationChanged, conversationRemoved } from '../../state/ducks/conversations';
import { editProfileModal, updateBchatWalletPasswordModal, updateConfirmModal } from '../../state/ducks/modalDialog';
import { uploadOurAvatar } from '../../interactions/conversationInteractions';
import { ModalContainer } from '../dialog/ModalContainer';
import { debounce, isEmpty, isString } from 'lodash';

// tslint:disable-next-line: no-import-side-effect no-submodule-imports

import { switchHtmlToDarkTheme, switchHtmlToLightTheme } from '../../state/ducks/BchatTheme';
import { loadDefaultRooms } from '../../bchat/apis/open_group_api/opengroupV2/ApiUtil';
import { getOpenGroupManager } from '../../bchat/apis/open_group_api/opengroupV2/OpenGroupManagerV2';
import { getSwarmPollingInstance } from '../../bchat/apis/snode_api';
import { forceRefreshRandomSnodePool } from '../../bchat/apis/snode_api/snodePool';
import { Avatar, AvatarSize } from '../avatar/Avatar';
import { CallInFullScreenContainer } from '../calling/CallInFullScreenContainer';
import { DraggableCallContainer } from '../calling/DraggableCallContainer';
import { IncomingCallDialog } from '../calling/IncomingCallDialog';
import { BchatIconButton } from '../icon';
import { BchatToastContainer } from '../BchatToastContainer';
import { LeftPaneSectionContainer } from './LeftPaneSectionContainer';
import { getLatestDesktopReleaseFileToFsV2 } from '../../bchat/apis/file_server_api/FileServerApiV2';
import { ipcRenderer } from 'electron';
import { UserUtils } from '../../bchat/utils';

import { Storage } from '../../util/storage';
import { SettingsKey } from '../../data/settings-key';
import classNames from 'classnames';

import ReactTooltip from 'react-tooltip';
import { BchatSettingCategory } from '../settings/BchatSettings';
import { clearSearch } from '../../state/ducks/search';

const Section = (props: { type: SectionType }) => {
  const ourNumber = useSelector(getOurNumber);
  const unreadMessageCount = useSelector(getUnreadMessageCount);
  const dispatch = useDispatch();
  const { type } = props;

  const focusedSection = useSelector(getFocusedSection);
  const isSelected = focusedSection === props.type;

  // function switchToWalletSec() {
  //   dispatch(showLeftPaneSection(3));
  //   dispatch(showSettingsSection(BchatSettingCategory.Wallet));
  // }

  const handleClick = () => {
    /* tslint:disable:no-void-expression */
    console.log('type:', type);
    if (type === SectionType.Profile) {
      dispatch(editProfileModal({}));
    } else if (type === SectionType.Moon) {
      const themeFromSettings = window.Events.getThemeSetting();
      const updatedTheme = themeFromSettings === 'dark' ? 'light' : 'dark';
      window.setTheme(updatedTheme);
      if (updatedTheme === 'dark') {
        switchHtmlToDarkTheme();
      } else {
        switchHtmlToLightTheme();
      }

      const newThemeObject = updatedTheme === 'dark' ? 'dark' : 'light';
      dispatch(applyTheme(newThemeObject));
    } else if (type === SectionType.Closedgroup) {
      // Show Path Indicator Modal

      dispatch(showLeftPaneSection(1));
      dispatch(setOverlayMode('closed-group'));
    } else if (type === SectionType.Opengroup) {
      // Show Path Indicator Modal

      dispatch(showLeftPaneSection(2));

      dispatch(setOverlayMode('open-group'));
      // dispatch(setOverlayMode(undefined))
    } else if (type === SectionType.Wallet) {
      // Show Path Indicator Modal

       dispatch(showLeftPaneSection(type));

      dispatch(setOverlayMode('wallet'));
      dispatch(showSettingsSection(BchatSettingCategory.Wallet));
      dispatch(updateBchatWalletPasswordModal({from:"wallet"}));

      // dispatch(setOverlayMode(undefined))
    }
    else {
      // message section
      dispatch(clearSearch());
      dispatch(showLeftPaneSection(type));
      if (type == 3) {
        // dispatch(setOverlayMode('wallet'));

         dispatch(showSettingsSection(BchatSettingCategory.Wallet));
      } else {
        dispatch(setOverlayMode(undefined));
      }
    }
  };

  if (type === SectionType.Profile) {
    return (
      <Avatar
        size={AvatarSize.XS}
        onAvatarClick={handleClick}
        pubkey={ourNumber}
        dataTestId="leftpane-primary-avatar"
      />
    );
  }

  const unreadToShow = type === SectionType.Message ? unreadMessageCount : undefined;
  switch (type) {
    case SectionType.Message:
      return (
        <div className={classNames(isSelected ? 'isSelected-icon-box' : 'icon-box')}>
          <div
            data-tip="Chat"
            data-place="top"
            data-offset="{'right':27}"
            className="btnView"
            onClick={handleClick}
          >
            <BchatIconButton
              iconSize="large"
              dataTestId="message-section"
              iconType={'chatBubble'}
              isSelected={isSelected}
            />
          </div>
          {unreadMessageCount !== 0 ? (
            <div className="unreadCountChatIcon">
              {unreadMessageCount <= 9 ? (
                unreadToShow
              ) : (
                <span style={{ marginLeft: '-5px' }}>
                  9
                  <span
                    style={{
                      position: 'absolute',
                      top: '-1px',
                      left: '10px',
                    }}
                  >
                    +
                  </span>
                </span>
              )}
            </div>
          ) : null}
        </div>
      );
    case SectionType.Closedgroup:
      return (
        <div className={classNames(isSelected ? 'isSelected-icon-box' : 'icon-box')}>
          <div
            data-tip="Secret Group"
            data-place="top"
            data-offset="{'right':54}"
            className="btnView"
            onClick={handleClick}
          >
            <BchatIconButton
              iconSize="large"
              dataTestId="settings-section"
              iconType={'closedgroup'}
              notificationCount={unreadToShow}
              isSelected={isSelected}
            />
          </div>
        </div>
      );
    case SectionType.Opengroup:
      return (
        <div className={classNames(isSelected ? 'isSelected-icon-box' : 'icon-box')}>
          <div
            data-tip="Social Group"
            data-place="top"
            data-offset="{'right':50}"
            className="btnView"
            onClick={handleClick}
          >
            <BchatIconButton
              iconSize="large"
              dataTestId="settings-section"
              iconType={'opengroup'}
              notificationCount={unreadToShow}
              isSelected={isSelected}
            />
          </div>
        </div>
      );

    case SectionType.Wallet:
      return (
        <div className={classNames(isSelected ? 'isSelected-icon-box' : 'icon-box')}>
          <div
            data-tip="Wallet"
            data-place="top"
            data-offset="{'right':35}"
            className="btnView"
            onClick={handleClick}
          >
            <BchatIconButton
              iconSize="medium"
              dataTestId="settings-section"
              iconType={'wallet'}
              notificationCount={unreadToShow}
              isSelected={isSelected}
            />
          </div>
        </div>
      );
    default:
      return null
      // (
        // <BchatIconButton
        //   iconSize="medium"
        //   iconType={'moon'}
        //   dataTestId="theme-section"
        //   iconColor={undefined}
        //   notificationCount={unreadToShow}
        //   onClick={handleClick}
        // />
      // );
  }
};

const cleanUpMediasInterval = DURATION.MINUTES * 60;

// every 10 minutes we fetch from the fileserver to check for a new release
// * if there is none, no request to github are made.
// * if there is a version on the fileserver more recent than our current, we fetch github to get the UpdateInfos and trigger an update as usual (asking user via dialog)
const fetchReleaseFromFileServerInterval = 1000 * 60; // try to fetch the latest release from the fileserver every minute

const setupTheme = () => {
  const theme = window.Events.getThemeSetting();

  window.setTheme(theme);
  if (theme === 'dark') {
    switchHtmlToDarkTheme();
  } else {
    switchHtmlToLightTheme();
  }

  const newThemeObject = theme === 'dark' ? 'dark' : 'light';
  window?.inboxStore?.dispatch(applyTheme(newThemeObject));
};

// Do this only if we created a new BChat ID, or if we already received the initial configuration message
const triggerSyncIfNeeded = async () => {
  await getConversationController()
    .get(UserUtils.getOurPubKeyStrFromCache())
    .setDidApproveMe(true, true);
  const didWeHandleAConfigurationMessageAlready =
    (await getItemById(hasSyncedInitialConfigurationItem))?.value || false;
  if (didWeHandleAConfigurationMessageAlready) {
    await syncConfigurationIfNeeded();
  }
};

const removeAllV1OpenGroups = async () => {
  const allV1Convos = (await getAllOpenGroupV1Conversations()).models || [];
  // do not remove messages of opengroupv1 for now. We have to find a way of doing it without making the whole app extremely slow
  // tslint:disable-next-line: prefer-for-of
  for (let index = 0; index < allV1Convos.length; index++) {
    const v1Convo = allV1Convos[index];
    try {
      await removeConversation(v1Convo.id);
      window.log.info(`deleting v1convo : ${v1Convo.id}`);
      getConversationController().unsafeDelete(v1Convo);
      if (window.inboxStore) {
        window.inboxStore?.dispatch(conversationRemoved(v1Convo.id));
        window.inboxStore?.dispatch(
          conversationChanged({ id: v1Convo.id, data: v1Convo.getConversationModelProps() })
        );
      }
    } catch (e) {
      window.log.warn(`failed to delete opengroupv1 ${v1Convo.id}`, e);
    }
  }
};

const triggerAvatarReUploadIfNeeded = async () => {
  const lastTimeStampAvatarUpload = (await getItemById(lastAvatarUploadTimestamp))?.value || 0;

  if (Date.now() - lastTimeStampAvatarUpload > DURATION.DAYS * 14) {
    window.log.info('Reuploading avatar...');
    // reupload the avatar
    await uploadOurAvatar();
  }
};

/**
 * This function is called only once: on app startup with a logged in user
 */
const doAppStartUp = () => {
  // init the messageQueue. In the constructor, we add all not send messages
  // this call does nothing except calling the constructor, which will continue sending message in the pipeline
  void getMessageQueue().processAllPending();

  void setupTheme();

  // keep that one to make sure our users upgrade to new bchatIDS
  void removeAllV1OpenGroups();

  // this generates the key to encrypt attachments locally
  void generateAttachmentKeyIfEmpty();
  void getOpenGroupManager().startPolling();
  // trigger a sync message if needed for our other devices

  void triggerSyncIfNeeded();
  void getSwarmPollingInstance().start();

  void loadDefaultRooms();

  debounce(triggerAvatarReUploadIfNeeded, 200);

  void askEnablingOpengroupPruningIfNeeded();
};

const CallContainer = () => {
  return (
    <>
      <DraggableCallContainer />
      <IncomingCallDialog />
      <CallInFullScreenContainer />
    </>
  );
};

async function fetchReleaseFromFSAndUpdateMain() {
  try {
    window.log.info('[updater] about to fetchReleaseFromFSAndUpdateMain');

    const latest = await getLatestDesktopReleaseFileToFsV2();
    window.log.info('[updater] fetched latest release from fsv2: ', latest);

    if (isString(latest) && !isEmpty(latest)) {
      ipcRenderer.send('set-release-from-file-server', latest);
      window.readyForUpdates();
    }
  } catch (e) {
    window.log.warn(e);
  }
}

async function askEnablingOpengroupPruningIfNeeded() {
  if (Storage.get(SettingsKey.settingsOpengroupPruning) === undefined) {
    const setSettingsAndCloseDialog = async (valueToSetPruningTo: boolean) => {
      window.setSettingValue(SettingsKey.settingsOpengroupPruning, valueToSetPruningTo);
      await window.setOpengroupPruning(valueToSetPruningTo);
      window.inboxStore?.dispatch(updateConfirmModal(null));
    };
    window.inboxStore?.dispatch(
      updateConfirmModal({
        onClickOk: async () => {
          await setSettingsAndCloseDialog(true);
        },
        onClickClose: async () => {
          await setSettingsAndCloseDialog(false);
        },
        onClickCancel: async () => {
          await setSettingsAndCloseDialog(false);
        },
        title: window.i18n('pruningSocialgroupDialogTitle'),
        message: window.i18n('pruningSocialgroupDialogMessage'),
        messageSub: window.i18n('pruningSocialgroupDialogSubMessage'),
        okText: window.i18n('enable'),
        cancelText: window.i18n('keepDisabled'),
      })
    );
    return;
  }
  // otherwise nothing to do. the settings is already on or off, but as expected by the user
}

export const BchatToolTip = (props: any) => (
  <ReactTooltip
    className="tooltipDesign"
    delayShow={500}
    place={props.place}
    effect={props.effect}
  />
);

/**
 * ActionsPanel is the far left banner (not the left pane).
 * The panel with buttons to switch between the message/contact/settings/theme views
 */
export const ActionsPanel = () => {
  const [startCleanUpMedia, setStartCleanUpMedia] = useState(false);
  const ourPrimaryConversation = useSelector(getOurPrimaryConversation);

  // this maxi useEffect is called only once: when the component is mounted.
  // For the action panel, it means this is called only one per app start/with a user loggedin
  useEffect(() => {
    void doAppStartUp();
  }, []);

  // wait for cleanUpMediasInterval and then start cleaning up medias
  // this would be way easier to just be able to not trigger a call with the setInterval
  useEffect(() => {
    // switchHtmlToDarkTheme()
    const timeout = setTimeout(() => setStartCleanUpMedia(true), cleanUpMediasInterval);

    return () => clearTimeout(timeout);
  }, []);

  useInterval(cleanUpOldDecryptedMedias, startCleanUpMedia ? cleanUpMediasInterval : null);

  useInterval(() => {
    void fetchReleaseFromFSAndUpdateMain();
  }, fetchReleaseFromFileServerInterval);

  if (!ourPrimaryConversation) {
    window?.log?.warn('ActionsPanel: ourPrimaryConversation is not set');
    return null;
  }

  useInterval(() => {
    void syncConfigurationIfNeeded();
  }, DURATION.DAYS * 2);

  useInterval(() => {
    // trigger an updates from the snodes every hour

    void forceRefreshRandomSnodePool();
  }, DURATION.HOURS * 1);

  useTimeoutFn(() => {
    // trigger an updates from the snodes after 5 minutes, once
    void forceRefreshRandomSnodePool();
  }, DURATION.MINUTES * 5);

  useInterval(() => {
    // this won't be run every days, but if the app stays open for more than 10 days
    void triggerAvatarReUploadIfNeeded();
  }, DURATION.DAYS * 1);

  return (
    <>
      <ModalContainer />

      <CallContainer />
      <LeftPaneSectionContainer data-testid="leftpane-section-container">
        <Section type={SectionType.Message} />

        <Section type={SectionType.Closedgroup} />

        <Section type={SectionType.Opengroup} />

        <Section type={SectionType.Wallet} />


        <Section type={SectionType.Settings} />

        <BchatToolTip effect="solid" />
        <BchatToastContainer />
      </LeftPaneSectionContainer>
    </>
  );
};
