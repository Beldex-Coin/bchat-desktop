import React from 'react';
import { useSelector } from 'react-redux';
import { useAppIsFocused } from '../hooks/useAppFocused';

import { getFocusedSettingsSection } from '../state/selectors/section';

import { SmartBchatConversation } from '../state/smart/BchatConversation';
import { BchatSettingsView } from './settings/BchatSettings';

const FilteredSettingsView = BchatSettingsView as any;

export const BchatMainPanel = () => {
  const focusedSettingsSection = useSelector(getFocusedSettingsSection);
  const isSettingsView = focusedSettingsSection !== undefined;

  // even if it looks like this does nothing, this does update the redux store.
  useAppIsFocused();
  if (isSettingsView) {
    return <FilteredSettingsView category={focusedSettingsSection} />;
  }
  return (
    <div className="bchat-conversation">
      {/* <div className="bchat-conversation-doodle"> */}
      <SmartBchatConversation />
      {/* </div> */}
    
    </div>
  );
};
