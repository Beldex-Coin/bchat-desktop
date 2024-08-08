import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ToastUtils } from '../../bchat/utils';
import { getFiatBalance } from '../../state/selectors/walletConfig';
import { SpacerSM, SpacerXS } from '../basic/Text';
import { BchatIcon } from '../icon/BchatIcon';
import { BchatToolTip } from '../leftpane/ActionsPanel';
import { walletSettingsKey } from '../../data/settings-key';
import { Flex } from '../basic/Flex';
import { BchatIconButton } from '../icon';
const { clipboard } = require('electron');

export const WalletBalanceSection = () => {
  const walletDetails = useSelector((state: any) => state.wallet);
  const walletAddress: any = localStorage.getItem('userAddress');
  // const sliceWalletAddress = walletAddress ? walletAddress.slice(0, 45) : '';
  const currency: any = window.getSettingValue(walletSettingsKey.settingsFiatCurrency);
  const fiatBalance: any = Number(useSelector(getFiatBalance));
  const [amountVisible, setAmountVisible] = useState(window.getSettingValue('balancevisibility'));
  const zoomLevel = window.getSettingValue('zoom-factor-setting');

  let decimalValue: any =
    window.getSettingValue(walletSettingsKey.settingsDecimal) || '2 - Two (0.00)';
  decimalValue = decimalValue.charAt(0);
  const handlePaste = () => {
    clipboard.writeText(walletAddress, 'clipboard');
    ToastUtils.pushCopiedToClipBoard();
  };

  function disableBalac(values: string | Number) {
    if (amountVisible) {
      return values;
    }
    let txt: any = String(values);
    let sliptStr = txt.split('');
    let dataArray = '';
    sliptStr.length > 0 &&
      sliptStr.map((item: any) => {
        if (item === '.') {
          dataArray = dataArray + '.';
          return;
        }
        dataArray = dataArray + '*';
      });
    return dataArray;
  }
  return (
    <div className="wallet-squarBox-bala" style={zoomLevel > 100 ? { width: '52%' } : {}}>
      <div className="innerWrapper">
        <Flex container={true} flexDirection="row" justifyContent="space-between">
          <div>
            <div className="flexCenter">
              <BchatIcon iconSize={24} iconType="wallet" />
              {/* <span className="marginLeft"></span> */}
              <div className="wallet-left-balance-Sec-balanceTxt marginLeft">
                {disableBalac((walletDetails.balance / 1e9).toFixed(decimalValue))}{' '}
                <span className="marginRight" style={{ color: '#128b17' }}>
                  BDX
                </span>
              </div>
              <span
                onClick={() => {
                  setAmountVisible(!amountVisible);
                  window.setSettingValue('balancevisibility', !amountVisible);
                }}
                style={{ cursor: 'pointer', marginBottom: '6px' }}
              >
                <BchatIcon iconSize={18} iconType={!amountVisible ? 'eye' : 'eye_closed'} />
              </span>
            </div>
            <Flex
              container={true}
              flexDirection="row"
              alignItems="center"
              className="wallet-left-balance-Sec"
            >
              <div className="currencyExt">{currency}</div>
              <div className="currencyVal">
                {disableBalac((fiatBalance / 1e9).toFixed(decimalValue))}{' '}
              </div>
            </Flex>
          </div>

          <div className="wallet-right-Button-Sec-unlockbal-box">
            <div>
              <span className="wallet-right-Button-Sec-unlockbal-box--Text">Unlocked Balance</span>
            </div>
            <Flex container={true} justifyContent="flex-end">
              <span className="unBalance">
                {disableBalac((walletDetails.unlocked_balance / 1e9).toFixed(decimalValue))} BDX
              </span>
              {/* <span className="bdx">BDX</span>{' '} */}
            </Flex>
          </div>
        </Flex>

        <SpacerXS />
        <SpacerSM />
        <div className="wallet-myAddress-Box">
          <div className="wallet-myAddress-Box-content">
            <div className='addres-title'>Beldex Address</div>
            <div className='address-txt'>{walletAddress}</div>
          </div>

          <div
            className="wallet-myAddress-Box-copyIcon-box"
            data-tip="Copy"
            data-place="right"
            data-offset="{'top':30,'left':15}"
          >
            <BchatIconButton
              iconType="copy"
              iconSize={20}
              iconColor='#00A638'
              onClick={handlePaste}
              clipRule="evenodd"
              fillRule="evenodd"
            />
          </div>
          <BchatToolTip place="top" effect="solid" />
        </div>
      </div>
    </div>
  );
};
