// import { ipcRenderer, shell } from 'electron';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// tslint:disable-next-line: no-submodule-imports
import useUpdate from 'react-use/lib/useUpdate';
import { createOrUpdateItem, hasLinkPreviewPopupBeenDisplayed } from '../../../data/data';
import { SettingsKey } from '../../../data/settings-key';
import { ToastUtils } from '../../../bchat/utils';
import { updateConfirmModal } from '../../../state/ducks/modalDialog';
import { toggleAudioAutoplay } from '../../../state/ducks/userConfig';
import { getAudioAutoplay } from '../../../state/selectors/userConfig';
// import { isHideMenuBarSupported } from '../../../types/Settings';
import { BchatButtonColor } from '../../basic/BchatButton';

import {BchatToggleWithDescription } from '../BchatSettingListItem';

import { ZoomingBchatSlider } from '../ZoomingBchatSlider';

import { switchHtmlToDarkTheme, switchHtmlToLightTheme } from '../../../state/ducks/BchatTheme';

async function toggleLinkPreviews() {
  const newValue = !window.getSettingValue(SettingsKey.settingsLinkPreview);
  window.setSettingValue(SettingsKey.settingsLinkPreview, newValue);
  if (!newValue) {
    await createOrUpdateItem({ id: hasLinkPreviewPopupBeenDisplayed, value: false });
  } else {
    window.inboxStore?.dispatch(
      updateConfirmModal({
        title: window.i18n('linkPreviewsTitle'),
        message: window.i18n('linkPreviewsConfirmMessage'),
        okTheme: BchatButtonColor.Danger,
      })
    );
  }
}

async function toggleStartInTray() {
  try {
    const newValue = !(await window.getStartInTray());

    // make sure to write it here too, as this is the value used on the UI to mark the toggle as true/false
    window.setSettingValue(SettingsKey.settingsStartInTray, newValue);
    await window.setStartInTray(newValue);
    if (!newValue) {
      ToastUtils.pushRestartNeeded();
    }
  } catch (e) {
    window.log.warn('start in tray change error:', e);
  }
}

export const SettingsCategoryAppearance = (props: { hasPassword: boolean | null }) => {
  const dispatch = useDispatch();
  const forceUpdate = useUpdate();
  const audioAutoPlay = useSelector(getAudioAutoplay);

  if (props.hasPassword !== null) {
    // const isHideMenuBarActive =
    //   window.getSettingValue(SettingsKey.settingsMenuBar) === undefined
    //     ? true
    //     : window.getSettingValue(SettingsKey.settingsMenuBar);
const isdark =window.Events.getThemeSetting() === "dark"? true : false;
console.log('dark is true ::',window.Events.getThemeSetting());

    const isSpellCheckActive =
      window.getSettingValue(SettingsKey.settingsSpellCheck) === undefined
        ? true
        : window.getSettingValue(SettingsKey.settingsSpellCheck);

    const isLinkPreviewsOn = Boolean(window.getSettingValue(SettingsKey.settingsLinkPreview));
    const isStartInTrayActive = Boolean(window.getSettingValue(SettingsKey.settingsStartInTray));

    function handleClick()
    {
      const themeFromSettings = window.Events.getThemeSetting();
        const updatedTheme = themeFromSettings === 'dark' ? 'light' : 'dark';
        window.setTheme(updatedTheme);
        if (updatedTheme === 'dark') {
          switchHtmlToDarkTheme();
        } else {
          switchHtmlToLightTheme();
        }
    }

    return (
      <>
       {/* this function used for hide the menubar */}
        {/* {isHideMenuBarSupported() && (
          <BchatToggleWithDescription
            onClickToggle={() => {
              window.toggleMenuBar();
              forceUpdate();
            }}
            title={window.i18n('hideMenuBarTitle')}
            description={window.i18n('hideMenuBarDescription')}
            active={isHideMenuBarActive}
          />
        )} */}

        <BchatToggleWithDescription
          onClickToggle={() => {
            handleClick()
            
            forceUpdate();
          }}
          // title={window.i18n('spellCheckTitle')}
          title={"Dark Mode"}

          // description={window.i18n('spellCheckDescription')}
          active={isdark}
        />

        <BchatToggleWithDescription
          onClickToggle={() => {
            window.toggleSpellCheck();
            forceUpdate();
          }}
          title={window.i18n('spellCheckTitle')}
          description={window.i18n('spellCheckDescription')}
          active={isSpellCheckActive}
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
        <BchatToggleWithDescription
          onClickToggle={async () => {
            await toggleStartInTray();
            forceUpdate();
          }}
          title={window.i18n('startInTrayTitle')}
          // description={window.i18n('startInTrayDescription')}
          description={"BChat continues running in the background when you close the window"}
          active={isStartInTrayActive}
        />
        <BchatToggleWithDescription
          onClickToggle={() => {
            dispatch(toggleAudioAutoplay());
            forceUpdate();
          }}
          title={window.i18n('audioMessageAutoplayTitle')}
          description={window.i18n('audioMessageAutoplayDescription')}
          active={audioAutoPlay}
        />
        

        <ZoomingBchatSlider />
        {/* <BchatSettingButtonItem
          title={window.i18n('surveyTitle')}
          onClick={() => void shell.openExternal('https://bchat/survey')}
          buttonColor={BchatButtonColor.Primary}
          buttonText={window.i18n('goToOurSurvey')}
        /> */}

        {/* for message transtaled bchat site */}
        
        {/* <BchatSettingButtonItem
          title={window.i18n('helpUsTranslateBchat')}
          onClick={() => void shell.openExternal('https://crowdin.com/project/bchat-desktop/')}
          buttonColor={BchatButtonColor.Primary}
          // buttonText={window.i18n('translation')}
          buttonText={"Help us translate chat"}

        /> */}
        {/* <BchatSettingButtonItem
          onClick={() => {
            ipcRenderer.send('show-debug-log');
          }}
          buttonColor={BchatButtonColor.Primary}
          buttonText={window.i18n('showDebugLog')}
        /> */}
        {/* <BchatSettingButtonItem
          onClick={async () => {
            await fillWithTestData(100, 1000);
          }}
          buttonColor={BchatButtonColor.Primary}
          buttonText={'Spam fill DB using cached'}
        /> */}
      </>
    );
  }
  return null;
};
