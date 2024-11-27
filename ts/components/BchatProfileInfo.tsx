import React from 'react';
import { useSelector } from 'react-redux';
import { getSelectedConversation, isRightPanelShowing } from '../state/selectors/conversations';
import { BchatRightPanelWithDetails } from './conversation/BchatRightPanel';

export const ProfileInfo = () => {
  const isShowing: boolean = useSelector(isRightPanelShowing) || false;
  const selectedConversation = useSelector(getSelectedConversation);
  if (isShowing && selectedConversation) {
    return <BchatRightPanelWithDetails />;
  }
  return <></>;
};
