import React from 'react';
import { useSelector } from 'react-redux';
import { getSelectedConversation, isRightPanelShowing, isShareContact, getViewContactPanel } from '../state/selectors/conversations';
import { BchatRightPanelWithDetails } from './conversation/BchatRightPanel';
import { BchatContactListPanel } from './conversation/BchatContactListPanel';
import { BchatViewContactPanel } from './conversation/BchatViewContactPanel';

export const ProfileInfo = (props:{sendMessage:any}) => {
  const isShowing: boolean = useSelector(isRightPanelShowing) || false;
  const isShare: boolean = useSelector(isShareContact) || false;
  const selectedConversation = useSelector(getSelectedConversation);
  const isShowingViewPanel=useSelector(getViewContactPanel)
  if (isShowing && selectedConversation) {
    return <BchatRightPanelWithDetails />;
  }
  if (isShare && selectedConversation) {
    return <BchatContactListPanel sendMessage={props.sendMessage} />;
  }
  if(isShowingViewPanel && selectedConversation)
  {
    return <BchatViewContactPanel {...isShowingViewPanel} />
  }
  
  return <></>;
};
