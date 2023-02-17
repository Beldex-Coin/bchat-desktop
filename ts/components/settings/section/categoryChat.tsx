import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useUpdate from 'react-use/lib/useUpdate';
import { createOrUpdateItem } from '../../../data/channelsItem';
import { hasLinkPreviewPopupBeenDisplayed } from '../../../data/data';
import { SettingsKey } from '../../../data/settings-key';
import { updateConfirmModal } from '../../../state/ducks/modalDialog';
import { toggleAudioAutoplay } from '../../../state/ducks/userConfig';
import { getAudioAutoplay } from '../../../state/selectors/userConfig';
import { BchatButtonColor } from '../../basic/BchatButton';
import { BchatToggleWithDescription } from '../BchatSettingListItem';
import { ChangeChatFontSetting } from '../ChangeChatFontSetting';

export const SettingsCategoryChat = (props: { hasPassword: boolean | null }) => {
  const dispatch = useDispatch();
  const forceUpdate = useUpdate();
  const audioAutoPlay = useSelector(getAudioAutoplay);
  const chatwithWallet = window.getSettingValue(SettingsKey.settingsChatWithWallet) || false;
  const isLinkPreviewsOn = Boolean(window.getSettingValue(SettingsKey.settingsLinkPreview));

  if (props.hasPassword !== null) {
    // const isSpellCheckActive =
    //   window.getSettingValue(SettingsKey.settingsSpellCheck) === undefined
    //     ? true
    //     : window.getSettingValue(SettingsKey.settingsSpellCheck);

    async function toggleLinkPreviews() {
      const newValue = !window.getSettingValue(SettingsKey.settingsLinkPreview);
      if (!newValue) {
        window.setSettingValue(SettingsKey.settingsLinkPreview, newValue);
        await createOrUpdateItem({ id: hasLinkPreviewPopupBeenDisplayed, value: false });
      } else {
        window.inboxStore?.dispatch(
          updateConfirmModal({
            title: window.i18n('linkPreviewsTitle'),
            message: window.i18n('linkPreviewsConfirmMessage'),
            okTheme: BchatButtonColor.Danger,
            onClickOk: () => {
              window.setSettingValue(SettingsKey.settingsLinkPreview, newValue);
              forceUpdate();
            },
          })
        );
      }
    }

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
        <BchatToggleWithDescription
          onClickToggle={async () => {
            await toggleLinkPreviews();
            forceUpdate();
          }}
          title={window.i18n('linkPreviewsTitle')}
          description={window.i18n('linkPreviewDescription')}
          active={isLinkPreviewsOn}
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
