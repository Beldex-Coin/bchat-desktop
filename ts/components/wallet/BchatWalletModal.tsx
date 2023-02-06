import classNames from "classnames"
import React, { useState } from "react"
import { BchatButton, BchatButtonColor, BchatButtonType } from "../basic/BchatButton"
import { SpacerLG, SpacerMD, SpacerSM } from "../basic/Text"
import { BchatWrapperModal } from "../BchatWrapperModal"


export const WalletModal = (props:any) => {
   const[select,setSelect]=useState(props.currency);
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
                    <div className={classNames("bchat-modal__centered-walletModalContent",select===item&&"isSelect")} key={i} 
                    onClick={()=>setSelect(item)} >
                    {item}
                </div>
                <SpacerSM />
                </>)}
                </div>
                <SpacerMD />
                <div className="bchat-modal__button-group__center">
                    <BchatButton
                        text={window.i18n('cancel')}
                        buttonType={BchatButtonType.BrandOutline}
                        buttonColor={BchatButtonColor.Primary}
                        onClick={props.onClose}
                    />
                    <BchatButton
                        text={window.i18n('save')}
                        buttonType={BchatButtonType.BrandOutline}
                        buttonColor={BchatButtonColor.Green}
                        onClick={()=>{props.onClick(select)}}
                    />

                </div></div>
        </BchatWrapperModal>
    </div>
}