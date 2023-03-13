import React, { useEffect } from 'react';
 import {  useDispatch, useSelector } from 'react-redux';
// import {   useSelector } from 'react-redux';
import { useAppIsFocused } from '../hooks/useAppFocused';
import { getFocusedSettingsSection } from '../state/selectors/section';
import { SmartBchatConversation } from '../state/smart/BchatConversation';
import { BchatSettingsView } from './settings/BchatSettings';
import { getOurPubKeyStrFromCache } from '../bchat/utils/User';
import { getConversationById } from '../data/data';
import { updateBchatUpgradeInstructionModal, updateBchatWalletPasswordModal  } from '../state/ducks/modalDialog';
// import { updateBchatUpgradeInstructionModal  } from '../state/ducks/modalDialog';

import { SettingsKey } from '../data/settings-key';
import { getWalletPasswordPopUpFlag, getWalletSyncBarShowInChat } from '../state/selectors/walletConfig';

const FilteredSettingsView = BchatSettingsView as any;

export async function getconverstation() {
  let userDetails = await getConversationById(getOurPubKeyStrFromCache());
  let data = userDetails?.attributes;
  if (data?.walletCreatedDaemonHeight===null) {
    window.inboxStore?.dispatch(updateBchatUpgradeInstructionModal({}));
  }
}

export const BchatMainPanel = () => {
  const focusedSettingsSection = useSelector(getFocusedSettingsSection);
  const isSettingsView = focusedSettingsSection !== undefined;
   const dispatch = useDispatch();
  const chatwithWallet = window.getSettingValue(SettingsKey.settingsChatWithWallet) || false;
  // const WalletSyncInitiatedWithChat=useSelector(getWalletSyncInitiatedWithChat)
 const walletSyncBarShowInChat=useSelector(getWalletSyncBarShowInChat);
 const WalletPasswordPopUpFlag=useSelector(getWalletPasswordPopUpFlag);
  
  useEffect(() => {
    getconverstation();
    validation()

  }, [chatwithWallet,WalletPasswordPopUpFlag]);
  
  const walletPassWordValidation = () => {
    // console.log('WalletSyncInitiatedWithChat ::',WalletSyncInitiatedWithChat);
    
    if (chatwithWallet && !walletSyncBarShowInChat && !isSettingsView) {

     dispatch(updateBchatWalletPasswordModal({}))
    }

  }
  const validation = () => {
    walletPassWordValidation();
    // chatInstruction && chatWithWalletInstruction();
  }
  // even if it looks like this does nothing, this does update the redux store.
  useAppIsFocused();
  if (isSettingsView) {
    return <FilteredSettingsView category={focusedSettingsSection} />;
  }
  
  return (
    <div className="bchat-conversation">
      <SmartBchatConversation />
    </div>
  );
};