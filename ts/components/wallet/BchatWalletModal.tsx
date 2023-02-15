import classNames from "classnames"
import React, { useState } from "react"
import { BchatButton, BchatButtonColor, BchatButtonType } from "../basic/BchatButton"
import { SpacerLG, SpacerMD, SpacerSM } from "../basic/Text"
import { BchatWrapperModal } from "../BchatWrapperModal"
import { useKey } from "react-use"


export const WalletModal = (props: any) => {
    const [select, setSelect] = useState(props.currency);
    useKey((event: KeyboardEvent) => {
        props.onClick(select)
        return event.key === 'Enter';
    });
    return <div>
        <BchatWrapperModal
            title={props.headerName}
            onClose={props.onClose}
            showExitIcon={false}
            headerReverse={true}
        >
            <SpacerLG />
            <div className="bchat-modal__centered">
                <div style={{ width: '100%', height: '148px', overflowY: 'auto' }}>
                    {props.content.length !== 0 && props.content.map((item: any, i: any) => <>
                        <div className={classNames("bchat-modal__centered-walletModalContent", select === item && "isSelect")} key={i}
                            onClick={() => setSelect(item)} >
                            {item}
                        </div>
                        <SpacerSM />
                    </>)}
                </div>
                <SpacerMD />
                <div className="bchat-modal__button-group__center">
                    <BchatButton
                        text={window.i18n('cancel')}
                        buttonType={BchatButtonType.Default}
                        buttonColor={BchatButtonColor.Primary}
                        onClick={props.onClose}
                        style={{
                            width: '100px',
                            borderRadius: '5px'
                        }}
                    />
                    <BchatButton
                        text={window.i18n('save')}
                        buttonType={BchatButtonType.Default}
                        buttonColor={BchatButtonColor.Green}
                        onClick={() => { props.onClick(select) }}
                        style={{
                            width: '100px',
                            borderRadius: '5px'
                        }}
                    />

                </div></div>
        </BchatWrapperModal>
    </div>
}