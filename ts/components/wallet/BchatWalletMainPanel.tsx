import React, { useState } from "react"
import { useSelector } from "react-redux"
// import { WalletStateType } from "../../state/ducks/walletSection"
import { Flex } from "../basic/Flex"
import { SpacerLG } from "../basic/Text"
import { AddressBook } from "./BchatWalletAddressBook"
import { WalletBalanceSection } from "./BchatWalletBalanceSection"
import { WalletHeader } from "./BchatWalletHeader"
import { WalletPassword } from "./BchatWalletPassword"
import { NodeSetting } from "./BchatWalletNodeSetting"
import { WalletPaymentSection } from "./BchatWalletPaymentSection"
import { ReceivedForm } from "./BchatWalletReceivedForm"
import { WalletSettings } from "./BchatWalletSettings"
import { SendForm } from "./BchatWalletSendForm"
import { TransactionSection } from "./BchatWalletTransactionSection"
// import { SendForm } from "./BchatWalletSendForm"
import { SyncStatusBar } from "./BchatWalletSyncSatusBar"
// import { TransactionSection } from "./BchatWalletTransactionSection"
import { daemon } from '../../wallet/daemon-rpc';
import { wallet } from '../../wallet/wallet-rpc';


export enum WalletPage {
   WalletPassword = "walletPassword",
   Dashboard = "dashboard",
   AddressBook = "addressbook",
   Setting = "setting",
   NodeSetting = "nodeSetting",
   Contact = "contact"
}

export enum WalletDashboard {
   walletSend = "walletSend",
   walletReceived = "walletReceived",
   walletTransaction = "walletTransaction"
}

 
export const WalletMainPanel = () => {
   const focusedsettings = useSelector((state: any) => state.walletFocused);
   const [amount, setAmount] = useState(0);
   const [priority, setPriority] = useState(window.i18n("flash"));
   const [passScreen,setPassScreen]=useState(true);

   function numberOnly(e: any) {
      if (isNaN(e)) {
         return
      }
      setAmount(e)
   }


   //   console.log("focusedsettings:",focusedsettings,WalletPage.WalletPassword);

   //   if(WalletPage.WalletPassword===focusedsettings)
   //   {
   //       return  <div className="wallet"> <WalletPassword />
   //       </div>
   //   }
   if(passScreen)
   {
      return <div className="wallet"><WalletPassword  onClick={()=>{setPassScreen(!passScreen)}}/> </div>
   }
   // if (WalletPage.Dashboard === focusedsettings) {

   //    return <div className="wallet"><Dashboard amount={amount} setAmount={(e: any) => { numberOnly(e) }} priority={priority} setPriority={(e: any) => setPriority(e)} />
   //       {/* <SyncStatusBar /> */}
   //    </div>
   // }
   if (WalletPage.AddressBook === focusedsettings) {
      return <div className="wallet"><AddressBook name={window.i18n('addressBook')} />
      </div>
   }
   if (WalletPage.Contact === focusedsettings) {
      return <div className="wallet"><AddressBook name={window.i18n('contact')} />
      </div>
   }
   if (WalletPage.Setting === focusedsettings) {
      return <div className="wallet"><WalletSettings />
      </div>
   }
   if (WalletPage.NodeSetting === focusedsettings) {
      return <div className="wallet"><NodeSetting />
      </div>
   }
   // walletheartAction();

   return (
      <div className="wallet">

         {WalletPage.Dashboard === focusedsettings &&
      <Dashboard amount={amount} setAmount={(e: any) => { numberOnly(e) }} priority={priority} setPriority={(e: any) => setPriority(e)} />
         }

         {/* <WalletPassword /> */}
         {/* <AddressBook /> */}
         {/* <NodeSetting /> */}
         {/* <WalletSettings /> */}

      </div>
   )
}

export const Dashboard = (props: any) => {
   const focusedInnersection = useSelector((state: any) => state.walletInnerFocused)
   wallet.startHeartbeat();
   daemon.daemonHeartbeat();

   return (
      <>
         <WalletHeader />
         <SpacerLG />
         <div className="wallet-contentSpace">
            <BalanceAndsendReceiveAction />
            <SpacerLG />
            {WalletDashboard.walletSend === focusedInnersection && <SendForm amount={props.amount} setAmount={props.setAmount}
               priority={props.priority} setPriority={props.setPriority} />}
            {WalletDashboard.walletReceived === focusedInnersection && <ReceivedForm />}
            {WalletDashboard.walletTransaction === focusedInnersection && <TransactionSection />}

            {/* <SendForm /> */}
            {/* <TransactionSection /> */}

            <SyncStatusBar />
         </div>
      </>
   )
}
export const BalanceAndsendReceiveAction = () => {
   return (
      <Flex
         container={true}
         flexDirection="row"
         justifyContent="space-between"
      >
         <WalletBalanceSection />
         <WalletPaymentSection />
      </Flex>

   )
}