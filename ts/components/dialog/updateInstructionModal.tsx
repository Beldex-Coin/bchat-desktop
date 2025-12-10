import { useState } from "react";
import { SpacerLG, SpacerMD } from "../basic/Text";
import { BchatButton, BchatButtonColor } from "../basic/BchatButton";
import { clipboard } from "electron";
import { getCurrentRecoveryPhrase } from "../../util/storage";
// import { ToastUtils } from "../../bchat/utils";
import { sendConfigMessageAndDeleteEverything } from "./DeleteAccountModal";
import styled from "styled-components";



export default function BchatUpdateInstruntion() {
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    function copyToClipboard() {
        clipboard.writeText(getCurrentRecoveryPhrase(), 'clipboard');
        setCopied(true)
        // ToastUtils.pushCopiedToClipBoard();
    }

    async function clearData() {
        setLoading(true)
        await sendConfigMessageAndDeleteEverything("oldVersion");
        setLoading(false)

    }

    return <div className="modal modal-center">

        {loading &&
            <Loader>
                <div className="modal-UpdateModal-loader">
                    <img
                        src={'images/bchat/Load_animation.gif'}
                        style={{ width: '150px', height: '150px' }}
                    />
                </div>
            </Loader>}
        <section className="contentUpdateModal">
            <SpacerLG />
            <img src='images/bchat/Update_icon.svg' className="modal-UpdateModal-icon"></img>
            <SpacerMD />
            <div className="modal-UpdateModal-header">BChat Wallet Update</div>
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
const Loader = styled.div`
    position: absolute;
    // top: 0;
    display: flex;
    // justify-content: center;
    /* width: 100%; */
    // width: 100Vw;
    // height: 100%;
    align-items: center;
    z-index: 101;
  `;