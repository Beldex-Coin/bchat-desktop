import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { dashboard } from '../../state/ducks/walletSection';
import { SpacerLG, SpacerMD } from '../basic/Text';
// import { wallet } from '../../wallet/wallet-rpc';
import { walletSettingsKey } from '../../data/settings-key';
import {
  updateDecimalValue,
  // updateSendAddress,
  // updateWalletPasswordPopUpFlag,
} from '../../state/ducks/walletConfig';
import { ProgressForSync } from './BchatWalletProgressForSync';
import { getHeight } from '../../state/selectors/walletConfig';
import { loadFiatCurrency, loadRecipient } from '../../wallet/BchatWalletHelper';
import { updateBchatWalletForgotPasswordModal } from '../../state/ducks/modalDialog';


export const WalletPassword = (props: any) => {
  const dispatch = useDispatch();
  let currentHeight: any;
  let daemonHeight: any;
  const currentDaemon = window.getSettingValue(walletSettingsKey.settingsCurrentDeamon);
  if (currentDaemon?.type === 'Local') {
    currentHeight = useSelector((state: any) => state.daemon.height);
    daemonHeight = Number(useSelector(getHeight));
  } else {
    currentHeight = Number(useSelector(getHeight));
    daemonHeight = useSelector((state: any) => state.daemon.height);
  }
  const { password, onChangePassword } = props;
  let pct: any =
    currentHeight == 0 || daemonHeight == 0 ? 0 : ((100 * currentHeight) / daemonHeight).toFixed(0);
  let percentage = pct == 100 && currentHeight < daemonHeight ? 99 : pct;
  function loadDecimal() {
    if (!window.getSettingValue(walletSettingsKey.settingsDecimal)) {
      let data: any = '2 - Two (0.00)';
      window.setSettingValue('decimal', data);
      dispatch(updateDecimalValue(data));
    } else {
      let data: any = window.getSettingValue(walletSettingsKey.settingsDecimal);
      dispatch(updateDecimalValue(data));
    }
  }
  loadDecimal();
  loadRecipient();
  loadFiatCurrency();

  if (daemonHeight > 0 && percentage < 99) {
    return (
      <ProgressForSync
        remainingHeight={daemonHeight - currentHeight}
        percentage={percentage}     
      />
    );
  }

  return (
    <div className="wallet-walletPassword">
      <div className="wallet-walletPassword-contentBox">
        <div className="wallet-walletPassword-contentBox-walletImg"></div>
        <SpacerMD />
        <div className="wallet-walletPassword-contentBox-headerBox">
          <span>{window.i18n('enterWalletPassword')}</span>
        </div>
        <SpacerMD />
        <div className="wallet-walletPassword-contentBox-inputBox">
          <input
            type="password"
            autoFocus={true}
            value={password}
            maxLength={16}
            placeholder="Enter wallet password"
            onChange={e => onChangePassword(e.target.value)}
          />
        </div>
        
        {props.from === 'wallet' && (<>
          <SpacerMD />
          <div className="wallet-walletPassword-contentBox-forgotTxt">
            <span onClick={() => {dispatch(updateBchatWalletForgotPasswordModal({}))}} style={{ cursor: 'pointer' }}>
              {window.i18n('forgotPassword')}
            </span>
          </div>
          </>
        )}
        <SpacerLG />
      </div>
    </div>
  );
};
