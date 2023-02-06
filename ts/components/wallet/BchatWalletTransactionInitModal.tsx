
import React from "react"
import { BchatButton, BchatButtonColor, BchatButtonType } from "../basic/BchatButton"
// import { Flex } from "../basic/Flex"
import { SpacerLG, SpacerMD } from "../basic/Text"
import { BchatWrapperModal } from "../BchatWrapperModal"
// import { BchatIcon } from "../icon"
import { useDispatch } from "react-redux"
import { updateTransactionInitModal } from "../../state/ducks/modalDialog"


export const TransactionInitModal = (props: any) => {
    const dispatch = useDispatch()
    return <div>
        <BchatWrapperModal
            title={window.i18n('transactionInitiated')}
            onClose={props.onClose}
            showExitIcon={false}
            headerReverse={true}
        >
            <SpacerLG />
            <div className="bchat-modal__centered">
                <svg xmlns="http://www.w3.org/2000/svg" width="50.555" height="50.555" viewBox="0 0 66.555 66.555">
                    <g id="icons8-ok" transform="translate(-8.304 -6.87)">
                        <path id="Path_4809" data-name="Path 4809" d="M73.555,39.278A33.278,33.278,0,1,1,40.278,6,33.281,33.281,0,0,1,73.555,39.278Z" transform="translate(1.304 0.87)" fill="#1bb51e" />
                        <path id="Path_4810" data-name="Path 4810" d="M50.872,21.976,30.646,42.226l-6.968-6.948a3.327,3.327,0,0,0-4.7,0h0a3.329,3.329,0,0,0,0,4.709l9.32,9.3a3.327,3.327,0,0,0,4.7,0L55.58,26.68a3.329,3.329,0,0,0,0-4.705h0A3.328,3.328,0,0,0,50.872,21.976Z" transform="translate(4.946 5.836)" fill="#fff" />
                    </g>
                </svg>
            </div>
            <SpacerMD />
            <div className="bchat-modal__button-group__center">
                <BchatButton
                    text={window.i18n('ok')}
                    buttonType={BchatButtonType.BrandOutline}
                    buttonColor={BchatButtonColor.Green}
                    onClick={() => { dispatch(updateTransactionInitModal(null)) }}
                />
            </div>
        </BchatWrapperModal>
    </div>
}