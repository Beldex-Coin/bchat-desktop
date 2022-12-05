
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import  classNames  from "classNames"
import { updateSendAddress } from "../../state/ducks/walletConfig"
import { walletSendPage } from "../../state/ducks/walletInnerSection"
import { dashboard } from "../../state/ducks/walletSection"
import { getDirectContacts } from "../../state/selectors/conversations"
// import { getWalletSendAddress } from "../../state/selectors/walletConfig"
import { Flex } from "../basic/Flex"
import { SpacerLG, SpacerSM } from "../basic/Text"
import { copyBchatID } from "../dialog/EditProfileDialog"
import { BchatIcon } from "../icon"

export const AddressBook = (props:any) => {
  const dispatch = useDispatch()
  const directContact = useSelector(getDirectContacts)
 
  // console.log("directContact :: ", directContact, directContact.length);

  function copyBtn(address:string){
    copyBchatID(address)
  }
  // console.log("sendAddress :: ",sendAddress);
  function send(walletAddress:any)
  {
    dispatch(dashboard());
    dispatch(walletSendPage())
    dispatch(updateSendAddress(walletAddress))
  }

  return <div className="wallet-addressBook">
    <div style={{ cursor: "pointer" }}>
      <Flex container={true} alignItems="center" onClick={() => dispatch(dashboard())}>
        <BchatIcon iconType="walletBackArrow" iconSize={"huge"} />
        <div className="wallet-addressBook-header-txt" >
          {/* {window.i18n('addressBook')} */}
          {props.name}
        </div>
      </Flex>
    </div>
    <SpacerLG />
    <div className="wallet-addressBook-wholeBox">
      {directContact.length > 0 && directContact.map((item, i) =>
         <div 
         className={classNames(`wallet-addressBook-wholeBox-contentBox`)} 
         style={window.i18n('addressBook')!==props.name?{cursor:'pointer'}:{}} 
         key={i} 
         onClick={()=>window.i18n('addressBook')!==props.name && send(item.walletAddress) }>
          
         <Flex container={true} flexDirection="column">
           <div>
             <span className="wallet-addressBook-wholeBox-contentBox-nameBtn">
               {item.profileName}
             </span>
           </div>
           <SpacerSM />
           <div className="wallet-addressBook-wholeBox-contentBox-addresstxt">
            {item.walletAddress}
             {/* bxcALKJHSakhdsadhaskdhHHHDJADHUAWjhjhsjdhjshaskjhdas9dapsidasasjhas8dauas */}
           </div>
         </Flex>

         {window.i18n('addressBook')===props.name && <Flex container={true} flexDirection="row" alignItems="center">
           <div className="wallet-addressBook-wholeBox-contentBox-sendBtn" onClick={()=>send(item.walletAddress)}>
             <BchatIcon iconType="send" iconSize={'small'} iconRotation={309} />
             <span>{window.i18n("sent")}</span>
           </div>
           <div className="wallet-addressBook-wholeBox-contentBox-copyBtn" onClick={()=>copyBtn(item.walletAddress)}>
             <BchatIcon iconType="copy" iconSize={'small'} />
             <span style={{ marginLeft: '3px' }}>{window.i18n("editMenuCopy")}</span>
           </div>
         </Flex> }
         
       </div>
         )}
      
    </div>
  </div>
}