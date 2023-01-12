import React, { useState } from 'react';
import { pushToastError, pushToastSuccess } from '../../bchat/utils/Toast';
import { useDispatch, useSelector } from 'react-redux';
import { dashboard } from '../../state/ducks/walletSection';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { SpacerLG, SpacerMD } from '../basic/Text';
import { BchatIcon } from '../icon';
import { wallet } from '../../wallet/wallet-rpc';
import { walletSettingsKey } from '../../data/settings-key';
import { updateDecimalValue } from '../../state/ducks/walletConfig';
import { ForgotPassword } from './BchatWalletForgotPassword';
import { ProgressForSync } from './BchatWalletProgressForSync';
import { getHeight } from '../../state/selectors/walletConfig';
import { loadFiatCurrency, loadRecipient } from '../../wallet/BchatWalletHelper';
import { ToastUtils } from '../../bchat/utils';
import { getConversationById } from '../../data/data';
import { UserUtils } from '../../bchat/utils';

export const WalletPassword = (props: any) => {
  const [password, setValue] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  // const [progressing, setProgressing] = useState(false);
  // const [getPercentage, setPercentage] = useState(1);
  // const [getPercentage, setPercentage] = useState(1);
  const dispatch = useDispatch();
  // const userId = useSelector((state: any) => state.user.ourNumber);
  // const UserDetails = useSelector((state: any) => state.conversations.conversationLookup);
  let daemonHeight = useSelector((state: any) => state.daemon.height);
  const currentHeight: any = Number(useSelector(getHeight));
  let pct: any =
    currentHeight == 0 || daemonHeight == 0 ? 0 : ((100 * currentHeight) / daemonHeight).toFixed(0);
  let percentage = pct == 100 && currentHeight < daemonHeight ? 99 : pct;
  // console.log('percentage:', percentage, currentHeight, daemonHeight);
  // if (percentage != 0) {
  //   setPercentage(percentage);
  // }
  // console.log('get_percentage:', getPercentage);
  // console.log('progressing:', progressing);

  // if (!progressing) {
  //   if (
  //     daemonHeight != 0 &&
  //     currentHeight != 0 &&
  //     daemonHeight !== currentHeight &&
  //     percentage < 99
  //     percentage !== 99
  //   ) {
  //     console.log('nottt');
  //     setProgressing(true);
  //   }
  // }
  // if (progressing) {
  //   if (daemonHeight != 0 && currentHeight != 0 && daemonHeight===currentHeight) {
  //     setProgressing(false);
  //   }
  // }
  // console.log('setProgressing:', progressing);
  //   if (daemonHeight != 0 && currentHeight != 0 && daemonHeight == 99) {
  // setProgressing(false);
  //   }
  // }

  // console.log('setProgressing:', progressing);
  function loadDecimal() {
    if (!window.getSettingValue(walletSettingsKey.settingsDecimal)) {
      let data: any = '2 - Two (0.00)';
      window.setSettingValue('decimal', data);
      dispatch(updateDecimalValue(data));
    } else {
      let data: any = window.getSettingValue(walletSettingsKey.settingsDecimal);
      dispatch(updateDecimalValue(data));
    }

    // window.setSettingValue("save-recipient", false);
  }
  loadDecimal();
  loadRecipient();
  loadFiatCurrency();

  async function submit() {
    if(!password){
      return ToastUtils.pushToastError('passwordFieldEmpty', window.i18n('passwordFieldEmpty'));
    }

    let userDetails=await getConversationById(UserUtils.getOurPubKeyStrFromCache())

    let profileName = userDetails?.attributes.walletUserName;
    let openWallet: any = await wallet.openWallet(profileName, password);
    if (openWallet.hasOwnProperty('error')) {
      pushToastError('walletInvalidPassword', openWallet.error?.message);
    } else {
      pushToastSuccess('successPassword', 'Success.');
      props.onClick();
      // setProgressing(true);
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

  // console.log(
  //   'currentHeight>0&&percentage<99',
  //   daemonHeight > 0 && percentage < 99,
  //   daemonHeight,
  //   percentage
  // );

  if ((daemonHeight > 0 && percentage < 99) ) {
    return (
      <ProgressForSync remainingHeight={daemonHeight - currentHeight} percentage={percentage} />
    );
  }

  return (
    <div className="wallet-walletPassword">
      <div className="wallet-walletPassword-contentBox">
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
          <input type="password" value={password} onChange={e => setValue(e.target.value)}/>
        </div>
        <SpacerMD />
        <div
          className="wallet-walletPassword-contentBox-forgotTxt"  
        >
          <span onClick={() => setForgotPassword(true)} style={{ cursor: 'pointer' }}>{window.i18n('forgotPassword')}</span>
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
