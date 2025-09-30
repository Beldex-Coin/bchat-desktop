import React, { useState } from 'react';
import { BchatButtonColor } from '../basic/BchatButton';
import { Flex } from '../basic/Flex';
import { SpacerLG, SpacerMD, SpacerSM } from '../basic/Text';
import {  BchatIconButton } from '../icon';
import { clipboard } from 'electron';
import { ToastUtils, UserUtils } from '../../bchat/utils';
import { wallet } from '../../wallet/wallet-rpc';
import { daemon } from '../../wallet/daemon-rpc';

import { useDispatch, useSelector } from 'react-redux';
import { getCurrentRecoveryPhrase } from '../../util/storage';
import { updateDaemon } from '../../state/ducks/daemon';
import { getConversationById } from '../../data/data';
import { useConversationWalletDaemonHeight } from '../../hooks/useParamSelector';
import { useKey } from 'react-use';
import { BchatWrapperModal } from '../BchatWrapperModal';
import {
  updateBchatWalletForgotPasswordModal,
  updateBchatWalletPasswordModal,
} from '../../state/ducks/modalDialog';

export const BchatWalletForgotPasswordModal = () => {
  const [seed, setSeed] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [newPasswordVisible, setNewPasswordVisible] = useState(true);
  const [confirmPasswordVisible, setConfirmNewPasswordVisible] = useState(true);
  const userId = useSelector((state: any) => state.user.ourNumber);
  const UserDetails = useSelector((state: any) => state.conversations.conversationLookup);
  const recoveryPhrase = getCurrentRecoveryPhrase();

  const walletDaemonHeight = useConversationWalletDaemonHeight(
    UserUtils.getOurPubKeyStrFromCache()
  );
  const dispatch = useDispatch();
  function onClickCancelHandler() {
    dispatch(updateBchatWalletForgotPasswordModal(null));
    dispatch(updateBchatWalletPasswordModal({from:'wallet'}));
  }
  const handlePaste = () => {
    const recoverySeed = clipboard.readText();
    setSeed(recoverySeed.replace(/^\s+|\s+$/g, ''));
  };
  const seedvalidation = async () => {
    try {
      const trimWhiteSpace = seed.replace(/^\s+|\s+$/g, '');
      const wlist = trimWhiteSpace.split(' ');
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
      let trimWhiteSpaceRec = recoveryPhrase.replace(/^\s+|\s+$/g, '');
      if (trimWhiteSpace.toLocaleLowerCase() !== trimWhiteSpaceRec.toLocaleLowerCase()) {
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
    // setLoading(true);
    let userDetails = await getConversationById(UserUtils.getOurPubKeyStrFromCache());
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
    let profileName = userDetails?.attributes.walletUserName;
    if (!profileName) {
      profileName = UserDetails[userId].profileName;
    }
    const refreshDetails = {
      refresh_start_timestamp_or_height: walletDaemonHeight ? walletDaemonHeight : 0,
    };

    try {
      await wallet.restoreWallet(profileName, newPassword, seed, refreshDetails, 'forgotPassword');
      // if (restore) {
      //   return onClickCancelHandler();
      // }
      daemon.sendRPC('get_info').then(data => {
        if (!data.hasOwnProperty('error')) {
          dispatch(updateDaemon({ height: data.result.height }));
        }
      });
      // props.showSyncScreen();
      setLoading(false);

      ToastUtils.pushToastSuccess('changePasswordSuccess', 'Password successfully changed.');
      return onClickCancelHandler();
    } catch (error) {
      setLoading(false);
      {
        error?.message && ToastUtils.pushToastError('changePasswordError', error?.message);
      }
    }
  };

  useKey((event: KeyboardEvent) => {
    return event.key === 'Enter';
  }, passValid);

  return (
    <div className="wallet-forgotPassword">
      <BchatWrapperModal
        title={window.i18n('forgotPassword')}
        onClose={() => {}}
        buttonSizeLg={true}
        showExitIcon={false}
        showHeader={true}
        headerReverse={false}
        additionalClassName="walletPassword"
        isloading={loading}
        okButton={{
          text: window.i18n('save'),
          onClickOkHandler: () => {
            passValid();
          },
          color: BchatButtonColor.Primary,
          disabled: false,
        }}
        cancelButton={{
          text: window.i18n('cancel'),
          status: true,
          color: BchatButtonColor.Secondary,
          onClickCancelHandler: () => {
            onClickCancelHandler();
          },
        }}
      >
        {/* <div  style={{width:'100%'}}>
      <div className='exitBtn'>
          <BchatIconButton
            iconType="exit"
            iconSize="small"
            onClick={props.exit}
            dataTestId="modal-close-button"
          />
        </div>
      </div> */}
        <div className="wallet-forgotPassword-content-Box">
          <div>
            <SpacerMD />
            <div className="wallet-forgotPassword-content-Box-seed">
              <textarea
                value={seed}
                onChange={e => {
                  const value=e.target.value;
                  // let trimWhiteSpace = e.target.value.replace(/^\s+|\s+$/g, '');
                  let trimmedValue =!value.trim()? '':value;
                  setSeed(trimmedValue);
                }}
                placeholder={window.i18n('enterSeed')}
                autoFocus
              />
              <div
                // onClick={() => handlePaste()}
               
                style={{ marginTop: '15px' }}
                data-tip="Paste"
                data-offset="{'top':30,'left':15}"
                data-place="right"
              >
                <BchatIconButton
                  iconType={'paste'}
                  iconSize={20}
                  iconColor="#0B9E3C"
                  onClick={() => handlePaste()}
                />
              </div>
            </div>

            <SpacerLG />
            <div className="wallet-forgotPassword-content-Box-password-label">
              {window.i18n('changeWalletPassword')}
            </div>
            <SpacerLG />
            <Flex
              container={true}
              flexDirection={'row'}
              alignItems="center"
              width="100%"
              className="wallet-forgotPassword-content-Box-password"
            >
              <input
                value={newPassword}
                onChange={e => {
                  setNewPassword(e.target.value);
                }}
                placeholder={window.i18n('enterNewWalletPassword')}
                //   className="bchat-dialog-newPassInput"
                type={newPasswordVisible ? 'password' : 'text'}
                maxLength={13}
              />

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
              className="wallet-forgotPassword-content-Box-password"
            >
              <input
                value={confirmPassword}
                onChange={e => {
                  setConfirmNewPassword(e.target.value);
                }}
                placeholder={'Confirm wallet password'}
                //   className="bchat-dialog-newPassInput"
                type={confirmPasswordVisible ? 'password' : 'text'}
                maxLength={13}
              />
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
          <div className="wallet-forgotPassword-content-Box-disClaimerBox">
            <span style={{ color: 'red', marginRight: '10px' }}>Disclaimer :</span>
            <span>{window.i18n('disclaimerForgotPassword', walletDaemonHeight)}</span>
          </div>
          {/* <div className="wallet-settings-modalBtnGrp">
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
          </div> */}
        </div>
      </BchatWrapperModal>
    </div>
  );
};
