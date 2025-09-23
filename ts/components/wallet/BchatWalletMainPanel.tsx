import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Flex } from '../basic/Flex';
import { SpacerLG, SpacerMD } from '../basic/Text';
import { AddressBook } from './BchatWalletAddressBook';
import { WalletBalanceSection } from './BchatWalletBalanceSection';
import { WalletHeader } from './BchatWalletHeader';
// import { WalletPassword } from './BchatWalletPassword';
import { WalletPaymentSection } from './BchatWalletPaymentSection';
// import { ReceivedForm } from './BchatWalletReceivedForm';

import { SendForm } from './BchatWalletSendForm';
import { TransactionSection } from './BchatWalletTransactionSection';
import { MemoSyncStatusBar } from './BchatWalletSyncSatusBar';
// import { daemon } from '../../wallet/daemon-rpc';
import { updateSendAddress } from '../../state/ducks/walletConfig';
import { ToastUtils } from '../../bchat/utils';
// import { walletSettingsKey } from '../../data/settings-key';
import classNames from 'classnames';
import { getBchatWalletPasswordModal } from '../../state/selectors/modal';
import styled from 'styled-components';
import { ReceivedForm } from './BchatWalletReceivedForm';
import { walletSettingsKey } from '../../data/settings-key';

export enum WalletPage {
  WalletPassword = 'walletPassword',
  Dashboard = 'dashboard',
  AddressBook = 'addressbook',
  Contact = 'contact',
}

export enum WalletDashboard {
  walletSend = 'walletSend',
  walletReceived = 'walletReceived',
}

export const WalletMainPanel = () => {
  const dispatch = useDispatch();
  // const focusedsettings = useSelector((state: any) => state.walletFocused);
  const walletDetails = useSelector((state: any) => state.wallet);
  const [amount, setAmount] = useState('');
  // const [priority, setPriority] = useState(window.i18n('flash'));
  // const [passScreen, setPassScreen] = useState(true);
  const [notes, setNotes] = useState('');
  const BchatWalletPasswordModal = useSelector(getBchatWalletPasswordModal);
  let decimalValue: any =
    window.getSettingValue(walletSettingsKey.settingsDecimal) || '2 - Two (0.00)';
  decimalValue = decimalValue.charAt(0);
  if (!window.globalOnlineStatus) {
    ToastUtils.pushToastError('internetConnectionError', 'Please check your internet connection');
  }

  function numberOnly(e: any) {
    // const re = /^\d+\.?\d*$/;
    const pattern = /^(\d{0,16}(\.\d{1,5})?|(\d{0,16}\.))$/;
    if (e === '' || pattern.test(e)) {
      setAmount(e);
    }
  }
  function clearStates() {
    setAmount('');
    setNotes('');
    let emptyAddress: any = '';
    dispatch(updateSendAddress(emptyAddress));
  }

  function fillAmount() {
    setAmount((walletDetails.balance / 1e9).toFixed(decimalValue));
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
  // if (WalletPage.AddressBook === focusedsettings) {
  //   return (
  //     <div className="wallet">
  //       <AddressBook from={window.i18n('addressBook')} />
  //     </div>
  //   );
  // }
  // if (WalletPage.Contact === focusedsettings) {
  //   return (
  //     <div className="wallet">
  //       <AddressBook isContact={false}/>
  //     </div>
  //   );
  // }

  return (
    <div className={classNames('wallet', BchatWalletPasswordModal && 'blurBg')}>
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
        fillAmount={() => fillAmount()}
      />
      {/* )} */}
    </div>
  );
};

export const Dashboard = (props: any) => {
  const focusedsettings = useSelector((state: any) => state.walletFocused);
  const focusedInnersection = useSelector((state: any) => state.walletInnerFocused);
  let transactions = useSelector((state: any) => state.wallet.transacations);
  const zoomLevel = window.getSettingValue('zoom-factor-setting');
  const syncBar = window.getSettingValue('sync_bar');
  const getSyncStatus = window.getSettingValue('syncStatus');
  // daemon.daemonHeartbeat();
  return (
    <>
      <WalletHeader />
      <SpacerLG />
      <SyncStatusBox width={syncBar} color={getSyncStatus}>
        <MemoSyncStatusBar />
      </SyncStatusBox>
      <SpacerLG />
      <div className="wallet-contentSpace">
        <Flex container={true} flexDirection="row" width="100%">
          <Leftpane zoomFactor={zoomLevel}>
            <WalletBalanceSection />
            <SpacerMD />
            {WalletPage.AddressBook === focusedsettings ? (
              <div className='address-book-wrapper'><AddressBook isContact={false} /></div>
             
            ) : (
              <TransactionSection transactionList={transactions} />
            )}
          </Leftpane>
          <RightPane zoomFactor={zoomLevel}>
            <WalletPaymentSection clearStates={props.clearStates} />
            {WalletDashboard.walletSend === focusedInnersection && (
              <SendForm
                amount={props.amount}
                setAmount={props.setAmount}
                // priority={props.priority}
                // setPriority={props.setPriority}
                notes={props.notes}
                setNotes={props.setNotes}
                fillAmount={props.fillAmount}
              />
            )}
            {WalletDashboard.walletReceived === focusedInnersection && <ReceivedForm />}
          </RightPane>
        </Flex>
        {/* <BalanceAndsendReceiveAction clearStates={props.clearStates} /> */}
        {/* <SpacerLG />
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
        )} */}
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
type RightPaneProps = {
  zoomFactor:number;
};
type Syncbar = {
  width:string;
  color:string
};
const Leftpane = styled.div<RightPaneProps>`
  // width:45vw;
  // height:${props=>props.zoomFactor==125?'76vh':props.zoomFactor==150 && window.innerWidth<1100? '74vh':props.zoomFactor==150?'73vh' :'79vh'};
  // height:79vh
  margin-right: 15px;
  overflow:${props=>props.zoomFactor>100?'auto':''};
`;

const RightPane = styled.div<RightPaneProps>`
  // width: 25vw;
  width: 50%;
  min-width:${props=>props.zoomFactor?'260px':'320px'} ;

  // height: ${props=>props.zoomFactor==125?'76vh':props.zoomFactor==150 && window.innerWidth<1100? '73.7vh':props.zoomFactor==150?'73vh':'82vh'} ;
  // height:78vh;
  border-radius: 16px;
  background: var(--color-wallet-inner-bg);
  overflow:auto;
`;

const SyncStatusBox = styled.div<Syncbar>`
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: 0px;
    left: ;
    padding: 10px;
    width: ${props => (props.width ? `${props.width}%` : '10%')};
    border-bottom: 2px solid ${props =>(props.color? '#1DBF25':'#FDB12A')};
    transition: width 3s ease-in-out;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: ${props => ((props.width == '100.0')? '12px'  : 'none')};

`;