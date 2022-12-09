import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import classNames from 'classnames';
import { getWalletSendAddress } from "../../state/selectors/walletConfig"
import { BchatButton, BchatButtonColor, BchatButtonType } from "../basic/BchatButton"
// import { BchatDropdown } from "../basic/BchatDropdown"
// import { BchatInput } from "../basic/BchatInput"
// import { BchatIdEditable } from "../basic/BchatIdEditable"
import { Flex } from "../basic/Flex"
import { SpacerLG, } from "../basic/Text"
import { BchatIcon } from "../icon/BchatIcon"
import { contact } from "../../state/ducks/walletSection";
import { wallet } from "../../wallet/wallet-rpc";



export const SendForm = (props:any) => {
    const sendAddress = useSelector(getWalletSendAddress)
    const dispatch=useDispatch()
    // const [amount, setAmount] = useState(props.amount);
    // const [priority, setPriority] = useState(window.i18n("flash"));
    const [address, setAddress] = useState(sendAddress);
    const [notes, setNotes] = useState("");
    const [dropDown,setDropDown]=useState(false);
    function send()
    {
        wallet.sendFund(address,props.amount*100000000,props.priority==="Flash"?0:1)
    }
    
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
                            <input value={props.amount} onChange={(e: any) => { props.setAmount(e.target.value) }} placeholder={window.i18n("enterAmount")} type = "tel" />

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
                        <div className="wallet-sendForm-inputBox" style={{display:'block'}}>
                            <div className="wallet-sendForm-inputBox" style={{padding:0}}>
                            <span className="priortyBox" 
                             >{props.priority}</span>
                           
                                {/* <input value={priority} onChange={(e: any) => { setPriority(e.target.value) }}/> */}
                                <span  onClick={()=>setDropDown(!dropDown)} style={{cursor:"pointer"}}>
                                <BchatIcon iconType="dropdownArrow" iconSize="small" iconRotation={269}/> 
                                </span>
                            </div>
                           
                            {/* <BchatDropdown label={'flash'} options={"flash",'slow'} /> */}
                           {dropDown && <div style={{ position: 'relative' }}>
                                <div className="wallet-settings-nodeSetting-sendDropDown" >
                                    <div className={classNames(`dropDownItem ${props.priority===window.i18n("flash")?"fontSemiBold":"fontRegular"} `)} onClick={()=>{props.setPriority(window.i18n("flash")),setDropDown(!dropDown)}}>
                                        {window.i18n("flash")}
                                    </div>
                                    <div className={classNames(`dropDownItem ${props.priority===window.i18n("slow")?"fontSemiBold":"fontRegular"} `)} onClick={()=>{props.setPriority(window.i18n("slow")),setDropDown(!dropDown)}}>
                                        {window.i18n("slow")}
                                    </div>
                                </div>
                            </div> }
                            

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
                        <input value={address} onChange={(e: any) => { setAddress(e.target.value) }} />
                        <BchatButton
                            text={window.i18n('contact')}
                              onClick={()=>dispatch(contact())}
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
                        <textarea value={notes} onChange={(e: any) => { setNotes(e.target.value) }} className="wallet-sendForm-textArea" />


                    </div>
                </Flex>

            </div>
            <SpacerLG />
            <div className="wallet-sendForm-sendBtnBox">
                <BchatButton
                    text={window.i18n('sent')}
                     onClick={()=>send()}
                    buttonType={BchatButtonType.Brand}
                    buttonColor={BchatButtonColor.Green}
                //   disabled={!caption}
                />
            </div>
        </div>
    )
}
