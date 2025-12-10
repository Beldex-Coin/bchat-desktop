import  { useState } from 'react';
// import { BchatRadioGroup } from '../basic/BchatRadioGroup';
import { BchatToggleWithDescription } from './BchatSettingListItem';
import { Constants } from '../../bchat';
import { BchatIcon } from '../icon';
import { SettingsKey } from '../../data/settings-key';
import { useUpdate } from 'react-use';
import { isAudioNotificationSupported } from '../../types/Settings';
import styled from 'styled-components';
import { SpacerLG, SpacerMD } from '../basic/Text';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { Notifications } from '../../util/notifications';
// import { BchatButtonIcon } from '../wallet/BchatWalletPaymentSection';
// import { BchatToggle } from '../basic/BchatToggle';

const StyledButtonContainer = styled.div`
  display: flex;
  width: min-content;
  flex-direction: column;
  padding-inline-start: var(--margins-lg);
  justify-content: center;
  align-items: center;
  width: 100%;
`;
export const BchatNotificationGroupSettings = (props: { hasPassword: boolean | null }) => {
  const initialItem = window.getSettingValue('notification-setting') || 'message';
  const initialAudioNotificationEnabled =
    window.getSettingValue(SettingsKey.settingsAudioNotification) || false;
  const forceUpdate = useUpdate();

  const [selected, setSelected] = useState(initialItem);
  if (props.hasPassword === null) {
    return null;
  }

  const items = [
    {
      label: window.i18n('nameAndMessage'),
      value: 'message',
    },
    {
      label: window.i18n('nameOnly'),
      value: 'name',
    },
    {
      label: window.i18n('noNameOrMessage'),
      value: 'count',
    },
    // {
    //   label: window.i18n('disableNotifications'),
    //   value: 'off',
    // },
  ];
  function notificationOption(item: any) {
    window.setSettingValue('notification-setting', item.value);
    setSelected(item.value);
  }
  function toggle() {
    if (selected === 'off') {
      window.setSettingValue('notification-setting', 'message');
      setSelected('message');
    } else {
      window.setSettingValue('notification-setting', 'off');
      setSelected('off');
    }
  }
  const onClickPreview = () => {
    if (selected === 'off') {
      return;
    }
    Notifications.addPreviewNotification({
      conversationId: `preview-notification-${Date.now()}`,
      message:
        items.find(m => m.value === selected)?.label ||
        window?.i18n?.('messageBody') ||
        'Message body',
      title: window.i18n('notificationPreview'),
      iconUrl: null,
      isExpiringMessage: false,
      messageSentAt: Date.now(),
    });
  };

  return (
    // <BchatSettingsItemWrapper inline={false}>
    <>
      <div className="notification-setting">
        {' '}
        <div className="notify-option-wrapper">
          <BchatToggleWithDescription
            onClickToggle={() => {
              toggle();
            }}
            title={window.i18n('notificationSettingsDialog')}
            // description={window.i18n('audioMessageAutoplayDescription')}
            active={selected !== 'off'}
            iconType="notifySet"
          />
          {selected !== 'off' &&
            items.map((item, i) => (
              <div
                className="bchat-settings-item-notification"
                key={i}
                onClick={() => notificationOption(item)}
              >
                <div
                  className={
                    selected !== item.value ? 'bchat-settings-item-notification-circle' : 'selected'
                  }
                >
                  {selected === item.value && (
                    <BchatIcon
                      iconType="circle"
                      iconSize={10}
                      iconColor={Constants.UI.COLORS.GREEN}
                    />
                  )}
                </div>
                <div className="bchat-settings-item-notification-title">{item.label}</div>
              </div>
            ))}
          {/* <BchatRadioGroup
        initialItem={initialItem}
        group={'notification-setting'}
        items={items}
        onClick={(selectedRadioValue: string) => {
          window.setSettingValue('notification-setting', selectedRadioValue);
        }}
      /> */}
        </div>
        <SpacerMD />
        {selected !== 'off' && isAudioNotificationSupported() && (
          <>
            <BchatToggleWithDescription
              onClickToggle={async () => {
                window.setSettingValue(
                  SettingsKey.settingsAudioNotification,
                  !initialAudioNotificationEnabled
                );
                forceUpdate();
              }}
              title={window.i18n('notificationSound')}
              // description={window.i18n('audioMessageAutoplayDescription')}
              active={window.getSettingValue(SettingsKey.settingsAudioNotification)}
              iconType="speaker"
            />

            <StyledButtonContainer>
              <SpacerLG />
              <BchatButton
                text={window.i18n('notificationPreview')}
                onClick={() => onClickPreview()}
                buttonColor={BchatButtonColor.Primary}
                buttonType={BchatButtonType.Brand}
              />
            </StyledButtonContainer>
          </>
        )}
      </div>
    </>
  );
};
