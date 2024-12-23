
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { animation, Item, Menu, useContextMenu } from 'react-contexify';

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
  sendMessageReaction,
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

import styled from 'styled-components';
import { MessageReactBar } from './MessageReactBar';
import { BchatEmojiPanel, StyledEmojiPanel } from '../../BchatEmojiPanel';
import { useMouse } from 'react-use';

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
const StyledMessageContextMenu = styled.div`
  position: relative;
  .react-contexify {
    margin-left: -80px;
  }
`;
const StyledEmojiPanelContainer = styled.div<{ x: number; y: number }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 101;
  ${StyledEmojiPanel} {
    position: absolute;
    left: ${props => `${props.x}px`};
    top: ${props => `${props.y}px`};
  }
`;

// tslint:disable: max-func-body-length cyclomatic-complexity
export const MessageContextMenu = (props: Props) => {
  const selected = useSelector(state => getMessageContextMenuProps(state as any, props.messageId));
  const dispatch = useDispatch();
  const { hideAll } = useContextMenu();

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

  const emojiPanelId = `${contextMenuId}-styled-emoji-panel-container`;

  const emojiPanelRef = useRef(null);
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const [emojiPanelWidth, setEmojiPanelWidth] = useState(-1);
  const [emojiPanelHeight, setEmojiPanelHeight] = useState(-1);

  const contextMenuRef = useRef(null);
  const { docX, docY } = useMouse(contextMenuRef);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const onContextMenuShown = () => {
    if (showEmojiPanel) {
      setShowEmojiPanel(false);
    }
    window.contextMenuShown = true;
  };
  

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

  const onShowEmoji = () => {
    hideAll();
    setMouseX(docX);
    setMouseY(docY);
    setShowEmojiPanel(true);
  };

  const onCloseEmoji = () => {
    setShowEmojiPanel(false);
  };
  const onEmojiLoseFocus = useCallback(
    (event: any) => {
      if (event.target.id === emojiPanelId && showEmojiPanel) {
        window.log.info('closed due to lost focus');
        onCloseEmoji();
      }
    },
    [emojiPanelId, showEmojiPanel]
  );
  const onEmojiClick = async(args: any) => {
    const emoji = args.native ?? args;
    await sendMessageReaction(messageId, emoji);
    onCloseEmoji();
  };

  // const onEmojiOffClick = (event: any) => {
  //   if (event.target.id === emojiPanelId && showEmojiPanel) {
  //     console.log('closing');
  //     setShowEmojiPanel(false);
  //   }
  // };

  const onEmojiKeyDown = (event: any) => {
    if (event.key === 'Escape' && showEmojiPanel) {
      onCloseEmoji();
    }
  };

  useEffect(() => {
    if (emojiPanelRef.current !== null) {
      if (emojiPanelWidth === -1 && emojiPanelHeight === -1) {
        const { offsetWidth, offsetHeight } = (emojiPanelRef.current as HTMLDivElement)
          .firstChild as HTMLDivElement;
        setEmojiPanelWidth(offsetWidth);
        setEmojiPanelHeight(offsetHeight);
      } else {
        const { innerWidth: windowWidth, innerHeight: windowHeight } = window;

        if (mouseX + emojiPanelWidth > windowWidth) {
          let x = mouseX;
          x = (mouseX + emojiPanelWidth - windowWidth) * 2;

          if (x === mouseX) {
            return;
          }
          setMouseX(mouseX - x);
        }

        if (mouseY + emojiPanelHeight > windowHeight) {
          const y = mouseY + emojiPanelHeight - windowHeight;

          
          if (y === mouseY) {
            return;
          }
          setMouseY(mouseY - y);
        }
      }
    }
  }, [emojiPanelRef.current, emojiPanelWidth, emojiPanelHeight, mouseX, mouseY]);

  useEffect(() => {
    document.addEventListener('click', onEmojiLoseFocus);

    return () => {
      document.removeEventListener('click', onEmojiLoseFocus);
    };
  }, [contextMenuId, onEmojiLoseFocus, window.contextMenuShown]);
  return (
    <StyledMessageContextMenu ref={contextMenuRef}>
        {showEmojiPanel && (
        <StyledEmojiPanelContainer id={emojiPanelId}
        ref={emojiPanelRef}
        onKeyDown={onEmojiKeyDown}
        role="button"
        x={mouseX}
        y={mouseY}>
          <BchatEmojiPanel onEmojiClicked={onEmojiClick} show={showEmojiPanel} />
        </StyledEmojiPanelContainer>
      )}
      <Menu
        id={contextMenuId}
        onShown={onContextMenuShown}
        onHidden={onContextMenuHidden}
        animation={animation.fade}
      >
        <MessageReactBar action={onEmojiClick} additionalAction={onShowEmoji}/>
        {attachments?.length ? (
          <Item onClick={saveAttachment}>
            <BchatIcon iconType={'downloadAttachment'} iconSize={18} />
            <span style={{ marginLeft: '10px' }}>{window.i18n('downloadAttachment')}</span>
          </Item>
        ) : null}
        {!attachments?.length && (
          <Item onClick={copyText}>
            <CopyIcon color={'var(--color-text)'} iconSize={18} />
            <span style={{ marginLeft: '10px' }}>{window.i18n('copyMessage')}</span>
          </Item>
        )}
        {(isSent || !isOutgoing) && (
          <Item onClick={onReply}>
            <BchatIcon iconType={'reply'} iconSize={18} />
            <span style={{ marginLeft: '10px' }}>{window.i18n('replyToMessage')}</span>
          </Item>
        )}
        {(!isPublic || isOutgoing) && (
          <Item onClick={onShowDetail}>
            <BchatIcon iconType={'infoCircle'} iconSize={18} />
            <span style={{ marginLeft: '10px' }}>{window.i18n('moreInformation')} </span>
          </Item>
        )}
        {showRetry ? (
          <Item onClick={onRetry}>
            {' '}
            <BchatIcon iconType={'resend'} iconSize={18} />
            <span style={{ marginLeft: '10px' }}>{window.i18n('resend')} </span>
          </Item>
        ) : null}
        {isDeletable ? (
          <>
            <Item onClick={onSelect}>
              {' '}
              <BchatIcon iconType={'tickBoxCurve'} iconSize={18} />
              <span style={{ marginLeft: '10px' }}>{selectMessageText}</span>
            </Item>
          </>
        ) : null}
        {isDeletable && !isPublic ? (
          <>
            <Item onClick={onDelete}>
              <BchatIcon iconType={'delete'} iconSize={18} iconColor="#FF3E3E" />
              <span style={{ marginLeft: '10px', color: '#FF3E3E' }}>
                {deleteMessageJustForMeText}
              </span>
            </Item>
          </>
        ) : null}
        {isDeletableForEveryone ? (
          <>
            <Item onClick={onDeleteForEveryone}>
              <BchatIcon iconType={'twoMember'} iconSize={18} iconColor="#FF3E3E" />
              <span style={{ marginLeft: '10px', color: '#FF3E3E' }}>{unsendMessageText}</span>
            </Item>
          </>
        ) : null}
        {weAreAdmin && isPublic ? <Item onClick={onBan}>{window.i18n('banUser')}</Item> : null}
        {weAreAdmin && isOpenGroupV2 ? (
          <Item onClick={onUnban}>{window.i18n('unbanUser')}</Item>
        ) : null}
        {weAreAdmin && isPublic && !isSenderAdmin ? (
          <Item onClick={addModerator}>{window.i18n('addAsModerator')}</Item>
        ) : null}
        {weAreAdmin && isPublic && isSenderAdmin ? (
          <Item onClick={removeModerator}>{window.i18n('removeFromModerators')}</Item>
        ) : null}
      </Menu>
    </StyledMessageContextMenu>
  );
};


