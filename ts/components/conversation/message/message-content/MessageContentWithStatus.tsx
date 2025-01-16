import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
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

import { MessageAuthorText } from './MessageAuthorText';
import { MessageContent } from './MessageContent';
import { MessageContextMenu } from './MessageContextMenu';
import { MessageStatus } from './MessageStatus';
import { ExpireTimer } from '../../ExpireTimer';
import styled from 'styled-components';
import { MessageReactions } from './MessageReactions';
import { sendMessageReaction } from '../../../../util/reactions';

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
    enableReactions
  } = props;
  const [popupReaction, setPopupReaction] = useState('');

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

  return (
    <StyledMessageContentContainer direction={isIncoming ? 'left' : 'right'}  onMouseLeave={() => {
      setPopupReaction('');
    }}>
    <div
      className={classNames('module-message', `module-message--${direction}`)}
      role="button"
      onClick={onClickOnMessageOuterContainer}
      onDoubleClickCapture={onDoubleClickReplyToMessage}
      style={{ width: hasAttachments && isTrustedForAttachmentDownload ? 'min-content' : 'auto' }}
      data-testid={dataTestId}
    >
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
        <MessageAuthorText messageId={messageId} />

        <MessageContent messageId={messageId} isDetailView={isDetailView} />
      </div>
      {expirationLength && expirationTimestamp  ? (
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


