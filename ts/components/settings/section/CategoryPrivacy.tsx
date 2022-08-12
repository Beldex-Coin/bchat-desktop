import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// tslint:disable-next-line: no-submodule-imports
import useUpdate from 'react-use/lib/useUpdate';
import { SettingsKey } from '../../../data/settings-key';
import { CallManager, ToastUtils } from '../../../bchat/utils';
import { bchatPassword, updateConfirmModal } from '../../../state/ducks/modalDialog';
import { toggleMessageRequests } from '../../../state/ducks/userConfig';
import { getHideMessageRequestBanner } from '../../../state/selectors/userConfig';
import { BchatButtonColor } from '../../basic/BchatButton';
import { PasswordAction } from '../../dialog/BchatPasswordDialog';

import { BchatSettingButtonItem, BchatToggleWithDescription } from '../BchatSettingListItem';

const toggleCallMediaPermissions = async (triggerUIUpdate: () => void) => {
  const currentValue = window.getCallMediaPermissions();
  if (!currentValue) {
    window.inboxStore?.dispatch(
      updateConfirmModal({
        message: window.i18n('callMediaPermissionsDialogContent'),
        okTheme: BchatButtonColor.Danger,
        onClickOk: async () => {
          await window.toggleCallMediaPermissionsTo(true);
          triggerUIUpdate();
          CallManager.onTurnedOnCallMediaPermissions();
        },
        onClickCancel: async () => {
          await window.toggleCallMediaPermissionsTo(false);
          triggerUIUpdate();
        },
      })
    );
  } else {
    await window.toggleCallMediaPermissionsTo(false);
    triggerUIUpdate();
  }
};

function displayPasswordModal(
  passwordAction: PasswordAction,
  onPasswordUpdated: (action: string) => void
) {
  window.inboxStore?.dispatch(
    bchatPassword({
      passwordAction,
      onOk: () => {
        onPasswordUpdated(passwordAction);
      },
    })
  );
}

async function toggleOpengroupPruning() {
  try {
    const newValue = !(await window.getOpengroupPruning());

    // make sure to write it here too, as this is the value used on the UI to mark the toggle as true/false
    window.setSettingValue(SettingsKey.settingsOpengroupPruning, newValue);
    await window.setOpengroupPruning(newValue);
    ToastUtils.pushRestartNeeded();
  } catch (e) {
    window.log.warn('toggleOpengroupPruning change error:', e);
  }
}

export const SettingsCategoryPrivacy = (props: {
  hasPassword: boolean | null;
  onPasswordUpdated: (action: string) => void;
}) => {
  const forceUpdate = useUpdate();
  const dispatch = useDispatch();
  const isOpengroupPruningEnabled = Boolean(
    window.getSettingValue(SettingsKey.settingsOpengroupPruning)
  );
  if (props.hasPassword !== null) {
    return (
      <>
        <BchatToggleWithDescription
          onClickToggle={async () => {
            await window.toggleMediaPermissions();
            forceUpdate();
          }}
          title={window.i18n('mediaPermissionsTitle')}
          description={window.i18n('mediaPermissionsDescription')}
          active={Boolean(window.getSettingValue('media-permissions'))}
        />
        <BchatToggleWithDescription
          onClickToggle={async () => {
            await toggleCallMediaPermissions(forceUpdate);
            forceUpdate();
          }}
          title={window.i18n('callMediaPermissionsTitle')}
          description={window.i18n('callMediaPermissionsDescription')}
          active={Boolean(window.getCallMediaPermissions())}
        />

        <BchatToggleWithDescription
          onClickToggle={() => {
            const old = Boolean(window.getSettingValue(SettingsKey.settingsReadReceipt));
            window.setSettingValue(SettingsKey.settingsReadReceipt, !old);
            forceUpdate();
          }}
          title={window.i18n('readReceiptSettingTitle')}
          // description={window.i18n('readReceiptSettingDescription')}
          description={"See and share when messages have been read (enables read receipts in all chat)."}

          active={window.getSettingValue(SettingsKey.settingsReadReceipt)}
        />
        <BchatToggleWithDescription
          onClickToggle={() => {
            const old = Boolean(window.getSettingValue(SettingsKey.settingsTypingIndicator));
            window.setSettingValue(SettingsKey.settingsTypingIndicator, !old);
            forceUpdate();
          }}
          title={window.i18n('typingIndicatorsSettingTitle')}
          // description={window.i18n('typingIndicatorsSettingDescription')}
          description={"See and share when messages are being typed (applies to all chat)."}
          active={Boolean(window.getSettingValue(SettingsKey.settingsTypingIndicator))}
        />
        <BchatToggleWithDescription
          onClickToggle={() => {
            const old = Boolean(window.getSettingValue(SettingsKey.settingsAutoUpdate));
            window.setSettingValue(SettingsKey.settingsAutoUpdate, !old);
            forceUpdate();
          }}
          title={window.i18n('autoUpdateSettingTitle')}
          description={window.i18n('autoUpdateSettingDescription')}
          active={Boolean(window.getSettingValue(SettingsKey.settingsAutoUpdate))}
        />
        <BchatToggleWithDescription
          onClickToggle={() => {
            dispatch(toggleMessageRequests());
          }}
          title={window.i18n('hideRequestBanner')}
          description={window.i18n('hideRequestBannerDescription')}
          active={useSelector(getHideMessageRequestBanner)}
        />
        <BchatToggleWithDescription
          onClickToggle={async () => {
            await toggleOpengroupPruning();
            forceUpdate();
          }}
          title={window.i18n('pruneSettingTitle')}
          description={window.i18n('pruneSettingDescription')}
          active={isOpengroupPruningEnabled}
        />
        {!props.hasPassword && (
          <BchatSettingButtonItem
            title={window.i18n('setAccountPasswordTitle')}
            // description={window.i18n('setAccountPasswordDescription')}
            description={"Require password to unlock BChat’s screen. you can still receive message notifications while screen lock is enabled. BChat’s notification settings allow you to customize information that is displayed"}

            onClick={() => {
              displayPasswordModal('set', props.onPasswordUpdated);
            }}
            buttonColor={BchatButtonColor.Primary}
            buttonText={window.i18n('setPassword')}
            dataTestId={'set-password-button'}
          />
        )}
        {props.hasPassword && (
          <BchatSettingButtonItem
            title={window.i18n('changeAccountPasswordTitle')}
            description={window.i18n('changeAccountPasswordDescription')}
            onClick={() => {
              displayPasswordModal('change', props.onPasswordUpdated);
            }}
            buttonColor={BchatButtonColor.Primary}
            buttonText={window.i18n('changePassword')}
          />
        )}
        {props.hasPassword && (
          <BchatSettingButtonItem
            title={window.i18n('removeAccountPasswordTitle')}
            // description={window.i18n('removeAccountPasswordDescription')}
            description={window.i18n('removeAccountPasswordDescription')}

            onClick={() => {
              displayPasswordModal('remove', props.onPasswordUpdated);
            }}
            buttonColor={BchatButtonColor.Danger}
            buttonText={window.i18n('removePassword')}
          />
        )}
      </>
    );
  }
  return null;
};
