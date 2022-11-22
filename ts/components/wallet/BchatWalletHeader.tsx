import React from "react"
import { BchatIconSize, BchatIconType } from "../icon"
import { BchatIcon } from "../icon/BchatIcon"

export const WalletHeader=()=>{
    return(
        <div className="wallet-header">
            <div className="wallet-header-left-side">
                {/* <BchatIcon iconSize="small" iconType="member"  />
                <div style={{marginLeft:'10px'}}>
                    Munavver
                </div> */}
                <div  className="wallet-header-left-side-btn-box">
                <WalletButton name={'Add Address'}  icontype="addressBook" iconSize={'medium'}/>
                </div>

            </div>
            <div className="wallet-header-right-side">
            <WalletButton name={'Rescan'} icontype="reload" iconSize={'tiny'}/>
            <span style={{marginLeft:"10px"}}>
            <BchatIcon iconSize="large" iconType="walletSetting"  iconColor="#2879fb" />
            </span>
            </div>

        </div>
    )
}

export const WalletButton=(props:{name:string,icontype:BchatIconType,iconSize:BchatIconSize})=>
{
    const {name,icontype,iconSize}=props
  return(
    <div className="wallet-button">
    <BchatIcon iconSize={iconSize} iconType={icontype}  /> 
    <span style={{marginLeft:'5px'}}>
    {name}
    </span>
    </div>
)
}
