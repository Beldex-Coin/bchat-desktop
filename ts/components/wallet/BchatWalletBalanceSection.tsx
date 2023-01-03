import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ToastUtils } from '../../bchat/utils';
import { getFiatBalance } from '../../state/selectors/walletConfig';
import { SpacerMD, SpacerSM, SpacerXS } from '../basic/Text';
import { BchatIcon } from '../icon/BchatIcon';
import { BchatToolTip } from '../leftpane/ActionsPanel';
import { walletSettingsKey } from '../../data/settings-key';
const { clipboard } = require('electron');

export const WalletBalanceSection = () => {
  const walletDetails = useSelector((state: any) => state.wallet);
  const walletAddress: any = localStorage.getItem('userAddress');
  const sliceWalletAddress = walletAddress ? walletAddress.slice(0, 45) : '';
  const currency: any = window.getSettingValue(walletSettingsKey.settingsFiatCurrency);
  const fiatBalance: any = Number(useSelector(getFiatBalance));
  const [amountVisible, setAmountVisible] = useState(window.getSettingValue('balancevisibility'));
  // let decimalValue: any = useSelector(getwalletDecimalValue);
  let decimalValue: any = window.getSettingValue(walletSettingsKey.settingsDecimal);
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
    <div className="wallet-squarBox">
      <div style={{ display: 'flex' }}>
        <div className="wallet-left-balance-Sec">
          <SpacerXS />

          <div className="flexCenter">
            <BchatIcon iconSize={13} iconType="wallet" />
            <span className="marginLeft">Balance</span>
          </div>
          <SpacerSM />
          <div className="wallet-left-balance-Sec-balanceTxt">
            {disableBalac((walletDetails.balance / 1e9).toFixed(decimalValue))}{' '}
            <span className="marginRight" style={{ color: '#128b17' }}>
              BDX
            </span>
            <span
              onClick={() => {
                setAmountVisible(!amountVisible);
                window.setSettingValue('balancevisibility',!amountVisible);
              }}
              style={{cursor:'pointer'}}
            >
              <BchatIcon iconSize="medium" iconType={amountVisible ? 'eye_closed' : 'eye'} />
            </span>
          </div>
          <div className="wallet-left-balance-Sec-realCurrencyTxt">
            {disableBalac((fiatBalance / 1e9).toFixed(decimalValue))} <span>{currency}</span>
          </div>
        </div>
        <div className="wallet-right-Button-Sec">
          <SpacerXS />
          {/* <div className="wallet-right-Button-Sec-fetch-btn">
            <BchatIcon iconSize="tiny" iconType="fetch" />
            <span style={{ marginLeft: '2px' }}>Fetch Balance & Txn</span>
          </div> */}
          <SpacerSM />

          <div className="wallet-right-Button-Sec-unlockbal-box">
            <span className="wallet-right-Button-Sec-unlockbal-box--Text">Unlocked</span>
            <span className="wallet-right-Button-Sec-unlockbal-box--verticalLine"></span>
            <span className="unBalance">
              {disableBalac((walletDetails.unlocked_balance / 1e9).toFixed(decimalValue))}
            </span>
          </div>
        </div>
      </div>
      <SpacerMD />
      <div className="wallet-myAddress-Box">
        <div className="wallet-myAddress-Box-content">{`${sliceWalletAddress}...`}</div>
        <div
          className="wallet-myAddress-Box-copyIcon-box"
          onClick={handlePaste}
          data-tip="Copy"
          data-place="right"
          data-offset="{'top':30,'left':15}"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 18.151 18.151"
          >
            <path
              id="copy_icon"
              d="M3.815,2A1.815,1.815,0,0,0,2,3.815V16.521H3.815V3.815H16.521V2Zm3.63,3.63A1.815,1.815,0,0,0,5.63,7.445V18.336a1.815,1.815,0,0,0,1.815,1.815H18.336a1.815,1.815,0,0,0,1.815-1.815V7.445A1.815,1.815,0,0,0,18.336,5.63Zm0,1.815H18.336V18.336H7.445Z"
              transform="translate(-2 -2)"
            />
          </svg>
        </div>
        <BchatToolTip place="top" effect="solid" />
      </div>
    </div>
  );
};
