import React from 'react';
import { useSelector } from 'react-redux';
import { getSelectedConversation, isRightPanelShowing, isShareContact } from '../state/selectors/conversations';
import { BchatRightPanelWithDetails } from './conversation/BchatRightPanel';
import { BchatContactListPanel } from './conversation/BchatContactListPanel';

export const ProfileInfo = () => {
  const isShowing: boolean = useSelector(isRightPanelShowing) || false;
  const isShare: boolean = useSelector(isShareContact) || false;
  const selectedConversation = useSelector(getSelectedConversation);
  if (isShowing && selectedConversation) {
    return <BchatRightPanelWithDetails />;
  }
  if (isShare && selectedConversation) {
    return <BchatContactListPanel />;
  }
  return <></>;
};
