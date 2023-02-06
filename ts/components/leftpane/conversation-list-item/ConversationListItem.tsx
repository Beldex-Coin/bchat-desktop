import React, { useCallback, useContext } from 'react';
import classNames from 'classnames';
import { contextMenu } from 'react-contexify';

import { Avatar, AvatarSize } from '../../avatar/Avatar';

import { createPortal } from 'react-dom';
import {
  openConversationToSpecificMessage,
  openConversationWithMessages,
  ReduxConversationType,
} from '../../../state/ducks/conversations';
import { useDispatch } from 'react-redux';
import { updateUserDetailsModal } from '../../../state/ducks/modalDialog';

import {
  useAvatarPath,
  // useConversationPropsById,
  useConversationUsername,
  useIsPrivate,
} from '../../../hooks/useParamSelector';
import { MemoConversationListItemContextMenu } from '../../menu/ConversationListItemContextMenu';
import { ConversationListItemHeaderItem } from './HeaderItem';
import { MessageItem } from './MessageItem';
import _ from 'lodash';
// import { Timestamp } from '../../conversation/Timestamp';
import { getFirstUnreadMessageWithMention } from '../../../data/data';
import { UserUtils } from '../../../bchat/utils';
import styled from 'styled-components';
// import { Timestamp } from '../../conversation/Timestamp';

// tslint:disable-next-line: no-empty-interface
export type ConversationListItemProps = Pick<
  ReduxConversationType,
  'id' | 'isSelected' | 'isBlocked' | 'mentionedUs' | 'unreadCount' | 'profileName' | 'walletAddress'
>;

/**
 * This React context is used to share deeply in the tree of the ConversationListItem what is the ID we are currently rendering.
 * This is to avoid passing the prop to all the subtree component
 */
export const ContextConversationId = React.createContext('');

type PropsHousekeeping = {
  style?: Object;
  isMessageRequest?: boolean;
};
// tslint:disable: use-simple-attributes

type Props = ConversationListItemProps & PropsHousekeeping;

const Portal = ({ children }: { children: any }) => {
  return createPortal(children, document.querySelector('.inbox.index') as Element);
};

const AvatarItem = () => {
  const conversationId = useContext(ContextConversationId);
  const userName = useConversationUsername(conversationId);
  const isPrivate = useIsPrivate(conversationId);
  const avatarPath = useAvatarPath(conversationId);
  const dispatch = useDispatch();

  function onPrivateAvatarClick() {
    dispatch(
      updateUserDetailsModal({
        conversationId: conversationId,
        userName: userName || '',
        authorAvatarPath: avatarPath,
      })
    );
  }

  return (
    <div className="module-conversation-list-item__avatar-container">
      <Avatar
        size={AvatarSize.S}
        pubkey={conversationId}
        onAvatarClick={isPrivate ? onPrivateAvatarClick : undefined}
      />
    </div>
  );
};

// tslint:disable: max-func-body-length
const ConversationListItem = (props: Props) => {
  const {
    unreadCount,
    id: conversationId,
    isSelected,
    isBlocked,
    style,
    mentionedUs,
    isMessageRequest,
    // walletAddress
    
  } = props;
 
  
  // function useHeaderItemProps(conversationId: string) {
  //   const convoProps = useConversationPropsById(conversationId);
  //   if (!convoProps) {
  //     return null;
  //   }
  //   return {
  //     isPinned: !!convoProps.isPinned,
  //     mentionedUs: convoProps.mentionedUs || false,
  //     unreadCount: convoProps.unreadCount || 0,
  //     activeAt: convoProps.activeAt,
  //   };
  // }
  // const convoProps = useHeaderItemProps(conversationId);
  
  // const activeAt=convoProps?.activeAt;
  // console.log("activeAt:",activeAt)
  // console.log("unreadCount ::",unreadCount);
  
  //  console.log(activeAt);
  
  const key = `conversation-item-${conversationId}`;

  const triggerId = `${key}-ctxmenu`;

  const openConvo = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      // mousedown is invoked sooner than onClick, but for both right and left click
      if (e.button === 0) {
        await openConversationWithMessages({ conversationKey: conversationId, messageId: null });
      }
    },
    [conversationId]
  );

  const openConvoToLastMention = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();

      // mousedown is invoked sooner than onClick, but for both right and left click
      if (e.button === 0) {
        const oldestMessageUnreadWithMention =
          (await getFirstUnreadMessageWithMention(
            conversationId,
            UserUtils.getOurPubKeyStrFromCache()
          )) || null;
        if (oldestMessageUnreadWithMention) {
          await openConversationToSpecificMessage({
            conversationKey: conversationId,
            messageIdToNavigateTo: oldestMessageUnreadWithMention,
            shouldHighlightMessage: true,
          });
        } else {
          window.log.info('cannot open to latest mention as no unread mention are found');
          await openConversationWithMessages({
            conversationKey: conversationId,
            messageId: null,
          });
        }
      }
    },
    [conversationId]
  );
  const MentionAtSymbol = styled.span`
  background-color: var(--color-accent);

  color: black;
  text-align: center;
  margin-top: 0px;
  margin-bottom: 0px;
  padding-top: 1px;
  padding-inline-start: 3px;
  padding-inline-end: 3px;

  position: static;
  margin-inline-start: 5px;

  font-weight: 300;
  font-size: 11px;
  letter-spacing: 0.25px;

  height: 16px;
  min-width: 16px;
  border-radius: 8px;
  /* transition: filter 0.25s linear; */
  cursor: pointer;

  :hover {
    filter: grayscale(0.7);
  }
`;
  

  let atSymbol = null;
  let unreadCountDiv = null;
  if (unreadCount?unreadCount:0 > 0) {
    atSymbol = mentionedUs ? (
      <MentionAtSymbol title="Open to latest mention" onMouseDown={openConvoToLastMention}>
        @
      </MentionAtSymbol>
    ) : null;
    unreadCountDiv = <p className="module-conversation-list-item__unread-count">{unreadCount?unreadCount:0>99?"99+":unreadCount}</p>;
  }

  return (
    <ContextConversationId.Provider value={conversationId}>
      <div key={key}>
        <div
          role="button"
          onMouseDown={openConvo}
          onMouseUp={e => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onContextMenu={e => {
            contextMenu.show({
              id: triggerId,
              event: e,
            });
          }}
          style={style}
          className={classNames(
            'module-conversation-list-item',
            unreadCount && unreadCount > 0 ? 'module-conversation-list-item--has-unread' : null,
            unreadCount && unreadCount > 0 && mentionedUs
              ? 'module-conversation-list-item--mentioned-us'
              : null,
            isSelected ? 'module-conversation-list-item--is-selected' : null,
            isBlocked ? 'module-conversation-list-item--is-blocked' : null
          )}
        >
          <div className='verticalLine'>
            
          </div>
          <AvatarItem />
          <div className="module-conversation-list-item__content">
            <ConversationListItemHeaderItem />
            
            <div className='module-conversation-list-item__content__messageBox' >
              
            <MessageItem isMessageRequest={Boolean(isMessageRequest)} />
            {unreadCountDiv}
           {atSymbol}
            {/* <Timestamp timestamp={activeAt} isConversationListItem={true} momentFromNow={true} /> */}

            </div>
            

            
            <div style={{fontSize:'12px'}}>
      {/* {walletAddress} */}
          </div>
          </div>
         
        </div>
        <Portal>
          <MemoConversationListItemContextMenu triggerId={triggerId} />
        </Portal>
      </div>
    </ContextConversationId.Provider>
  );
};

export const MemoConversationListItemWithDetails = React.memo(ConversationListItem, _.isEqual);


