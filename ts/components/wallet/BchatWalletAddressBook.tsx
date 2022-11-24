
import React from "react"
import { useDispatch } from "react-redux"
import { dashboard } from "../../state/ducks/walletSection"
import { Flex } from "../basic/Flex"
import { SpacerLG, SpacerSM } from "../basic/Text"
import { BchatIcon } from "../icon"

export const AddressBook=()=>{
  const dispatch=useDispatch()
    return<div className="wallet-addressBook">
      <div style={{cursor:"pointer"}}>
        <Flex container={true} alignItems="center"  onClick={()=>dispatch(dashboard())}>
          <BchatIcon  iconType="walletBackArrow" iconSize={"huge"}   />
          <div className="wallet-addressBook-header-txt" >
          {window.i18n('addressBook')}
          </div>
        </Flex>
        </div>
        <SpacerLG />
        <div className="wallet-addressBook-wholeBox">
         <div className="wallet-addressBook-wholeBox-contentBox">
           <Flex container={true} flexDirection="column">
            <div>
              <span className="wallet-addressBook-wholeBox-contentBox-nameBtn">
                Munavver
              </span>
              </div>
              <SpacerSM />
              <div>
              bxcALKJHSakhdsadhaskdhHHHDJADHUAWjhjhsjdhjshaskjhdas9dapsidasasjhas8dauas
              </div>
           </Flex>
           <Flex container={true} flexDirection="row" alignItems="center">
            <div className="wallet-addressBook-wholeBox-contentBox-sendBtn">
                <BchatIcon iconType="send" iconSize={'small'} iconRotation={309}/>
                <span>{window.i18n("sent")}</span>
            </div>
            <div className="wallet-addressBook-wholeBox-contentBox-copyBtn">
                <BchatIcon iconType="copy" iconSize={'small'} />
                <span style={{marginLeft:'3px'}}>{window.i18n("editMenuCopy")}</span>
            </div>
           </Flex>
         </div>
        </div>
    </div>
}