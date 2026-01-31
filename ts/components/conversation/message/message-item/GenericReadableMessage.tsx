import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { contextMenu } from 'react-contexify';
import { useDispatch, useSelector } from 'react-redux';
import useInterval from 'react-use/lib/useInterval';
import _ from 'lodash';
import { removeMessage } from '../../../../data/data';
import { MessageRenderingProps } from '../../../../models/messageType';
import { getConversationController } from '../../../../bchat/conversations';
import { messageExpired, toggleSelectedMessageId } from '../../../../state/ducks/conversations';
import {
  getGenericReadableMessageSelectorProps,
  getIsMessageSelected,
  isMessageSelectionMode,
} from '../../../../state/selectors/conversations';
import { getIncrement } from '../../../../util/timer';
// import { ExpireTimer } from '../../ExpireTimer';
import { MessageAvatar } from '../message-content/MessageAvatar';
import { MessageContentWithStatuses } from '../message-content/MessageContentWithStatus';
import { ReadableMessage } from './ReadableMessage';
import { BchatIcon } from '../../../icon/BchatIcon';
import { getTheme } from '../../../../state/selectors/theme';
import styled, { keyframes } from 'styled-components';
import { GroupInvitation } from './GroupInvitation';
import { SharedContactCardMessage } from './SharedContactCardMessage';
import { PaymentMessage } from './PaymentMessage';

export type GenericReadableMessageSelectorProps = Pick<
  MessageRenderingProps,
  | 'direction'
  | 'conversationType'
  | 'receivedAt'
  | 'isUnread'
  | 'expirationLength'
  | 'expirationTimestamp'
  | 'isKickedFromGroup'
  | 'isExpired'
  | 'convoId'
  | 'isDeleted'
>;

type ExpiringProps = {
  isExpired?: boolean;
  expirationTimestamp?: number | null;
  expirationLength?: number | null;
  convoId?: string;
  messageId: string;
};
const EXPIRATION_CHECK_MINIMUM = 2000;

function useIsExpired(props: ExpiringProps) {
  const {
    convoId,
    messageId,
    expirationLength,
    expirationTimestamp,
    isExpired: isExpiredProps,
  } = props;

  const dispatch = useDispatch();

  const [isExpired] = useState(isExpiredProps);

  const checkExpired = useCallback(async () => {
    const now = Date.now();

    if (!expirationTimestamp || !expirationLength) {
      return;
    }

    if (isExpired || now >= expirationTimestamp) {
      await removeMessage(messageId);
      if (convoId) {
        dispatch(
          messageExpired({
            conversationKey: convoId,
            messageId,
          })
        );
        const convo = getConversationController().get(convoId);
        convo?.updateLastMessage();
      }
    }
  }, [expirationTimestamp, expirationLength, isExpired, messageId, convoId]);

  let checkFrequency: number | null = null;
  if (expirationLength) {
    const increment = getIncrement(expirationLength || EXPIRATION_CHECK_MINIMUM);
    checkFrequency = Math.max(EXPIRATION_CHECK_MINIMUM, increment);
  }

  useEffect(() => {
    void checkExpired();
  }, []); // check on mount
  useInterval(checkExpired, checkFrequency); // check every 2sec or sooner if needed

  return { isExpired };
}

type Props = {
  messageId: string;
  ctxMenuID: string;
  isDetailView?: boolean;

  serverName?: string;
  url?: string;
  acceptUrl?: string;
  isUnread?: boolean;

  amount?: string;
  txnId?: string;

  address?: string;
  name?: string;
};

const highlightedMessageAnimation = keyframes`
  1% {
      background-color: #00f782;
  }
`;

const StyledReadableMessage = styled(ReadableMessage)<{
  selected: boolean;
  isRightClicked: boolean;
}>`
  display: flex;
  align-items: center;
  width: 100%;
  letter-spacing: 0.03em;
  margin-top: 5px;
  &.message-highlighted {
    animation: ${highlightedMessageAnimation} 1s ease-in-out;
  }
  ${props =>
    props.isRightClicked &&
    `
    background-color:var(--color-chat-multi-select-bg);
  `}
  ${props =>
    props.selected &&
    `
    &.message-selected {
      .module-message {
        &__container {
          box-shadow: var(--color-bchat-shadow);
        }
      }
    }
    `}
`;
export const GenericReadableMessage = (props: Props) => {
  const dispatch = useDispatch();

  const msgProps = useSelector(state =>
    getGenericReadableMessageSelectorProps(state as any, props.messageId)
  );
  const isSelectionMode = useSelector(isMessageSelectionMode);

  const expiringProps: ExpiringProps = {
    convoId: msgProps?.convoId,
    expirationLength: msgProps?.expirationLength,
    messageId: props.messageId,
    expirationTimestamp: msgProps?.expirationTimestamp,
    isExpired: msgProps?.isExpired,
  };
  const { isExpired } = useIsExpired(expiringProps);

  const isMessageSelected = useSelector(state =>
    getIsMessageSelected(state as any, props.messageId)
  );
  const multiSelectMode = useSelector(isMessageSelectionMode);
  const [isRightClicked, setIsRightClicked] = useState(false);
  const [enableReactions, setEnableReactions] = useState(true);
  const [recentEmojiBtnVisible, setRecentEmojiBtnVisible] = useState(false);
  const onMessageLoseFocus = useCallback(() => {
    if (isRightClicked) {
      setIsRightClicked(false);
    }
  }, [isRightClicked]);
   const {
    convoId,
    direction,
    conversationType,
    receivedAt,
    isUnread,
    expirationLength,
    expirationTimestamp,
  } = msgProps||{};
   useEffect(() => {
    if(convoId===undefined) return;
    const conversationModel = getConversationController().get(convoId);
    if (conversationModel) {
      setEnableReactions(conversationModel.hasReactions());
    }
  }, [convoId]);

  useEffect(() => {
    document.addEventListener('click', onMessageLoseFocus);

    return () => {
      document.removeEventListener('click', onMessageLoseFocus);
    };
  }, [onMessageLoseFocus]);

  
  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const enableContextMenu = !multiSelectMode && !msgProps?.isKickedFromGroup && !isDetailView;

      if (enableContextMenu) {
        contextMenu.hideAll();
        contextMenu.show({
          id: ctxMenuID,
          event: e,
        });
      }
      setIsRightClicked(enableContextMenu);
    },
    [props.ctxMenuID, multiSelectMode, msgProps?.isKickedFromGroup]
  );

  const {
    ctxMenuID,
    messageId,
    isDetailView,
    serverName,
    acceptUrl,
    url,
    txnId,
    amount,
    address,
    name,
  } = props;

  const selected = isMessageSelected || false;
  const isGroup = conversationType === 'group';
  const isIncoming = direction === 'incoming';
  const darkMode = useSelector(getTheme) === 'dark';
  const iconColor = darkMode ? '#F0F0F0' : selected ? '#3E4A53' : '#ACACAC';

  const onSelect = useCallback(
    (messageId:any) => {
      //  if(isSelectionMode)
      //  {
      dispatch(toggleSelectedMessageId(messageId));
      //  }
    },
    [messageId]
  );

  const cardDesignTag = (() => {
    if (serverName) {
      return (
        <GroupInvitation
          serverName={serverName}
          url={url ||''}
          direction="incoming"
          acceptUrl={acceptUrl||''}
          messageId={messageId}
          isUnread={props.isUnread ?? false}
          onRecentEmojiBtnVisible={() => setRecentEmojiBtnVisible(true)}
        />
      );
    }

      if (txnId && amount&&direction) {
      return (
        <PaymentMessage
          amount={amount}
          txnId={txnId}
          messageId={messageId}
          direction={direction}
          acceptUrl={acceptUrl}
          isUnread={props.isUnread ?? false}
          onRecentEmojiBtnVisible={() => setRecentEmojiBtnVisible(true)}
        />
      );
    }
  
    if (address&&name) {
      return (
        <SharedContactCardMessage
          address={address}
          name={name}
          messageId={messageId}
          isUnread={props.isUnread ?? false}
          isDetailView={isDetailView}
          onRecentEmojiBtnVisible={() => setRecentEmojiBtnVisible(true)}
        />
      );
    }
  
    return null;
  })();

  return (
    <>
    {isExpired ? null : 
    <StyledReadableMessage
      messageId={messageId}
      className={classNames(
        'bchat-message-wrapper',
        selected && 'message-selected',
        isGroup && 'public-chat-message-wrapper',
        isIncoming ? 'bchat-message-wrapper-incoming' : 'bchat-message-wrapper-outgoing'
      )}
      onContextMenu={handleContextMenu}
      receivedAt={receivedAt}
      isUnread={!!isUnread}
      key={`readable-message-${messageId}`}
      selected={selected}
      isRightClicked={isRightClicked}
    >
      <div
        className="message-box"
        style={{ cursor: isSelectionMode ? 'pointer' : 'default' }}
        onClick={() => isSelectionMode && onSelect(messageId)}
        onMouseLeave={() => {
        setRecentEmojiBtnVisible(false);
      }}
      onMouseOver={() => setRecentEmojiBtnVisible(true)}
      >
        {/* <div className={classNames(isSelectionMode && !selected && 'checkedCircle')}> */}
        <div style={{margin:'auto'}}>
          {isSelectionMode && isIncoming && (
            <div style={{ marginRight: '15px', cursor: 'pointer' }}>
              <BchatIcon
                iconType={!selected ? 'checkBox' : 'checkBoxTick'}
                iconColor={iconColor}
                clipRule="evenodd"
                fillRule="evenodd"
                iconSize={23}
              />
            </div>
          )}
        </div>
       {!isDetailView &&  <MessageAvatar messageId={messageId} />}
        {/* {expirationLength && expirationTimestamp && (
          <ExpireTimer
            isCorrectSide={!isIncoming}
            expirationLength={expirationLength}
            expirationTimestamp={expirationTimestamp}
          />
        )} */}
        <MessageContentWithStatuses
          ctxMenuID={ctxMenuID}
          messageId={messageId}
          isDetailView={isDetailView}
          dataTestId={`message-content-${messageId}`}
          expirationLength={expirationLength}
          expirationTimestamp={expirationTimestamp}
          enableReactions={enableReactions}
          isRightClicked={isRightClicked}
          onMessageLoseFocus={onMessageLoseFocus}
          onHandleContextMenu={handleContextMenu}
          acceptUrl={acceptUrl}
          txnId={txnId}
          cardDesignTag={cardDesignTag}
          recentEmojiBtnVisible={recentEmojiBtnVisible}
          setRecentEmojiBtnVisible={e => setRecentEmojiBtnVisible(e)}
        />
        {/* {expirationLength && expirationTimestamp && (
          <ExpireTimer
            isCorrectSide={isIncoming}
            expirationLength={expirationLength}
            expirationTimestamp={expirationTimestamp}
          />
        )} */}
        <div style={{margin:'auto'}}>
          {!isIncoming && isSelectionMode && (
            <div style={{ marginLeft: '15px', cursor: 'pointer' }}>
              <BchatIcon
                iconType={!selected ? 'checkBox' : 'checkBoxTick'}
                iconColor={iconColor}
                clipRule="evenodd"
                fillRule="evenodd"
                iconSize={23}
              />
            </div>
          )}
        </div>
      </div>
    </StyledReadableMessage>
    }
    </>
  );
};
