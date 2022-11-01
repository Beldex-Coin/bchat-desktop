import React from "react"
import { BchatButton, BchatButtonColor, BchatButtonType } from "../basic/BchatButton"
import { BchatInput } from "../basic/BchatInput"
import { Flex } from "../basic/Flex"
import {  } from "../leftpane/ActionsPanel"

import { GoBackMainMenuButton } from "./SignUpTab"

 export const WalletPassword=(props:any)=>{
  
  return(
    <div>
         <div className="bchat-registration__content" style={{paddingTop:'0px'}}>
      <Flex flexDirection="row" container={true} alignItems="center" padding="14px 0px" margin='0px 0px 0px 51px'>
          <div className='bchat-registration-goback-icon'>
            <GoBackMainMenuButton assent={props.backArrow} />
        </div>
        <Flex className="bchat-registration__welcome-bchat">
        Wallet Password
        </Flex>
      </Flex>
       <p className="bchat-registration-container-walletHintText">Create New Wallet Password </p>
         <BchatInput
      label={"Enter Password"}
      type="password"
      value={props.password}
      autoFocus={false}
      placeholder={"Enter Password"}
      enableShowHide={true}
      onValueChanged={props.setPassword}
      maxLength={13}
    />
    <div style={{height:'55px'}}></div>
     <BchatInput
      label={"Re-Enter Password"}
      type="password"
      value={props.repassword}
      autoFocus={false}
      placeholder={"Re-Enter Password"}
      enableShowHide={true}
      onValueChanged={props.setRepassword}
      maxLength={13}
    />
 <div style={{height:'50px'}}></div>
 <div style={{width:'75%',margin:'auto'}}>
 <BchatButton
        onClick={()=>props.submit()}
        buttonType={BchatButtonType.Brand}
        buttonColor={BchatButtonColor.Green}
        text={window.i18n('continue')}
      />
  </div>

      </div>
      <p className="warning-notes"><span>Note:</span> Your wallet password will be used to authenticate transactions on BChat.<strong>Keep Your Wallet Password Safe.</strong>  If you forget the password, you can reset it only by restoring your BChat account using your Recovery Seed.</p>
    </div>
  )
}