import classNames from "classnames"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { wallet } from "../../wallet/wallet-rpc"
// import { BchatDropdown } from "../basic/BchatDropdown"
import { Flex } from "../basic/Flex"
import { SpacerLG } from "../basic/Text"
import { BchatIcon } from "../icon/BchatIcon"

export const TransactionSection = () => {

    const [filter, setFilter] = useState(window.i18n('filterAll'))
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState([])

    function closeDropDown(params: any) {
        setFilter(params)
        setVisible(!visible)
    }
    useEffect(
        () => {
            getTransfer();
        }, [filter]
    )

    async function getTransfer() {
        let value: any = await wallet.getTransfer(filter)
        // console.log("value getTransfer ::", value);
        setData(value)
        // setData(value)

    }
    // const types = ['in', 'out', 'pending', 'failed', 'pool', 'miner', 'mnode', 'gov', 'stake'];
   const Indication=(props:any)=>
   {
    const {type}=props
       return(<>       
        {type==='in'&&<div>{window.i18n("received")}</div>}
        {type==='out'&&<div>{window.i18n("sent")}</div>}
        {type==='pending'&&<div>{window.i18n("pending")}</div>}
        {type==='failed'&&<div>{window.i18n("failed")}</div>}
        {/* {type==='pool'&&<div>{window.i18n("pool")}</div>}
        {type==='mnode'&&<div>{window.i18n("mnode")}</div>}
        {type==='gov'&&<div>{window.i18n("gov")}</div>}
        {type==='miner'&&<div>{window.i18n("miner")}</div>}
        {type==='stake'&&<div>{window.i18n("stake")}</div>}  */}
        </>
       )
   }

    
    return <div className="wallet-Transaction">

        {/* **********************Transaction Header************************* */}

        <Flex container={true} justifyContent="space-between" flexDirection="row">
            <div>
                {window.i18n('transactions')}
            </div>
            <Flex container={true} justifyContent="space-between" flexDirection="row">
                <div >
                    {window.i18n('filter')}
                    <input placeholder={window.i18n('filterPlaceHolder')} className="wallet-Transaction-filterInput" />
                </div>
                <div className="wallet-Transaction-filterWithIcon">
                    {/* <input value={window.i18n('filterAll')} /> */}
                    <span className="wallet-Transaction-filterWithIcon-inputBox">{filter}</span>
                    <span onClick={() => setVisible(!visible)} style={{ cursor: "pointer" }}>
                        <BchatIcon iconType="filter" iconSize={"tiny"} />

                    </span>
                    {/* <BchatDropdown
                        label={window.i18n('disappearingMessages')}
                        options={option}
                        expanded={true}
                    /> */}
                    {visible &&
                        <div style={{ position: 'relative' }}>
                            <div className="wallet-settings-nodeSetting-sendDropDown" >
                                <div className={classNames(`dropDownItem `)} onClick={() => closeDropDown(window.i18n("filterAll"))} >
                                    {filter === window.i18n("filterAll") ? <span className="dropDownItem-blockAndMargin">
                                        <BchatIcon iconType="tickCircle"
                                            iconColor="#FFF"
                                            iconSize={13}
                                            iconPadding={'3px'}
                                            backgroundColor={'#159B24'}
                                            borderRadius={'10px'}
                                        /></span> :
                                        <span className="dropDownItem-checkedCircle"></span>

                                    }

                                    {window.i18n("filterAll")}
                                </div>
                                <div className={classNames(`dropDownItem `)} onClick={() => closeDropDown(window.i18n("filterIncoming"))} >
                                    {filter === window.i18n("filterIncoming") ? <span className="dropDownItem-blockAndMargin">
                                        <BchatIcon iconType="tickCircle"
                                            iconColor="#FFF"
                                            iconSize={13}
                                            iconPadding={'3px'}
                                            backgroundColor={'#159B24'}
                                            borderRadius={'10px'}
                                        /></span> :
                                        <span className="dropDownItem-checkedCircle"></span>
                                    }

                                    {window.i18n("filterIncoming")}
                                </div>
                                <div className={classNames(`dropDownItem `)}
                                    onClick={() => closeDropDown(window.i18n("filterOutgoing"))} >
                                    {filter === window.i18n("filterOutgoing") ? <span className="dropDownItem-blockAndMargin">
                                        <BchatIcon iconType="tickCircle"
                                            iconColor="#FFF"
                                            iconSize={13}
                                            iconPadding={'3px'}
                                            backgroundColor={'#159B24'}
                                            borderRadius={'10px'}
                                        /></span> :
                                        <span className="dropDownItem-checkedCircle"></span>
                                    }

                                    {window.i18n("filterOutgoing")}
                                </div>
                                <div className={classNames(`dropDownItem `)} onClick={() => closeDropDown(window.i18n("filterPending"))} >
                                    {filter === window.i18n("filterPending") ? <span className="dropDownItem-blockAndMargin">
                                        <BchatIcon iconType="tickCircle"
                                            iconColor="#FFF"
                                            iconSize={13}
                                            iconPadding={'3px'}
                                            backgroundColor={'#159B24'}
                                            borderRadius={'10px'}
                                        /></span> :
                                        <span className="dropDownItem-checkedCircle"></span>
                                    }
                                    {window.i18n("filterPending")}
                                </div>
                            </div>
                        </div>
                    }
                </div>

            </Flex>
        </Flex>

        <SpacerLG />
        <div className="wallet-Transaction-parentBox" >
            {data.length > 0 && data.map((item: any, i) =>
                <div className="wallet-Transaction-contentBox" key={i}>

                    <Flex container={true} justifyContent="space-between" flexDirection="row" >

                        <Flex container={true} height=" 60px">
                            <article className="wallet-Transaction-contentBox-sendIndicationBox">
                                <BchatIcon iconType={item.type === 'out' ? "paySend" : "payRecieved"} iconSize={"medium"} iconColor={item.type === 'out' ? "#FC2727" : '#128b17'} />
                                <div>
                                    {/* {item.type === 'out' ? window.i18n('sent') : window.i18n("received")} */}
                                   
                                    <Indication type={item.type} />
                                </div>
                            </article>
                            <article className="wallet-Transaction-contentBox-verticalline">

                            </article>
                            <div className="wallet-Transaction-contentBox-balanceBox">
                                <div className="wallet-Transaction-contentBox-balanceBox-amount">{item.type === 'out' ? "-" : ""}{Number((item.amount / 1000000000).toFixed(4))} BDX</div>
                                <div>{item.address}</div>
                            </div>
                        </Flex>
                        <section className="wallet-Transaction-contentBox-dateandheight">
                            <div className="wallet-Transaction-contentBox-dateandheight-month">{moment.unix(item.timestamp).fromNow()}</div>
                            <div className="wallet-Transaction-contentBox-dateandheight-height">Height : {item.height} (confirmed)</div>
                        </section>

                    </Flex>


                </div>
            )}
        </div>
    </div>
}


