import classNames from "classnames"
import React from "react"
import { BchatButton, BchatButtonColor, BchatButtonType } from "../basic/BchatButton"
// import { Flex } from "../basic/Flex"
import { SpacerLG, SpacerMD, SpacerSM } from "../basic/Text"
import { BchatWrapperModal } from "../BchatWrapperModal"


export const WalletModal = (props:any) => {

    // console.log("content",props.content,props.headerName);

    // console.log('props.onClose',props.onClose);
    
    
    // const isSelect=1;
    return <div>
        <BchatWrapperModal
            title={props.headerName}
             onClose={props.onClose}
            showExitIcon={true}
            headerReverse={true}
        >
            <SpacerLG />


            <div className="bchat-modal__centered">
                <div style={{width: '100%',height: '148px',overflowY: 'auto'}}>
                {props.content.length!==0&&props.content.map((item:any,i:any)=><>
                    <div className={classNames("bchat-modal__centered-walletModalContent",props.currency===item&&"isSelect")} key={i} onClick={()=>{props.onClick(item)}}>
                    {item}
                </div>
                <SpacerSM />
                </>)}
                </div>
                {/* <div className={classNames("bchat-modal__centered-walletModalContent",isSelect==1&&"isSelect")}>

                    {props.content[1]}
                </div>
                <SpacerSM />
                <div className={classNames("bchat-modal__centered-walletModalContent",isSelect==1&&"isSelect")}>

                    {props.content[2]}
                </div> */}
                <SpacerMD />
                <SpacerMD />
                {/* <div className="wallet-settings-modalBtnGrp"> */}
                <div className="bchat-modal__button-group__center">
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

                </div></div>


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