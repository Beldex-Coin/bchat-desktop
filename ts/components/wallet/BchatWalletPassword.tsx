import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dashboard } from '../../state/ducks/walletSection';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { SpacerLG, SpacerMD } from '../basic/Text';
import { BchatIcon } from '../icon';
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

export const WalletPassword = (props: any) => {
  const [password, setValue] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [progressing, setProgressing] = useState(false);
  // const [getPercentage, setPercentage] = useState(1);
  // const [getPercentage, setPercentage] = useState(1);
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.user.ourNumber);
  const UserDetails = useSelector((state: any) => state.conversations.conversationLookup);
  let daemonHeight = useSelector((state: any) => state.daemon.height);
  //  const currentDaemon= window.getSettingValue(walletSettingsKey.settingsCurrentDeamon)
  const currentHeight: any = Number(useSelector(getHeight));
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
    let openWallet: any = await wallet.openWallet(profileName, password);
    if (openWallet.hasOwnProperty('error')) {
      setLoading(false);

      ToastUtils.pushToastError('walletInvalidPassword', openWallet.error?.message);
    } else {
      let emptyAddress: any = '';
      dispatch(updateSendAddress(emptyAddress));
      setLoading(false);
      props.onClick();
      dispatch(dashboard());
    }
  }
  if (forgotPassword) {
    return (
      <ForgotPassword
        cancelBtn={() => setForgotPassword(false)}
        showSyncScreen={() => ProgressForSync(true)}
      />
    );
  }

  if (daemonHeight > 0 && percentage < 99) {
    return (
      <ProgressForSync remainingHeight={daemonHeight - currentHeight} percentage={percentage} />
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
        <SpacerLG />
        <SpacerLG />
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
