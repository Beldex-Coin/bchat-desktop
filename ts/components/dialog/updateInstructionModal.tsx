import React, { useState } from "react";
import { SpacerLG, SpacerMD } from "../basic/Text";
import { BchatButton, BchatButtonColor } from "../basic/BchatButton";
import { clipboard } from "electron";
import { getCurrentRecoveryPhrase } from "../../util/storage";
import { ToastUtils } from "../../bchat/utils";
import { sendConfigMessageAndDeleteEverything } from "./DeleteAccountModal";



export default function BchatUpdateInstruntion() {
    const [copied, setCopied] = useState(false);

    function copyToClipboard() {
        clipboard.writeText(getCurrentRecoveryPhrase(), 'clipboard');
        setCopied(true)
        ToastUtils.pushCopiedToClipBoard();
    }

    async function clearData() {
        await sendConfigMessageAndDeleteEverything("oldVersion");
    }

    return <div className="modal">


        <section className="contentUpdateModal">
            <SpacerLG />
            {/* <img src={require('../../../images/bchat/Update_icon.svg')} className="modal-UpdateModal-icon" /> */}
            <img src='images/bchat/Update_icon.svg' className="modal-UpdateModal-icon"></img>
            <SpacerMD />
            <div>BChat Wallet Update</div>
            <SpacerLG />
            <div className="modal-UpdateModal-discription">
                The Beldex wallet has been integrated to BChat. Restore your app to gain access your BChat account.
                First, copy your recovery seed by clicking <span className="modal-UpdateModal-discription-fontMedium">'Copy Seed'</span>. Save your recovery seed. Then click <span className="modal-UpdateModal-discription-fontMedium">'Restore'</span> to restore your
                account using the seed.
            </div>
            <SpacerLG />

            <div className="modal-UpdateModal-btnBox">
                <BchatButton
                    text="Copy Seed"
                    buttonColor={BchatButtonColor.Green}
                    onClick={() => copyToClipboard()}
                />
                <SpacerMD />
                <BchatButton
                    text="Restore"
                    buttonColor={BchatButtonColor.Primary}
                    onClick={() => clearData()}
                    disabled={!copied}
                />
            </div>

            <SpacerLG />

        </section>
    </div>
}