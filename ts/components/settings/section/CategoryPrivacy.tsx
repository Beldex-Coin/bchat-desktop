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
import { BchatIcon } from '../../icon';

const toggleCallMediaPermissions = async (triggerUIUpdate: () => void) => {
  const currentValue = window.getCallMediaPermissions();
  if (!currentValue) {
    window.inboxStore?.dispatch(
      updateConfirmModal({
        title:'Turn on Voice/Video Call',
        message: window.i18n('callMediaPermissionsDialogContent'),
        okTheme: BchatButtonColor.Primary,
        onClickOk: async () => {
          await window.toggleCallMediaPermissionsTo(true);
          triggerUIUpdate();
          CallManager.onTurnedOnCallMediaPermissions();
        },
        onClickCancel: async () => {
          await window.toggleCallMediaPermissionsTo(false);
          triggerUIUpdate();
        },
        iconShow: true,
        customIcon: <BchatIcon iconType='videoCall' iconSize={30} />
      })
    );
  } else {
    await window.toggleCallMediaPermissionsTo(false);
    triggerUIUpdate();
  }
};

export function displayPasswordModal(
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
        <div className="bgWrapper ">
          <BchatToggleWithDescription
            onClickToggle={() => {
              const old = Boolean(window.getSettingValue(SettingsKey.settingsTypingIndicator));
              window.setSettingValue(SettingsKey.settingsTypingIndicator, !old);
              forceUpdate();
            }}
            title={window.i18n('typingIndicatorsSettingTitle')}
            // description={window.i18n('typingIndicatorsSettingDescription')}
            description={window.i18n('typingIndicatorsSettingDescription')}
            active={Boolean(window.getSettingValue(SettingsKey.settingsTypingIndicator))}
            iconType="chatDots"
          />
          <BchatToggleWithDescription
            onClickToggle={async () => {
              await window.toggleMediaPermissions();
              forceUpdate();
            }}
            title={window.i18n('mediaPermissionsTitle')}
            description={window.i18n('mediaPermissionsDescription')}
            active={Boolean(window.getSettingValue('media-permissions'))}
            iconType="microphone"
          />
          <BchatToggleWithDescription
            onClickToggle={async () => {
              await toggleCallMediaPermissions(forceUpdate);
              forceUpdate();
            }}
            title={window.i18n('callMediaPermissionsTitle')}
            description={window.i18n('callMediaPermissionsDescription')}
            active={Boolean(window.getCallMediaPermissions())}
            iconType="privacyvideoCam"
          />
          <BchatToggleWithDescription
            onClickToggle={() => {
              dispatch(toggleMessageRequests());
            }}
            title={window.i18n('hideRequestBanner')}
            description={window.i18n('hideRequestBannerDescription')}
            active={useSelector(getHideMessageRequestBanner)}
            iconType="eye_closed"
          />
          <BchatToggleWithDescription
            onClickToggle={() => {
              const old = Boolean(window.getSettingValue(SettingsKey.settingsReadReceipt));
              window.setSettingValue(SettingsKey.settingsReadReceipt, !old);
              forceUpdate();
            }}
            title={window.i18n('readReceiptSettingTitle')}
            // description={window.i18n('readReceiptSettingDescription')}
            description={window.i18n('readReceiptSettingDescription')}
            active={window.getSettingValue(SettingsKey.settingsReadReceipt)}
            iconType="receipt"
          />
          <BchatToggleWithDescription
            onClickToggle={async () => {
              await toggleOpengroupPruning();
              forceUpdate();
            }}
            title={window.i18n('pruneSettingTitle')}
            description={window.i18n('pruneSettingDescription')}
            active={isOpengroupPruningEnabled}
            iconType="members"
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
            iconType="rotatedArrow"
          />
          {!props.hasPassword && (
            <BchatSettingButtonItem
              title={window.i18n('setAccountPasswordTitle')}
              // description={window.i18n('setAccountPasswordDescription')}
              description={window.i18n('setAccountPasswordDescription')}
              onClick={() => {
                displayPasswordModal('set', props.onPasswordUpdated);
              }}
              buttonColor={BchatButtonColor.Secondary}
              buttonText={window.i18n('setPassword')}
              dataTestId={'set-password-button'}
              iconType="lockWithDots"
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
        </div>
      </>
    );
  }
  return null;
};
