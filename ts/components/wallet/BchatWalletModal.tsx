import classNames from "classnames"
import React, { useState } from "react"
import { BchatButtonColor } from "../basic/BchatButton"
import { SpacerSM } from "../basic/Text"
import { BchatWrapperModal } from "../BchatWrapperModal"
import { useKey } from "react-use"
import { BchatIcon } from "../icon"
import { Constants } from '../../bchat';


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
            // headerReverse={true}
            okButton={{
                text: window.i18n('save'),
                color: BchatButtonColor.Primary,
                onClickOkHandler: () => { props.onClick(select) }
            }}
            cancelButton={{
                status: true,
                text: window.i18n('cancel'),
                onClickCancelHandler: props.onClose
            }}
        >
            <div className="bchat-modal__centered">
                <div className="bchat-modal__walletModel">
                    <div style={{ width: '100%', overflowY: 'auto' }}>
                        {props.content.length !== 0 && props.content.map((item: any, i: any) => <>
                            <div className={classNames("bchat-modal__centered-walletModalContent", select === item && "isSelect")} key={i}

                                onClick={() => setSelect(item)} >
                                <div
                                    className={
                                        select !== item ? 'bchat-modal__centered-walletModalContent-circle' : 'selected'
                                    }
                                >
                                    {select === item && (
                                        <BchatIcon
                                            iconType="circle"
                                            iconSize={10}
                                            iconColor={Constants.UI.COLORS.GREEN}
                                        />
                                    )}
                                </div>
                                {item}
                            </div>
                            <SpacerSM />
                        </>)}
                    </div>
                    {/* <SpacerMD /> */}
                </div>
                {/* <div className="bchat-modal__button-group__center"> */}
                {/* <BchatButton
                        text={window.i18n('cancel')}
                        buttonType={BchatButtonType.Default}
                        buttonColor={BchatButtonColor.Primary}
                        onClick={props.onClose}
                        style={{
                            width: '100px',
                            borderRadius: '5px'
                        }}
                    /> */}
                {/* <BchatButton
                        text={window.i18n('save')}
                        buttonType={BchatButtonType.Default}
                        buttonColor={BchatButtonColor.Green}
                        onClick={() => { props.onClick(select) }}
                        style={{
                            width: '100px',
                            borderRadius: '5px'
                        }}
                    /> */}

                {/* </div> */}
            </div>
        </BchatWrapperModal>
    </div>
}