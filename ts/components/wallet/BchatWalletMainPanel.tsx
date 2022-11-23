import React from "react"
import { Flex } from "../basic/Flex"
import { SpacerLG } from "../basic/Text"
// import { AddressBook } from "./BchatWalletAddressBook"
import { WalletBalanceSection } from "./BchatWalletBalanceSection"
import { WalletHeader } from "./BchatWalletHeader"
// import { WalletPassword } from "./BchatWalletPassword"
// import { NodeSetting } from "./BchatWalletNodeSetting"
import { WalletPaymentSection } from "./BchatWalletPaymentSection"
import { ReceivedForm } from "./BchatWalletReceivedForm"
//  import { WalletSettings } from "./BchatWalletSettings"
// import { SendForm } from "./BchatWalletSendForm"
// import { SyncStatusBar } from "./BchatWalletSyncSatusBar"
// import { TransactionSection } from "./BchatWalletTransactionSection"

export enum WalletPage
{
   WalletPassword="walletPassword",
   Dashboard="dashboard",

}
export const WalletMainPanel = () => {

   return (
      <div className="wallet">

        {/* <WalletPassword /> */}
         <Dashboard />
         {/* <AddressBook /> */}
         {/* <NodeSetting /> */}
        {/* <WalletSettings /> */}
         {/* <SyncStatusBar /> */}
      </div>
   )
}

export const Dashboard=()=>
{
 return(
   <>
    <WalletHeader />
         <SpacerLG />
         <div className="wallet-contentSpace">
          <BalanceAndsendReceiveAction />
         <SpacerLG />
         {/* <SendForm /> */}
         {/* <TransactionSection /> */}
         <ReceivedForm /> 

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