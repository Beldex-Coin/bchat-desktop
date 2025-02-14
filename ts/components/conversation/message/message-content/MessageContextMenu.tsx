import React, { useCallback } from 'react';

import { animation, Item, Menu } from 'react-contexify';

import { useDispatch, useSelector } from 'react-redux';
import { getMessageById } from '../../../../data/data';
import { MessageInteraction } from '../../../../interactions';
import { replyToMessage } from '../../../../interactions/conversationInteractions';
import {
  deleteMessagesById,
  deleteMessagesByIdForEveryone,
} from '../../../../interactions/conversations/unsendingInteractions';
import {
  addSenderAsModerator,
  removeSenderFromModerator,
} from '../../../../interactions/messageInteractions';
import { MessageRenderingProps } from '../../../../models/messageType';
import { pushUnblockToSend } from '../../../../bchat/utils/Toast';
import {
  // MessagePropsDetails,
  // showMessageDetailsView,
  toggleSelectedMessageId,
} from '../../../../state/ducks/conversations';
import { getMessageContextMenuProps } from '../../../../state/selectors/conversations';
import { saveAttachmentToDisk } from '../../../../util/attachmentsUtil';
import { BchatIcon } from '../../../icon';
import CopyIcon from '../../../icon/CopyIcon';
import { updateMessageMoreInfoModal } from '../../../../state/ducks/modalDialog';

export type MessageContextMenuSelectorProps = Pick<
  MessageRenderingProps,
  | 'attachments'
  | 'sender'
  | 'convoId'
  | 'direction'
  | 'status'
  | 'isDeletable'
  | 'isPublic'
  | 'isOpenGroupV2'
  | 'weAreAdmin'
  | 'isSenderAdmin'
  | 'text'
  | 'serverTimestamp'
  | 'timestamp'
  | 'isBlocked'
  | 'isDeletableForEveryone'
>;

type Props = { messageId: string; contextMenuId: string };

// tslint:disable: max-func-body-length cyclomatic-complexity
export const MessageContextMenu = (props: Props) => {
  const selected = useSelector(state => getMessageContextMenuProps(state as any, props.messageId));
  const dispatch = useDispatch();

  if (!selected) {
    return null;
  }
  const {
    attachments,
    sender,
    convoId,
    direction,
    status,
    isDeletable,
    isDeletableForEveryone,
    isPublic,
    isOpenGroupV2,
    weAreAdmin,
    isSenderAdmin,
    text,
    serverTimestamp,
    timestamp,
    isBlocked,
  } = selected;
  const { messageId, contextMenuId } = props;
  const isOutgoing = direction === 'outgoing';
  const showRetry = status === 'error' && isOutgoing;
  const isSent = status === 'sent' || status === 'read'; // a read message should be replyable

  const onContextMenuShown = useCallback(() => {
    window.contextMenuShown = true;
  }, []);

  const onContextMenuHidden = useCallback(() => {
    // This function will called before the click event
    // on the message would trigger (and I was unable to
    // prevent propagation in this case), so use a short timeout
    setTimeout(() => {
      window.contextMenuShown = false;
    }, 100);
  }, []);

  const onShowDetail = async () => {
    const found = await getMessageById(messageId);
    if (found) {
      const messageDetailsProps = await found.getPropsForMessageDetail();
      // dispatch(showMessageDetailsView(messageDetailsProps));
      dispatch(updateMessageMoreInfoModal(messageDetailsProps));
    } else {
      window.log.warn(`Message ${messageId} not found in db`);
    }
  };

  const selectMessageText = window.i18n('selectMessage');
  const deleteMessageJustForMeText = window.i18n('deleteJustForMe');
  const unsendMessageText = window.i18n('deleteForEveryone');

  const addModerator = useCallback(() => {
    void addSenderAsModerator(sender, convoId);
  }, [sender, convoId]);

  const removeModerator = useCallback(() => {
    void removeSenderFromModerator(sender, convoId);
  }, [sender, convoId]);

  const onReply = useCallback(() => {
    if (isBlocked) {
      pushUnblockToSend();
      return;
    }
    void replyToMessage(messageId);
  }, [isBlocked, messageId]);

  const saveAttachment = useCallback(
    (e: any) => {
      // this is quite dirty but considering that we want the context menu of the message to show on click on the attachment
      // and the context menu save attachment item to save the right attachment I did not find a better way for now.
      let targetAttachmentIndex = e.triggerEvent.path[1].getAttribute('data-attachmentindex');
      e.event.stopPropagation();
      if (!attachments?.length) {
        return;
      }

      if (!targetAttachmentIndex) {
        targetAttachmentIndex = 0;
      }
      if (targetAttachmentIndex > attachments.length) {
        return;
      }
      const messageTimestamp = timestamp || serverTimestamp || 0;
      void saveAttachmentToDisk({
        attachment: attachments[targetAttachmentIndex],
        messageTimestamp,
        messageSender: sender,
        conversationId: convoId,
      });
    },
    [convoId, sender, timestamp, serverTimestamp, convoId, attachments]
  );

  const copyText = useCallback(() => {
    MessageInteraction.copyBodyToClipboard(text);
  }, [text]);

  const onRetry = useCallback(async () => {
    const found = await getMessageById(messageId);
    if (found) {
      await found.retrySend();
    }
  }, [messageId]);

  const onBan = useCallback(() => {
    MessageInteraction.banUser(sender, convoId);
  }, [sender, convoId]);

  const onUnban = useCallback(() => {
    MessageInteraction.unbanUser(sender, convoId);
  }, [sender, convoId]);

  const onSelect = useCallback(() => {
    dispatch(toggleSelectedMessageId(messageId));
  }, [messageId]);

  const onDelete = useCallback(() => {
    void deleteMessagesById([messageId], convoId);
  }, [convoId, messageId]);

  const onDeleteForEveryone = useCallback(() => {
    void deleteMessagesByIdForEveryone([messageId], convoId);
  }, [convoId, messageId]);

  return (
    <Menu
      id={contextMenuId}
      onShown={onContextMenuShown}
      onHidden={onContextMenuHidden}
      animation={animation.fade}
    >
      {attachments?.length ? (
        <Item onClick={saveAttachment}>
          <BchatIcon iconType={'downloadAttachment'} iconSize={18} />
          <span style={{ marginLeft: '10px' }}>{window.i18n('downloadAttachment')}</span>
        </Item>
      ) : null}
      {!attachments?.length &&
        <Item onClick={copyText}>
          <CopyIcon color={'var(--color-text)'} iconSize={18} />
          <span style={{ marginLeft: '10px' }}>{window.i18n('copyMessage')}</span>
        </Item>}
      {(isSent || !isOutgoing) && (
        <Item onClick={onReply}>
          <BchatIcon iconType={'reply'} iconSize={18} />
          <span style={{ marginLeft: '10px' }}>{window.i18n('replyToMessage')}</span>
        </Item>
      )}
      {(!isPublic || isOutgoing) && (
        <Item onClick={onShowDetail}>
          <BchatIcon iconType={'infoCircle'} iconSize={18} />
          <span style={{ marginLeft: '10px' }}>{window.i18n('moreInformation')} </span></Item>
      )}
      {showRetry ? <Item onClick={onRetry}> <BchatIcon iconType={'resend'} iconSize={18} />
        <span style={{ marginLeft: '10px' }}>{window.i18n('resend')} </span></Item> : null}
      {isDeletable ? (
        <>
          <Item onClick={onSelect}> <BchatIcon iconType={'tickBoxCurve'} iconSize={18} />
            <span style={{ marginLeft: '10px' }}>{selectMessageText}</span></Item>
        </>
      ) : null}
      {isDeletable && !isPublic ? (
        <>
          <Item onClick={onDelete}><BchatIcon iconType={'delete'} iconSize={18} iconColor='#FF3E3E' />
            <span style={{ marginLeft: '10px', color: "#FF3E3E" }}>{deleteMessageJustForMeText}</span></Item>
        </>
      ) : null}
      {isDeletableForEveryone ? (
        <>
          <Item onClick={onDeleteForEveryone}><BchatIcon iconType={'twoMember'} iconSize={18} iconColor='#FF3E3E' />
            <span style={{ marginLeft: '10px', color: '#FF3E3E' }}>{unsendMessageText}</span></Item>
        </>
      ) : null}
      {weAreAdmin && isPublic ? <Item onClick={onBan}>
        <BchatIcon iconType={'banIcon'} iconSize={18} iconColor='#FF3E3E' fillRule="evenodd" clipRule="evenodd" />
        <span style={{ marginLeft: '10px', color: "#FF3E3E" }}>{window.i18n('banUser')}</span>
      </Item> : null}
      {weAreAdmin && isOpenGroupV2 ? (
        <Item onClick={onUnban}>
          <BchatIcon iconType={'unBanIcon'} iconSize={18} />
          <span style={{ marginLeft: '10px' }}>{window.i18n('unbanUser')}</span>
        </Item>
      ) : null}
      {weAreAdmin && isPublic && !isSenderAdmin ? (
        <Item onClick={addModerator}>
          <BchatIcon iconType={'addModerator'} iconSize={18} iconColor='#FF3E3E' fillRule="evenodd" clipRule="evenodd" />
          <span style={{ marginLeft: '10px' }}>{window.i18n('addAsModerator')}</span>
          </Item>
      ) : null}
      {weAreAdmin && isPublic && isSenderAdmin ? (
        <Item onClick={removeModerator}>
          <BchatIcon iconType={'removeFromModerators'} iconSize={18} iconColor='#FF3E3E' fillRule="evenodd" clipRule="evenodd" />
          <span style={{ marginLeft: '10px' }}>{window.i18n('removeFromModerators')}</span>
        </Item>
      ) : null}
    </Menu>
  );
};



