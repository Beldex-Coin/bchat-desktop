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
            let params = {
                in: filter === window.i18n('filterAll') ? true : filter === window.i18n('filterIncoming') ? true : false,
                out: filter === window.i18n('filterAll') ? true : filter === window.i18n('filterIncoming') ? false : true,
                pending: filter === window.i18n('filterAll') ? true : false,
                failed: filter === window.i18n('filterAll') ? true : false,
                pool: filter === window.i18n('filterAll') ? true : false
            }

            wallet.sendRPC("get_transfers", params).then((data) => {
                let combineData = filter === window.i18n('filterAll') ? data.result.in.concat(data.result.out) : filter === window.i18n('filterIncoming') ? data.result.in : data.result.out;
                combineData = combineData.sort((a: any, b: any) => parseFloat(b.timestamp) - parseFloat(a.timestamp));
                setData(combineData);
            }).catch((e: any) => console.log(e));

        }, [filter]
    )

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
            {data.map((item: any, i) =>
                <div className="wallet-Transaction-contentBox" key={i}>

                    <Flex container={true} justifyContent="space-between" flexDirection="row" >

                        <Flex container={true} height=" 60px">
                            <article className="wallet-Transaction-contentBox-sendIndicationBox">
                                <BchatIcon iconType={item.type === 'out' ? "paySend" : "payRecieved"} iconSize={"medium"} iconColor={item.type === 'out' ? "#FC2727" : '#128b17'} />
                                <div>
                                    {item.type === 'out' ? window.i18n('sent') : window.i18n("received")}
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