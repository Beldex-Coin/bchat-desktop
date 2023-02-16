import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppIsFocused } from '../hooks/useAppFocused';
import { getFocusedSettingsSection } from '../state/selectors/section';
import { SmartBchatConversation } from '../state/smart/BchatConversation';
import { BchatSettingsView } from './settings/BchatSettings';
import { getOurPubKeyStrFromCache } from '../bchat/utils/User';
import { getConversationById } from '../data/data';
import { updateBchatUpgradeInstructionModal, updateBchatWalletPasswordModal } from '../state/ducks/modalDialog';
import { ModalContainer } from './dialog/ModalContainer';
import { SettingsKey } from '../data/settings-key';

const FilteredSettingsView = BchatSettingsView as any;

export async function getconverstation() {
  let userDetails = await getConversationById(getOurPubKeyStrFromCache());
  let data = userDetails?.attributes;
console.log('walletCreatedDaemonHeight ::',data?.walletCreatedDaemonHeight);
  if (data?.walletCreatedDaemonHeight===null) {
    window.inboxStore?.dispatch(updateBchatUpgradeInstructionModal({}));
  }
}


export const BchatMainPanel = () => {
  const focusedSettingsSection = useSelector(getFocusedSettingsSection);
  const isSettingsView = focusedSettingsSection !== undefined;
  const dispatch=useDispatch()
  const chatwithWallet= window.getSettingValue(SettingsKey.settingsChatWithWallet) || false;

  useEffect(() => {
    getconverstation();
    walletPassWordValidation();

  }, [chatwithWallet]);
  // even if it looks like this does nothing, this does update the redux store.
  useAppIsFocused();
  if (isSettingsView) {
    return <FilteredSettingsView category={focusedSettingsSection} />;
  }
  const walletPassWordValidation=()=>{
    if (chatwithWallet)
    {
      dispatch( updateBchatWalletPasswordModal({}))
    }
  
  }
  return (
    <div className="bchat-conversation">
      <ModalContainer />
      <SmartBchatConversation />
    </div>
  );
};
