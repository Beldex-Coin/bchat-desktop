import classNames from "classnames"
import moment from "moment"
import React, { useState } from "react"
import { useSelector } from "react-redux"
import { getRecipientAddress } from "../../data/data"
// import { wallet } from "../../wallet/wallet-rpc"
// import { BchatDropdown } from "../basic/BchatDropdown"
import { Flex } from "../basic/Flex"
import { SpacerLG } from "../basic/Text"
import { BchatIcon } from "../icon/BchatIcon"

export const TransactionSection = () => {

    let transactions = useSelector((state: any) => state.wallet.transacations);
    // console.log('transactionsHistory :: 1',transactions);

    const transactionsHistory =
        transactions.
            tx_list == undefined ? [] : transactions.tx_list;
    // console.log('transactionsHistory :: 2',transactionsHistory);
    // let tx: any = [
    //     {
    //         address:
    //             "9swTGGL3jP3HNeM7ajsKipQKUvwXYHpPR7NCA2jf2bMUKApQwWZUeXP1qxDv8ZbzPm6xf64NL8ozYVQeYzTFFCFFBkFEywB",
    //         amount: 1000000000,
    //         checkpointed: 1,
    //         confirmations: 2396,
    //         double_spend_seen: false,
    //         fee: 3451150,
    //         flash_mempool: false,
    //         height: 235475,
    //         note: "",
    //         payment_id: "0000000000000000",
    //         subaddr_index: { major: 0, minor: 0 },
    //         subaddr_indices: [[Object]],
    //         suggested_confirmations_threshold: 1,
    //         timestamp: 1670587373,
    //         txid: "addbcdeaecc029cf406e5f559cb1b290ab92fd761085905bb34a1a05ca000eca",
    //         type: "out",
    //         unlock_time: 0,
    //         was_flash: false
    //     },
    //     {
    //         address:
    //             "sjshjhjsjshs",
    //         amount: 100000000000,
    //         checkpointed: 1,
    //         confirmations: 11069,
    //         double_spend_seen: false,
    //         fee: 3455150,
    //         flash_mempool: false,
    //         height: 226802,
    //         note: "",
    //         payment_id: "0000000000000000",
    //         subaddr_index: { major: 0, minor: 0 },
    //         subaddr_indices: [[Object]],
    //         suggested_confirmations_threshold: 16,
    //         timestamp: 1670327182,
    //         txid: "sossj",
    //         type: "in",
    //         unlock_time: 0,
    //         was_flash: false
    //     },
    //     {
    //         address:
    //             "9swTGGL3jP3HNeM7ajsKipQKUvwXYHpPR7NCA2jf2bMUKApQwWZUeXP1qxDv8ZbzPm6xf64NL8ozYVQeYzTFFCFFBkFEywB",
    //         amount: 1000000000,
    //         checkpointed: 1,
    //         confirmations: 2410,
    //         double_spend_seen: false,
    //         fee: 3455150,
    //         flash_mempool: false,
    //         height: 235461,
    //         note: "",
    //         payment_id: "0000000000000000",
    //         subaddr_index: { major: 0, minor: 0 },
    //         subaddr_indices: [[Object]],
    //         suggested_confirmations_threshold: 1,
    //         timestamp: 1670586952,
    //         txid: "8f4c8cf8057cb31f6f615626c261b6464241e35e124d021db596ca9ca2b26ed3",
    //         type: "pending",
    //         unlock_time: 0,
    //         was_flash: false
    //     },
    //     {
    //         address:
    //             "9swTGGL3jP3HNeM7ajsKipQKUvwXYHpPR7NCA2jf2bMUKApQwWZUeXP1qxDv8ZbzPm6xf64NL8ozYVQeYzTFFCFFBkFEywB",
    //         amount: 10000000000,
    //         checkpointed: 1,
    //         confirmations: 2552,
    //         double_spend_seen: false,
    //         fee: 3451150,
    //         flash_mempool: false,
    //         height: 235319,
    //         note: "",
    //         payment_id: "0000000000000000",
    //         subaddr_index: { major: 0, minor: 0 },
    //         subaddr_indices: [[Object]],
    //         suggested_confirmations_threshold: 2,
    //         timestamp: 1670582693,
    //         txid: "18ff5a4d32a08349a9055388d750454a93cdae2c23c3fbf0dab8aecdfd386e69",
    //         type: "failed",
    //         unlock_time: 0,
    //         was_flash: false
    //     },
    //     {
    //         address:
    //             "9swTGGL3jP3HNeM7ajsKipQKUvwXYHpPR7NCA2jf2bMUKApQwWZUeXP1qxDv8ZbzPm6xf64NL8ozYVQeYzTFFCFFBkFEywB",
    //         amount: 10000000000,
    //         checkpointed: 1,
    //         confirmations: 2562,
    //         double_spend_seen: false,
    //         fee: 3451150,
    //         flash_mempool: false,
    //         height: 235309,
    //         note: "",
    //         payment_id: "0000000000000000",
    //         subaddr_index: { major: 0, minor: 0 },
    //         subaddr_indices: [[Object]],
    //         suggested_confirmations_threshold: 2,
    //         timestamp: 1670582392,
    //         txid: "e774512c00e71378c5e02c957aa515bbb4e9b947591a8aa5271765e86e5ae05e",
    //         type: "failed",
    //         unlock_time: 0,
    //         was_flash: false
    //     },
    //     {
    //         address:
    //             "9swTGGL3jP3HNeM7ajsKipQKUvwXYHpPR7NCA2jf2bMUKApQwWZUeXP1qxDv8ZbzPm6xf64NL8ozYVQeYzTFFCFFBkFEywB",
    //         amount: 10000000000,
    //         checkpointed: 1,
    //         confirmations: 2572,
    //         double_spend_seen: false,
    //         fee: 3455150,
    //         flash_mempool: false,
    //         height: 235299,
    //         note: "",
    //         payment_id: "0000000000000000",
    //         subaddr_index: { major: 0, minor: 0 },
    //         subaddr_indices: [[Object]],
    //         suggested_confirmations_threshold: 2,
    //         timestamp: 1670582093,
    //         txid: "1ebbaf429102aa4537d1fb468628796e638130c4e3830cc57109b3600a0291e5",
    //         type: "pending",
    //         unlock_time: 0,
    //         was_flash: false
    //     },]


    const [filter, setFilter] = useState(window.i18n('filterAll'))
    const [visible, setVisible] = useState(false);
    // const [data, setData] = useState(transactionsHistory)
    const [data, setData] = useState(transactionsHistory);
    const [selected, setSelected] = useState(null);
    const [receipientData, setRecipientdata] = useState([])



    function closeDropDown(params: any, type: any) {
        setFilter(params)
        setVisible(!visible)
        filterTransaction(type)
    }

    function filterTransaction(type: any) {
        if (type === window.i18n('filterAll')) {
            setData(transactionsHistory);
            return
        }

        let filterData = transactionsHistory.filter((data: any) => data.type === type);
        setData(filterData);
    }
    async function showdata(tx_hash: string, i: any) {
        let recipientAddress = await getRecipientAddress(tx_hash)
        setRecipientdata(recipientAddress)
        setSelected(i);

    }


    const TransactionIndication = (props: any) => {
        const { type } = props
        let item: any = {
            iconType: "payRecieved",
            iconColor: "#128b17",
            type: window.i18n("received")
        }
        switch (type) {
            case "out":
                item.iconType = "paySend",
                    item.iconColor = "#FC2727",
                    item.type = window.i18n("sent")
                break;
            case "pending":
                item.iconType = "pendingTransaction",
                    item.iconColor = "#FDB12A",
                    item.type = window.i18n("pending")
                break;
            case "failed":
                item.iconType = "error",
                    item.iconColor = "#FC2727",
                    item.type = window.i18n("failed")
                break;

            default:
                break;
        }
        return (<>
            <BchatIcon iconType={item.iconType} iconSize={"medium"} iconColor={item.iconColor} />
            <div>{item.type}</div>
        </>
        )
    }

    const RececipientAddress = (props: any) => {

        const { trasactionData } = props;
        let reccipient: any = receipientData
        console.log("RececipientData:,", trasactionData, receipientData, reccipient.addres);


        return <>
            <Flex container={true} justifyContent="space-between" flexDirection="row" width="95%" >

                {/* <Flex container={true} height=" 60px" > */}
                <div style={{ display: 'flex' }}>
                    <section style={{ display: 'flex' }}>
                        <article style={{ width: '110px' }}>
                            {/* <TransactionIndication type={item.type} /> */}
                        </article>

                        {reccipient.address && <div style={{ marginLeft: '20px' }} className='wallet-Transaction-recipitentBox-adddressBox'>
                            <div className="">{window.i18n('recipientAddress')}</div>
                            <div className="wallet-Transaction-recipitentBox-adddressBox-address">{reccipient.address}</div>
                        </div>}

                    </section>


                    <section style={{ marginLeft: '20px' }} >
                        <article className="wallet-Transaction-recipitentBox-transactionFee-header">
                            {window.i18n('transactionFee')}
                        </article>
                        <article className="wallet-Transaction-recipitentBox-transactionFee-text">
                            {(trasactionData.fee / 1e9)} BDX
                        </article>
                    </section>

                </div>

                <section className="wallet-Transaction-contentBox-dateandheight">
                    <div className="wallet-Transaction-contentBox-dateandheight-month">{window.i18n('dateTime')}</div>
                    <div className="wallet-Transaction-contentBox-dateandheight-height">{moment.unix(trasactionData.timestamp).format("DD/MM/YYYY HH:mm")}</div>
                </section>

            </Flex>


        </>
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
                                <div className={classNames(`dropDownItem `)} onClick={() => closeDropDown(window.i18n("filterAll"), "All")} >
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
                                <div className={classNames(`dropDownItem `)} onClick={() => closeDropDown(window.i18n("filterIncoming"), 'in')} >
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
                                    onClick={() => closeDropDown(window.i18n("filterOutgoing"), 'out')} >
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
                                <div className={classNames(`dropDownItem `)} onClick={() => closeDropDown(window.i18n("filterPending"), 'pending')} >
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
                                <div className={classNames(`dropDownItem `)} onClick={() => closeDropDown(window.i18n("failed"), 'failed')} >
                                    {filter === window.i18n("failed") ? <span className="dropDownItem-blockAndMargin">
                                        <BchatIcon iconType="tickCircle"
                                            iconColor="#FFF"
                                            iconSize={13}
                                            iconPadding={'3px'}
                                            backgroundColor={'#159B24'}
                                            borderRadius={'10px'}
                                        /></span> :
                                        <span className="dropDownItem-checkedCircle"></span>
                                    }
                                    {window.i18n("failed")}
                                </div>
                            </div>
                        </div>
                    }
                </div>

            </Flex>
        </Flex>

        <SpacerLG />
        <div className="wallet-Transaction-parentBox" >
            {data.length > 0 && data.map((item: any, i: any) =>
                <div className="wallet-Transaction-contentBox" key={i}>

                    <Flex container={true} justifyContent="space-between" flexDirection="row" >

                        <Flex container={true} height=" 60px" onClick={() => item.type === 'out' && showdata(item.txid, i)}>
                            <article className="wallet-Transaction-contentBox-sendIndicationBox">
                                <TransactionIndication type={item.type} />
                            </article>
                            <article className="wallet-Transaction-contentBox-verticalline">

                            </article>
                            <div className="wallet-Transaction-contentBox-balanceBox">
                                <div className="wallet-Transaction-contentBox-balanceBox-amount">{item.type === 'out' ? "-" : ""}{Number((item.amount / 1e9).toFixed(4))} BDX</div>
                                <div className="wallet-Transaction-contentBox-balanceBox-address">{item.address}</div>
                            </div>
                        </Flex>
                        <section className="wallet-Transaction-contentBox-dateandheight">
                            <div className="wallet-Transaction-contentBox-dateandheight-month">{moment.unix(item.timestamp).fromNow()}</div>
                            <div className="wallet-Transaction-contentBox-dateandheight-height">Height : {item.height} (confirmed)</div>
                        </section>

                    </Flex>
                    {selected === i && item.type === 'out' && <RececipientAddress trasactionData={item} />}
                </div>
            )}
        </div>
    </div>
}


