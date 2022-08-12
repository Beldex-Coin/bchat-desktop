import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { contextMenu } from 'react-contexify';
import { useDispatch, useSelector } from 'react-redux';
// tslint:disable-next-line: no-submodule-imports
import useInterval from 'react-use/lib/useInterval';
import _ from 'lodash';
import { removeMessage } from '../../../../data/data';
import { MessageRenderingProps } from '../../../../models/messageType';
import { getConversationController } from '../../../../bchat/conversations';
import { messageExpired, 
  toggleSelectedMessageId
 } from '../../../../state/ducks/conversations';
import {
  getGenericReadableMessageSelectorProps,
  getIsMessageSelected,
  isMessageSelectionMode,
} from '../../../../state/selectors/conversations';
import { getIncrement } from '../../../../util/timer';
import { ExpireTimer } from '../../ExpireTimer';
import { MessageAvatar } from '../message-content/MessageAvatar';
import { MessageContentWithStatuses } from '../message-content/MessageContentWithStatus';
import { ReadableMessage } from './ReadableMessage';
import { BchatIcon } from '../../../icon/BchatIcon';
// import styled from 'styled-components';

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
};
// tslint:disable: use-simple-attributes

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

  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const enableContextMenu = !multiSelectMode && !msgProps?.isKickedFromGroup;

      if (enableContextMenu) {
        contextMenu.hideAll();
        contextMenu.show({
          id: props.ctxMenuID,
          event: e,
        });
      }
    },
    [props.ctxMenuID, multiSelectMode, msgProps?.isKickedFromGroup]
  );

  const { messageId, isDetailView } = props;

  if (!msgProps) {
    return null;
  }
  const {
    direction,
    conversationType,
    receivedAt,
    isUnread,
    expirationLength,
    expirationTimestamp,
  } = msgProps;

  if (isExpired) {
    return null;
  }

  const selected = isMessageSelected || false;
  const isGroup = conversationType === 'group';
  const isIncoming = direction === 'incoming';
  
  const onSelect = useCallback((messageId) => {
    console.log("onSelect",isSelectionMode,messageId);
    
    //  if(isSelectionMode)
    //  {
      dispatch(toggleSelectedMessageId(messageId));
    //  }
  }, [messageId]);

  return (
    <ReadableMessage
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
    >
      
      {/* <SelectionDiv onClick={()=>isSelectionMode&&onSelect(messageId)}> */}
      <div className='message-box' onClick={()=>isSelectionMode&&onSelect(messageId)} >
      <div className={classNames( isSelectionMode&&!selected&&'checkedCircle')} onClick={()=>onSelect(messageId)} >
        {selected&&<div className='isSelected'><BchatIcon iconType="check" iconColor={'rgba(17, 193, 25, 1)'} iconSize={15} /></div>}
      </div>
      <MessageAvatar messageId={messageId} />
      {expirationLength && expirationTimestamp && (
        <ExpireTimer
          isCorrectSide={!isIncoming}
          expirationLength={expirationLength}
          expirationTimestamp={expirationTimestamp}
        />
      )}
      <MessageContentWithStatuses
        ctxMenuID={props.ctxMenuID}
        messageId={messageId}
        isDetailView={isDetailView}
        dataTestId={`message-content-${messageId}`}
      />
      {expirationLength && expirationTimestamp && (
        <ExpireTimer
          isCorrectSide={isIncoming}
          expirationLength={expirationLength}
          expirationTimestamp={expirationTimestamp}
        />
      )}
      {/* </SelectionDiv> */}
      </div>
    </ReadableMessage>
  );
};


