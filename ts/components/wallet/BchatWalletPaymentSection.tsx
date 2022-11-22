import React from "react"
import styled from "styled-components"
import { Flex } from "../basic/Flex"
import { BchatIcon } from "../icon/BchatIcon"
import { BchatIconSize, BchatIconType } from "../icon/Icons"

export const WalletPaymentSection = () => {

   return (
      <div className="wallet-squarBox">
         <Flex
            container={true}
            flexDirection="column"
            justifyContent="center"
            height="100%"
         >         
         <Flex
            container={true}
            flexDirection="row"
            justifyContent="space-between"
         >
               <BchatButtonIcon name={window.i18n('sent')} iconSize="small" iconType='paySend' iconColor={'#FC2727'}/>
               <span style={{ width: "5%", height: "20px" }}></span>
               <BchatButtonIcon name={window.i18n('received')} iconSize="small" iconType="payRecieved" iconColor={'#159B24'}/>

            </Flex>
            <Flex
               container={true}
               flexDirection="row"
               justifyContent="space-between"
               margin="15px 0 0 0"
            >
               <BchatButtonIcon  name={window.i18n('transactionDetails')} iconSize="large" iconType="payTransaction" iconColor={"#fff"}/>

            </Flex>
         </Flex>

      </div>
   )
}

export const BchatButtonIcon = (props: { name: string ,iconType:BchatIconType,iconColor:string,iconSize:BchatIconSize}) => {

   return (
      <Button>
         <BchatIcon iconSize={props.iconSize} iconType={props.iconType}   iconColor={props.iconColor} />
         <span className='font-medium' style={{ marginLeft: '5px' }}>{props.name}</span>
      </Button>
   )
}

const Button = styled.button`
    outline: none;
    border: none;
    background-color: #444455;
    width: 100%;
    height: 60px;
    border-radius: 10px;
    font-size: 16px;
`