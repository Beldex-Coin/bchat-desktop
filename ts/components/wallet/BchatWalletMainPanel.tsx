import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Flex } from '../basic/Flex';
import { SpacerLG } from '../basic/Text';
import { AddressBook } from './BchatWalletAddressBook';
import { WalletBalanceSection } from './BchatWalletBalanceSection';
import { WalletHeader } from './BchatWalletHeader';
// import { WalletPassword } from './BchatWalletPassword';
import { NodeSetting } from './BchatWalletNodeSetting';
import { WalletPaymentSection } from './BchatWalletPaymentSection';
import { ReceivedForm } from './BchatWalletReceivedForm';
import { WalletSettings } from './BchatWalletSettings';
import { SendForm } from './BchatWalletSendForm';
import { TransactionSection } from './BchatWalletTransactionSection';
import { MemoSyncStatusBar } from './BchatWalletSyncSatusBar';
// import { daemon } from '../../wallet/daemon-rpc';
import { updateSendAddress } from '../../state/ducks/walletConfig';
import { ToastUtils } from '../../bchat/utils';
// import { walletSettingsKey } from '../../data/settings-key';
import classNames from 'classnames';
import { getBchatWalletPasswordModal } from '../../state/selectors/modal';


export enum WalletPage {
  WalletPassword = 'walletPassword',
  Dashboard = 'dashboard',
  AddressBook = 'addressbook',
  Setting = 'setting',
  NodeSetting = 'nodeSetting',
  Contact = 'contact',
}

export enum WalletDashboard {
  walletSend = 'walletSend',
  walletReceived = 'walletReceived',
  walletTransaction = 'walletTransaction',
}

export const WalletMainPanel = () => {
  const dispatch = useDispatch();
  const focusedsettings = useSelector((state: any) => state.walletFocused);
  const [amount, setAmount] = useState('');
  // const [priority, setPriority] = useState(window.i18n('flash'));
  // const [passScreen, setPassScreen] = useState(true);
  const [notes, setNotes] = useState('');
  const BchatWalletPasswordModal = useSelector(getBchatWalletPasswordModal);


  if (!window.globalOnlineStatus) {
    ToastUtils.pushToastError('internetConnectionError', 'Please check your internet connection');
  }

  function numberOnly(e: any) {
    const re = /^\d+\.?\d*$/;
    if (e === '' || re.test(e)) {
      setAmount(e);
    }
  }
  function clearStates() {
    setAmount("");
    setNotes("");
    let emptyAddress: any = '';
    dispatch(updateSendAddress(emptyAddress));

  }
  // if (passScreen) {
  //   return (
  //     <div className="wallet">
  //       <WalletPassword
  //         onClick={() => {
  //           const currentDaemon = window.getSettingValue(walletSettingsKey.settingsCurrentDeamon)
  //           ToastUtils.pushToastInfo('connectedDaemon', `Connected to ${currentDaemon.host}`);
  //           setPassScreen(!passScreen);
  //         }}
  //       />{' '}
  //     </div>
  //   );
  // }
  if (WalletPage.AddressBook === focusedsettings) {
    return (
      <div className="wallet">
        <AddressBook from={window.i18n('addressBook')} />
      </div>
    );
  }
  if (WalletPage.Contact === focusedsettings) {
    return (
      <div className="wallet">
        <AddressBook from={window.i18n('contact')} />
      </div>
    );
  }
  if (WalletPage.Setting === focusedsettings) {
    return (
      <div className="wallet">
        <WalletSettings />
      </div>
    );
  }
  if (WalletPage.NodeSetting === focusedsettings) {
    return (
      <div className="wallet">
        <NodeSetting />
      </div>
    );
  }

  return (
    <div className={classNames("wallet",BchatWalletPasswordModal  && 'blurBg')}>
      {/* {WalletPage.Dashboard === focusedsettings && ( */}

        <Dashboard
          amount={amount}
          setAmount={(e: any) => {
            numberOnly(e);
          }}
          // priority={priority}
          notes={notes}
          // setPriority={(e: any) => setPriority(e)}
          setNotes={(e: any) => setNotes(e)}
          clearStates={() => clearStates()}

        />
      {/* )} */}
    </div>
  );
};

export const Dashboard = (props: any) => {
  const focusedInnersection = useSelector((state: any) => state.walletInnerFocused);
  let transactions = useSelector((state: any) => state.wallet.transacations);
  // daemon.daemonHeartbeat();
  return (
    <>
      <WalletHeader clearStates={props.clearStates} />
      <SpacerLG />
      <div className="wallet-contentSpace">
        <BalanceAndsendReceiveAction clearStates={props.clearStates} />
        <SpacerLG />
        {WalletDashboard.walletSend === focusedInnersection && (
          <SendForm
            amount={props.amount}
            setAmount={props.setAmount}
            // priority={props.priority}
            // setPriority={props.setPriority}
            notes={props.notes}
            setNotes={props.setNotes}
          />
        )}
        {WalletDashboard.walletReceived === focusedInnersection && <ReceivedForm />}
        {WalletDashboard.walletTransaction === focusedInnersection && (
          <TransactionSection
            transactionList={transactions}
          />
        )}
      </div>
      <div  className='wallet-syncStatusBox'>
      <MemoSyncStatusBar />
      </div>

    </>
  );
};
export const BalanceAndsendReceiveAction = (props: any) => {
  return (
    <Flex container={true} flexDirection="row" justifyContent="space-between">
      <WalletBalanceSection />
      <WalletPaymentSection clearStates={props.clearStates} />
    </Flex>
  );
};
