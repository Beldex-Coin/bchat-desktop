import classNames from 'classnames';
import React, { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { replyToMessage } from '../../../../interactions/conversationInteractions';
import { MessageRenderingProps } from '../../../../models/messageType';
import { toggleSelectedMessageId } from '../../../../state/ducks/conversations';
import { updateReactListModal } from '../../../../state/ducks/modalDialog';
import {
  getMessageContentWithStatusesSelectorProps,
  getMessageStatusProps,
  isMessageSelectionMode,
} from '../../../../state/selectors/conversations';

// import { MessageAuthorText } from './MessageAuthorText';
import { MessageContent } from './MessageContent';
import { MessageContextMenu } from './MessageContextMenu';
import { MessageStatus } from './MessageStatus';
import { ExpireTimer } from '../../ExpireTimer';
import styled from 'styled-components';
import { MessageReactions } from './MessageReactions';
import { sendMessageReaction } from '../../../../util/reactions';

import RecentEmojiIcon from '../../../icon/RecentEmojiIcon';
import { Flex } from '../../../basic/Flex';
import { MessageReactBar } from './MessageReactBar';
import { BchatEmojiPanel, StyledEmojiPanel } from '../../BchatEmojiPanel';

import { useClickAway } from 'react-use';

export type MessageContentWithStatusSelectorProps = Pick<
  MessageRenderingProps,
  'direction' | 'isDeleted' | 'isTrustedForAttachmentDownload'
> & { hasAttachments: boolean };

type Props = {
  messageId: string;
  ctxMenuID: string;
  isDetailView?: boolean;
  dataTestId?: string;

  expirationLength?: number | null;
  expirationTimestamp?: number | null;
  enableReactions: boolean;
};
const StyledMessageContentContainer = styled.div<{ direction: 'left' | 'right' }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: ${props => (props.direction === 'left' ? 'flex-start' : 'flex-end')};
  width: 100%;
`;
type RecentReactsProps = {
  isIncoming: boolean;
  recentEmojiBtnVisible: boolean;
  onEmojiClick: (...args: Array<any>) => void;
  onRecentEmojiBtnVisible: () => void;
};
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
const RecentReacts = (props: RecentReactsProps) => {
  const { isIncoming, recentEmojiBtnVisible, onEmojiClick,onRecentEmojiBtnVisible } = props;

  if (!recentEmojiBtnVisible) {
    return null;
  }
  const [recentEmoji, setRecentEmoji] = useState(false);
  const emojiPanelRef = useRef<HTMLDivElement>(null);
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);

  const emojiPanelWidth = 324;
  const emojiPanelHeight = 435;
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const onShowEmoji = (e: MouseEvent): void => {
    let x = e.clientX;
    if (isIncoming) {
      x -= 186;
    } else {
      x -= emojiPanelWidth + 18;
    }
    let y = e.clientY - 39;
    if (y + emojiPanelHeight > window.innerHeight) {
      y = Math.abs(mouseY - emojiPanelHeight);
    }
    setMouseX(x);
    setMouseY(y);
    setShowEmojiPanel(true);
    setRecentEmoji(false);
  };

  const onEmojiKeyDown = (event: any) => {
    if (event.key === 'Escape' && showEmojiPanel) {
      onCloseEmoji();
    }
  };

  useClickAway(emojiPanelRef, () => {
    onCloseEmoji();
  });

  const onCloseEmoji = () => {
    setShowEmojiPanel(false);
    onRecentEmojiBtnVisible();
    setRecentEmoji(false);
  };

  const onSubmit = (e: any) => {
    onEmojiClick(e);
    onCloseEmoji();
  };

  return (
    <Flex container={true} flexDirection={isIncoming ? 'row' : 'row-reverse'} alignItems="center">
      <span style={{ margin: '0 10px',cursor:'pointer' }} onClick={() => setRecentEmoji(!recentEmoji)} role='button'>
        <RecentEmojiIcon iconSize={26} />
      </span>

      {recentEmoji && (
        <MessageReactBar action={onSubmit} additionalAction={e => onShowEmoji(e)} />
      )}
      {showEmojiPanel && (
        <StyledEmojiPanelContainer onKeyDown={onEmojiKeyDown} role="button" x={mouseX} y={mouseY}>
          <BchatEmojiPanel
            ref={emojiPanelRef}
            onEmojiClicked={onSubmit}
            show={showEmojiPanel}
            isModal={true}
          />
        </StyledEmojiPanelContainer>
      )}
    </Flex>
  );
};

export const MessageContentWithStatuses = (props: Props) => {
  const contentProps = useSelector(state =>
    getMessageContentWithStatusesSelectorProps(state as any, props.messageId)
  );

  const dispatch = useDispatch();
  const multiSelectMode = useSelector(isMessageSelectionMode);
  const selected = useSelector(state => getMessageStatusProps(state as any, props.messageId));
  if (!selected) {
    return null;
  }
  const { status } = selected;

  const onClickOnMessageOuterContainer = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (multiSelectMode && messageId) {
        event.preventDefault();
        event.stopPropagation();
        dispatch(toggleSelectedMessageId(messageId));
      }
    },
    [window.contextMenuShown, props?.messageId, multiSelectMode, props?.isDetailView]
  );

  const onDoubleClickReplyToMessage = (e: React.MouseEvent<HTMLDivElement>) => {
    const currentSelection = window.getSelection();
    const currentSelectionString = currentSelection?.toString() || undefined;

    // if multiple word are selected, consider that this double click was actually NOT used to reply to
    // but to select
    if (
      !currentSelectionString ||
      currentSelectionString.length === 0 ||
      !currentSelectionString.includes(' ')
    ) {
      void replyToMessage(messageId);
      currentSelection?.empty();
      e.preventDefault();
      return;
    }
  };

  const {
    messageId,
    ctxMenuID,
    isDetailView,
    dataTestId,
    expirationLength,
    expirationTimestamp,
    enableReactions,
  } = props;
  const [popupReaction, setPopupReaction] = useState('');
  const [recentEmojiBtnVisible, setRecentEmojiBtnVisible] = useState(false);

  const handleMessageReaction = async (emoji: string) => {
    await sendMessageReaction(messageId, emoji);
  };

  const handlePopupClick = () => {
    dispatch(updateReactListModal({ reaction: popupReaction, messageId }));
  };

  if (!contentProps) {
    return null;
  }
  const { direction, isDeleted, hasAttachments, isTrustedForAttachmentDownload } = contentProps;
  const isIncoming = direction === 'incoming';

  const onEmojiClick = async (args: any) => {
    const emoji = args.native ?? args;
    await sendMessageReaction(messageId, emoji);
  };

  return (
    <StyledMessageContentContainer
      direction={isIncoming ? 'left' : 'right'}
      onMouseEnter={() => {
        setRecentEmojiBtnVisible(true);
      }}
      onMouseLeave={() => {
        setPopupReaction('');
        setRecentEmojiBtnVisible(false);
      }}
    >
      <div
        className={classNames('module-message', `module-message--${direction}`)}
        role="button"
        onClick={onClickOnMessageOuterContainer}
        onDoubleClickCapture={onDoubleClickReplyToMessage}
        style={{ width: hasAttachments && isTrustedForAttachmentDownload ? 'min-content' : 'auto' }}
        data-testid={dataTestId}
      >
        {!isIncoming && (
          <RecentReacts
            isIncoming={isIncoming}
            recentEmojiBtnVisible={recentEmojiBtnVisible}
            onEmojiClick={onEmojiClick}
            onRecentEmojiBtnVisible={()=>setRecentEmojiBtnVisible(false)}
          />
        )}
        {expirationLength && expirationTimestamp && (status === 'sent' || status === 'read') ? (
          <ExpireTimer
            isCorrectSide={!isIncoming}
            expirationLength={expirationLength}
            expirationTimestamp={expirationTimestamp}
          />
        ) : (
          <MessageStatus
            dataTestId="msg-status-outgoing"
            messageId={messageId}
            isCorrectSide={!isIncoming}
          />
        )}
        <div>
          {/* <MessageAuthorText messageId={messageId} /> */}

          <MessageContent messageId={messageId} isDetailView={isDetailView} />
        </div>
        {expirationLength && expirationTimestamp ? (
          <ExpireTimer
            isCorrectSide={isIncoming}
            expirationLength={expirationLength}
            expirationTimestamp={expirationTimestamp}
          />
        ) : (
          <MessageStatus
            dataTestId="msg-status-incoming"
            messageId={messageId}
            isCorrectSide={isIncoming}
          />
        )}
        {isIncoming && (
          <RecentReacts
            isIncoming={isIncoming}
            recentEmojiBtnVisible={recentEmojiBtnVisible}
            onEmojiClick={onEmojiClick}
            onRecentEmojiBtnVisible={() => setRecentEmojiBtnVisible(false)}
          />
        )}
        {!isDeleted && (
          <MessageContextMenu
            messageId={messageId}
            contextMenuId={ctxMenuID}
            enableReactions={enableReactions}
          />
        )}
      </div>
      {enableReactions && (
        <MessageReactions
          messageId={messageId}
          onClick={handleMessageReaction}
          popupReaction={popupReaction}
          setPopupReaction={setPopupReaction}
          onPopupClick={handlePopupClick}
          isIncoming={isIncoming}
        />
      )}
    </StyledMessageContentContainer>
  );
};
