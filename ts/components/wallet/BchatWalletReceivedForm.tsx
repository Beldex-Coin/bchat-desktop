import React, { useState } from "react"
// import { QRCode } from "react-qr-svg"
import { Flex } from "../basic/Flex"
import { SpacerLG } from "../basic/Text"
import { BchatIcon } from "../icon/BchatIcon"
import { QRCode } from 'react-qrcode-logo';
import { copyBchatID } from "../dialog/EditProfileDialog";



export const ReceivedForm = () => {
    let walletAddress = localStorage.getItem("userAddress");
    const [txnAmount,setTxnAmount]=useState()

     let qrValue=`Beldex:${walletAddress}?tx_amount=${txnAmount}`

     function validator(e:any)
     {
        if (isNaN(e)) {
            return
         }
         setTxnAmount(e)
     }
    return <>
     <div className="wallet-receivedForm">
        <Flex container={true} flexDirection="row" justifyContent="center" alignItems="center" width="100%">
            <section className="wallet-receivedForm-qrBox">
                <div className="wallet-receivedForm-qrBox-qrView" >
                    <QRCode value={qrValue} bgColor="#FFFFFF" fgColor="#1B1B1B" ecLevel="M" size={185} qrStyle={'dots'}
                        logoImage={'images/wallet/beldex_watermark_qr.svg'}
                    />
                </div>
            </section>
            <div className="wallet-receivedForm-rightSide">
                <div className="wallet-receivedForm-rightSide-Title">
                    {window.i18n("receiveBDX")}
                </div>
                <div className="wallet-receivedForm-rightSide-label">
                    {window.i18n("hintReceiveBDX")}
                </div>
                <div >
                    <input value={txnAmount} className="wallet-receivedForm-rightSide-input"  
                    placeholder={window.i18n("enterAmount")}
                    onChange={(e:any)=>validator(e.target.value)}/>
                </div>
                <SpacerLG />
                <div className="wallet-receivedForm-rightSide-btn" onClick={()=>copyBchatID(walletAddress)}>
                    <BchatIcon iconType="copy" iconSize={'small'} />
                    <span style={{ marginLeft: '3px' }}>{window.i18n("copyAddress")}</span>

                </div>
            </div>

        </Flex>
    </div>
    <SpacerLG />
    <SpacerLG />
    <SpacerLG />
    </>
}