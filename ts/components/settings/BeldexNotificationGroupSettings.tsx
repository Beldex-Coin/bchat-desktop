import React, { useState } from 'react';
// import { BchatRadioGroup } from '../basic/BchatRadioGroup';
import { BchatToggleWithDescription } from './BchatSettingListItem';
import { Constants } from '../../bchat';
import { BchatIcon } from '../icon';
// import { BchatToggle } from '../basic/BchatToggle';


export const BchatNotificationGroupSettings = (props: { hasPassword: boolean | null }) => {
  const initialItem = window.getSettingValue('notification-setting') || 'message';

  const [selected, setSelected] = useState(initialItem)
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
    setSelected(item.value)
  }
  function toggle() {
    if (selected === 'off') {
      window.setSettingValue('notification-setting', 'message');
      setSelected('message')
    }
    else {
      window.setSettingValue('notification-setting', 'off');
      setSelected('off')
    }

  }
  return (
    // <BchatSettingsItemWrapper inline={false}>
    <div className={'bchat-settings-item'} style={{ padding:'0 0 10px 0' }}>
      <BchatToggleWithDescription
        onClickToggle={() => {
          toggle()
        }}
        title={window.i18n('notificationSettingsDialog')}
        // description={window.i18n('audioMessageAutoplayDescription')}
        active={selected !== 'off'}
      />
      {selected !== 'off' && items.map((item, i) =>
        <div className='bchat-settings-item-notification'
          key={i}
          onClick={() => notificationOption(item)}>
          <div
            className={selected !== item.value ? 'bchat-settings-item-notification-circle' : "selected"}
          >
            {selected === item.value && <BchatIcon iconType="circle" iconSize={10} iconColor={Constants.UI.COLORS.GREEN} />}
          </div>
          <div className='bchat-settings-item-notification-title'>
            {item.label}
          </div>
        </div>
      )}


      {/* <BchatRadioGroup
        initialItem={initialItem}
        group={'notification-setting'}
        items={items}
        onClick={(selectedRadioValue: string) => {
          window.setSettingValue('notification-setting', selectedRadioValue);
        }}
      /> */}
    </div>
  );
};



