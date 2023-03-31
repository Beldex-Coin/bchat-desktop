import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { walletSettingsKey } from '../../data/settings-key';
import { ChangePasswordModal, walletSettingMiniModal } from '../../state/ducks/modalDialog';
import { updateDecimalValue } from '../../state/ducks/walletConfig';
// import { dashboard } from '../../state/ducks/walletSection';
import { getwalletDecimalValue } from '../../state/selectors/walletConfig';
import { wallet } from '../../wallet/wallet-rpc';

import { Flex } from '../basic/Flex';
import { SpacerLG, SpacerXS } from '../basic/Text';
import { BchatIcon } from '../icon/BchatIcon';
import { NodeSetting } from './BchatWalletNodeSetting';
// import { showSettingsSection } from '../../state/ducks/section';
// import { BchatSettingCategory } from '../settings/BchatSettings';

export const WalletSettings = () => {
  const dispatch = useDispatch();
  const decimalValue = useSelector(getwalletDecimalValue);
  const priority = window.getSettingValue(walletSettingsKey.settingsPriority) || "Flash";
  const [priorityStatus, setPriorityStatus] = useState(priority)
  const [saveRecipient, setSaveRecipient] = useState(
    window.getSettingValue(walletSettingsKey.settingSaveRecipient)
  );
  const [nodeSetting, setNodeSetting] = useState(false);

  const syncProDone = window.getSettingValue('syncStatus');
  const [fiatCurrency, setFiatCurrency] = useState(
    window.getSettingValue(walletSettingsKey.settingsFiatCurrency)
  );
  const connectedDeamon = window.getSettingValue(walletSettingsKey.settingsCurrentDeamon);

  const currenyExt = [
    'AUD',
    'BRL',
    'CAD',
    'CHF',
    'CNY',
    'CZK',
    'EUR',
    'DKK',
    'GBP',
    'HKD',
    'HUF',
    'IDR',
    'ILS',
    'INR',
    'JPY',
    'KRW',
    'MXN',
    'MYR',
    'NOK',
    'NZD',
    'PHP',
    'PLN',
    'RUB',
    'SEK',
    'SGD',
    'THB',
    'USD',
    'VEF',
    'ZAR',
  ];
  const decimal = ['0 - Zero (0)', '2 - Two (0.00)', '3 - Three (0.000)', '4 - Four (0.0000)'];
  function changepass() {
    if (syncProDone) {
      dispatch(ChangePasswordModal({}));
    }
  }
  function enbaleOrdisableSaveRecipient() {
    window.setSettingValue(walletSettingsKey.settingSaveRecipient, !saveRecipient);

    setSaveRecipient(!saveRecipient);
  }
  if (nodeSetting) {
    return <div className='wallet'>
      <NodeSetting onClick={() => setNodeSetting(false)} />
    </div>
  }
  return (
    <div className="">
      {/* <div style={{ cursor: 'pointer' }}>
        <Flex container={true} alignItems="center">
          <div onClick={() => dispatch(dashboard())}>
            <BchatIcon iconType="walletBackArrow" iconSize={'huge'} iconColor={'#9393af'} />
          </div>
          <div className="wallet-addressBook-header-txt">{window.i18n('settingsHeader')}</div>
        </Flex>
      </div> */}
      <SpacerLG />
      <div className="wallet-settings-tabBox-subtle">{window.i18n('node')}</div>
      <SpacerXS />
      <div className="wallet-settings-tabBox">
        <div className="subBox">
          <Flex
            container={true}
            justifyContent="space-between"
            padding="10px 0"
            cursor="pointer"
            onClick={() => setNodeSetting(true)}
          >
            <div className="wallet-settings-tabBox-subtle">{window.i18n('nCurrentRPCTxt')}</div>
            <div style={{ cursor: 'pointer' }}>
              <span className="wallet-settings-tabBox-disableText">
                {connectedDeamon ? `${connectedDeamon?.host}:${connectedDeamon?.port}` : "Please check your internet connection"}
              </span>
              <BchatIcon iconSize="medium" iconType="chevron" iconRotation={270} />
            </div>
          </Flex>
        </div>
      </div>
      <SpacerLG />
      <div className="wallet-settings-tabBox-subtle">{window.i18n('WalletSettingsTitle')}</div>
      <SpacerXS />
      <div className="wallet-settings-tabBox">
        <div className="subBox">
          <Flex
            container={true}
            justifyContent="space-between"
            padding="10px 0"
            cursor="pointer"
            onClick={() =>
              dispatch(
                walletSettingMiniModal({
                  headerName: window.i18n('priority'),
                  content: ["Flash", 'Slow'],
                  currency:priorityStatus,
                  onClose: () => dispatch(walletSettingMiniModal(null)),
                  onClick: (e: any) => {
                    dispatch(walletSettingMiniModal(null));
                    window.setSettingValue(walletSettingsKey.settingsPriority, e);
                    setPriorityStatus(e)
                  },
                })
              )
            }
          >
            <div className="wallet-settings-tabBox-subtle">{window.i18n('priority')}</div>
            <div style={{ cursor: 'pointer' }}>
              <span className="wallet-settings-tabBox-disableText">{priorityStatus}</span>
              <BchatIcon iconSize="medium" iconType="chevron" iconRotation={270} />
            </div>
          </Flex>
        </div>
        <div className="subBox">
          <Flex
            container={true}
            justifyContent="space-between"
            padding="10px 0"
            cursor="pointer"
            onClick={() =>
              dispatch(
                walletSettingMiniModal({
                  headerName: window.i18n('decimals'),
                  content: decimal,
                  currency: decimalValue,
                  onClose: () => dispatch(walletSettingMiniModal(null)),
                  onClick: (e: any) => {
                    dispatch(walletSettingMiniModal(null));
                    window.inboxStore?.dispatch(updateDecimalValue(e));
                    window.setSettingValue(walletSettingsKey.settingsDecimal, e);
                  },
                })
              )
            }
          >
            <div className="wallet-settings-tabBox-subtle">{window.i18n('decimals')}</div>
            <div style={{ cursor: 'pointer' }}>
              <span className="wallet-settings-tabBox-disableText">{decimalValue}</span>
              <BchatIcon iconSize="medium" iconType="chevron" iconRotation={270} />
            </div>
          </Flex>
        </div>
        <div className="subBox">
          <Flex
            container={true}
            justifyContent="space-between"
            padding="10px 0"
            cursor="pointer"
            onClick={() =>
              dispatch(
                walletSettingMiniModal({
                  headerName: window.i18n('displayCurrency'),
                  content: currenyExt,
                  currency: fiatCurrency,
                  onClose: () => dispatch(walletSettingMiniModal(null)),
                  onClick: (e: any) => {
                    window.setSettingValue(walletSettingsKey.settingsFiatCurrency, e);
                    wallet.getFiatBalance(e);
                    setFiatCurrency(e);
                    dispatch(walletSettingMiniModal(null));
                  },
                })
              )
            }
          >
            <div className="wallet-settings-tabBox-subtle">{window.i18n('displayCurrency')}</div>
            <div style={{ cursor: 'pointer' }}>
              <span className="wallet-settings-tabBox-disableText">
                {window.getSettingValue(walletSettingsKey.settingsFiatCurrency)}
              </span>
              <BchatIcon iconSize="medium" iconType="chevron" iconRotation={270} />
            </div>
          </Flex>
        </div>
        <div className="subBox">
          <Flex
            container={true}
            justifyContent="space-between"
            padding="10px 0"
            cursor="pointer"
            onClick={() => enbaleOrdisableSaveRecipient()}
          >
            <div className="wallet-settings-tabBox-subtle">
              {window.i18n('saveRecipientAddress')}
            </div>
            <div>
              {saveRecipient ? (
                <BchatIcon
                  iconType="tickCircle"
                  iconColor="#FFF"
                  iconSize={16}
                  iconPadding={'3px'}
                  backgroundColor={'#159B24'}
                  borderRadius={'5px'}
                />
              ) : (
                <article className="wallet-settings-tabBox-checkBox"></article>
              )}
            </div>
          </Flex>
        </div>
      </div>

      <SpacerLG />

      <div className="wallet-settings-tabBox-subtle">{window.i18n('personal')}</div>
      <SpacerXS />
      <div className="wallet-settings-tabBox">
        <div className="subBox">
          <Flex
            container={true}
            justifyContent="space-between"
            padding="10px 0"
            cursor="pointer"
            onClick={() => changepass()}
          >
            <div className="wallet-settings-tabBox-subtle">{window.i18n('changePassword')}</div>
            <div style={{ cursor: syncProDone ? 'pointer' : 'not-allowed' }}>
              <BchatIcon iconSize="medium" iconType="chevron" iconRotation={270} />
            </div>
          </Flex>
        </div>
      </div>
    </div>
  );
};
