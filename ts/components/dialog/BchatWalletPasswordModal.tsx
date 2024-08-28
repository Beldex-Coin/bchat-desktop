import React, { useEffect, useState } from 'react';
import { BchatWrapperModal } from '../BchatWrapperModal';
import { BchatButtonColor } from '../basic/BchatButton';
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

import { updateSendAddress, updateWalletPasswordPopUpFlag } from '../../state/ducks/walletConfig';
import { daemon } from '../../wallet/daemon-rpc';
import { getHeight } from '../../state/selectors/walletConfig';



export const BchatWalletPasswordModal = (props: any) => {
  const dispatch = useDispatch();
  // const [loading, setLoading] = useState(true);
  const userId = useSelector((state: any) => state.user.ourNumber);

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const UserDetails: any = useSelector((state: any) => state.conversations.conversationLookup);
  // const syncStatus = useSelector(getRescaning);
  const getSyncStatus = window.getSettingValue('syncStatus');

  let currentHeight: any;
  let daemonHeight: any;
  const currentDaemon = window.getSettingValue(walletSettingsKey.settingsCurrentDeamon);
  if (currentDaemon?.type === 'Local') {
    currentHeight = useSelector((state: any) => state.daemon.height);
    daemonHeight = Number(useSelector(getHeight));
  } else {
    currentHeight = Number(useSelector(getHeight));
    daemonHeight = useSelector((state: any) => state.daemon.height);
  }
  let pct: any =
    currentHeight == 0 || daemonHeight == 0 ? 0 : ((100 * currentHeight) / daemonHeight).toFixed(0);
  let percentage = pct == 100 && currentHeight < daemonHeight ? 99 : pct;
  const sync = daemonHeight > 0 && percentage < 99;

  const onClickClose = () => {
    dispatch(updateBchatWalletPasswordModal(null));
  };

  useEffect(() => {
    deamonvalidation();
    startWalletRpc();
  }, []);

  async function startWalletRpc() {
    await wallet.startWallet('settings');
  }
  async function submitForChat() {
    if (!password) {
      return ToastUtils.pushToastError('passwordFieldEmpty', window.i18n('passwordFieldEmpty'));
    }
    let userDetails = await getConversationById(UserUtils.getOurPubKeyStrFromCache());
    let profileName = userDetails?.attributes.walletUserName;
    if (!profileName) {
      profileName = UserDetails?.userId?.profileName;
    }

    if (!getSyncStatus && wallet.wallet_state.password_hash === wallet.passwordEncrypt(password)) {
      showSyncBar();
      return;
    }

    //   setLoading(true);
    let openWallet: any = await wallet.openWallet(profileName, password);
    if (openWallet.hasOwnProperty('error')) {
      // setLoading(false);

      return ToastUtils.pushToastError('walletInvalidPassword', openWallet.error?.message);
    } else {
      await wallet.startHeartbeat('inChat');
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
      props.from !== 'wallet' ? submitForChat() : submitForWallet();
    }
    return event.key === 'Enter';
  });

  function backToChat() {
    // console.log('backToChat');
    dispatch(clearSearch());
    dispatch(setOverlayMode(undefined));
    dispatch(showLeftPaneSection(0));
    dispatch(updateBchatWalletPasswordModal(null));
  }
  async function submitForWallet() {
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
      return ToastUtils.pushToastError('walletInvalidPassword', openWallet.error?.message);
    } else {
      wallet.startHeartbeat('wallet');
      let emptyAddress: any = '';
      dispatch(updateSendAddress(emptyAddress));
      let False: any = false;
      dispatch(updateWalletPasswordPopUpFlag(False));
      dispatch(updateBchatWalletPasswordModal(null));
      // setLoading(false);
      daemon.daemonHeartbeat();
    }
  }

  return (
    <BchatWrapperModal
      title={''}
      onClose={() => {
        props.from === 'wallet' ? backToChat() : onClickClose();
      }}
      showExitIcon={false}
      showHeader={props.from === 'wallet' ? false : true}
      headerReverse={props.from === 'wallet' ? false : true}
      additionalClassName="walletPassword"
      isloading={loading}
      okButton={{
        text: !sync ? 'Continue' : 'Close',
        onClickOkHandler: () => {
          !sync ? (props.from === 'wallet' ? submitForWallet() : submitForChat()) : backToChat();
        },
        color: !sync ? BchatButtonColor.Primary : BchatButtonColor.Secondary,
        disabled: false,
      }}
      cancelButton={
        !sync && {
          text: 'Cancel',
          status: true,
          color: BchatButtonColor.Secondary,
          onClickCancelHandler: () => {
            props.from === 'wallet' ? backToChat() : onClickClose();
          },
        }
      }
    >
      <WalletPassword
        from={props.from}
        onClickClose={backToChat}
        password={password}
        onChangePassword={(e: any) => setPassword(e)}
        // loading={loading}
      />
    </BchatWrapperModal>
  );
};
