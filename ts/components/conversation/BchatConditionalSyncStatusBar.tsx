import React from 'react'
import { useSelector } from 'react-redux'
import { getWalletSyncBarShowInChat } from '../../state/selectors/walletConfig'
import { SyncStatusBar } from '../wallet/BchatWalletSyncSatusBar';

export default function ConditionalSyncBar()
{
 const walletSyncBarShowInChat=useSelector(getWalletSyncBarShowInChat);
 if(walletSyncBarShowInChat)
 {
    return <SyncStatusBar from={"chat"} />
 }
 return <></>
}