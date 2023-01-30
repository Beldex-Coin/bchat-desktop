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

export const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmNewPassword] = useState('');

  // const [oldPassVisible,setOldPassVisible]=useState('');
  const [newPasswordVisible, setNewPasswordVisible] = useState(true);
  const [confirmPasswordVisible, setConfirmNewPasswordVisible] = useState(true);
  const dispatch = useDispatch();
  function onClickCancelHandler() {
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
      return ToastUtils.pushToastError('oldPasswordSame', `Cannot use old password. Set a different password.`);
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

  useKey((event: KeyboardEvent) => {
    return event.key === 'Enter';
  }, passValid);

  // const [confirm,setConfirm]=useState("");
  return (
    <div>
      <BchatWrapperModal
        title={window.i18n('changePassword')}
        onClose={() => onClickCancelHandler()}
        showExitIcon={false}
        headerReverse={true}
      >
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
              type={newPasswordVisible?"password":"text"}
            />
            </span>
            <span onClick={()=>setNewPasswordVisible(!newPasswordVisible)} style={{cursor:'pointer'}}>
            <BchatIcon iconType={!newPasswordVisible?"eye_closed":"eye"} iconSize={'medium'} />
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
              type={confirmPasswordVisible?"password":"text"}
            />
            </span>
            <span onClick={()=>setConfirmNewPasswordVisible(!confirmPasswordVisible)} style={{cursor:'pointer'}}>
            <BchatIcon iconType={!confirmPasswordVisible?"eye_closed":"eye"} iconSize={'medium'} />

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
