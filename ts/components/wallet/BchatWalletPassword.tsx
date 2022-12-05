import React, { useState } from "react"
import { pushToastError, pushToastSuccess } from "../../bchat/utils/Toast"
import { useDispatch, useSelector } from "react-redux"
import { dashboard } from "../../state/ducks/walletSection"
import { BchatButton, BchatButtonColor, BchatButtonType } from "../basic/BchatButton"
import { SpacerLG, SpacerMD } from "../basic/Text"
import { BchatIcon } from "../icon"
import { wallet } from '../../wallet/wallet-rpc'

export const WalletPassword = () => {
    const [password, setValue] = useState("")
    const dispatch = useDispatch();
    const userId = useSelector((state: any) => state.user.ourNumber);
    const UserDetails = useSelector((state: any) => state.conversations.conversationLookup);

    async function submit() {
        let profileName = UserDetails[userId].profileName;
        let openWallet = await wallet.sendRPC("open_wallet", {
            filename: profileName,
            password
        });
        if (openWallet.hasOwnProperty("error")) {
            pushToastError("walletInvalidPassword",openWallet.error?.message );
        } else {
            pushToastSuccess("successPassword", "Success.");
            dispatch(dashboard())
        }
    }
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
                <input type={'text'} value={password} onChange={(e) => setValue(e.target.value)} />
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
                    onClick={() => submit()}
                />
            </div>
            <SpacerLG />
        </div>
    </div>
}
