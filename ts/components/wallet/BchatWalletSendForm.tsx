import React from "react"
import { BchatButton, BchatButtonColor, BchatButtonType } from "../basic/BchatButton"
// import { BchatInput } from "../basic/BchatInput"
// import { BchatIdEditable } from "../basic/BchatIdEditable"
import { Flex } from "../basic/Flex"
import { SpacerLG, } from "../basic/Text"



export const SendForm = () => {

    return (
        <div className="wallet-sendForm">
            <Flex
                container={true}
                flexDirection='row'
                justifyContent="space-between"
            >
                <Flex width="48%">
                    <Flex
                        container={true}
                        flexDirection='row'
                        justifyContent="center"
                        alignItems="center"
                        width="100%"
                    >
                        <span style={{ width: "20%" }}>{window.i18n('amount')}</span>
                        <div className="wallet-sendForm-inputBox">
                            <input value="10" />

                        </div>
                    </Flex>
                </Flex>
                <Flex width="48%">
                    <Flex
                        container={true}
                        flexDirection='row'
                        justifyContent="center"
                        alignItems="center"
                        width="100%"
                    >
                        <span style={{ width: "20%" }}>{window.i18n('priority')}</span>
                        <div className="wallet-sendForm-inputBox">
                            <input value="10" />

                        </div>
                    </Flex>
                </Flex>
            </Flex>
            <SpacerLG />
            <div>
                <Flex
                    container={true}
                    flexDirection='row'
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                >
                    <span style={{ width: "8.9%" }}>{window.i18n('address')}</span>
                    <div className="wallet-sendForm-inputBox">
                        <input value="10" />
                        <BchatButton
                            text={window.i18n('contact')}
                            //   onClick={this.onSave}
                            buttonType={BchatButtonType.Brand}
                            buttonColor={BchatButtonColor.Green}
                        //   disabled={!caption}
                        />
                    </div>
                </Flex>

            </div>
            <SpacerLG />
            <div>
                <Flex
                    container={true}
                    flexDirection='row'
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                >
                    <span style={{ width: "8.9%" }}>{window.i18n('notes')}</span>
                    <div className="wallet-sendForm-inputBox">
                        <textarea value={'notes'} className="wallet-sendForm-textArea" />


                    </div>
                </Flex>

            </div>
            <SpacerLG />
            <div className="wallet-sendForm-sendBtnBox">
            <BchatButton
                text={window.i18n('sent')}
                //   onClick={this.onSave}
                buttonType={BchatButtonType.Brand}
                buttonColor={BchatButtonColor.Green}
            //   disabled={!caption}
            />
</div>
        </div>
    )
}
