import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { dashboard } from '../../state/ducks/walletSection';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { SpacerLG, SpacerMD } from '../basic/Text';
import { BchatIcon, BchatIconButton } from '../icon';
import { wallet } from '../../wallet/wallet-rpc';
import { walletSettingsKey } from '../../data/settings-key';
import { updateDecimalValue, updateSendAddress } from '../../state/ducks/walletConfig';
import { ForgotPassword } from './BchatWalletForgotPassword';
import { ProgressForSync } from './BchatWalletProgressForSync';
import { getHeight } from '../../state/selectors/walletConfig';
import { loadFiatCurrency, loadRecipient } from '../../wallet/BchatWalletHelper';
import { ToastUtils } from '../../bchat/utils';
import { getConversationById } from '../../data/data';
import { UserUtils } from '../../bchat/utils';
import styled from 'styled-components';
import { useKey } from 'react-use';
import { updateBchatWalletPasswordModal } from '../../state/ducks/modalDialog';
import { daemon } from '../../wallet/daemon-rpc';

export const WalletPassword = (props: any) => {
  const [password, setValue] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.user.ourNumber);
  const UserDetails = useSelector((state: any) => state.conversations.conversationLookup);
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

  // let daemonHeight = useSelector((state: any) => state.daemon.height);
  // const currentHeight: any = Number(useSelector(getHeight));
  const Loader = styled.div`
    position: absolute;
    // top: 0;
    display: flex;
    // justify-content: center;
    /* width: 100%; */
    // width: 100Vw;
    // height: 100%;
    align-items: center;
    z-index: 101;
  `;
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

  useKey((event: KeyboardEvent) => {
    if (!forgotPassword && event.key === 'Enter') {
      submit();
    }
    return event.key === 'Enter';
  });

  async function submit() {
    if (!password) {
      return ToastUtils.pushToastError('passwordFieldEmpty', window.i18n('passwordFieldEmpty'));
    }
    let userDetails = await getConversationById(UserUtils.getOurPubKeyStrFromCache());
    let profileName = userDetails?.attributes.walletUserName;
    if (!profileName) {
      profileName = UserDetails[userId].profileName;
    }
    setLoading(true);
    // console.log('profileName ::', profileName, password);
    let openWallet: any = await wallet.openWallet(profileName, password);
    console.log('openWallet pass:', openWallet);
    if (openWallet.hasOwnProperty('error')) {
      setLoading(false);
      return ToastUtils.pushToastError('walletInvalidPassword', openWallet.error?.message);
    } else {
      await wallet.startHeartbeat('wallet');
      let emptyAddress: any = '';
      dispatch(updateSendAddress(emptyAddress));
      dispatch(updateBchatWalletPasswordModal(null));
      setLoading(false);
      await daemon.daemonHeartbeat();
      props.onClick();
      return;
      // return wallet.startHeartbeat();
      // dispatch(dashboard());
    }
  }

  if (forgotPassword) {
    return (
      <ForgotPassword
        cancelBtn={() => setForgotPassword(false)}
        showSyncScreen={() => setLoading(true)}
        // loginLoader={()=> setLoading(true)}
        exit={props.onClickClose}
      />
    );
  }
  // if (true) {
  console.log('currentHeight ::', currentHeight, 'daemonHeight ::', daemonHeight);
  if (daemonHeight > 0 && percentage < 99 && currentHeight > 0) {
    // setLoading(false)
    return (
      <ProgressForSync
        remainingHeight={daemonHeight - currentHeight}
        percentage={percentage}
        exit={props.onClickClose}
      />
    );
  }

  return (
    <div className="wallet-walletPassword">
      <div className="wallet-walletPassword-contentBox">
        {loading && (
          <Loader>
            <div className="wallet-walletPassword-contentBox-loader">
              <img
                src={'images/bchat/Load_animation.gif'}
                style={{ width: '150px', height: '150px' }}
              />
            </div>
          </Loader>
        )}
        <div className="exitBtn">
          <BchatIconButton
            iconType="exit"
            iconSize="small"
            onClick={props.onClickClose}
            dataTestId="modal-close-button"
          />
        </div>
        {/* <SpacerLG /> */}
        {/* <SpacerLG /> */}
        <div className="wallet-walletPassword-contentBox-walletImg"></div>
        <SpacerMD />
        <div className="wallet-walletPassword-contentBox-headerBox">
          <BchatIcon iconType="lock" iconSize={'small'} />
          <span>{window.i18n('enterWalletPassword')}</span>
        </div>
        <SpacerMD />
        <div className="wallet-walletPassword-contentBox-inputBox">
          <input type="password" value={password} onChange={e => setValue(e.target.value)} />
        </div>
        <SpacerMD />
        <div className="wallet-walletPassword-contentBox-forgotTxt">
          <span onClick={() => setForgotPassword(true)} style={{ cursor: 'pointer' }}>
            {window.i18n('forgotPassword')}
          </span>
        </div>
        <SpacerMD />
        <div>
          <BchatButton
            text={window.i18n('continue')}
            buttonType={BchatButtonType.BrandOutline}
            buttonColor={BchatButtonColor.Green}
            onClick={() => submit()}
          />
        </div>
        <SpacerLG />
      </div>
    </div>
  );
};
