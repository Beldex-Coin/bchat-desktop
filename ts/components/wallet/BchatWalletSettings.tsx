import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { walletSettingsKey } from '../../data/settings-key';
import { ChangePasswordModal, walletSettingMiniModal } from '../../state/ducks/modalDialog';
import { updateDecimalValue } from '../../state/ducks/walletConfig';
import { dashboard, nodeSetting } from '../../state/ducks/walletSection';
import { getwalletDecimalValue } from '../../state/selectors/walletConfig';
import { wallet } from '../../wallet/wallet-rpc';

import { Flex } from '../basic/Flex';
import { SpacerLG, SpacerXS } from '../basic/Text';
// import { ModalContainer } from "../dialog/ModalContainer"
import { BchatIcon } from '../icon/BchatIcon';
// import { ChangePassword } from "./BchatWalletChangePassword"
// import { WalletModal } from "./BchatWalletModal"

export const WalletSettings = () => {
  const dispatch = useDispatch();
  const exeCurrency: any = localStorage.getItem('currency');
  const decimalValue = useSelector(getwalletDecimalValue);
  const [saveRecipient, setSaveRecipient] = useState(
    window.getSettingValue(walletSettingsKey.settingSaveRecipient)
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
    'ZAR'
  ];
  const decimal = ['2 - Two (0.00)', '3 - Three (0.000)', '4 - Four (0.0000)'];
  function enbaleOrdisableSaveRecipient() {
    window.setSettingValue(walletSettingsKey.settingSaveRecipient, !saveRecipient);

    setSaveRecipient(!saveRecipient);
  }
  // let content=[window.i18n("usdCurrency"),window.i18n("audCurrency"),window.i18n("bgnCurrency")]
  return (
    <div className="">
      {/* <WalletModal headerName={window.i18n('displayCurrency')} content={content} /> */}
      {/* <WalletModal headerName={window.i18n('displayCurrency')} content={content} /> */}

      {/* <ModalContainer /> */}
      <div onClick={() => dispatch(dashboard())} style={{ cursor: 'pointer' }}>
        <Flex container={true} alignItems="center">
          <BchatIcon iconType="walletBackArrow" iconSize={'huge'} iconColor={'#9393af'}/>
          <div className="wallet-addressBook-header-txt">{window.i18n('settingsHeader')}</div>
        </Flex>
      </div>
      <SpacerLG />
      <div className="wallet-settings-tabBox-subtle">{window.i18n('node')}</div>
      <SpacerXS />
      <div className="wallet-settings-tabBox">
        <Flex container={true} justifyContent="space-between" padding="10px 0">
          <div className="wallet-settings-tabBox-subtle">{window.i18n('nCurrentRPCTxt')}</div>
          <div onClick={() => dispatch(nodeSetting())} style={{ cursor: 'pointer' }}>
            <span className="wallet-settings-tabBox-disableText">
              {connectedDeamon.host}:{connectedDeamon.port}
            </span>
            <BchatIcon iconSize="medium" iconType="chevron" iconRotation={270} />
          </div>
        </Flex>
      </div>
      <SpacerLG />
      <div className="wallet-settings-tabBox-subtle">{window.i18n('WalletSettingsTitle')}</div>
      <SpacerXS />
      <div className="wallet-settings-tabBox">
        <Flex container={true} justifyContent="space-between" padding="10px 0">
          <div className="wallet-settings-tabBox-subtle">{window.i18n('decimals')}</div>
          <div
            style={{ cursor: 'pointer' }}
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
            <span className="wallet-settings-tabBox-disableText">{decimalValue}</span>
            <BchatIcon iconSize="medium" iconType="chevron" iconRotation={270} />
          </div>
        </Flex>

        {/* <SpacerMD /> */}
        <Flex container={true} justifyContent="space-between" padding="10px 0">
          <div className="wallet-settings-tabBox-subtle">{window.i18n('displayCurrency')}</div>
          <div
            style={{ cursor: 'pointer' }}
            onClick={() =>
              dispatch(
                walletSettingMiniModal({
                  headerName: window.i18n('displayCurrency'),
                  content: currenyExt,
                  currency: exeCurrency,
                  onClose: () => dispatch(walletSettingMiniModal(null)),
                  onClick: (e: any) => {
                    localStorage.setItem('currency', e);
                    wallet.getFiatBalance(e);
                    dispatch(walletSettingMiniModal(null));
                  },
                })
              )
            }
          >
            <span className="wallet-settings-tabBox-disableText">{exeCurrency}</span>
            <BchatIcon iconSize="medium" iconType="chevron" iconRotation={270} />
          </div>
        </Flex>
        {/* <SpacerMD /> */}
        <Flex container={true} justifyContent="space-between" padding="10px 0">
          <div className="wallet-settings-tabBox-subtle">{window.i18n('saveRecipientAddress')}</div>
          <div onClick={() => enbaleOrdisableSaveRecipient()}>
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

      <SpacerLG />

      <div className="wallet-settings-tabBox-subtle">{window.i18n('personal')}</div>
      <SpacerXS />
      <div className="wallet-settings-tabBox">
        <Flex container={true} justifyContent="space-between" padding="10px 0">
          <div className="wallet-settings-tabBox-subtle">{window.i18n('changePassword')}</div>
          <div onClick={() => dispatch(ChangePasswordModal({}))} style={{ cursor: 'pointer' }}>
            {/* <span className="wallet-settings-tabBox-disableText">mainnet.beldex.io:29095</span>  */}
            <BchatIcon iconSize="medium" iconType="chevron" iconRotation={270} />
          </div>
        </Flex>
      </div>
    </div>
  );
};
