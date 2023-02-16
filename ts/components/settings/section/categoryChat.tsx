import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useUpdate from 'react-use/lib/useUpdate';
import { SettingsKey } from '../../../data/settings-key';
import { toggleAudioAutoplay } from '../../../state/ducks/userConfig';
import { getAudioAutoplay } from '../../../state/selectors/userConfig';
import { BchatToggleWithDescription } from '../BchatSettingListItem';
import { ChangeChatFontSetting } from '../ChangeChatFontSetting';

export const SettingsCategoryChat = (props: { hasPassword: boolean | null }) => {
  const dispatch = useDispatch();
  const forceUpdate = useUpdate();
  const audioAutoPlay = useSelector(getAudioAutoplay);
  const chatwithWallet = window.getSettingValue(SettingsKey.settingsChatWithWallet) || false;
  

  if (props.hasPassword !== null) {
    // const isSpellCheckActive =
    //   window.getSettingValue(SettingsKey.settingsSpellCheck) === undefined
    //     ? true
    //     : window.getSettingValue(SettingsKey.settingsSpellCheck);

    return (
      <>
        <BchatToggleWithDescription
          onClickToggle={async () => {
            window.setSettingValue(SettingsKey.settingsChatWithWallet, !chatwithWallet);
            forceUpdate();
          }}
          title={window.i18n('chatWithWallet')}
          description={''}
          active={chatwithWallet}
        />
        <ChangeChatFontSetting />
        <BchatToggleWithDescription
          onClickToggle={() => {
            dispatch(toggleAudioAutoplay());
            forceUpdate();
          }}
          title={window.i18n('audioMessageAutoplayTitle')}
          description={window.i18n('audioMessageAutoplayDescription')}
          active={audioAutoPlay}
        />
        {/* <BchatToggleWithDescription
          onClickToggle={() => {
            window.toggleSpellCheck();
            forceUpdate();
          }}
          title={window.i18n('spellCheckTitle')}
          description={window.i18n('spellCheckDescription')}
          active={isSpellCheckActive}
        /> */}
      </>
    );
  }
  return null;
};
