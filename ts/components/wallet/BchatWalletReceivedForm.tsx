import React from "react"
// import { QRCode } from "react-qr-svg"
import { Flex } from "../basic/Flex"
import { SpacerLG } from "../basic/Text"
import { BchatIcon } from "../icon/BchatIcon"
import { QRCode } from 'react-qrcode-logo';


export const ReceivedForm = () => {
    return <div className="wallet-receivedForm">
        <Flex container={true} flexDirection="row" justifyContent="center" alignItems="center" width="100%">
            <section className="wallet-receivedForm-qrBox">
                <div className="wallet-receivedForm-qrBox-qrView" >
                    <QRCode value={'300'} bgColor="#FFFFFF" fgColor="#1B1B1B" ecLevel="M" size={185} qrStyle={'dots'}
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
                    <input value={1000} className="wallet-receivedForm-rightSide-input" />
                </div>
                <SpacerLG />
                <div className="wallet-receivedForm-rightSide-btn">
                    <BchatIcon iconType="copy" iconSize={'small'} />
                    <span style={{ marginLeft: '3px' }}>{window.i18n("copyAddress")}</span>

                </div>
            </div>

        </Flex>
    </div>
}