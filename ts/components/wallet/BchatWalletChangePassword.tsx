import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ToastUtils } from '../../bchat/utils';
import { ChangePasswordModal } from '../../state/ducks/modalDialog';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { Flex } from '../basic/Flex';
import { SpacerMD, SpacerSM } from '../basic/Text';
import { BchatWrapperModal } from '../BchatWrapperModal';
import { BchatIcon } from '../icon';
import { wallet } from '../../wallet/wallet-rpc';
import { useKey } from 'react-use';
import styled from 'styled-components';

export const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmNewPassword] = useState('');
  const [newPasswordVisible, setNewPasswordVisible] = useState(true);
  const [confirmPasswordVisible, setConfirmNewPasswordVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  function onClickCancelHandler() {
    setLoading(false);
    dispatch(ChangePasswordModal(null));
  }
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
    setLoading(true)
    const changePassword = await wallet.changeWalletPassword(oldPassword, newPassword);
    if (changePassword.hasOwnProperty('error')) {
    setLoading(false)
      return ToastUtils.pushToastError('changePasswordError', changePassword.error.message);
    }
    wallet.wallet_state.password_hash = wallet.passwordEncrypt(newPassword);
    setLoading(false)
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
        // title={window.i18n('changePassword')}
        onClose={() => onClickCancelHandler()}
        showExitIcon={false}
        headerReverse={true}
        showHeader={false}

      >
        {loading && <Loader>
          <div className='edit-profile-dialog-modalLoader'
            style={{
              width: '524px',
              height: '375px'
            }}>
            <img src={"images/bchat/Load_animation.gif"} style={{ width: "150px", height: '150px' }} />
          </div>
        </Loader>}
        <div className='walletChangePasswordHeader'>{window.i18n('changePassword')}</div>

        <div className="bchat-modal__centered changepass" style={{ width: '475px', alignItems: 'start' }}>
          <SpacerMD />
          <span className='changepass-oldpassInput' >
            <input
              value={oldPassword}
              onChange={e => {
                setOldPassword(e.target.value);
              }}
              placeholder={window.i18n('currentPassword')}
            // className="bchat-dialog-oldpassInput"
            />
          </span>
          <SpacerMD />
          <div>{window.i18n('changewalletPassword')}</div>
          <SpacerSM />
          <Flex container={true} flexDirection={'row'} alignItems="center" width="100%">
            <span className='changepass-newPassInput' >

              <input
                value={newPassword}
                onChange={e => {
                  setNewPassword(e.target.value);
                }}
                placeholder={window.i18n('enterPassword')}
                // className="bchat-dialog-newPassInput"
                type={newPasswordVisible ? "password" : "text"}
                maxLength={13}
              />
            </span>
            <span onClick={() => setNewPasswordVisible(!newPasswordVisible)} style={{ cursor: 'pointer' }}>
              <BchatIcon iconType={!newPasswordVisible ? "eye_closed" : "eye"} iconSize={'medium'} />
            </span>
          </Flex>
          <SpacerSM />
          <Flex container={true} flexDirection={'row'} alignItems="center" width="100%">
            <span className='changepass-newPassInput' >

              <input
                value={confirmPassword}
                onChange={e => {
                  setConfirmNewPassword(e.target.value);
                }}
                placeholder={window.i18n('confirmPassword')}
                // className="bchat-dialog-newPassInput"
                type={confirmPasswordVisible ? "password" : "text"}
                maxLength={13}
              />
            </span>
            <span onClick={() => setConfirmNewPasswordVisible(!confirmPasswordVisible)} style={{ cursor: 'pointer' }}>
              <BchatIcon iconType={!confirmPasswordVisible ? "eye_closed" : "eye"} iconSize={'medium'} />

            </span>
          </Flex>
        </div>
        <SpacerMD />
        <SpacerMD />
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
      </BchatWrapperModal>
    </div>
  );
};
