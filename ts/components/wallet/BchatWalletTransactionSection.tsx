import classNames from "classnames"
import React, { useEffect, useState } from "react"
import { wallet } from "../../wallet/wallet-rpc"
// import { BchatDropdown } from "../basic/BchatDropdown"
import { Flex } from "../basic/Flex"
import { SpacerLG } from "../basic/Text"
import { BchatIcon } from "../icon/BchatIcon"

export const TransactionSection = () => {

    const [filter, setFilter] = useState(window.i18n('filterAll'))
    const [visible, setVisible] = useState(false);
    // const [data,setData]=useState([])

    useEffect(
        () => {
            wallet.sendRPC("get_transfers", {
                in: true,
                out: true,
                pending: true,
                failed: true,
                pool: true
            }).then((data) => {
                console.log('data for transaction ::', data);
                
            //    let dummyData=[];
            //    let inData=data.result

            })
        }, []
    )
    // let option=[{
    //     content: 'string',

    // }]

    //   console.log("data for transaction :: ",data);

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
                    <span onClick={()=>setVisible(!visible)} style={{cursor:"pointer"}}>
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
                                <div className={classNames(`dropDownItem `)} onClick={() => setFilter(window.i18n("filterAll"))} >
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
                                <div className={classNames(`dropDownItem `)} onClick={() => setFilter(window.i18n("filterIncoming"))} >
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
                                <div className={classNames(`dropDownItem `)} onClick={() => setFilter(window.i18n("filterOutgoing"))} >
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
                                <div className={classNames(`dropDownItem `)} onClick={() => setFilter(window.i18n("filterPending"))} >
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

        <div className="wallet-Transaction-contentBox">
            <Flex container={true} justifyContent="space-between" flexDirection="row">

                <Flex container={true} height=" 60px">
                    <article className="wallet-Transaction-contentBox-sendIndicationBox">
                        <BchatIcon iconType="paySend" iconSize={"medium"} iconColor="#FC2727" />
                        <div>
                            {window.i18n('sent')}
                        </div>
                    </article>
                    <article className="wallet-Transaction-contentBox-verticalline">

                    </article>
                    <div className="wallet-Transaction-contentBox-balanceBox">
                        <div className="wallet-Transaction-contentBox-balanceBox-amount">-2 BDX</div>
                        <div> bxcALKJHSakhdsadhaskdhHHHDJADHUAWjhjhsjdhjshaskjhdas9dapsidas…</div>
                    </div>
                </Flex>
                <section className="wallet-Transaction-contentBox-dateandheight">
                    <div className="wallet-Transaction-contentBox-dateandheight-month">6 months ago</div>
                    <div className="wallet-Transaction-contentBox-dateandheight-height">Height : 1150109 (confirmed)</div>
                </section>

            </Flex>

        </div>

    </div>
}