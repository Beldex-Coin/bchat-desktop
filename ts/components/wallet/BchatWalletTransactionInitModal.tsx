
import React from "react"
import { BchatButton, BchatButtonColor, BchatButtonType } from "../basic/BchatButton"
// import { Flex } from "../basic/Flex"
import { SpacerLG, SpacerMD } from "../basic/Text"
import { BchatWrapperModal } from "../BchatWrapperModal"
import { BchatIcon } from "../icon"
import { useDispatch } from "react-redux"
import { updateTransactionInitModal } from "../../state/ducks/modalDialog"


export const TransactionInitModal = (props: any) => {
const dispatch=useDispatch()
    return <div>
        <BchatWrapperModal
            title={window.i18n('transactionInitiated')}
            onClose={props.onClose}
            showExitIcon={false}
            headerReverse={true}
        >
            <SpacerLG />


            <div className="bchat-modal__centered">
                <BchatIcon
                    iconType="tickCircle"
                    iconColor="#FFF"
                    iconSize={50}
                    iconPadding={'15px'}
                    backgroundColor={'#159B24'}
                    borderRadius={'40px'}
                />
            </div>
            <SpacerMD />
            <div className="bchat-modal__button-group__center">
                
                <BchatButton
                    text={window.i18n('ok')}
                    buttonType={BchatButtonType.BrandOutline}
                    buttonColor={BchatButtonColor.Green}
                 onClick={()=>{dispatch(updateTransactionInitModal(null))}}
                />

            </div>


            {/* <BchatSpinner loading={isLoading} /> */}
            {/* </div> */}
        </BchatWrapperModal>
        {/* <div>
            <header>{window.i18n('displayCurrency')}</header>
           

            <SpacerLG />
            <Flex container={true} >
            <BchatButton
              text={window.i18n('cancel')}
              buttonType={BchatButtonType.BrandOutline}
              buttonColor={BchatButtonColor.Primary}
            //   onClick={this.initClearDataView}
            />
            <BchatButton
              text={window.i18n('save')}
              buttonType={BchatButtonType.BrandOutline}
              buttonColor={BchatButtonColor.Green}
            //   onClick={this.initClearDataView}
            />
            </Flex>
    </div> */}
    </div>
}