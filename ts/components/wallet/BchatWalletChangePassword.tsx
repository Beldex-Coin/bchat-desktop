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

export const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmNewPassword] = useState('');

  // const [oldPassVisible,setOldPassVisible]=useState('');
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmNewPasswordVisible] = useState(false);
  const dispatch = useDispatch();
  function onClickCancelHandler() {
    dispatch(ChangePasswordModal(null));
  }

  const passValid = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return ToastUtils.pushToastError('passwordFieldEmpty', window.i18n('passwordFieldEmpty'));
    }
    if (newPassword !== confirmPassword) {
      window?.log?.warn('invalid password');
      return ToastUtils.pushToastError('invalidPassword', 'Passwords do not match');
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
    const changePassword = await wallet.changeWalletPassword(oldPassword, newPassword);
    if (changePassword.hasOwnProperty('error')) {
      return ToastUtils.pushToastError('changePasswordError', changePassword.error.message);
    }
    ToastUtils.pushToastSuccess('changePasswordSuccess', 'Password successfully changed.');
    return onClickCancelHandler();
  };

  // const [confirm,setConfirm]=useState("");
  return (
    <div>
      <BchatWrapperModal
        title={window.i18n('changePassword')}
        onClose={() => onClickCancelHandler()}
        showExitIcon={false}
        headerReverse={true}
      >
        <div className="bchat-modal__centered changepass" style={{ width: '350px', alignItems: 'start' }}>
          <SpacerMD />
          <input
            value={oldPassword}
            onChange={e => {
              setOldPassword(e.target.value);
            }}
            placeholder={window.i18n('currentPassword')}
            className="bchat-dialog-oldpassInput"
          />
          <SpacerMD />
          <div>{window.i18n('changewalletPassword')}</div>
          <SpacerSM />
          <Flex container={true} flexDirection={'row'} alignItems="center" width="100%">
            <input
              value={newPassword}
              onChange={e => {
                setNewPassword(e.target.value);
              }}
              placeholder={window.i18n('enterPassword')}
              className="bchat-dialog-newPassInput"
              type={!newPasswordVisible?"password":"text"}
            />
            <span onClick={()=>setNewPasswordVisible(!newPasswordVisible)}>
            <BchatIcon iconType={newPasswordVisible?"eye_closed":"eye"} iconSize={'medium'} />
            </span>
          </Flex>
          <SpacerSM />
          <Flex container={true} flexDirection={'row'} alignItems="center" width="100%">
            <input
              value={confirmPassword}
              onChange={e => {
                setConfirmNewPassword(e.target.value);
              }}
              placeholder={window.i18n('confirmPassword')}
              className="bchat-dialog-newPassInput"
              type={confirmPasswordVisible?"password":"text"}
            />
            <span onClick={()=>setConfirmNewPasswordVisible(!confirmPasswordVisible)}>
            <BchatIcon iconType={confirmPasswordVisible?"eye_closed":"eye"} iconSize={'medium'} />

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

        {/* <BchatSpinner loading={isLoading} /> */}
      </BchatWrapperModal>
    </div>
  );
};
