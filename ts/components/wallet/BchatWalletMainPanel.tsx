import React from "react"
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
// import { SendForm } from "./BchatWalletSendForm"
 import { SyncStatusBar } from "./BchatWalletSyncSatusBar"
// import { TransactionSection } from "./BchatWalletTransactionSection"

export enum WalletPage
{
   WalletPassword="walletPassword",
   Dashboard="dashboard",
   AddressBook="addressbook",
   Setting="setting",
   NodeSetting="nodeSetting",



}
export const WalletMainPanel = () => {
  const focusedsettings=useSelector((state:any)=>state.walletFocused);
//   console.log("focusedsettings:",focusedsettings,WalletPage.WalletPassword);
  
//   if(WalletPage.WalletPassword===focusedsettings)
//   {
//       return  <div className="wallet"> <WalletPassword />
//       </div>
//   }
  if(WalletPage.Dashboard===focusedsettings)
  {
      return <div className="wallet"><Dashboard />
         <SyncStatusBar />
      </div>
  }
 if(WalletPage.AddressBook===focusedsettings)
  {
      return <div className="wallet"><AddressBook  />
      </div>
  }
  if(WalletPage.Setting===focusedsettings)
  {
      return  <div className="wallet"><WalletSettings  />
      </div>
  }
  if(WalletPage.NodeSetting===focusedsettings)
  {
      return  <div className="wallet"><NodeSetting  />
      </div>
  }
   return (
      <div className="wallet">
      
        {WalletPage.WalletPassword===focusedsettings&&<WalletPassword />}     
         {/* <AddressBook /> */}
         {/* <NodeSetting /> */}
        {/* <WalletSettings /> */}
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