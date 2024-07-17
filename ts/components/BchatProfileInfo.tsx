import React from 'react';
import { useSelector } from 'react-redux';
import { isRightPanelShowing } from '../state/selectors/conversations';
import { BchatRightPanelWithDetails } from './conversation/BchatRightPanel';

export const ProfileInfo = () => {
  const isShowing: boolean = useSelector(isRightPanelShowing);
  if (isShowing) {
    return <BchatRightPanelWithDetails />;
  }
  return <></>;
};
