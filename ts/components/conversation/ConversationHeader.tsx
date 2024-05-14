import React from 'react';

import { Avatar, AvatarSize } from '../avatar/Avatar';

import { contextMenu } from 'react-contexify';
import styled from 'styled-components';
import {
  ConversationNotificationSettingType,
  ConversationTypeEnum,
} from '../../models/conversation';
import {
  getConversationHeaderTitleProps,
  // getCurrentNotificationSettingText,
  getIsSelectedBlocked,
  getIsSelectedNoteToSelf,
  getIsSelectedPrivate,
  getSelectedConversation,
  getSelectedConversationIsPublic,
  getSelectedConversationKey,
  getSelectedMessageIds,
  isMessageDetailView,
  isMessageSelectionMode,
  isRightPanelShowing,
} from '../../state/selectors/conversations';
import { useDispatch, useSelector } from 'react-redux';

import {
  deleteMessagesById,
  deleteMessagesByIdForEveryone,
} from '../../interactions/conversations/unsendingInteractions';
import {
  closeMessageDetailsView,
  closeRightPanel,
  openRightPanel,
  resetSelectedMessageIds,
} from '../../state/ducks/conversations';
import { callRecipient } from '../../interactions/conversationInteractions';
import { getHasIncomingCall, getHasOngoingCall } from '../../state/selectors/call';
import {
  useConversationPropsById,
  useConversationUsername,
  useExpireTimer,
  useIsKickedFromGroup,
} from '../../hooks/useParamSelector';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { BchatIcon, BchatIconButton } from '../icon';
import { ConversationHeaderMenu } from '../menu/ConversationHeaderMenu';
import { Flex } from '../basic/Flex';
import { ExpirationTimerOptions } from '../../util/expiringMessages';
import { Timestamp } from './Timestamp';
import { TypingBubble } from './TypingBubble';
import { getConversationController } from '../../bchat/conversations';
import { getWalletSyncBarShowInChat } from '../../state/selectors/walletConfig';
import { SettingsKey } from '../../data/settings-key';
import { updateBchatWalletPasswordModal } from '../../state/ducks/modalDialog';
// import { BchatButtonIcon } from '../wallet/BchatWalletPaymentSection';

export interface TimerOption {
  name: string;
  value: number;
}

export type ConversationHeaderProps = {
  conversationKey: string;
  name?: string;

  profileName?: string;
  avatarPath: string | null;

  isMe: boolean;
  isGroup: boolean;
  isPrivate: boolean;
  isPublic: boolean;
  weAreAdmin: boolean;

  // We might not always have the full list of members,
  // e.g. for Social groups where we could have thousands
  // of members. We'll keep this for now (for closed chats)
  members: Array<any>;

  // not equal members.length (see above)
  subscriberCount?: number;

  expirationSettingName?: string;
  currentNotificationSetting: ConversationNotificationSettingType;
  hasNickname: boolean;

  isBlocked: boolean;

  isKickedFromGroup: boolean;
  left: boolean;
};

const SelectionOverlay = () => {
  const selectedMessageIds = useSelector(getSelectedMessageIds);
  const selectedConversationKey = useSelector(getSelectedConversationKey);
  const isPublic = useSelector(getSelectedConversationIsPublic);
  const dispatch = useDispatch();

  const { i18n } = window;

  function onCloseOverlay() {
    dispatch(resetSelectedMessageIds());
  }

  function onDeleteSelectedMessages() {
    if (selectedConversationKey) {
      void deleteMessagesById(selectedMessageIds, selectedConversationKey);
    }
  }
  function onDeleteSelectedMessagesForEveryone() {
    if (selectedConversationKey) {
      void deleteMessagesByIdForEveryone(selectedMessageIds, selectedConversationKey);
    }
  }

  const isOnlyServerDeletable = isPublic;
  const deleteMessageButtonText = i18n('delete');
  const deleteForEveryoneMessageButtonText = i18n('deleteForEveryone');

  return (
    <div className="message-selection-overlay">
      <div className="button-group">
        {!isOnlyServerDeletable && (
          <BchatButton
            buttonType={BchatButtonType.Default}
            buttonColor={BchatButtonColor.Danger}
            text={deleteMessageButtonText}
            onClick={onDeleteSelectedMessages}
          />
        )}
        <BchatButton
          buttonType={BchatButtonType.Default}
          buttonColor={BchatButtonColor.Red}
          text={deleteForEveryoneMessageButtonText}
          onClick={onDeleteSelectedMessagesForEveryone}
        />
      </div>
      <div className="close-button">
        <BchatIconButton iconType="exit" iconSize="medium" onClick={onCloseOverlay} />
      </div>
    </div>
  );
};

const TripleDotsMenu = (props: { triggerId: string; showBackButton: boolean }) => {
  const { showBackButton } = props;
  if (showBackButton) {
    return null;
  }
  let width = window.innerWidth;
  return (
    <div
      className="threedot-option"
      role="button"
      onClick={(e: any) => {
        contextMenu.show({
          id: props.triggerId,
          event: e,
          position: {
            x: width - 300,
            y: 55,
          },
        });
      }}
      data-testid="three-dots-conversation-options"
    >
      <BchatIconButton iconType="ellipses" iconSize={22} />
    </div>
  );
};

const ExpirationLength = (props: { expirationSettingName?: string }) => {
  const { expirationSettingName } = props;

  if (!expirationSettingName) {
    return null;
  }

  return (
    <div className="module-conversation-header__expiration">
      <div className="module-conversation-header__expiration__clock-icon" />
      <div
        className="module-conversation-header__expiration__setting"
        data-testid="disappearing-messages-indicator"
      >
        {expirationSettingName}
      </div>
    </div>
  );
};

const AvatarHeader = (props: {
  pubkey: string;
  showBackButton: boolean;
  onAvatarClick?: (pubkey: string) => void;
}) => {
  const { pubkey, onAvatarClick, showBackButton } = props;

  return (
    <span className="module-conversation-header__avatar">
      <Avatar
        size={AvatarSize.S}
        onAvatarClick={() => {
          // do not allow right panel to appear if another button is shown on the BchatConversation
          if (onAvatarClick && !showBackButton) {
            onAvatarClick(pubkey);
          }
        }}
        pubkey={pubkey}
        dataTestId="conversation-options-avatar"
      />
    </span>
  );
};

const BackButton = (props: { onGoBack: () => void; showBackButton: boolean }) => {
  const { onGoBack, showBackButton } = props;
  if (!showBackButton) {
    return null;
  }

  return (
    <BchatIconButton
      iconType="chevron"
      iconSize="large"
      iconRotation={90}
      onClick={onGoBack}
      dataTestId="back-button-message-details"
    />
  );
};

const CallButton = () => {
  const isPrivate = useSelector(getIsSelectedPrivate);
  const isBlocked = useSelector(getIsSelectedBlocked);
  const isMe = useSelector(getIsSelectedNoteToSelf);
  const selectedConvoKey = useSelector(getSelectedConversationKey);

  const hasIncomingCall = useSelector(getHasIncomingCall);
  const hasOngoingCall = useSelector(getHasOngoingCall);
  const canCall = !(hasIncomingCall || hasOngoingCall);

  if (!isPrivate || isMe || !selectedConvoKey || isBlocked) {
    return null;
  }

  return (
    <BchatIconButton
      iconType="phone"
      iconRotation={270}
      iconSize="medium"
      iconPadding="2px"
      margin="0 10px 0 0"
      onClick={() => {
        void callRecipient(selectedConvoKey, canCall);
      }}
    />
  );
};

export const StyledSubtitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  span:last-child {
    margin-bottom: 0;
  }
`;

export type ConversationHeaderTitleProps = {
  conversationKey: string;
  profileName?: string;
  isMe: boolean;
  isGroup: boolean;
  isPublic: boolean;
  members: Array<any>;
  subscriberCount?: number;
  isKickedFromGroup: boolean;
  name?: string;
  currentNotificationSetting?: ConversationNotificationSettingType;
};

const ConversationHeaderTitle = () => {
  // console.log("convertion header 1::")
  const headerTitleProps = useSelector(getConversationHeaderTitleProps);
  // console.log("convertion header 2::",headerTitleProps)

  // const notificationSetting = useSelector(getCurrentNotificationSettingText);
  const isRightPanelOn = useSelector(isRightPanelShowing);
  // console.log("convertion header 3::",isRightPanelOn)

  const convoName = useConversationUsername(headerTitleProps?.conversationKey);
  // console.log("convertion header 4::",convoName)

  const dispatch = useDispatch();
  const convoProps = useConversationPropsById(headerTitleProps?.conversationKey);
  // console.log("convertion header 5::",convoProps)

  const conversationKey: any = useSelector(getSelectedConversationKey);
  // console.log("convertion header 6::",conversationKey)

  const conversation: any = useSelector(getSelectedConversation);
  // console.log("convertion header 7::",conversation)
  

  let displayedName = null;
  if (conversation?.type === ConversationTypeEnum.PRIVATE) {
    displayedName = getConversationController().getContactProfileNameOrShortenedPubKey(
      conversationKey
    );
  }
  // console.log("convertion header 8::",displayedName)

  const activeAt = convoProps?.activeAt;
  if (!headerTitleProps) {
    return null;
  }
  // console.log("convertion header 9::",activeAt)

  const { isGroup, isPublic, members, subscriberCount, isMe, isKickedFromGroup } = headerTitleProps;
  // console.log("convertion header 10::",headerTitleProps)

  const { i18n } = window;
  // console.log("convertion header 11::",isMe)

  if (isMe) {
    // console.log("convertion header 12::",isMe)

    // return <div className="module-conversation-header__title">{window.i18n('noteToSelf')}</div>;
    return <div className="module-conversation-header__title">Note to Self</div>;
  }
  // console.log("convertion header 13::",headerTitleProps)

  let memberCount = 0;
  if (isGroup) {
    if (isPublic) {
      memberCount = subscriberCount || 0;
    } else {
      memberCount = members.length;
    }
  }
  // console.log("convertion header 14::",headerTitleProps)

  const SubTxt = styled.div`
    font-size: 11px;
    line-height: 16px;
    letter-spacing: 0.3px;
    // text-transform: uppercase;
    user-select: none;
    font-weight: 100;
    color: var(--color-text-subtle);
  `;
  let memberCountText = '';
  if (isGroup && memberCount > 0 && !isKickedFromGroup) {
    const count = String(memberCount);
    memberCountText = i18n('members', [count]);
  }

  return (
    <div
      className="module-conversation-header__title"
      onClick={() => {
        if (isRightPanelOn) {
          dispatch(closeRightPanel());
        } else {
          dispatch(openRightPanel());
        }
      }}
      role="button"
    >
      <span className="module-contact-name__profile-name" data-testid="header-conversation-name">
        {convoName} 
        {!isGroup &&conversation.isBnsHolder && <span className='module-contact-name-bns-tag '>Bns</span>}
        <SubTxt>
          {isGroup ? (
            memberCountText
          ) : !!conversation.isTyping ? (
            <TypingBubble
              pubkey={conversationKey}
              conversationType={conversation?.type}
              displayedName={displayedName}
              isTyping={!!conversation.isTyping}
              //  isTyping={true}

              key="typing-bubble"
            />
          ) : (
            <Timestamp timestamp={activeAt} isConversationListItem={true} momentFromNow={true} />
          )}
        </SubTxt>
      </span>
    </div>
  );
};

/**
 * The subtitle beneath a conversation title when looking at a conversation screen.
 * @param props props for subtitle. Text to be displayed
 * @returns JSX Element of the subtitle of conversation header
 */
export const ConversationHeaderSubtitle = (props: { text?: string | null }): JSX.Element | null => {
  const { text } = props;
  if (!text) {
    return null;
  }
  return <span className="module-conversation-header__title-text">{text}</span>;
};

export const ConversationHeaderWithDetails = () => {
  const isSelectionMode = useSelector(isMessageSelectionMode);
  const isMessageDetailOpened = useSelector(isMessageDetailView);
  const selectedConvoKey: any = useSelector(getSelectedConversationKey);

  const conversation = useSelector(getSelectedConversation);
  const WalletSyncBarShowInChat = useSelector(getWalletSyncBarShowInChat);
  const chatwithWallet = window.getSettingValue(SettingsKey.settingsChatWithWallet) || false;

  const dispatch = useDispatch();
  const displayConnectWalletBtn =
    chatwithWallet &&
    !WalletSyncBarShowInChat &&
    conversation?.type == 'private' &&
    conversation?.isApproved &&
    conversation?.didApproveMe;

  console.log('ConversationHeaderWithDetails............', conversation);
  if (!selectedConvoKey) {
    return null;
  }

  const isKickedFromGroup = useIsKickedFromGroup(selectedConvoKey);
  const expireTimerSetting = useExpireTimer(selectedConvoKey);
  const expirationSettingName = expireTimerSetting
    ? ExpirationTimerOptions.getName(expireTimerSetting || 0)
    : undefined;

  const triggerId = 'conversation-header';

  // function displayWalletPassword() {

  //   // if (chatwithWallet && !WalletSyncBarShowInChat) {
  //   dispatch(updateBchatWalletPasswordModal({}));
  //     // return;
  //   // }
  // }
  async function printlog() {
    console.log('conversation data 0 ----->');
    const conversation = await getConversationController().getOrCreateAndWait(
      selectedConvoKey,
      ConversationTypeEnum.PRIVATE
    );
    // await conversation.setIsBnsHolder(false)
    console.log('conversation data ----->', conversation);
  }
  return (
    <div className="module-conversation-header">
      <div className="conversation-header--items-wrapper">
        <BackButton
          onGoBack={() => {
            dispatch(closeMessageDetailsView());
          }}
          showBackButton={isMessageDetailOpened}
        />
        <ConversationHeaderMenu triggerId={triggerId} />
        <div style={{ width: '100%' }}>
          <Flex container={true} flexDirection="row" alignItems="center">
            {/* <div> */}

            <AvatarHeader
              onAvatarClick={() => {
                dispatch(openRightPanel());
              }}
              pubkey={selectedConvoKey}
              showBackButton={isMessageDetailOpened}
            />
            {/* <span>BNS</span>
            </div> */}
            <ConversationHeaderTitle />
            <button onClick={() => printlog()}>get convo</button>
            {displayConnectWalletBtn && (
              <div
                className="connectWalletBtn"
                onClick={() => dispatch(updateBchatWalletPasswordModal({}))}
              >
                <BchatIcon iconType="wallet" iconSize={'tiny'} iconColor="white" />
                <div>{window.i18n('connectWallet')}</div>
                {/* <BchatButtonIcon
                name={window.i18n('connectWallet')}
                buttonType={BchatButtonType.Brand}
                buttonColor={BchatButtonColor.Green}
                style={{
                  height: '25px',
                  borderRadius: '5px',
                  marginRight: '14px'
                }}
                onClick={() => dispatch(updateBchatWalletPasswordModal({}))}
              // disabled={!caption}
              /> */}
              </div>
            )}
            {!isKickedFromGroup && (
              <ExpirationLength expirationSettingName={expirationSettingName} />
            )}
            {conversation?.type == 'private' && (
              <div className="call">
                <CallButton />
              </div>
            )}
          </Flex>
        </div>
        <div className="module-conversation-header__title-container">
          <div className="module-conversation-header__title-flex">
            <TripleDotsMenu triggerId={triggerId} showBackButton={isMessageDetailOpened} />
          </div>
        </div>
      </div>

      {isSelectionMode && <SelectionOverlay />}
    </div>
  );
};
