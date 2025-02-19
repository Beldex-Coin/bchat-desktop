import React, { useEffect, useState } from 'react';

import { Avatar, AvatarSize, BNSWrapper } from '../avatar/Avatar';

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
  // isRightPanelShowing,
} from '../../state/selectors/conversations';
import { useDispatch, useSelector } from 'react-redux';

import {
  deleteMessagesById,
  deleteMessagesByIdForEveryone,
} from '../../interactions/conversations/unsendingInteractions';
import {
  closeMessageDetailsView,
  // closeRightPanel,
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
import { BchatIconButton } from '../icon';
import { ConversationHeaderMenu } from '../menu/ConversationHeaderMenu';
import { Flex } from '../basic/Flex';
import { ExpirationTimerOptions } from '../../util/expiringMessages';
import { Timestamp } from './Timestamp';
import { TypingBubble } from './TypingBubble';
import { getConversationController } from '../../bchat/conversations';
import { getWalletSyncBarShowInChat } from '../../state/selectors/walletConfig';
import { SettingsKey } from '../../data/settings-key';
import { updateBchatWalletPasswordModal } from '../../state/ducks/modalDialog';
import { getTheme } from '../../state/selectors/theme';
import { getMessageById } from '../../data/data';

// import { CustomIconButton } from '../icon/CustomIconButton';
// import CallIcon from '../icon/CallIcon';
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
  const darkMode = useSelector(getTheme) === 'dark';

  const [canDeleteEveryone, setCanDeleteEveryone] = useState(false);

  useEffect(() => {
    const isDeleteEveryone = async () => {
      // Retrieve selected messages
      const selectedMessages = await Promise.all(
        selectedMessageIds.map(id => getMessageById(id, false))
      );
      // Remove null or undefined messages
      const compactedMessages = selectedMessages.filter(Boolean);

      // Check if there are any incoming messages in selected messages for private conversations
      const containsIncomingMessages =
        !isPublic && compactedMessages.some(msg => !msg?.isOutgoing());

      // Return the negation of containsIncomingMessages
      return !containsIncomingMessages;
    };

    // Call isDeleteEveryone and update state
    isDeleteEveryone().then(result => {
      setCanDeleteEveryone(result);
    });
  }, [selectedMessageIds, isPublic]);

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
      <Flex container={true} alignItems="center">
        <div className="close-button">
          <BchatIconButton iconType="xWithCircle" iconSize={24} onClick={onCloseOverlay} />
        </div>

        <div className="seleted-count">
          <span style={{ marginRight: '5px' }}>{selectedMessageIds.length}</span>
          <span>Selected</span>
        </div>
      </Flex>

      <div className="button-group">
        {!isOnlyServerDeletable && (
          <BchatButton
            buttonType={BchatButtonType.Medium}
            buttonColor={BchatButtonColor.Danger}
            text={deleteMessageButtonText}
            onClick={onDeleteSelectedMessages}
            style={{ borderRadius: '40px', background: darkMode ? '#131313' : '' }}
          />
        )}
        {canDeleteEveryone && (
          <BchatButton
            buttonType={BchatButtonType.Medium}
            buttonColor={BchatButtonColor.Red}
            text={deleteForEveryoneMessageButtonText}
            onClick={onDeleteSelectedMessagesForEveryone}
            style={{ borderRadius: '40px' }}
          />
        )}
      </div>
    </div>
  );
};

const TripleDotsMenu = (props: { triggerId: string; showBackButton: boolean }) => {
  const { showBackButton } = props;
  const isShowing: boolean = useSelector(isRightPanelShowing);
  if (showBackButton) {
    return null;
  }
  let width = isShowing ? window.innerWidth - 370 : window.innerWidth;
  return (
    <div
      role="button"
      onClick={(e: any) => {
        contextMenu.show({
          id: props.triggerId,
          event: e,
          position: {
            x: width - 300,
            y: 70,
          },
        });
      }}
      data-testid="three-dots-conversation-options"
    >
      <BchatIconButton iconType="ellipses" iconSize={24} />
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
  conversation: any;
  onAvatarClick?: (pubkey: string) => void;
}) => {
  const { pubkey, onAvatarClick, showBackButton, conversation } = props;
  return (
    <span className="module-conversation-header__avatar">
      <BNSWrapper
        // size={40}
        position={{ left: '46px', top: '46px' }}
        isBnsHolder={conversation?.isBnsHolder}
        size={{ width: '20', height: '20' }}
      >
        <Avatar
          size={AvatarSize.L}
          onAvatarClick={() => {
            // do not allow right panel to appear if another button is shown on the BchatConversation
            if (onAvatarClick && !showBackButton) {
              onAvatarClick(pubkey);
            }
          }}
          pubkey={pubkey}
          dataTestId="conversation-options-avatar"
        />
      </BNSWrapper>
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
    <div style={{ marginRight: '15px' }}>
      {/* <CustomIconButton
        onClick={() => {
          void callRecipient(selectedConvoKey, canCall);
        }}
        customIcon={<CallIcon iconSize={24} />}
      /> */}
      <BchatIconButton
        iconType={'call'}
        iconSize={24}
        fillRule="evenodd"
        clipRule="evenodd"
        onClick={() => {
          void callRecipient(selectedConvoKey, canCall);
        }}
      />
    </div>
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
  const headerTitleProps = useSelector(getConversationHeaderTitleProps);
  // const isRightPanelOn = useSelector(isRightPanelShowing);
  const convoName = useConversationUsername(headerTitleProps?.conversationKey);

  const convoProps = useConversationPropsById(headerTitleProps?.conversationKey);
  const conversationKey: any = useSelector(getSelectedConversationKey);
  const conversation: any = useSelector(getSelectedConversation);
  // const dispatch = useDispatch();
  let displayedName = null;
  if (conversation?.type === ConversationTypeEnum.PRIVATE) {
    displayedName = getConversationController().getContactProfileNameOrShortenedPubKey(
      conversationKey
    );
  }
  const activeAt = convoProps?.activeAt;
  if (!headerTitleProps) {
    return <></>;
  }
  const { isGroup, isPublic, members, subscriberCount, isKickedFromGroup } = headerTitleProps;
  const { i18n } = window;

  let memberCount = 0;
  if (isGroup) {
    if (isPublic) {
      memberCount = subscriberCount || 0;
    } else {
      memberCount = members.length;
    }
  }

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
  if (conversation?.isMe) {
    return <div className="module-conversation-header__title">Note to Self</div>;
  }

  return (
    <div className="module-conversation-header__title">
      <span
        className="module-contact-name__profile-name"
        data-testid="header-conversation-name"
        // onClick={() => {
        //   if (isRightPanelOn) {
        //     dispatch(closeRightPanel());
        //   } else {
        //     dispatch(openRightPanel());
        //   }
        // }}
        // role="button"
      >
        {convoName}
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
    conversation?.didApproveMe &&
    !conversation?.isMe;

  if (!selectedConvoKey) {
    return null;
  }

  const isKickedFromGroup = useIsKickedFromGroup(selectedConvoKey);
  const expireTimerSetting = useExpireTimer(selectedConvoKey);
  const expirationSettingName = expireTimerSetting
    ? ExpirationTimerOptions.getName(expireTimerSetting || 0)
    : undefined;

  const triggerId = 'conversation-header';
  const isMe = useSelector(getIsSelectedNoteToSelf);

  // function displayWalletPassword() {

  //   // if (chatwithWallet && !WalletSyncBarShowInChat) {
  //   dispatch(updateBchatWalletPasswordModal({}));
  //     // return;
  //   // }
  // }

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
            <AvatarHeader
              onAvatarClick={() => {
                dispatch(openRightPanel());
              }}
              pubkey={selectedConvoKey}
              conversation={conversation}
              showBackButton={isMessageDetailOpened}
            />
            <ConversationHeaderTitle />

            {displayConnectWalletBtn && (
              // <div
              //   className="connectWalletBtn"
              //   onClick={() => dispatch(updateBchatWalletPasswordModal({}))}
              // >
              //   <BchatIcon iconType="wallet" iconSize={'tiny'} iconColor="white" />
              //   <div>{window.i18n('connectWallet')}</div>
              <BchatButton
                text={window.i18n('connectWallet')}
                buttonType={BchatButtonType.Medium}
                buttonColor={BchatButtonColor.Primary}
                iconType="wallet"
                iconSize={'small'}
                style={{
                  minWidth: '172px',
                  height: '40px',
                  borderRadius: '5px',
                  marginRight: '14px',
                }}
                onClick={() => dispatch(updateBchatWalletPasswordModal({}))}
                // disabled={!caption}
              />
              // </div>
            )}
            {!isKickedFromGroup && (
              <ExpirationLength expirationSettingName={expirationSettingName} />
            )}
            {conversation?.type == 'private' && conversation?.didApproveMe && !isMe && (
              <div>
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
