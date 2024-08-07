import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useUpdate from 'react-use/lib/useUpdate';
import { createOrUpdateItem } from '../../../data/channelsItem';
import { hasLinkPreviewPopupBeenDisplayed } from '../../../data/data';
import { SettingsKey } from '../../../data/settings-key';
import { updateBchatAlertConfirmModal, updateConfirmModal } from '../../../state/ducks/modalDialog';
import { toggleAudioAutoplay } from '../../../state/ducks/userConfig';
import { getAudioAutoplay } from '../../../state/selectors/userConfig';
import { BchatButtonColor } from '../../basic/BchatButton';
import { BchatToggleWithDescription } from '../BchatSettingListItem';
import { ChangeChatFontSetting } from '../ChangeChatFontSetting';
import { updatewalletSyncBarShowInChat } from '../../../state/ducks/walletConfig';

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
            okTheme: BchatButtonColor.Primary,
            onClickOk: () => {
              window.setSettingValue(SettingsKey.settingsLinkPreview, newValue);
              forceUpdate();
            },
          })
        );
      }
    }

    function chatWithWallet() {
      window.setSettingValue(SettingsKey.settingsChatWithWallet, !chatwithWallet);
      // let contional:any=chatwithWallet;
      // console.log('contional::',contional)
      // dispatch(updateWalletSyncInitiatedWithChat(contional)) ;
      let data: any = false;

      dispatch(updatewalletSyncBarShowInChat(data));
      // dispatch(updateWalletPasswordPopUpFlag(data))
      // window.setSettingValue(SettingsKey.settingChatwithWalletInstruction,false)

      forceUpdate();
    }

    function dispatchConfirmModal() {
      if (!chatwithWallet) {
        dispatch(
          updateBchatAlertConfirmModal({
            settings: true,
            onClickOk: async () => {
              chatWithWallet();
              dispatch(updateBchatAlertConfirmModal(null));
            },
            onClickCancel: () => dispatch(updateBchatAlertConfirmModal(null)),
          })
        );
      } else {
        chatWithWallet();
      }
    }

    return (
      <>
        <div className='bgWrapper'> 
          {' '}
          <BchatToggleWithDescription
            onClickToggle={() => dispatchConfirmModal()}
            title={window.i18n('chatWithWallet')}
            description={window.i18n('chatWithWalletDisc')}
            active={chatwithWallet}
            iconType={'chatWithLogo'}
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
            iconType="microphone"
          />
          <BchatToggleWithDescription
            onClickToggle={async () => {
              await toggleLinkPreviews();
              forceUpdate();
            }}
            title={window.i18n('linkPreviewsTitle')}
            description={window.i18n('linkPreviewDescription')}
            active={isLinkPreviewsOn}
            iconType="chainLink"
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
        </div>
      </>
    );
  }
  return null;
};
