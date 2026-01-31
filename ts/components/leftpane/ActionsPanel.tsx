import  { useEffect, useState } from 'react';
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
import useInterval from 'react-use/lib/useInterval';
import useTimeoutFn from 'react-use/lib/useTimeoutFn';

import { getOurNumber } from '../../state/selectors/user';
import {
  getUnreadMessageCount,
} from '../../state/selectors/conversations';
import { ThemeStateType, applyTheme } from '../../state/ducks/theme';
import { getFocusedSection } from '../../state/selectors/section';
// import { clearSearch } from '../../state/ducks/search';
import {
  SectionType,
  setOverlayMode,
  showLeftPaneSection,
  // showSettingsSection,
} from '../../state/ducks/section';

import { cleanUpOldDecryptedMedias } from '../../bchat/crypto/DecryptedAttachmentsManager';

import { DURATION } from '../../bchat/constants';
import {
  closeRightPanel,
  conversationChanged,
  conversationRemoved
} from '../../state/ducks/conversations';
import {
  editProfileModal,
  updateConfirmModal,
} from '../../state/ducks/modalDialog';
import { uploadOurAvatar } from '../../interactions/conversationInteractions';
import { ModalContainer } from '../dialog/ModalContainer';
import { debounce, isEmpty, isString } from 'lodash';


// import { switchHtmlToDarkTheme, switchHtmlToLightTheme } from '../../state/ducks/BchatTheme';
import { loadDefaultRooms } from '../../bchat/apis/open_group_api/opengroupV2/ApiUtil';
import { getOpenGroupManager } from '../../bchat/apis/open_group_api/opengroupV2/OpenGroupManagerV2';
import { getSwarmPollingInstance } from '../../bchat/apis/snode_api';
import { forceRefreshRandomSnodePool } from '../../bchat/apis/snode_api/snodePool';
import { Avatar, AvatarSize } from '../avatar/Avatar';
import { CallInFullScreenContainer } from '../calling/CallInFullScreenContainer';
import { DraggableCallContainer } from '../calling/DraggableCallContainer';
import { IncomingCallDialog } from '../calling/IncomingCallDialog';
import { BchatIcon } from '../icon';
import { BchatToastContainer } from '../BchatToastContainer';
import { LeftPaneSectionContainer } from './LeftPaneSectionContainer';
import { getLatestDesktopReleaseFileToFsV2 } from '../../bchat/apis/file_server_api/FileServerApiV2';
import { ipcRenderer } from 'electron';
import { UserUtils } from '../../bchat/utils';

import { Storage } from '../../util/storage';
import { SettingsKey } from '../../data/settings-key';
import classNames from 'classnames';

import ReactTooltip from 'react-tooltip';
import { clearSearch } from '../../state/ducks/search';
import { getOurPubKeyStrFromCache } from '../../bchat/utils/User';
import { getIsOnline } from '../../state/selectors/onions';
import styled from 'styled-components';
import { ActionPanelOnionStatusLight } from '../dialog/OnionStatusPathDialog';
import { Flex } from '../basic/Flex';
import { SpacerLG, SpacerMD, SpacerSM } from '../basic/Text';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import { getTheme } from '../../state/selectors/theme';
import NewChatIcon from '../icon/NewChatIcon';
import SecretGrpIcon from '../icon/SecretGrpIcon';
import SocialGrpIcon from '../icon/SocialGrpIcon';
import SubMenuConnectIcon from '../icon/SubMenuConnect';
import { openCallHistory } from '../../state/ducks/callHistory';
import { useConversationBnsHolder } from '../../hooks/useParamSelector';

const Section = (props: {
  type: SectionType;
  isHiddenSubMenus?: boolean;
  setIsHiddenSubMenus?: any;
}) => {
  const ourNumber = useSelector(getOurNumber);
  const unreadMessageCount = useSelector(getUnreadMessageCount);
  const dispatch = useDispatch();
  const { type, isHiddenSubMenus, setIsHiddenSubMenus } = props;
  const focusedSection = useSelector(getFocusedSection);
  const isSelected = focusedSection === props.type;


  const handleClick = async (subTypes?: SectionType) => {
    dispatch(closeRightPanel());
    if (type === SectionType.Profile) {
      dispatch(editProfileModal({}));
    } else if (subTypes === SectionType.SubMenu) {
      setIsHiddenSubMenus(false);
    } else if (type === SectionType.Moon) {
      const themeFromSettings = window.Events.getThemeSetting();
      const updatedTheme = themeFromSettings === 'dark' ? 'light' : 'dark';
      window.setTheme(updatedTheme);
      // if (updatedTheme === 'dark') {
      //   switchHtmlToDarkTheme();
      // } else {
      //   switchHtmlToLightTheme();
      // }

      const newThemeObject = updatedTheme === 'dark' ? 'dark' : 'light';
      dispatch(applyTheme(newThemeObject));
    } else if (subTypes === SectionType.NewChat) {
      setIsHiddenSubMenus(!isHiddenSubMenus);
      dispatch(showLeftPaneSection(1));

      dispatch(setOverlayMode('message'));
    } else if (subTypes === SectionType.Closedgroup) {
      setIsHiddenSubMenus(!isHiddenSubMenus);
      // Show close group
      dispatch(showLeftPaneSection(2));

      dispatch(setOverlayMode('closed-group'));
    } else if (subTypes === SectionType.Opengroup) {
      setIsHiddenSubMenus(!isHiddenSubMenus);
      // Show open group
      dispatch(showLeftPaneSection(3));

      dispatch(setOverlayMode('open-group'));
      // dispatch(setOverlayMode(undefined))
    } else if (type === SectionType.CallHistory) {
      openCallHistory();
      // Show open group
      dispatch(showLeftPaneSection(type));
      dispatch(setOverlayMode('call-history'));
    }else if (type === SectionType.Settings) {
      // show open settings
      dispatch(showLeftPaneSection(type));

      // dispatch(setOverlayMode());
      dispatch(setOverlayMode(undefined));
    } else {
      // show open all chat
      dispatch(clearSearch());
      dispatch(setOverlayMode(undefined));
      dispatch(showLeftPaneSection(type));
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
            // data-tip="Chat"
            // data-place="right"
            // data-offset="{'top':0}"
            className="btnView"
            onClick={() => handleClick()}
          >
            <BchatIcon iconSize={31} iconType={'chatBubble'} />
            {unreadMessageCount !== 0 ? (
              <div className="unreadCountChatIcon">
                {unreadMessageCount <= 99 ? unreadToShow : <span>99+</span>}
              </div>
            ) : null}
          </div>
          <section className="d-visiblity ">
            <DisplayTitle title="All Chats" top={'186px'} />
          </section>
        </div>
      );
    case SectionType.NewChat:
      const isFocused =
        focusedSection === SectionType.NewChat ||
        focusedSection === SectionType.Closedgroup ||
        focusedSection === SectionType.Opengroup;
      return (
        <div
          className={classNames(
            isFocused ? 'isSelected-icon-box' : 'icon-box',
            !isHiddenSubMenus && 'icon-colored-box'
          )}
          onMouseOver={() => setIsHiddenSubMenus(false)}
          onMouseLeave={() => {
            setIsHiddenSubMenus(true);
          }}
        >
          <div
            // data-tip="New Chat"
            // data-place="right"
            // data-offset="{'top':0}"
            className="btnView"
            onClick={() => handleClick(SectionType.SubMenu)}
          >
            <BchatIcon iconSize={31} iconType={'newChat'} />
          </div>
          <div>
            <Flex
              container={true}
              className={classNames(
                'sub-menu-box-wrapper',
                isHiddenSubMenus && 'sub-menu-box-wrapper-disabled'
              )}
            >
              <MarginedDiv>
                <SubMenuConnectIcon />
              </MarginedDiv>
              <div className={'sub-menu-box'}>
                <SubMenuList
                  container={true}
                  padding="17px"
                  onClick={() => handleClick(SectionType.NewChat)}
                  isSelected={focusedSection === SectionType.NewChat}
                >
                  <NewChatIcon />
                  <SpacerMD /> <div className="menu-txt">New Chat</div>
                </SubMenuList>
                <SpacerMD />
                <SubMenuList
                  container={true}
                  padding="17px"
                  onClick={() => handleClick(SectionType.Closedgroup)}
                  isSelected={focusedSection === SectionType.Closedgroup}
                >
                  <SecretGrpIcon />
                  <SpacerMD /> <div className="menu-txt">Secret Group</div>
                </SubMenuList>
                <SpacerMD />
                <SubMenuList
                  container={true}
                  padding="17px"
                  onClick={() => handleClick(SectionType.Opengroup)}
                  isSelected={focusedSection === SectionType.Opengroup}
                >
                  <SocialGrpIcon />
                  <SpacerMD /> <div className="menu-txt">Social Group</div>{' '}
                </SubMenuList>
              </div>
            </Flex>
          </div>
        </div>
      );
       {/* *****call history feature implement in future release***** */}
    // case SectionType.CallHistory:
    //   return (
    //     <div className={classNames(isSelected ? 'isSelected-icon-box' : 'icon-box')}>
    //       <div className="btnView" onClick={() => handleClick()}>
    //         <BchatIcon iconSize={31} iconType={'call'} fillRule="evenodd" clipRule="evenodd" />
    //       </div>

    //       <section className="d-visiblity ">
    //         <DisplayTitle title="Call History" top={'278px'} />
    //       </section>
    //     </div>
    //   );
    case SectionType.Settings:
      return (
        <div className={classNames(isSelected ? 'isSelected-icon-box' : 'icon-box')}>
          <div
            // data-tip="settings"
            // data-place="right"
            // data-offset="{'top':0}"
            className="btnView"
            onClick={() => handleClick()}
          >
            <BchatIcon
              iconSize={31}
              // dataTestId="settings-section"
              iconType={'gear'}
            />
          </div>
          <section className="d-visiblity ">
            <DisplayTitle title="Settings" top={'278px'} />
          </section>
        </div>
      );

   

    default:
      return null;
  }
};

const cleanUpMediasInterval = DURATION.MINUTES * 60;

// every 10 minutes we fetch from the fileserver to check for a new release
// * if there is none, no request to github are made.
// * if there is a version on the fileserver more recent than our current, we fetch github to get the UpdateInfos and trigger an update as usual (asking user via dialog)
const fetchReleaseFromFileServerInterval = 1000 * 60; // try to fetch the latest release from the fileserver every minute

const setupTheme = () => {
  const theme = window.Events.getThemeSetting();

  // window.setTheme(theme);
  // if (theme === 'dark') {
  //   switchHtmlToDarkTheme();
  // } else {
  //   switchHtmlToLightTheme();
  // }

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

const DisplayTitle = (props: { title: string; top: string }) => (
  <StyledTitleWrapper container={true} alignItems="center" top={props.top}>
    <SubMenuConnectIcon />
    <div className={'sub-menu-box'}>
      <div className="menu-txt">{props.title}</div>
    </div>
  </StyledTitleWrapper>
);

/**
 * ActionsPanel is the far left banner (not the left pane).
 * The panel with buttons to switch between the message/contact/settings/theme views
 */
export const ActionsPanel = () => {
  const [startCleanUpMedia, setStartCleanUpMedia] = useState(false);
  const [isHiddenSubMenus, setIsHiddenSubMenus] = useState(true);
  const ourPrimaryConversation = useSelector(getOurPubKeyStrFromCache);
  const isBnsHolder=useConversationBnsHolder(ourPrimaryConversation)
  const dispatch = useDispatch();
  const pathCon = useSelector(getIsOnline);
  // const isOnline=window.getGlobalOnlineStatus();
  const isOnline = useNetworkStatus();
  const darkMode = useSelector(getTheme) === 'dark';
  const imgsrc: any = darkMode
    ? 'images/bchat/connect_wallet_dark.gif'
    : 'images/bchat/connect_wallet_white.gif';

  // this maxi useEffect is called only once: when the component is mounted.
  // For the action panel, it means this is called only one per app start/with a user loggedin
  useEffect(() => {
    void doAppStartUp();
  }, []);

  // wait for cleanUpMediasInterval and then start cleaning up medias
  // this would be way easier to just be able to not trigger a call with the setInterval
  useEffect(() => {
    const timeout = setTimeout(() => setStartCleanUpMedia(true), cleanUpMediasInterval);

    return () => clearTimeout(timeout);
  }, []);

  useInterval(cleanUpOldDecryptedMedias, startCleanUpMedia ? cleanUpMediasInterval : null);

  useInterval(() => {
    if (!ourPrimaryConversation) {
      return;
    }
    void fetchReleaseFromFSAndUpdateMain();
  }, fetchReleaseFromFileServerInterval);

  useInterval(() => {
    if (!ourPrimaryConversation) {
      return;
    }
    void syncConfigurationIfNeeded();
  }, DURATION.DAYS * 2);

  useInterval(() => {
    if (!ourPrimaryConversation) {
      return;
    }
    // trigger an updates from the snodes every hour

    void forceRefreshRandomSnodePool();
  }, DURATION.HOURS * 1);

  useTimeoutFn(() => {
    if (!ourPrimaryConversation) {
      return;
    }
    // trigger an updates from the snodes after 5 minutes, once
    void forceRefreshRandomSnodePool();
  }, DURATION.MINUTES * 5);

  useInterval(() => {
    if (!ourPrimaryConversation) {
      return;
    }
    // this won't be run every days, but if the app stays open for more than 10 days
    void triggerAvatarReUploadIfNeeded();
  }, DURATION.DAYS * 1);
  if (!ourPrimaryConversation) {
    window?.log?.warn('ActionsPanel: ourPrimaryConversation is not set');
    return null;
  }

 

  const themeChanger = (theme: ThemeStateType) => {
    // const themeFromSettings = window.Events.getThemeSetting();
    window.setTheme(theme);
    dispatch(applyTheme(theme));

    // if (themeFromSettings !== theme) {
    //   if (theme === 'dark') {
    //     switchHtmlToDarkTheme();
    //   } else {
    //     switchHtmlToLightTheme();
    //   }
    // }
  };
  const IsOnline = () => {
    const isOnline = useSelector(getIsOnline);
    const status = isOnline ? 'Online' : 'Offline';

    return (
      <Hops data-tip={status} data-offset="{'right':30}" data-place="bottom">
        <ActionPanelOnionStatusLight
          isSelected={false}
          handleClick={() => {}}
          id={''}
          size="small"
        />
      </Hops>
    );
  };
  return (
    <>
      <ModalContainer />
      <CallContainer />
      <LeftPaneSectionContainer data-testid="leftpane-section-container">
        <div
          className="profile-box"
          style={{ marginTop: '10px', height: '60px', position: 'relative' }}
        >
          <IsOnline />
            <Avatar
              size={AvatarSize.L}
              onAvatarClick={() => dispatch(editProfileModal({}))}
              pubkey={getOurPubKeyStrFromCache()}
              dataTestId="leftpane-primary-avatar"
              isBnsHolder={isBnsHolder}
            />
        </div>
        <SpacerMD />
        <div style={{ overflow: 'auto', width: '65%', height: 'calc(100vh - 250px)' }}>
          <Section
            type={SectionType.NewChat}
            isHiddenSubMenus={isHiddenSubMenus}
            setIsHiddenSubMenus={(e: boolean) => setIsHiddenSubMenus(e)}
          />

          <SpacerMD />
          <Section type={SectionType.Message} />
          {/* *****call history feature implement in future release***** */}
          {/* <SpacerMD />
          <Section type={SectionType.CallHistory} /> */}
          <SpacerMD />
          <Section type={SectionType.Settings} />
        </div>
        <Flex container={true} alignItems="flex-end">
          <div className="theme-Wrapper ">
            <div
              className={classNames('icon-wrapper', !darkMode && 'selected')}
              onClick={() => themeChanger('light')}
            >
              <BchatIcon
                iconType={'sun'}
                iconSize={24}
                iconColor={darkMode ? '#F0F0F0' : '#333333'}
              />
            </div>

            <div
              className={classNames('icon-wrapper', darkMode && 'selected')}
              onClick={() => themeChanger('dark')}
            >
              <BchatIcon
                iconType={'moon'}
                iconSize={24}
                iconColor={darkMode ? '#F0F0F0' : '#A7A7BA'}
              />
            </div>
          </div>
        </Flex>
        <SpacerLG />
        <div className="appVersion">V {window.getVersion()}</div>
        <SpacerSM />
        <BchatToolTip effect="solid" />
        <BchatToastContainer />
        <NetWorkStatusWrapper>
          {!isOnline && !pathCon && (
            <div className="offline-msg">
              <BchatIcon iconType={'warning'} iconSize={'huge'} iconColor={'#FF3C3C'} />
              <span className="txt">
                You are not connected to the Hop. Check your internet connection or Restart the app!
              </span>
            </div>
          )}
          {!pathCon && isOnline && (
            <div className="offline-msg connection-Wrapper ">
              <Flex
                container={true}
                flexDirection="row"
                alignItems="center"
                width="350px"
                justifyContent="space-between"
              >
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div className="dotIcon">
                    <BchatIcon iconSize={'small'} iconType="circle" />
                  </div>
                  <div>Connecting..</div>
                </div>
                <div>
                  <img src={imgsrc} style={{ width: '30px', height: '30px', display: 'flex' }} />
                </div>
              </Flex>
            </div>
          )}
        </NetWorkStatusWrapper>
      </LeftPaneSectionContainer>
    </>
  );
};
const Hops = styled.div`
  position: absolute;
  right: -7px;
  top: -4px;
  z-index: 1;
  border: 4px solid var(--color-inbox-background);
  border-radius: 40px;
`;
const NetWorkStatusWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  width: 338px;
  left: 141px;
  z-index: 99;
`;
const MarginedDiv = styled.div`
  margin-top: 30px;
`;
const SubMenuList = styled(Flex)<{ isSelected: boolean }>`
  ${props => props.isSelected && 'background-color: var(--color-hop-bg);'}
  cursor:pointer;
  border-radius: 16px;
  &:hover {
    background-color: var(--color-theme-selected-bg);
  }
`;
const StyledTitleWrapper = styled(Flex)<{ top: string }>`
  position: fixed;
  left: 102px;
  top: ${props => props.top};
  z-index: 9;
  .sub-menu-box {
    padding: 21px 25px;
    background-color: var(--color-modal-bg);
    border-radius: 16px;
  }
`;
