import React, { useState } from 'react';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { Flex } from '../basic/Flex';
import { SpacerMD, SpacerSM } from '../basic/Text';
import { BchatIcon } from '../icon';
import { clipboard } from 'electron';
import { ToastUtils } from '../../bchat/utils';
import { wallet } from '../../wallet/wallet-rpc';
import { daemon } from '../../wallet/daemon-rpc';

import { useDispatch, useSelector } from 'react-redux';
import { getCurrentRecoveryPhrase } from '../../util/storage';
import { updateDaemon } from '../../state/ducks/daemon';
// import { mn_decode } from '../../bchat/crypto/mnemonic';

export const ForgotPassword = (props: any) => {
  const [seed, setSeed] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmNewPassword] = useState('');

  const [newPasswordVisible, setNewPasswordVisible] = useState(true);
  const [confirmPasswordVisible, setConfirmNewPasswordVisible] = useState(true);
  const userId = useSelector((state: any) => state.user.ourNumber);
  const UserDetails = useSelector((state: any) => state.conversations.conversationLookup);
  const recoveryPhrase = getCurrentRecoveryPhrase();
  console.log('recoveryPhrase:', recoveryPhrase);
  const dispatch = useDispatch();
  // console.log('recoveryPhrase:', recoveryPhrase);
  function onClickCancelHandler() {
    props.cancelBtn();
  }
  const handlePaste = () => {
    const recoverySeed = clipboard.readText();
    setSeed(recoverySeed);
  };

  console.log('seed:', seed);
  console.log('newPassword:', newPassword);
  console.log('confirmPassword:', confirmPassword);

  const seedvalidation = async () => {
    try {
      const trimWhiteSpace = seed.replace(/^\s+|\s+$/g, '');
      const wlist = trimWhiteSpace.split(' ');
      console.log('wlist:', wlist, wlist.length, wlist.length % 3 !== 0);
      const wordset = { prefixLen: 3 };
      if (wlist.length < 24) {
        ToastUtils.pushToastError('invalidSeed', "You've entered too few words, please try again");
        return false;
      }
      if (
        (wordset.prefixLen === 0 && wlist.length % 3 !== 0) ||
        (wordset.prefixLen > 0 && wlist.length % 3 === 2)
      ) {
        ToastUtils.pushToastError('invalidSeed', "You've entered too few words, please try again");
        return false;
      }
      console.log('seedvalidation:', seed.length, recoveryPhrase.length);
      if (trimWhiteSpace.toLocaleLowerCase() !== recoveryPhrase.toLocaleLowerCase()) {
        ToastUtils.pushToastError('invalidSeed', 'Seed entered does not match.');
        return false;
      }
      return true;
    } catch (error) {
      ToastUtils.pushToastError(
        'forgotPasswordError',
        `Error: ${error.message || 'Something went wrong'}`
      );
      return false;
    }
  };

  const passValid = async () => {
    if (!seed) {
      return ToastUtils.pushToastError('seedFieldEmpty', window.i18n('seedFieldEmpty'));
    }
    if (!newPassword || !confirmPassword) {
      return ToastUtils.pushToastError('passwordFieldEmpty', window.i18n('passwordFieldEmpty'));
    }
    if (newPassword !== confirmPassword) {
      window?.log?.warn('invalid password');
      return ToastUtils.pushToastError('invalidPassword', 'Passwords do not match');
    }
    const seedValidation = await seedvalidation();
    if (!seedValidation) {
      return;
    }
    if (
      (newPassword.length < 4 && confirmPassword.length < 4) ||
      (newPassword.length > 13 && confirmPassword.length > 13)
    ) {
      return ToastUtils.pushToastError(
        'walletPasswordLengthError',
        window.i18n('walletPasswordLengthError')
      );
    }
    let profileName = UserDetails[userId].profileName;
    const refreshDetails = { refresh_start_timestamp_or_height: 0 };
    const changePassword = await wallet.restoreWallet(
      profileName,
      newPassword,
      seed,
      refreshDetails,
      'forgotPassword'
    );
    daemon.sendRPC('get_info').then(data => {
      if (!data.hasOwnProperty('error')) {
        console.log('success');
        dispatch(updateDaemon({ height: data.result.height }));
      }
    });
    if (changePassword.hasOwnProperty('error')) {
      return ToastUtils.pushToastError('changePasswordError', changePassword.error.message);
    }
    // await wallet.closeWallet();
    props.showSyncScreen();
    ToastUtils.pushToastSuccess('changePasswordSuccess', 'Password successfully changed.');
    return onClickCancelHandler();
  };
  return (
    <div className="wallet-forgotPassword">
      <div className="wallet-forgotPassword-content-Box">
        <div>
          <div className="wallet-forgotPassword-content-Box-title">
            {window.i18n('forgotPassword')}
          </div>
          <SpacerMD />
          <div className="wallet-forgotPassword-content-Box-seed">
            <textarea
              value={seed}
              onChange={e => {
                setSeed(e.target.value);
              }}
              placeholder={window.i18n('enterSeed')}
            />
            <div
              onClick={() => handlePaste()}
              className="wallet-forgotPassword-content-Box-paste-icon"
              data-tip="Paste"
              data-offset="{'top':30,'left':15}"
              data-place="right"
            ></div>
          </div>

          <SpacerMD />
          <div>{window.i18n('changewalletPassword')}</div>
          <SpacerSM />
          <Flex container={true} flexDirection={'row'} alignItems="center" width="100%">
            <span className="wallet-forgotPassword-content-Box-password">
              <input
                value={newPassword}
                onChange={e => {
                  setNewPassword(e.target.value);
                }}
                placeholder={window.i18n('enterPassword')}
                //   className="bchat-dialog-newPassInput"
                type={newPasswordVisible ? 'password' : 'text'}
              />
            </span>

            <span onClick={() => setNewPasswordVisible(!newPasswordVisible)} style={{cursor:'pointer'}}>
              <BchatIcon iconType={!newPasswordVisible ? 'eye_closed' : 'eye'} iconSize={'medium'} />
            </span>
          </Flex>
          <SpacerSM />
          <Flex container={true} flexDirection={'row'} alignItems="center" width="100%">
            <span className="wallet-forgotPassword-content-Box-password">
              <input
                value={confirmPassword}
                onChange={e => {
                  setConfirmNewPassword(e.target.value);
                }}
                placeholder={window.i18n('confirmPassword')}
                //   className="bchat-dialog-newPassInput"
                type={confirmPasswordVisible ? 'password' : 'text'}
              />
            </span>
            <span onClick={() => setConfirmNewPasswordVisible(!confirmPasswordVisible)} style={{cursor:'pointer'}}>
              <BchatIcon
                iconType={!confirmPasswordVisible ? 'eye_closed' : 'eye'}
                iconSize={'medium'}
              />
            </span>
          </Flex>
        </div>
        <SpacerMD />
        <SpacerMD />
        <div style={{ width: '86%', paddingTop: '12px' ,paddingBottom:'25px',fontSize:'13px'}}>
          <span style={{ color: 'red' }}>Disclaimer </span>: When you use this forget password
          option, your wallet will sync from the 0th block
        </div>
        <div className="wallet-settings-modalBtnGrp">
          <div className="bchat-modal__button-group__center">
            <BchatButton
              text={window.i18n('cancel')}
              buttonType={BchatButtonType.BrandOutline}
              buttonColor={BchatButtonColor.Primary}
              onClick={onClickCancelHandler}
            />
            <BchatButton
              text={window.i18n('save')}
              buttonType={BchatButtonType.BrandOutline}
              buttonColor={BchatButtonColor.Green}
              onClick={passValid}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
