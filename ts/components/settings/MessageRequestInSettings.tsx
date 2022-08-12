import React, {  useContext } from 'react';
import classNames from 'classnames';
// import { contextMenu } from 'react-contexify';
// import { useSelector } from 'react-redux';

import { Avatar, AvatarSize } from '.././avatar/Avatar';

import { createPortal } from 'react-dom';
import {
//   openConversationWithMessages,
  ReduxConversationType,
} from '../../state/ducks/conversations';
import { useDispatch } from 'react-redux';
import { updateUserDetailsModal } from '../../state/ducks/modalDialog';

import {
  useAvatarPath,
  useConversationUsername,
  useIsPrivate,
//   useIsRequest,
} from '../../hooks/useParamSelector';
import { MemoConversationListItemContextMenu } from '../menu/ConversationListItemContextMenu';
import { ConversationListItemHeaderItem } from '../../components/leftpane/conversation-list-item/HeaderItem';
import { MessageItem } from '../../components/leftpane/conversation-list-item/MessageItem';
import _ from 'lodash';
// import { BchatButton, BchatButtonColor,BchatButtonType } from '../basic/BchatButton';
// import { getSelectedConversation } from '../../state/selectors/conversations';
// import { getConversationController } from 'bchat/conversations';
import {
    approveConvoAndSendResponse,
  } from '../../interactions/conversationInteractions';
import { getConversationController } from '../../bchat/conversations';
// import { AcceptMenuItem } from '../menu/Menu';

// import useUpdate from 'react-use/lib/useUpdate';

// tslint:disable-next-line: no-empty-interface
export type ConversationListItemProps = Pick< 
  ReduxConversationType,
  'id' | 'isSelected' | 'isBlocked' | 'mentionedUs' | 'unreadCount' | 'profileName'
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
        size={AvatarSize.M}
        pubkey={conversationId}
        onAvatarClick={isPrivate ? onPrivateAvatarClick : undefined}
      />
    </div>
  );
};

// tslint:disable: max-func-body-length
const MessageRequestListSetting = (props: Props) => {
//   const selectedConversation = useSelector(getSelectedConversation);

  const {
    // unreadCount,
    id: conversationId,
    // isSelected,
    // isBlocked,
    style,
    // mentionedUs,
    isMessageRequest,
    // walletAddress,
    profileName
    
  } = props;
  console.log("props convertasion",props);
  
  const key = `conversation-item-${conversationId}`;

  const triggerId = `${key}-ctxmenu`;
  console.log("triggerIdctxmenu",triggerId);
  

//   const openConvo = useCallback(
//     async (e: React.MouseEvent<HTMLDivElement>) => {
//       // mousedown is invoked sooner than onClick, but for both right and left click
//       if (e.button === 0) {
//         await openConversationWithMessages({ conversationKey: conversationId, messageId: null });
//       }
//     },
//     [conversationId]
//   );
  const handleAcceptConversationRequest = async () => {

    const convo = getConversationController().get(conversationId);
    await convo.setDidApproveMe(true);
    await convo.addOutgoingApprovalMessage(Date.now());
    await approveConvoAndSendResponse(conversationId, true);
//     // forceUpdate()
  };


  return (
    <ContextConversationId.Provider value={conversationId}>
      <div key={key}>
        <div
        //   role="button"
        //   onMouseDown={openConvo}
        //   onMouseUp={e => {
        //     e.stopPropagation();
        //     e.preventDefault();
        //   }}
        //   onContextMenu={e => {
        //     console.log("triggerId",triggerId,);
        //     contextMenu.show({
        //       id: triggerId,
        //       event: e,
        //     });
            
            
        //   }}
          style={style}
          className={classNames(
            'bchat-settings-messageRequest-list-item',
            // unreadCount && unreadCount > 0 ? 'module-conversation-list-item--has-unread' : null,
            // unreadCount && unreadCount > 0 && mentionedUs
            //   ? 'module-conversation-list-item--mentioned-us'
            //   : null,
            // isSelected ? 'module-conversation-list-item--is-selected' : null,
            // isBlocked ? 'module-conversation-list-item--is-blocked' : null
          )}
        >
          <AvatarItem />
          <div className="module-conversation-list-item__content">
            <ConversationListItemHeaderItem />
             <div className='bchat-settings-messageRequest-profileName' >{profileName}</div>
            <MessageItem isMessageRequest={Boolean(isMessageRequest)} />
            {/* <div style={{fontSize:'12px'}}>
             {walletAddress}
          </div> */}
          </div>
          {/* <button style={{background:"green"}} onClick={handleAcceptConversationRequest}>{window.i18n('accept')}</button> */}
          <div role="button" className='bchat-settings-messageRequest-acceptButton' onClick={handleAcceptConversationRequest}>
          {window.i18n('accept')}
          </div>
          
          {/* <AcceptMenuItem /> */}
        </div>
       
       
        <Portal>
            {console.log("triggerIdMemoConversationListItemContextMenu",triggerId)}
            
          <MemoConversationListItemContextMenu triggerId={triggerId} />
        </Portal>
      </div>
    </ContextConversationId.Provider>
  );
};

export const MemoMessageRequestListSetting = React.memo(MessageRequestListSetting, _.isEqual);
