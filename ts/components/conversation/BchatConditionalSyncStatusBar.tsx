import React from 'react';
import { useSelector } from 'react-redux';
import { getWalletSyncBarShowInChat } from '../../state/selectors/walletConfig';
import { MemoSyncStatusBar } from '../wallet/BchatWalletSyncSatusBar';
import { daemon } from '../../wallet/daemon-rpc';

export default function ConditionalSyncBar() {
  const walletSyncBarShowInChat = useSelector(getWalletSyncBarShowInChat);
  daemon.daemonHeartbeat();

  if (walletSyncBarShowInChat) {
    return <MemoSyncStatusBar from={'chat'} />;
  }
  return <></>;
}
