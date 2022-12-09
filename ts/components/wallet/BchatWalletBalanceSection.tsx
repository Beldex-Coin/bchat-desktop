import React from "react"
import { useSelector } from "react-redux";
import { SpacerMD, SpacerSM, SpacerXS } from "../basic/Text"
import { BchatIcon } from "../icon/BchatIcon";
// import { walletHelper } from "./BchatWalletHelper";



export const WalletBalanceSection = () => {
   let wallet = useSelector((state: any) => state.wallet);
   let walletAddress = localStorage.getItem("userAddress");
   // const balanceConv = walletHelper.currencyConversion(balance);

//  console.log ("walletBalance :: ",wallet)

   return (
      <div className="wallet-squarBox">
         <div style={{ display: "flex" }}>
            <div className="wallet-left-balance-Sec">
               <SpacerXS />

               <div className="flexCenter" >
                  <BchatIcon iconSize={13} iconType="wallet" />
                  <span className="marginLeft">Balance</span>
               </div>
               <SpacerSM />
               <div className="wallet-left-balance-Sec-balanceTxt">{wallet.balance} <span className="marginRight">BDX</span>
                  <BchatIcon iconSize="medium" iconType="eye" />
               </div>
               <div className="wallet-left-balance-Sec-realCurrencyTxt">
                  {wallet.balanceConvert} <span>USD</span>
               </div>
            </div>
            <div className="wallet-right-Button-Sec">
               <SpacerXS />
               <div className="wallet-right-Button-Sec-fetch-btn">
                  <BchatIcon iconSize="tiny" iconType="fetch" />
                  <span style={{ marginLeft: '2px' }}>Fetch Balance & Txn</span>
               </div>
               <SpacerSM />

               <div className="wallet-right-Button-Sec-unlockbal-box" >
                  <span className="wallet-right-Button-Sec-unlockbal-box--Text">Unlocked</span>
                  <span className="wallet-right-Button-Sec-unlockbal-box--verticalLine"></span>
                  <span className="unBalance">{wallet.unlocked_balance}</span>
               </div>


            </div>
         </div>
         <SpacerMD />
         <div className="wallet-myAddress-Box" >
            <div className="wallet-myAddress-Box-content">
               {walletAddress}
            </div>
            <div className="wallet-myAddress-Box-copyIcon-box">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 18.151 18.151">
                  <path id="copy_icon" d="M3.815,2A1.815,1.815,0,0,0,2,3.815V16.521H3.815V3.815H16.521V2Zm3.63,3.63A1.815,1.815,0,0,0,5.63,7.445V18.336a1.815,1.815,0,0,0,1.815,1.815H18.336a1.815,1.815,0,0,0,1.815-1.815V7.445A1.815,1.815,0,0,0,18.336,5.63Zm0,1.815H18.336V18.336H7.445Z" transform="translate(-2 -2)" />
               </svg>
            </div>
         </div>

      </div>
   )
}