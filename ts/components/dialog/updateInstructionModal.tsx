import { useState } from "react";
import { SpacerLG, SpacerMD } from "../basic/Text";
import { BchatButton, BchatButtonColor } from "../basic/BchatButton";
import { clipboard } from "electron";
import { getCurrentRecoveryPhrase } from "../../util/storage";
// import { ToastUtils } from "../../bchat/utils";
import { sendConfigMessageAndDeleteEverything } from "./DeleteAccountModal";
import styled from "styled-components";



const COPY_SEED_MARKER = '\u0001';
const RESTORE_MARKER = '\u0002';

// Fills the button-label placeholders with markers, then swaps each marker for the
// translated label in bold, so the text always matches the buttons below it.
const RestoreInstructions = () => {
    const labels: Record<string, string> = {
        [COPY_SEED_MARKER]: window.i18n('copySeed'),
        [RESTORE_MARKER]: window.i18n('restore'),
    };
    const parts = window
        .i18n('bchatUpdateRestoreInstructions', [COPY_SEED_MARKER, RESTORE_MARKER])
        .split(new RegExp(`(${COPY_SEED_MARKER}|${RESTORE_MARKER})`));

    return <>
        {parts.map((part, index) =>
            labels[part]
                ? <span key={index} className="modal-UpdateModal-discription-fontMedium">{labels[part]}</span>
                : part
        )}
    </>;
};

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
            <div className="modal-UpdateModal-header">{window.i18n('bchatUpdateTitle')}</div>
            <SpacerLG />
            <div className="modal-UpdateModal-discription">
                <RestoreInstructions />
            </div>
            <SpacerLG />

            <div className="modal-UpdateModal-btnBox">
                <BchatButton
                    text={window.i18n('copySeed')}
                    buttonColor={BchatButtonColor.Green}
                    onClick={() => copyToClipboard()}
                />
                <SpacerMD />
                <BchatButton
                    text={window.i18n('restore')}
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