import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppIsFocused } from '../hooks/useAppFocused';
import { getFocusedSettingsSection } from '../state/selectors/section';
import { SmartBchatConversation } from '../state/smart/BchatConversation';
import { BchatSettingsView } from './settings/BchatSettings';
import { getOurPubKeyStrFromCache } from '../bchat/utils/User';
import { getConversationById } from '../data/data';
import { updateBchatUpgradeInstructionModal } from '../state/ducks/modalDialog';
import { ModalContainer } from './dialog/ModalContainer';

const FilteredSettingsView = BchatSettingsView as any;

export async function getconverstation() {
  let userDetails = await getConversationById(getOurPubKeyStrFromCache());
  let data = userDetails?.attributes;
  if (!data?.walletCreatedDaemonHeight) {
    window.inboxStore?.dispatch(updateBchatUpgradeInstructionModal({}));
  }
}

export const BchatMainPanel = () => {
  const focusedSettingsSection = useSelector(getFocusedSettingsSection);
  const isSettingsView = focusedSettingsSection !== undefined;
  useEffect(() => {
    getconverstation();
  }, []);
  // even if it looks like this does nothing, this does update the redux store.
  useAppIsFocused();
  if (isSettingsView) {
    return <FilteredSettingsView category={focusedSettingsSection} />;
  }
  return (
    <div className="bchat-conversation">
      <ModalContainer />
      <SmartBchatConversation />
    </div>
  );
};
