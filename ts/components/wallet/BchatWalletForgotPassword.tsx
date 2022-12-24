import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { ToastUtils } from '../../bchat/utils';
// import { ChangePasswordModal } from '../../state/ducks/modalDialog';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { Flex } from '../basic/Flex';
import { SpacerMD, SpacerSM } from '../basic/Text';
// import { BchatWrapperModal } from '../BchatWrapperModal';
import { BchatIcon } from '../icon';
import { clipboard } from 'electron';
// import { wallet } from '../../wallet/wallet-rpc';

export const ForgotPassword = (props: any) => {
    console.log(props);

    const [seed, setSeed] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmNewPassword] = useState('');

    // const [oldPassVisible,setOldPassVisible]=useState('');
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmNewPasswordVisible] = useState(false);
    // const dispatch = useDispatch();
    function onClickCancelHandler() {
        // dispatch(ChangePasswordModal(null));
        props.cancelBtn();
    }
    const handlePaste = () => {
        // event.clipboardData.getData('text')
        const recoverySeed = clipboard.readText();
        setSeed(recoverySeed)
        // console.log("EVENT_TEXT:", );
        // pushUserCopySuccess()
    };
    const passValid = async () => {
        // if (!oldPassword || !newPassword || !confirmPassword) {
        //   return ToastUtils.pushToastError('passwordFieldEmpty', window.i18n('passwordFieldEmpty'));
        // }
        // if (newPassword !== confirmPassword) {
        //   window?.log?.warn('invalid password');
        //   return ToastUtils.pushToastError('invalidPassword', 'Passwords do not match');
        // }
        // if (
        //   (newPassword.length < 4 && confirmPassword.length < 4) ||
        //   (newPassword.length > 13 && confirmPassword.length > 13)
        // ) {
        //   return ToastUtils.pushToastError(
        //     'walletPasswordLengthError',
        //     window.i18n('walletPasswordLengthError')
        //   );
        // }
        // const changePassword = await wallet.changeWalletPassword(oldPassword, newPassword);
        // if (changePassword.hasOwnProperty('error')) {
        //   return ToastUtils.pushToastError('changePasswordError', changePassword.error.message);
        // }
        // ToastUtils.pushToastSuccess('changePasswordSuccess', 'Password successfully changed.');
        // return onClickCancelHandler();
    };

    // const [confirm,setConfirm]=useState("");
    return (
        <div className='wallet-forgotPassword' >
            {/* <BchatWrapperModal
        title={window.i18n('changePassword')}
        onClose={() => onClickCancelHandler()}
        showExitIcon={false}
        headerReverse={true}
      > */}
            <div className='wallet-forgotPassword-content-Box'>
                <div >
                    <SpacerMD />
                    <div className='wallet-forgotPassword-content-Box-seed'>
                        <textarea
                            value={seed}
                            onChange={e => {
                                setSeed(e.target.value);
                            }}
                            // onPaste={handlePaste}
                            placeholder={window.i18n('enterSeed')}
                        />
                        <div onClick={() => handlePaste()} className='wallet-forgotPassword-content-Box-paste-icon' data-tip="Paste" data-offset="{'top':30,'left':15}" data-place="right"
                        ></div>
                    </div>

                    <SpacerMD />
                    <div>{window.i18n('changewalletPassword')}</div>
                    <SpacerSM />
                    <Flex container={true} flexDirection={'row'} alignItems="center" width="100%">
                        <span className='wallet-forgotPassword-content-Box-password'>
                            <input
                                value={newPassword}
                                onChange={e => {
                                    setNewPassword(e.target.value);
                                }}
                                placeholder={window.i18n('enterPassword')}
                                //   className="bchat-dialog-newPassInput"
                                type={!newPasswordVisible ? "password" : "text"}
                            />
                        </span>

                        <span onClick={() => setNewPasswordVisible(!newPasswordVisible)}>
                            <BchatIcon iconType={newPasswordVisible ? "eye_closed" : "eye"} iconSize={'medium'} />
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
                                type={confirmPasswordVisible ? "password" : "text"}
                            />
                        </span>
                        <span onClick={() => setConfirmNewPasswordVisible(!confirmPasswordVisible)}>
                            <BchatIcon iconType={confirmPasswordVisible ? "eye_closed" : "eye"} iconSize={'medium'} />

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
            </div>

            {/* <BchatSpinner loading={isLoading} /> */}
            {/* </BchatWrapperModal> */}
        </div>
    );
};
