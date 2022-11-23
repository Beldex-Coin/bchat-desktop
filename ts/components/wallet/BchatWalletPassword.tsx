import React, { useState } from "react"
import { BchatButton, BchatButtonColor, BchatButtonType } from "../basic/BchatButton"
import { SpacerLG, SpacerMD } from "../basic/Text"
import { BchatIcon } from "../icon"

export const WalletPassword = () => {
    const [value, setValue] = useState("")
    return <div className="wallet-walletPassword">
        <div className="wallet-walletPassword-contentBox">
             <SpacerLG />
             <SpacerLG />
            <div className="wallet-walletPassword-contentBox-walletImg">
            </div>
            <SpacerMD />
            <div className="wallet-walletPassword-contentBox-headerBox">
                <BchatIcon iconType="lock" iconSize={"small"} />
                <span>{window.i18n('enterWalletPassword')}</span>
            </div>
            <SpacerMD />
            <div className="wallet-walletPassword-contentBox-inputBox">
                <input type={'text'} value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
            <SpacerMD />
            <div className="wallet-walletPassword-contentBox-forgotTxt">
                {window.i18n("forgotPassword")}
            </div>
            <SpacerMD />
            <div>
                <BchatButton
                    text={window.i18n('continue')}
                    buttonType={BchatButtonType.BrandOutline}
                    buttonColor={BchatButtonColor.Green}
                //   onClick={this.initClearDataView}
                />
            </div>
            <SpacerLG />
        </div>
    </div>
}