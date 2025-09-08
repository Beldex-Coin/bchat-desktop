import classNames from 'classnames';
import React, { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { replyToMessage } from '../../../../interactions/conversationInteractions';
import { MessageRenderingProps } from '../../../../models/messageType';
import { toggleSelectedMessageId } from '../../../../state/ducks/conversations';
import { updateReactListModal } from '../../../../state/ducks/modalDialog';
import {
  getIsTypingEnabled,
  getMessageContentWithStatusesSelectorProps,
  getMessageStatusProps,
  isMessageSelectionMode,
} from '../../../../state/selectors/conversations';

import { MessageContent } from './MessageContent';
import { MessageContextMenu } from './MessageContextMenu';
import { MessageStatus } from './MessageStatus';
import { ExpireTimer } from '../../ExpireTimer';
import styled from 'styled-components';
import { MessageReactions } from './MessageReactions';
import { sendMessageReaction } from '../../../../util/reactions';

import { Flex } from '../../../basic/Flex';
import { MessageReactBar } from './MessageReactBar';
import { BchatEmojiPanel, StyledEmojiPanel } from '../../BchatEmojiPanel';

import { useClickAway } from 'react-use';
import { BchatIconButton } from '../../../icon';
import { getTheme } from '../../../../state/selectors/theme';

export type MessageContentWithStatusSelectorProps = Pick<
  MessageRenderingProps,
  'direction' | 'isDeleted' | 'isTrustedForAttachmentDownload' | 'isPublic'
> & { hasAttachments: boolean };

type Props = {
  messageId: string;
  ctxMenuID: string;
  isDetailView?: boolean;
  dataTestId?: string;

  expirationLength?: number | null;
  expirationTimestamp?: number | null;
  enableReactions: boolean;
  isRightClicked: boolean;
  onMessageLoseFocus: () => void;
  onHandleContextMenu: (e: React.MouseEvent<HTMLElement>) => void;
  acceptUrl?:string;
  groupInvitationTag?:any;
  recentEmojiBtnVisible:boolean;
  setRecentEmojiBtnVisible:(e:boolean) => void
};
export const StyledMessageContentContainer = styled.div<{ direction: 'left' | 'right' }>`
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
const StyledMessageReactBarInnerWrapper = styled.div<{ isIncoming: boolean }>`
  position: absolute;
  left: ${props => `${props.isIncoming ? 4 : -248}px`};
  z-index: 1;
`;
const StyledRecentReactionWrapper = styled.div`
  position: relative;
`;

const RecentReacts = (props: RecentReactsProps) => {
  const { isIncoming, recentEmojiBtnVisible, onEmojiClick, onRecentEmojiBtnVisible } = props;
  if (!recentEmojiBtnVisible) {
    return null;
  }

  const [recentEmoji, setRecentEmoji] = useState(false);
  const emojiPanelRef = useRef<HTMLDivElement>(null);
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const emojiPanelHeight = 435;
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const darkMode = useSelector(getTheme) === 'dark';

  const onShowEmoji = (e: MouseEvent): void => {
    // const panelWidth = 300; // Approximate width of emoji panel
    const panelHeight = emojiPanelHeight; // Defined as 435
    let x = e.clientX;
    let y = e.clientY - 39; // Adjust Y to position above the click if needed

    if (isIncoming) {
      x -= 240;
    } else {
      x -= 150;
    }

    // Adjust Y to prevent it from overflowing below the screen
    if (y + panelHeight > window.innerHeight) {
      y = window.innerHeight - panelHeight - 10 - 80; // Keep a margin of 10px
    } else if (y < 10) {
      y = 10; // Prevent it from going too high
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
      <div>
        <BchatIconButton
          iconType="smileyEmoji"
          iconSize={20}
          iconColor={darkMode ? '#858598' : '#ACACAC'}
          onClick={() => setRecentEmoji(!recentEmoji)}
          margin="0 5px"
          btnBgColor={darkMode ? '#2E333D' : '#F8F8F8'}
          btnRadius="30px"
          style={{}}
        />
      </div>
      {recentEmoji && (
        <div style={{ height: '46px', position: 'relative' }}>
          <StyledMessageReactBarInnerWrapper
            isIncoming={isIncoming}
            className="Message-ReactBar-Inner"
          >
            <MessageReactBar
              action={onSubmit}
              additionalAction={e => onShowEmoji(e)}
              isIncoming={isIncoming}
            />
          </StyledMessageReactBarInnerWrapper>
        </div>
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

const ThreeDotsMenu = (props: {
  darkMode: boolean;
  onHandleContextMenu: Props['onHandleContextMenu'];
}) => {
  const { darkMode, onHandleContextMenu } = props;
  return (
    <div>
      <BchatIconButton
        iconType={'filledThreeDots'}
        iconSize={20}
        iconColor={darkMode ? '#858598' : '#ACACAC'}
        onClick={onHandleContextMenu}
        margin="0 2.5px"
        btnBgColor={darkMode ? '#2E333D' : '#F8F8F8'}
        btnRadius="30px"
      />
    </div>
  );
};
export const MessageContentWithStatuses = (props: Props) => {
  const contentProps = useSelector(state =>
    getMessageContentWithStatusesSelectorProps(state as any, props.messageId)
  );
  const typingEnabled = useSelector(getIsTypingEnabled);

  const dispatch = useDispatch();
  const multiSelectMode = useSelector(isMessageSelectionMode);
  const darkMode = useSelector(getTheme) === 'dark';
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
    isRightClicked,
    onMessageLoseFocus,
    onHandleContextMenu,
    acceptUrl,
    groupInvitationTag,
    recentEmojiBtnVisible,
    setRecentEmojiBtnVisible
  } = props;
  const [popupReaction, setPopupReaction] = useState('');

  const handleMessageReaction = async (emoji: string) => {
    await sendMessageReaction(messageId, emoji);
  };

  const handlePopupClick = () => {
    setPopupReaction('');
    setRecentEmojiBtnVisible(false);
    dispatch(updateReactListModal({ reaction: popupReaction, messageId }));
  };

  if (!contentProps) {
    return null;
  }
  const {
    direction,
    isDeleted,
    hasAttachments,
    isTrustedForAttachmentDownload,
    isPublic,
  } = contentProps;
  const isIncoming = direction === 'incoming';

  const emojiIsVisible =
    !isDeleted &&
    !multiSelectMode &&
    !isPublic &&
    (!hasAttachments || isTrustedForAttachmentDownload) &&
    status !== 'sending' &&
    status !== 'error' &&
    typingEnabled &&
    !isRightClicked;

  const threeDotVisible = recentEmojiBtnVisible && !isRightClicked;
  const onEmojiClick = async (args: any) => {
    const emoji = args.native ?? args;
    await sendMessageReaction(messageId, emoji);
  };

  return (
    <StyledMessageContentContainer
      direction={isIncoming ? 'left' : 'right'}
      onMouseLeave={() => {
        setPopupReaction('');
        setRecentEmojiBtnVisible(false);
      }}
    >
      <div
        className={classNames(
          'module-message',
          `module-message--${direction}`,
          isDetailView && 'module-message--detailview'
        )}
        role="button"
        onClick={onClickOnMessageOuterContainer}
        style={{
          width: hasAttachments && isTrustedForAttachmentDownload ? 'min-content' : 'auto',
        }}
        data-testid={dataTestId}
      >
        {multiSelectMode && <div className="module-message--multiSelect-overlay" />}
        {!isIncoming && (
          <Flex container={true} width="165px" justifyContent="flex-end">
            {threeDotVisible && (
              <ThreeDotsMenu darkMode={darkMode} onHandleContextMenu={onHandleContextMenu} />
            )}
            {emojiIsVisible && (
              <StyledRecentReactionWrapper>
                <RecentReacts
                  isIncoming={isIncoming}
                  recentEmojiBtnVisible={recentEmojiBtnVisible}
                  onEmojiClick={onEmojiClick}
                  onRecentEmojiBtnVisible={() => setRecentEmojiBtnVisible(false)}
                />
              </StyledRecentReactionWrapper>
            )}
          </Flex>
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
            isCorrectSide={!isIncoming && !isDetailView}
            status={status}
          />
        )}
        <div onDoubleClickCapture={onDoubleClickReplyToMessage}>
          {groupInvitationTag ? (
            groupInvitationTag
          ) : (
            <MessageContent
              messageId={messageId}
              isDetailView={isDetailView}
              onRecentEmojiBtnVisible={() => setRecentEmojiBtnVisible(true)}
              isTrustedForAttachmentDownload={isTrustedForAttachmentDownload}
            />
          )}
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
            status={status}
          />
        )}
        {isIncoming && (
          <Flex container={true} width="165px">
            {emojiIsVisible && (
              <StyledRecentReactionWrapper>
                <RecentReacts
                  isIncoming={isIncoming}
                  recentEmojiBtnVisible={recentEmojiBtnVisible}
                  onEmojiClick={onEmojiClick}
                  onRecentEmojiBtnVisible={() => setRecentEmojiBtnVisible(false)}
                />
              </StyledRecentReactionWrapper>
            )}
            {threeDotVisible && (
              <ThreeDotsMenu darkMode={darkMode} onHandleContextMenu={onHandleContextMenu} />
            )}
          </Flex>
        )}

        {!isDetailView && (
          <MessageContextMenu
            messageId={messageId}
            contextMenuId={ctxMenuID}
            enableReactions={enableReactions}
            onMessageLoseFocus={onMessageLoseFocus}
            acceptUrl={acceptUrl}
          />
        )}
      </div>

      {enableReactions && !isDetailView && (
        <MessageReactions
          messageId={messageId}
          onClick={handleMessageReaction}
          popupReaction={popupReaction}
          setPopupReaction={e => {
            setPopupReaction(e), setRecentEmojiBtnVisible(false);
          }}
          onPopupClick={handlePopupClick}
          isIncoming={isIncoming}
        />
      )}
    </StyledMessageContentContainer>
  );
};
