import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { WalletStateType } from "../../state/ducks/walletSection"
import { Flex } from '../basic/Flex';
import { SpacerLG } from '../basic/Text';
import { AddressBook } from './BchatWalletAddressBook';
import { WalletBalanceSection } from './BchatWalletBalanceSection';
import { WalletHeader } from './BchatWalletHeader';
import { WalletPassword } from './BchatWalletPassword';
import { NodeSetting } from './BchatWalletNodeSetting';
import { WalletPaymentSection } from './BchatWalletPaymentSection';
import { ReceivedForm } from './BchatWalletReceivedForm';
import { WalletSettings } from './BchatWalletSettings';
import { SendForm } from './BchatWalletSendForm';
import { TransactionSection } from './BchatWalletTransactionSection';
import { SyncStatusBar } from './BchatWalletSyncSatusBar';
import { daemon } from '../../wallet/daemon-rpc';
import { pushToastError } from '../../bchat/utils/Toast';
import { updateSendAddress } from '../../state/ducks/walletConfig';
// import { ModalContainer } from "../dialog/ModalContainer"
//  import { ForgotPassword } from "./BchatWalletForgotPassword"
// import { getwalletDecimalValue } from "../../state/selectors/walletConfig"
// import { wallet } from '../../wallet/wallet-rpc';
// import { walletHelper } from "../../wallet/BchatWalletHelper";

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
  const dispatch=useDispatch();
  const focusedsettings = useSelector((state: any) => state.walletFocused);
  const [amount, setAmount] = useState('');
  const [priority, setPriority] = useState(window.i18n('flash'));
  const [passScreen, setPassScreen] = useState(true);
  const [notes, setNotes] = useState('');


  if(!window.globalOnlineStatus){
    pushToastError('internetConnectionError', 'Please check your internet connection');
  }

  function numberOnly(e: any) {
    // const re = /^-?\d+\.?\d*$/;
    const re = /^\d+\.?\d*$/;
    

    if (e === '' || re.test(e)) {
      setAmount(e);
    }
    // if (isNaN(e)) {
    //    return
    // }
    // setAmount(e)
  }
  function clearStates() {
    setAmount("");
    setNotes("");
    let emtStr: any = '';
    dispatch(updateSendAddress(emtStr));

  }

  //   console.log("focusedsettings:",focusedsettings,WalletPage.WalletPassword);

  //   if(WalletPage.WalletPassword===focusedsettings)
  //   {
  //       return  <div className="wallet"> <WalletPassword />
  //       </div>
  //   }
  if (passScreen) {
    return (
      <div className="wallet">
        <WalletPassword
          onClick={() => {
            setPassScreen(!passScreen);
          }}
        />{' '}
      </div>
    );
    // return <div className="wallet"><ForgotPassword onClick={()=>{setPassScreen(!passScreen)}}/> </div>
  }
  // if (WalletPage.Dashboard === focusedsettings) {

  //    return <div className="wallet"><Dashboard amount={amount} setAmount={(e: any) => { numberOnly(e) }} priority={priority} setPriority={(e: any) => setPriority(e)} />
  //       {/* <SyncStatusBar /> */}
  //    </div>
  // }
  if (WalletPage.AddressBook === focusedsettings) {
    return (
      <div className="wallet">
        <AddressBook name={window.i18n('addressBook')} />
      </div>
    );
  }
  if (WalletPage.Contact === focusedsettings) {
    return (
      <div className="wallet">
        <AddressBook name={window.i18n('contact')} />
      </div>
    );
  }
  if (WalletPage.Setting === focusedsettings) {
    // setAmount('')
    return (
      <div className="wallet">
        <WalletSettings />
      </div>
    );
  }
  if (WalletPage.NodeSetting === focusedsettings) {
    console.log('NodeSetting');

    return (
      <div className="wallet">
        <NodeSetting />
      </div>
    );
  }
  // walletheartAction();

  return (
    <div className="wallet">
      {/* <ModalContainer /> */}

      {WalletPage.Dashboard === focusedsettings && (
        <Dashboard
          amount={amount}
          setAmount={(e: any) => {
            numberOnly(e);
          }}
          priority={priority}
          notes={notes}
          setPriority={(e: any) => setPriority(e)}
          setNotes={(e:any)=>setNotes(e)}
          clearStates={()=>clearStates()}

        />
      )}

      {/* <WalletPassword /> */}
      {/* <AddressBook /> */}
      {/* <NodeSetting /> */}
      {/* <WalletSettings /> */}
    </div>
  );
};

export const Dashboard = (props: any) => {
  const focusedInnersection = useSelector((state: any) => state.walletInnerFocused);
  let transactions = useSelector((state: any) => state.wallet.transacations);
  daemon.daemonHeartbeat();
  

  return (
    <>
      <WalletHeader clearStates={props.clearStates}/>
      <SpacerLG />
      <div className="wallet-contentSpace">
        <BalanceAndsendReceiveAction clearStates={props.clearStates}  />
        <SpacerLG />
        {WalletDashboard.walletSend === focusedInnersection && (
          <SendForm
            amount={props.amount}
            setAmount={props.setAmount}
            priority={props.priority}
            setPriority={props.setPriority}
            notes={props.notes}
            setNotes={props.setNotes}
          />
        )}
        {WalletDashboard.walletReceived === focusedInnersection && <ReceivedForm />}
        {WalletDashboard.walletTransaction === focusedInnersection && (
          <TransactionSection
            // syncStatus={localStorage.getItem('syncStatus')}
            syncStatus={window.getSettingValue('syncStatus')}
            transactionList={transactions}
          />
        )}

        {/* <SendForm /> */}
        {/* <TransactionSection /> */}

        <SyncStatusBar />
      </div>
    </>
  );
};
export const BalanceAndsendReceiveAction = (props: any) => {
  return (
    <Flex container={true} flexDirection="row" justifyContent="space-between">
      <WalletBalanceSection />
      <WalletPaymentSection clearStates={props.clearStates}/>
    </Flex>
  );
};
