import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ToastUtils } from '../../bchat/utils';
import { ChangePasswordModal } from '../../state/ducks/modalDialog';
import { Flex } from '../basic/Flex';
import { SpacerMD, SpacerSM } from '../basic/Text';
import { BchatWrapperModal } from '../BchatWrapperModal';
import { BchatIconButton } from '../icon';
import { wallet } from '../../wallet/wallet-rpc';
import { useKey } from 'react-use';
import { BchatButtonColor } from '../basic/BchatButton';
import styled from 'styled-components';

export const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmNewPassword] = useState('');
  const [oldPasswordVisible, setOldPasswordVisible] = useState(true);
  const [newPasswordVisible, setNewPasswordVisible] = useState(true);
  const [confirmPasswordVisible, setConfirmNewPasswordVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  function onClickCancelHandler() {
    setLoading(false);
    dispatch(ChangePasswordModal(null));
  }

  const passValid = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return ToastUtils.pushToastError('passwordFieldEmpty', window.i18n('passwordFieldEmpty'));
    }
    if (newPassword !== confirmPassword) {
      return ToastUtils.pushToastError('invalidPassword', 'Passwords do not match');
    }
    if (oldPassword == newPassword) {
      window?.log?.warn('invalid password');
      return ToastUtils.pushToastError(
        'oldPasswordSame',
        `Cannot use old password. Set a different password.`
      );
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
    setLoading(true);
    const changePassword = await wallet.changeWalletPassword(oldPassword, newPassword);
    if (changePassword.hasOwnProperty('error')) {
      setLoading(false);
      return ToastUtils.pushToastError('changePasswordError', changePassword.error.message);
    }
    wallet.wallet_state.password_hash = wallet.passwordEncrypt(newPassword);
    setLoading(false);
    ToastUtils.pushToastSuccess('changePasswordSuccess', 'Password successfully changed.');
    return onClickCancelHandler();
  };

  useKey((event: KeyboardEvent) => {
    return event.key === 'Enter';
  }, passValid);

  return (
    <div>
      {/* {loading && (
          <Loader>
            <div className="walletChangePasswordLoader">
              <img
                src={'images/bchat/Load_animation.gif'}
                style={{ width: '150px', height: '150px' }}
              />
            </div>
          </Loader>
        )} */}
      <BchatWrapperModal
        title={window.i18n('changePassword')}
        onClose={() => onClickCancelHandler()}
        showExitIcon={false}
        headerReverse={false}
        showHeader={true}
        okButton={{
          text: window.i18n('save'),
          onClickOkHandler: passValid,
          color: BchatButtonColor.Primary,
        }}
        cancelButton={{
          status: true,
          text: window.i18n('cancel'),
          onClickCancelHandler,
        }}
        isloading={loading}
      >
        {/* <div className="walletChangePasswordHeader">{window.i18n('changePassword')}</div> */}

        <div
          className="bchat-modal__centered changepass"
          style={{ width: '475px', alignItems: 'start' }}
        >
          <SpacerMD />

          <Flex
            container={true}
            flexDirection={'row'}
            alignItems="center"
            width="100%"
            className="changepass-oldpassInput"
          >
            <span>
              <input
                value={oldPassword}
                onChange={e => {
                  setOldPassword(e.target.value);
                }}
                type={oldPasswordVisible ? 'password' : 'text'}
                placeholder={window.i18n('currentPassword')}
                // className="bchat-dialog-oldpassInput"
                maxLength={13}
              />
            </span>

            <BchatIconButton
              iconType={!oldPasswordVisible ? 'eye_closed' : 'eye'}
              iconSize={'medium'}
              fillRule="evenodd"
              clipRule="evenodd"
              onClick={() => setOldPasswordVisible(!oldPasswordVisible)}
            />
          </Flex>
          <SpacerMD />
          <NewPasswordLabel>{window.i18n('newwalletPassword')}</NewPasswordLabel>
          <SpacerSM />
          <Flex
            container={true}
            flexDirection={'row'}
            alignItems="center"
            width="100%"
            className="changepass-newPassInput"
          >
            <span>
              <input
                value={newPassword}
                onChange={e => {
                  setNewPassword(e.target.value);
                }}
                placeholder={window.i18n('enterNewPassword')}
                // className="bchat-dialog-newPassInput"
                type={newPasswordVisible ? 'password' : 'text'}
                maxLength={13}
              />
            </span>
              <BchatIconButton
              iconType={!newPasswordVisible ? 'eye_closed' : 'eye'}
              iconSize={'medium'}
              fillRule="evenodd"
              clipRule="evenodd"
              onClick={() => setNewPasswordVisible(!newPasswordVisible)}
            />
           
          </Flex>
          <SpacerSM />
          <Flex
            container={true}
            flexDirection={'row'}
            alignItems="center"
            width="100%"
            className="changepass-newPassInput"
          >
            <span>
              <input
                value={confirmPassword}
                onChange={e => {
                  setConfirmNewPassword(e.target.value);
                }}
                placeholder={window.i18n('confirmPassword')}
                // className="bchat-dialog-newPassInput"
                type={confirmPasswordVisible ? 'password' : 'text'}
                maxLength={13}
              />
            </span>
            <BchatIconButton
              iconType={!confirmPasswordVisible ? 'eye_closed' : 'eye'}
              iconSize={'medium'}
              fillRule="evenodd"
              clipRule="evenodd"
              onClick={() => setConfirmNewPasswordVisible(!confirmPasswordVisible)}
            />
          </Flex>
        </div>
        <SpacerMD />
        <SpacerMD />
      </BchatWrapperModal>
    </div>
  );
};

const NewPasswordLabel = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
