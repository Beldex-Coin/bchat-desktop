import React, { useEffect, useState } from 'react';
import { BchatWrapperModal } from '../BchatWrapperModal';
import { SpacerLG, SpacerMD } from '../basic/Text';
import { BchatIcon } from '../icon';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { useDispatch, useSelector } from 'react-redux';
import { updateBchatWalletPasswordModal } from '../../state/ducks/modalDialog';
import { ToastUtils, UserUtils } from '../../bchat/utils';
import { useKey } from 'react-use';
import { updatewalletSyncBarShowInChat } from '../../state/ducks/walletConfig';
import { deamonvalidation } from '../../wallet/BchatWalletHelper';
import { getConversationById } from '../../data/data';
import { wallet } from '../../wallet/wallet-rpc';
import { walletSettingsKey } from '../../data/settings-key';
import { WalletPassword } from '../wallet/BchatWalletPassword';
import { clearSearch } from '../../state/ducks/search';
import { setOverlayMode, showLeftPaneSection } from '../../state/ducks/section';
// import { getRescaning } from '../../state/selectors/walletConfig';
// import styled from 'styled-components';

export const BchatWalletPasswordModal = (props: any) => {
  const dispatch = useDispatch();
  // const [loading, setLoading] = useState(true);

  const [password, setPassword] = useState('');
  const UserDetails: any = useSelector((state: any) => state.conversations.conversationLookup);
  // const syncStatus = useSelector(getRescaning);
  const getSyncStatus = window.getSettingValue('syncStatus');

  const onClickClose = () => {
    // if(props.from === 'wallet' )
    // {
    // backToChat();
    // dispatch(updateBchatWalletPasswordModal(null))
    // }
    // else{
    dispatch(updateBchatWalletPasswordModal(null));
    // }
  };

  useEffect(() => {
    deamonvalidation();
    startWalletRpc();
  }, []);

  // startWalletRpc();

  async function startWalletRpc() {
    await wallet.startWallet('settings');
  }
  async function submit() {
    if (!password) {
      return ToastUtils.pushToastError('passwordFieldEmpty', window.i18n('passwordFieldEmpty'));
    }
    let userDetails = await getConversationById(UserUtils.getOurPubKeyStrFromCache());
    let profileName = userDetails?.attributes.walletUserName;
    if (!profileName) {
      profileName = UserDetails?.userId?.profileName;
    }
    // console.log("password hash ::",wallet.wallet_state.password_hash , wallet.passwordEncrypt(password),
    // wallet.wallet_state.password_hash === wallet.passwordEncrypt(password),!getSyncStatus)
    if (!getSyncStatus && wallet.wallet_state.password_hash === wallet.passwordEncrypt(password)) {
      showSyncBar();
      return;
    }

    //   setLoading(true);
    let openWallet: any = await wallet.openWallet(profileName, password);
    console.log('openWallet:-', openWallet);
    if (openWallet.hasOwnProperty('error')) {
      // setLoading(false);

      return ToastUtils.pushToastError('walletInvalidPassword', openWallet.error?.message);
    } else {
      await wallet.startHeartbeat('inChat');
      // let emptyAddress: any = '';
      // dispatch(updateSendAddress(emptyAddress));
      // setLoading(false);
      // props.onClick();
      // dispatch(dashboard());
      // let data: any = true;
      // //   dispatch(updateWalletSyncInitiatedWithChat(data)) ;
      // dispatch(updatewalletSyncBarShowInChat(data));
      // onClickClose();
      // // heartbeat();
      // const currentDaemon = window.getSettingValue(walletSettingsKey.settingsCurrentDeamon);
      // ToastUtils.pushToastInfo('connectedDaemon', `Connected to ${currentDaemon.host}`);
      showSyncBar();
      return;
    }
  }
  function showSyncBar() {
    let data: any = true;
    //   dispatch(updateWalletSyncInitiatedWithChat(data)) ;
    dispatch(updatewalletSyncBarShowInChat(data));
    onClickClose();
    // heartbeat();
    const currentDaemon = window.getSettingValue(walletSettingsKey.settingsCurrentDeamon);
    return ToastUtils.pushToastInfo('connectedDaemon', `Connected to ${currentDaemon.host}`);
  }
  useKey((event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      props.from !== 'wallet' && submit();
    }
    return event.key === 'Enter';
  });

  function backToChat() {
    dispatch(clearSearch());
    dispatch(setOverlayMode(undefined));
    dispatch(showLeftPaneSection(0));
    dispatch(updateBchatWalletPasswordModal(null));
  }

  return (
    <BchatWrapperModal
      title={''}
      onClose={onClickClose}
      showExitIcon={props.from === 'wallet' ? false : true}
      showHeader={props.from === 'wallet' ? false : true}
      headerReverse={props.from === 'wallet' ? false : true}
      additionalClassName="walletPassword"
    >
      {props.from === 'wallet' ? (
        <WalletPassword onClickClose={backToChat} />
      ) : (
        <div className="bchat-modal-walletPassword">
          <div className="bchat-modal-walletPassword-contentBox">
            {/* {loading && (
                            <Loader>
                                <div className="bchat-modal-walletPassword-contentBox-loader">
                                    <img
                                        src={'images/bchat/Load_animation.gif'}
                                        style={{ width: '150px', height: '150px' }}
                                    />
                                </div>
                            </Loader>
                        )} */}
            {/* <SpacerLG /> */}
            {/* <SpacerLG /> */}
            <div className="bchat-modal-walletPassword-contentBox-walletImg"></div>
            <SpacerMD />
            <div className="bchat-modal-walletPassword-contentBox-headerBox">
              <BchatIcon iconType="lock" iconSize={'small'} />
              <span>{window.i18n('enterWalletPassword')}</span>
            </div>
            <SpacerMD />
            <div className="bchat-modal-walletPassword-contentBox-inputBox">
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} autoFocus={true} />
            </div>
            <SpacerMD />
            <div className="bchat-modal-walletPassword-contentBox-forgotTxt">
              {/* <span style={{ cursor: 'pointer' }}>
                                {window.i18n('forgotPassword')}
                            </span> */}
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
      )}
    </BchatWrapperModal>
  );
};

// const Loader = styled.div`
//     position: absolute;
//     // top: 0;
//     display: flex;
//     // justify-content: center;
//     /* width: 100%; */
//     // width: 100Vw;
//     // height: 100%;
//     align-items: center;
//     z-index: 101;
//   `;
