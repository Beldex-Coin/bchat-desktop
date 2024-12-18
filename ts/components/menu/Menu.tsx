import React, { useContext } from 'react';

import { Item, Submenu } from 'react-contexify';
import { useDispatch, useSelector } from 'react-redux';
import {
  useConversationUsername,
  useHasNickname,
  useIsBlocked,
  useIsKickedFromGroup,
  useIsLeft,
  useIsMe,
  useIsPrivate,
  useIsPublic,
  useIsRequest,
  useNotificationSetting,
  useWeAreAdmin,
} from '../../hooks/useParamSelector';
import {
  approveConvoAndSendResponse,
  blockConvoById,
  clearNickNameByConvoId,
  copyPublicKeyByConvoId,
  declineConversationWithConfirm,
  deleteAllMessagesByConvoIdWithConfirmation,
  markAllReadByConvoId,
  setDisappearingMessagesByConvoId,
  setNotificationForConvoId,
  showAddModeratorsByConvoId,
  showBanUserByConvoId,
  showInviteContactByConvoId,
  showLeaveGroupByConvoId,
  showRemoveModeratorsByConvoId,
  showUnbanUserByConvoId,
  showUpdateGroupNameByConvoId,
  unblockConvoById,
} from '../../interactions/conversationInteractions';
import {
  ConversationNotificationSetting,
  ConversationNotificationSettingType,
} from '../../models/conversation';
import { getConversationController } from '../../bchat/conversations';
import { ToastUtils } from '../../bchat/utils';
import { changeNickNameModal, updateConfirmModal } from '../../state/ducks/modalDialog';
import { SectionType } from '../../state/ducks/section';
import { hideMessageRequestBanner } from '../../state/ducks/userConfig';
import { getNumberOfPinnedConversations } from '../../state/selectors/conversations';
import { getFocusedSection } from '../../state/selectors/section';
import { getTimerOptions } from '../../state/selectors/timerOptions';
import { LocalizerKeys } from '../../types/LocalizerKeys';
import { BchatButtonColor } from '../basic/BchatButton';
import { ContextConversationId } from '../leftpane/conversation-list-item/ConversationListItem';
import { getOurNumber } from '../../state/selectors/user';
import { BchatIcon } from '../icon/BchatIcon';
// import CopyIcon from '../icon/CopyIcon';
import styled from 'styled-components';
import DeclineMessageRequest from '../icon/DeclineMessageRequest';

const maxNumberOfPinnedConversations = 5;

function showTimerOptions(
  isPublic: boolean,
  isKickedFromGroup: boolean,
  left: boolean,
  isBlocked: boolean,
  isRequest: boolean
): boolean {
  return !isPublic && !left && !isKickedFromGroup && !isBlocked && !isRequest;
}

function showNotificationConvo(
  isKickedFromGroup: boolean,
  left: boolean,
  isBlocked: boolean,
  isRequest: boolean,
  isMe: boolean
): boolean {
  return !left && !isKickedFromGroup && !isBlocked && !isRequest && !isMe;
}

function showBlock(isMe: boolean, isPrivate: boolean, isRequest: boolean): boolean {
  return !isMe && isPrivate && !isRequest;
}

function showClearNickname(
  isMe: boolean,
  hasNickname: boolean,
  isPrivate: boolean,
  isRequest: boolean
): boolean {
  return !isMe && hasNickname && isPrivate && isRequest;
}

function showChangeNickname(isMe: boolean, isPrivate: boolean, isRequest: boolean) {
  return !isMe && isPrivate && !isRequest;
}

// we want to show the copyId for Social groups and private chats only
function showCopyId(isPublic: boolean, isPrivate: boolean): boolean {
  return isPrivate || isPublic;
}

function showDeleteContact(
  isGroup: boolean,
  isPublic: boolean,
  isGroupLeft: boolean,
  isKickedFromGroup: boolean,
  isRequest: boolean
): boolean {
  // you need to have left a closed group first to be able to delete it completely.
  return (!isGroup && !isRequest) || (isGroup && (isGroupLeft || isKickedFromGroup || isPublic));
}

const showUnbanUser = (weAreAdmin: boolean, isPublic: boolean, isKickedFromGroup: boolean) => {
  return !isKickedFromGroup && weAreAdmin && isPublic;
};

const showBanUser = (weAreAdmin: boolean, isPublic: boolean, isKickedFromGroup: boolean) => {
  return !isKickedFromGroup && weAreAdmin && isPublic;
};

function showAddModerators(
  weAreAdmin: boolean,
  isPublic: boolean,
  isKickedFromGroup: boolean
): boolean {
  return !isKickedFromGroup && weAreAdmin && isPublic;
}

function showRemoveModerators(
  weAreAdmin: boolean,
  isPublic: boolean,
  isKickedFromGroup: boolean
): boolean {
  return !isKickedFromGroup && weAreAdmin && isPublic;
}

function showUpdateGroupName(
  weAreAdmin: boolean,
  isKickedFromGroup: boolean,
  left: boolean
): boolean {
  return !isKickedFromGroup && !left && weAreAdmin;
}

function showLeaveGroup(
  isKickedFromGroup: boolean,
  left: boolean,
  isGroup: boolean,
  isPublic: boolean
): boolean {
  return !isKickedFromGroup && !left && isGroup && !isPublic;
}

function showInviteContact(isPublic: boolean): boolean {
  return isPublic;
}

export const MenuWrapper = styled.span`
  margin-left: 12px;
  margin-right: 10px;
`;
/** Menu items standardized */

export const InviteContactMenuItem = (): JSX.Element | null => {
  const convoId = useContext(ContextConversationId);
  const isPublic = useIsPublic(convoId);

  if (showInviteContact(isPublic)) {
    return (
      <Item
        onClick={() => {
          showInviteContactByConvoId(convoId);
        }}
      >
        <BchatIcon iconType={'inviteContact'} iconSize={20} fillRule="evenodd" clipRule="evenodd" />
        <MenuWrapper>{window.i18n('inviteContacts')}</MenuWrapper>
      </Item>
    );
  }
  return null;
};

export const PinConversationMenuItem = (): JSX.Element | null => {
  const conversationId = useContext(ContextConversationId);
  const isMessagesSection = useSelector(getFocusedSection) === SectionType.Message;
  const nbOfAlreadyPinnedConvos = useSelector(getNumberOfPinnedConversations);
  const isRequest = useIsRequest(conversationId);

  if (isMessagesSection && !isRequest) {
    const conversation = getConversationController().get(conversationId);
    const isPinned = conversation?.isPinned() || false;

    const togglePinConversation = async () => {
      if ((!isPinned && nbOfAlreadyPinnedConvos < maxNumberOfPinnedConversations) || isPinned) {
        await conversation?.setIsPinned(!isPinned);
      } else {
        ToastUtils.pushToastWarning(
          'pinConversationLimitToast',
          window.i18n('pinConversationLimitTitle'),
          window.i18n('pinConversationLimitToastDescription', [`${maxNumberOfPinnedConversations}`])
        );
      }
    };

    const menuText = isPinned ? window.i18n('unpinConversation') : window.i18n('pinConversation');
    return (
      <Item onClick={togglePinConversation}>
        <BchatIcon iconType="pinSubMenu" iconSize={20} fillRule="evenodd" clipRule="evenodd" />{' '}
        <MenuWrapper>{menuText}</MenuWrapper>
      </Item>
    );
  }
  return null;
};

export const DeleteContactMenuItem = () => {
  const dispatch = useDispatch();
  const convoId = useContext(ContextConversationId);
  const isPublic = useIsPublic(convoId);
  const isLeft = useIsLeft(convoId);
  const isKickedFromGroup = useIsKickedFromGroup(convoId);
  const isPrivate = useIsPrivate(convoId);
  const isRequest = useIsRequest(convoId);
  const ourNumber = useSelector(getOurNumber);
  const username = String(useConversationUsername(convoId));

  if (showDeleteContact(!isPrivate, isPublic, isLeft, isKickedFromGroup, isRequest)) {
    let menuItemText: string;
    if (isPublic) {
      menuItemText = window.i18n('leaveGroup');
    } else {
      menuItemText = isPrivate
        ? window.i18n('editMenuDeleteContact')
        : window.i18n('editMenuDeleteGroup');
    }

    const onClickClose = () => {
      dispatch(updateConfirmModal(null));
    };

    const showConfirmationModal = () => {
      let notetoSelf = {
        title: menuItemText,
        message: "This chat is for your self reference.So can't be deleted.",
        onClickClose,
        okTheme: BchatButtonColor.Primary,
        onClickOk: async () => {
          onClickClose;
        },
        okText: 'OK',
        hideCancel: true,
      };

      let contactDelete = {
        title: menuItemText,
        message: isPrivate
          ? 'Permanently delete the Contact?'
          : window.i18n('leaveGroupConfirmation', [username]),
        onClickClose,
        onClickOk: async () => {
          await getConversationController().deleteContact(convoId);
        },
        okText: menuItemText.slice(0, 5) === 'Leave' ? 'Leave' : 'Delete',
        okTheme: BchatButtonColor.Danger,
      };
      dispatch(updateConfirmModal(ourNumber === convoId ? notetoSelf : contactDelete));
      // updateConfirmModal(temp))
    };

    return (
      <Item onClick={showConfirmationModal}>
        {' '}
        <BchatIcon
          iconType="deleteContact"
          iconSize={20}
          iconColor="#FF3E3E"
          fillRule="evenodd"
          clipRule="evenodd"
        />{' '}
        <MenuWrapper style={{ color: '#FF3E3E' }}>{menuItemText}</MenuWrapper>
      </Item>
    );
  }
  return null;
};

export const LeaveGroupMenuItem = () => {
  const convoId = useContext(ContextConversationId);
  const isPublic = useIsPublic(convoId);
  const isLeft = useIsLeft(convoId);
  const isKickedFromGroup = useIsKickedFromGroup(convoId);
  const isPrivate = useIsPrivate(convoId);
  const username = String(useConversationUsername(convoId));

  if (showLeaveGroup(isKickedFromGroup, isLeft, !isPrivate, isPublic)) {
    return (
      <Item
        onClick={() => {
          showLeaveGroupByConvoId(
            convoId,
            username,
            <BchatIcon iconType="leaveGroup" iconColor="#FF3E3E" iconSize={30} />
          );
        }}
      >
        <BchatIcon
          iconType={'leave'}
          iconSize={20}
          fillRule="evenodd"
          clipRule="evenodd"
          iconColor="#FF3E3E"
        />
        <MenuWrapper style={{ color: '#FF3E3E' }}> {window.i18n('leaveGroup')}</MenuWrapper>
      </Item>
    );
  }

  return null;
};

export const UpdateGroupNameMenuItem = () => {
  const convoId = useContext(ContextConversationId);
  const left = useIsLeft(convoId);
  const isKickedFromGroup = useIsKickedFromGroup(convoId);
  const weAreAdmin = useWeAreAdmin(convoId);

  if (showUpdateGroupName(weAreAdmin, isKickedFromGroup, left)) {
    return (
      <Item
        onClick={async () => {
          await showUpdateGroupNameByConvoId(convoId);
        }}
      >
        <BchatIcon iconType={'editNotes'} iconSize={20} fillRule="evenodd" clipRule="evenodd" />{' '}
        <MenuWrapper>{window.i18n('editGroup')}</MenuWrapper>
      </Item>
    );
  }
  return null;
};

export const RemoveModeratorsMenuItem = (): JSX.Element | null => {
  const convoId = useContext(ContextConversationId);
  const isPublic = useIsPublic(convoId);
  const isKickedFromGroup = useIsKickedFromGroup(convoId);
  const weAreAdmin = useWeAreAdmin(convoId);

  if (showRemoveModerators(weAreAdmin, Boolean(isPublic), Boolean(isKickedFromGroup))) {
    return (
      <Item
        onClick={() => {
          showRemoveModeratorsByConvoId(convoId);
        }}
      >
        {window.i18n('removeModerators')}
      </Item>
    );
  }
  return null;
};

export const AddModeratorsMenuItem = (): JSX.Element | null => {
  const convoId = useContext(ContextConversationId);
  const isPublic = useIsPublic(convoId);
  const isKickedFromGroup = useIsKickedFromGroup(convoId);
  const weAreAdmin = useWeAreAdmin(convoId);

  if (showAddModerators(weAreAdmin, isPublic, isKickedFromGroup)) {
    return (
      <Item
        onClick={() => {
          showAddModeratorsByConvoId(convoId);
        }}
      >
        {window.i18n('addModerators')}
      </Item>
    );
  }
  return null;
};

export const UnbanMenuItem = (): JSX.Element | null => {
  const convoId = useContext(ContextConversationId);
  const isPublic = useIsPublic(convoId);
  const isKickedFromGroup = useIsKickedFromGroup(convoId);
  const weAreAdmin = useWeAreAdmin(convoId);

  if (showUnbanUser(weAreAdmin, isPublic, isKickedFromGroup)) {
    return (
      <Item
        onClick={() => {
          showUnbanUserByConvoId(convoId);
        }}
      >
        {window.i18n('unbanUser')}
      </Item>
    );
  }
  return null;
};

export const BanMenuItem = (): JSX.Element | null => {
  const convoId = useContext(ContextConversationId);
  const isPublic = useIsPublic(convoId);
  const isKickedFromGroup = useIsKickedFromGroup(convoId);
  const weAreAdmin = useWeAreAdmin(convoId);

  if (showBanUser(weAreAdmin, isPublic, isKickedFromGroup)) {
    return (
      <Item
        onClick={() => {
          showBanUserByConvoId(convoId);
        }}
      >
        {window.i18n('banUser')}
      </Item>
    );
  }
  return null;
};

export const CopyMenuItem = (): JSX.Element | null => {
  const convoId = useContext(ContextConversationId);
  const isPublic = useIsPublic(convoId);
  const isPrivate = useIsPrivate(convoId);

  if (showCopyId(isPublic, isPrivate)) {
    const copyIdLabel = isPublic ? window.i18n('copySocialGroupURL') : window.i18n('copyBchatID');
    return (
      <Item onClick={() => copyPublicKeyByConvoId(convoId)}>
        <BchatIcon iconType={'copy'} iconSize={20} fillRule="evenodd" clipRule="evenodd" />
        <MenuWrapper>{copyIdLabel}</MenuWrapper>
      </Item>
    );
  }
  return null;
};

export const MarkAllReadMenuItem = (): JSX.Element | null => {
  const convoId = useContext(ContextConversationId);
  const isRequest = useIsRequest(convoId);
  const isMe = useIsMe(convoId);
  if (!isRequest && !isMe) {
    return (
      <Item onClick={() => markAllReadByConvoId(convoId)}>
        <BchatIcon iconType={'markRead'} iconSize={20} fillRule="evenodd" clipRule="evenodd" />{' '}
        <MenuWrapper> {window.i18n('markAllAsRead')}</MenuWrapper>
      </Item>
    );
  } else {
    return null;
  }
};

export const DisappearingMessageMenuItem = (): JSX.Element | null => {
  const convoId = useContext(ContextConversationId);
  const isBlocked = useIsBlocked(convoId);
  const isPublic = useIsPublic(convoId);
  const isLeft = useIsLeft(convoId);
  const isKickedFromGroup = useIsKickedFromGroup(convoId);
  const timerOptions = useSelector(getTimerOptions).timerOptions;
  const isRequest = useIsRequest(convoId);
  const ourNumber = useSelector(getOurNumber);
  if (ourNumber === convoId) {
    return null;
  }

  if (
    showTimerOptions(
      Boolean(isPublic),
      Boolean(isKickedFromGroup),
      Boolean(isLeft),
      Boolean(isBlocked),
      isRequest
    )
  ) {
    return (
      // Remove the && false to make context menu work with RTL support
      <Submenu
        label={
          <>
            <BchatIcon iconType={'chatTimer'} iconSize={20} fillRule="evenodd" clipRule="evenodd" />{' '}
            <MenuWrapper>{window.i18n('disappearingMessages')}</MenuWrapper>
          </>
        }
        arrow={<BchatIcon iconType="chevron" iconSize="small" iconRotation={268} />}
      >
        {timerOptions.map(item => (
          <div className="submenu">
            <Item
              style={{ width: '100%' }}
              key={item.value}
              onClick={async () => {
                await setDisappearingMessagesByConvoId(convoId, item.value);
              }}
            >
              {item.name}
            </Item>
          </div>
        ))}
      </Submenu>
    );
  }
  return null;
};

export const NotificationForConvoMenuItem = (): JSX.Element | null => {
  const convoId = useContext(ContextConversationId);
  const isKickedFromGroup = useIsKickedFromGroup(convoId);
  const left = useIsLeft(convoId);
  const isBlocked = useIsBlocked(convoId);
  const isPrivate = useIsPrivate(convoId);
  const isRequest = useIsRequest(convoId);
  const currentNotificationSetting = useNotificationSetting(convoId);
  const isMe = useIsMe(convoId);

  if (
    showNotificationConvo(
      Boolean(isKickedFromGroup),
      Boolean(left),
      Boolean(isBlocked),
      isRequest,
      isMe
    )
  ) {
    // exclude mentions_only settings for private chats as this does not make much sense
    const notificationForConvoOptions = ConversationNotificationSetting.filter(n =>
      isPrivate ? n !== 'mentions_only' : true
    ).map((n: ConversationNotificationSettingType) => {
      // do this separately so typescript's compiler likes it
      const keyToUse: LocalizerKeys =
        n === 'all' || !n
          ? 'notificationForConvo_all'
          : n === 'disabled'
          ? 'notificationForConvo_disabled'
          : 'notificationForConvo_mentions_only';
      return { value: n, name: window.i18n(keyToUse) };
    });

    return (
      // Remove the && false to make context menu work with RTL support
      <Submenu
        label={
          <>
            <BchatIcon
              iconType={'notifyBell'}
              iconSize={20}
              fillRule="evenodd"
              clipRule="evenodd"
            />{' '}
            <MenuWrapper>{window.i18n('notificationForConvo') as any}</MenuWrapper>
          </>
        }
        arrow={<BchatIcon iconType="chevron" iconSize="small" iconRotation={268} />}
        // label={window.i18n('notificationForConvo') as any}
      >
        {(notificationForConvoOptions || []).map(item => {
          const disabled = item.value === currentNotificationSetting;

          return (
            <div className="submenu">
              <Item
                style={{ width: '100%' }}
                key={item.value}
                onClick={async () => {
                  await setNotificationForConvoId(convoId, item.value);
                }}
                // disabled={disabled}
              >
                <div
                  style={{
                    marginRight: '10px',
                    color: disabled ? '#108D32' : ' var(--color-action-btn-icon)',
                  }}
                >
                  <BchatIcon iconSize={10} iconType="circle" />
                </div>
                {item.name}
              </Item>
            </div>
          );
        })}
      </Submenu>
    );
  }
  return null;
};

export function isRtlBody(): boolean {
  const body = document.getElementsByTagName('body').item(0);

  return body?.classList.contains('rtl') || false;
}

export const BlockMenuItem = (): JSX.Element | null => {
  const convoId = useContext(ContextConversationId);
  const isMe = useIsMe(convoId);
  const isBlocked = useIsBlocked(convoId);
  const isPrivate = useIsPrivate(convoId);
  const isRequest = useIsRequest(convoId);

  if (showBlock(Boolean(isMe), Boolean(isPrivate), Boolean(isRequest))) {
    const blockTitle = isBlocked ? window.i18n('unblockUser') : window.i18n('blockUser');
    const blockHandler = isBlocked
      ? () => unblockConvoById(convoId)
      : () => blockConvoById(convoId);

    return (
      <Item onClick={blockHandler}>
        <BchatIcon iconType={'blockSubmenu'} iconSize={20} fillRule="evenodd" clipRule="evenodd" />{' '}
        <MenuWrapper>{blockTitle}</MenuWrapper>
      </Item>
    );
  }
  return null;
};

export const ClearNicknameMenuItem = (): JSX.Element | null => {
  const convoId = useContext(ContextConversationId);
  const isMe = useIsMe(convoId);
  const hasNickname = useHasNickname(convoId);
  const isPrivate = useIsPrivate(convoId);
  const isRequest = Boolean(useIsRequest(convoId)); // easier to copy paste

  if (showClearNickname(Boolean(isMe), Boolean(hasNickname), Boolean(isPrivate), isRequest)) {
    return (
      <Item onClick={() => clearNickNameByConvoId(convoId)}>{window.i18n('clearNickname')}</Item>
    );
  }
  return null;
};

export const ChangeNicknameMenuItem = () => {
  const convoId = useContext(ContextConversationId);
  const isMe = useIsMe(convoId);
  const isPrivate = useIsPrivate(convoId);
  const isRequest = useIsRequest(convoId);

  const dispatch = useDispatch();
  if (showChangeNickname(isMe, isPrivate, isRequest)) {
    return (
      <Item
        onClick={() => {
          dispatch(changeNickNameModal({ conversationId: convoId }));
        }}
      >
        <BchatIcon iconType={'editNotes'} iconSize={20} fillRule="evenodd" clipRule="evenodd" />{' '}
        <MenuWrapper>{window.i18n('changeNickname')}</MenuWrapper>
      </Item>
    );
  }
  return null;
};

export const DeleteMessagesMenuItem = () => {
  const convoId = useContext(ContextConversationId);
  const isRequest = useIsRequest(convoId);

  if (isRequest) {
    return null;
  }

  return (
    <Item
      onClick={() => {
        deleteAllMessagesByConvoIdWithConfirmation(convoId);
      }}
    >
      <BchatIcon iconType={'delete'} iconSize={20} iconColor="#FF3E3E" />
      <MenuWrapper style={{ color: '#FF3E3E' }}> {window.i18n('deleteMessages')}</MenuWrapper>
    </Item>
  );
};

export const HideBannerMenuItem = (): JSX.Element => {
  const dispatch = useDispatch();
  return (
    <Item
      onClick={() => {
        dispatch(hideMessageRequestBanner());
      }}
    >
      {window.i18n('hideBanner')}
    </Item>
  );
};

export const AcceptMenuItem = () => {
  const convoId = useContext(ContextConversationId);
  const isRequest = useIsRequest(convoId);
  const convo = getConversationController().get(convoId);

  if (isRequest) {
    return (
      <Item
        onClick={async () => {
          await convo.setDidApproveMe(true);
          await convo.addOutgoingApprovalMessage(Date.now());
          await approveConvoAndSendResponse(convoId, true);
        }}
      >
        <BchatIcon
          iconType={'accept'}
          iconSize={20}
          iconColor="#108D32"
          clipRule="evenodd"
          fillRule="evenodd"
        />
        <MenuWrapper style={{ color: '#108D32' }}> {window.i18n('accept')}</MenuWrapper>
      </Item>
    );
  }
  return null;
};

export const DeclineMenuItem = () => {
  const convoId = useContext(ContextConversationId);
  const isRequest = useIsRequest(convoId);
  const customIcon = <DeclineMessageRequest iconSize={30} />;

  if (isRequest) {
    return (
      <Item
        onClick={() => {
          declineConversationWithConfirm(convoId, true, customIcon);
        }}
      >
        <BchatIcon
          iconType={'accept'}
          iconSize={20}
          iconColor="#FF3E3E"
          clipRule="evenodd"
          fillRule="evenodd"
        />
        <MenuWrapper style={{ color: '#FF3E3E' }}> {window.i18n('decline')}</MenuWrapper>
      </Item>
    );
  }
  return null;
};
