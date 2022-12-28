import classNames from 'classnames';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
//  import { useSelector } from 'react-redux';
import { getRecipientAddress } from '../../data/data';
// import { wallet } from "../../wallet/wallet-rpc"
// import { BchatDropdown } from "../basic/BchatDropdown"
import { Flex } from '../basic/Flex';
import { SpacerLG } from '../basic/Text';
import { BchatIcon } from '../icon/BchatIcon';
import { shell } from 'electron';

export const TransactionSection = (props: any) => {
  const transactionsHistory = props.transactionList == undefined ? [] : props.transactionList;

  const [filter, setFilter] = useState(window.i18n('filterAll'));
  const [emptyScreen, setEmptyScreen] = useState(window.i18n('filterAll'));
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(transactionsHistory);
  const [searchData, setSearchData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [receipientData, setRecipientdata] = useState([]);
  const [searchText, setSearchText] = useState('');
  const syncingStatus = props.syncStatus ? true : false;
  console.log('data:', data.length, filter);
  useEffect(() => {
    // console.log("filter ::",filter,'out');

    // document.addEventListener('mousedown', handleClick);
    console.log('filter:', filter);
    switch (filter) {
      case 'Outgoing':
        filterTransaction('out');
        console.log('filter ::', filter, 'out');
        searchTransaction(searchText);

        break;
      case 'Pending':
        filterTransaction('pending');
        searchTransaction(searchText);

        break;
      case 'Failed':
        filterTransaction('failed');
        searchTransaction(searchText);

        break;
      case 'Incoming':
        filterTransaction('in');
        searchTransaction(searchText);

        break;

      default:
        filterTransaction('All');
        searchTransaction(searchText);

        break;
    }
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
    // filterTransaction(type);
  }, [transactionsHistory]);

  const handleClick = (e: any) => {
    if (!modalRef.current?.contains(e.target)) {
      setVisible(!visible);
    }
  };
  function openToExplore(traxId: string) {
    void shell.openExternal(
      `http://explorer.beldex.io/tx/${traxId}`
    );
  }
  function closeDropDown(params: any, type: any) {
    setFilter(params);
    setEmptyScreen(params);
    setVisible(!visible);
    filterTransaction(type);
  }

  function filterTransaction(type: string) {
    if (type === window.i18n('filterAll')) {
      setSearchData(transactionsHistory);
      setData(transactionsHistory);
      return;
    }
    let filterData = transactionsHistory.filter((data: any) => data.type === type);
    setData(filterData);
    setSearchData(filterData);
  }
  async function showdata(item: any, i: any) {
    // console.log("item.type ::",item.type)
    setSelected(i);

    if (item.type === 'out') {
      let recipientAddress = await getRecipientAddress(item.txid);
      // console.log("showdata:: ",recipientAddress);
      setRecipientdata(recipientAddress);
      // return
    }
    // setRecipientdata([]);
  }

  const TransactionIndication = (props: any) => {
    const { type } = props;
    let item: any = {
      iconType: 'payRecieved',
      iconColor: '#128b17',
      type: window.i18n('received'),
    };
    switch (type) {
      case 'out':
        (item.iconType = 'paySend'),
          (item.iconColor = '#FC2727'),
          (item.type = window.i18n('sent'));
        break;
      case 'pending':
        (item.iconType = 'pendingTransaction'),
          (item.iconColor = '#FDB12A'),
          (item.type = window.i18n('pending'));
        break;
      case 'failed':
        (item.iconType = 'error'),
          (item.iconColor = '#FC2727'),
          (item.type = window.i18n('failed'));
        break;

      default:
        break;
    }
    return (
      <>
        <BchatIcon iconType={item.iconType} iconSize={'medium'} iconColor={item.iconColor} />
        <div>{item.type}</div>
      </>
    );
  };

  function searchTransaction(value: any) {
    setSearchText(value);

    if (value.length !== 0) {
      setEmptyScreen('search');
    }

    // if(isNaN(value))
    // {
    let data = searchData.filter(
      (item: any) =>
        String(item.amount / 1e9).includes(value.toLowerCase()) ||
        item.txid.toLowerCase().includes(value.toLowerCase())
    );
    console.log('searchData:', searchData.length);
    setData(data);
    // let tx_list_filtered = transactionsHistory.filter((tx:any)=>{
    //     let search_item = [tx.txid,String(tx.amount/1e9)];
    //    return !!search_item.find(f => f.toLowerCase().includes(value.toLowerCase()));
    // });
    // console.log('tx_list_filtered ::',tx_list_filtered);
    // setData(tx_list_filtered);
    // }
    // else if(!isNaN(value) && value){
    //     let searchData=transactionsHistory.filter((item:any)=> item.amount===Number(value)*1e9);
    //     setData(searchData);
    // }
    // else{
    //     setData(transactionsHistory);
    // }
  }
  const modalRef = useRef<HTMLDivElement>(null);

  const RececipientAddress = (props: any) => {
    const { trasactionData } = props;
    let reccipient: any = receipientData;
    //  console.log("RececipientData:,", trasactionData, receipientData, reccipient.addres);

    return (
      <>
        <Flex
          container={true}
          justifyContent="space-between"
          flexDirection="row"
          width={reccipient.address ? '92.5%' : '44%'}
        >
          {/* <Flex container={true} height=" 60px" > */}
          <div style={{ display: 'flex' }}>
            <section style={{ display: 'flex' }}>
              <article style={{ width: '110px' }}>
                {/* <TransactionIndication type={item.type} /> */}
              </article>

              {reccipient.address && (
                <div
                  style={{ marginLeft: '20px' }}
                  className="wallet-Transaction-recipitentBox-adddressBox"
                >
                  <div className="">{window.i18n('recipientAddress')}</div>
                  <div className="wallet-Transaction-recipitentBox-adddressBox-address">
                    {reccipient.address}
                  </div>
                </div>
              )}
            </section>

            <section style={{ marginLeft: '20px' }}>
              <article className="wallet-Transaction-recipitentBox-transactionFee-header">
                {window.i18n('transactionFee')}
              </article>
              <article className="wallet-Transaction-recipitentBox-transactionFee-text">
                {trasactionData.fee / 1e9} BDX
              </article>
            </section>
          </div>

          <section className="wallet-Transaction-contentBox-dateandheight">
            <div className="wallet-Transaction-contentBox-dateandheight-month">
              {window.i18n('dateTime')}
            </div>
            <div className="wallet-Transaction-contentBox-dateandheight-height">
              {moment.unix(trasactionData.timestamp).format('DD/MM/YYYY HH:mm')}
            </div>
          </section>
        </Flex>
      </>
    );
  };
  console.log(
    'DAAAAAATAAAAAA.length:',
    `wallet-Transaction-${emptyScreen.toLocaleLowerCase()}`,
    data.length
  );
  return (
    <div className="wallet-Transaction">
      {!syncingStatus ? (
        <div className="wallet-syncing">
          <h5 className="wallet-syncing-content">{window.i18n('walletSyncingDiscription')}</h5>
        </div>
      ) : (
        <div style={{ height: '91%' }}>
          <Flex container={true} justifyContent="space-between" flexDirection="row">
            <div>{window.i18n('transactions')}</div>
            <Flex container={true} justifyContent="space-between" flexDirection="row">
              {data.length !== 0 || searchText ? (
                <div>
                  {window.i18n('filter')}
                  <input
                    placeholder={window.i18n('filterPlaceHolder')}
                    className="wallet-Transaction-filterInput"
                    onChange={(e: any) => searchTransaction(e.target.value)}
                    value={searchText}
                  />
                </div>
              ) : (
                ''
              )}
              {/* {data.length == 0 && filter == 'All' ? ( */}
              {/* '' */}
              {/* ) : ( */}
              {data.length == 0 && filter == 'All' ? (
                ''
              ) : (
                <div className="wallet-Transaction-filterWithIcon">
                  {/* <input value={window.i18n('filterAll')} /> */}
                  <span className="wallet-Transaction-filterWithIcon-inputBox">{filter}</span>
                  <span onClick={() => setVisible(!visible)} style={{ cursor: 'pointer' }}>
                    <BchatIcon iconType="filter" iconSize={'tiny'} />
                  </span>
                  {/* <BchatDropdown
                        label={window.i18n('disappearingMessages')}
                        options={option}
                        expanded={true}
                    /> */}
                  {visible && (
                    <div style={{ position: 'relative' }}>
                      <div className="wallet-settings-nodeSetting-sendDropDown">
                        <div
                          className={classNames(`dropDownItem `)}
                          onClick={() => closeDropDown(window.i18n('filterAll'), 'All')}
                        >
                          {filter === window.i18n('filterAll') ? (
                            <span className="dropDownItem-blockAndMargin">
                              <BchatIcon
                                iconType="tickCircle"
                                iconColor="#FFF"
                                iconSize={13}
                                iconPadding={'3px'}
                                backgroundColor={'#159B24'}
                                borderRadius={'10px'}
                              />
                            </span>
                          ) : (
                            <span className="dropDownItem-checkedCircle"></span>
                          )}

                          {window.i18n('filterAll')}
                        </div>
                        <div
                          className={classNames(`dropDownItem `)}
                          onClick={() => closeDropDown(window.i18n('filterIncoming'), 'in')}
                        >
                          {filter === window.i18n('filterIncoming') ? (
                            <span className="dropDownItem-blockAndMargin">
                              <BchatIcon
                                iconType="tickCircle"
                                iconColor="#FFF"
                                iconSize={13}
                                iconPadding={'3px'}
                                backgroundColor={'#159B24'}
                                borderRadius={'10px'}
                              />
                            </span>
                          ) : (
                            <span className="dropDownItem-checkedCircle"></span>
                          )}

                          {window.i18n('filterIncoming')}
                        </div>
                        <div
                          className={classNames(`dropDownItem `)}
                          onClick={() => closeDropDown(window.i18n('filterOutgoing'), 'out')}
                        >
                          {filter === window.i18n('filterOutgoing') ? (
                            <span className="dropDownItem-blockAndMargin">
                              <BchatIcon
                                iconType="tickCircle"
                                iconColor="#FFF"
                                iconSize={13}
                                iconPadding={'3px'}
                                backgroundColor={'#159B24'}
                                borderRadius={'10px'}
                              />
                            </span>
                          ) : (
                            <span className="dropDownItem-checkedCircle"></span>
                          )}

                          {window.i18n('filterOutgoing')}
                        </div>
                        <div
                          className={classNames(`dropDownItem `)}
                          onClick={() => closeDropDown(window.i18n('filterPending'), 'pending')}
                        >
                          {filter === window.i18n('filterPending') ? (
                            <span className="dropDownItem-blockAndMargin">
                              <BchatIcon
                                iconType="tickCircle"
                                iconColor="#FFF"
                                iconSize={13}
                                iconPadding={'3px'}
                                backgroundColor={'#159B24'}
                                borderRadius={'10px'}
                              />
                            </span>
                          ) : (
                            <span className="dropDownItem-checkedCircle"></span>
                          )}
                          {window.i18n('filterPending')}
                        </div>
                        <div
                          className={classNames(`dropDownItem `)}
                          onClick={() => closeDropDown(window.i18n('failed'), 'failed')}
                        >
                          {filter === window.i18n('failed') ? (
                            <span className="dropDownItem-blockAndMargin">
                              <BchatIcon
                                iconType="tickCircle"
                                iconColor="#FFF"
                                iconSize={13}
                                iconPadding={'3px'}
                                backgroundColor={'#159B24'}
                                borderRadius={'10px'}
                              />
                            </span>
                          ) : (
                            <span className="dropDownItem-checkedCircle"></span>
                          )}
                          {window.i18n('failed')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Flex>
          </Flex>

          <SpacerLG />
          <div className="wallet-Transaction-parentBox">
            {data.length > 0 &&
              data.map((item: any, i: any) => (
                <div className="wallet-Transaction-contentBox" key={i}>
                  <Flex container={true} justifyContent="space-between" flexDirection="row">
                    <Flex container={true} height=" 60px" >
                      <article className="wallet-Transaction-contentBox-sendIndicationBox">
                        <TransactionIndication type={item.type} />
                      </article>
                      <article className="wallet-Transaction-contentBox-verticalline"></article>
                      <div className="wallet-Transaction-contentBox-balanceBox">
                        <div className="wallet-Transaction-contentBox-balanceBox-amount"
                          onClick={() => showdata(item, i)}
                         >
                          {item.type === 'out' ? '-' : ''}
                          {Number((item.amount / 1e9).toFixed(4))} BDX
                        </div>
                        <div className="wallet-Transaction-contentBox-balanceBox-address"
                          onClick={() => openToExplore(item.txid)}
                        >
                          {item.txid}
                        </div>
                      </div>
                    </Flex>
                    <section className="wallet-Transaction-contentBox-dateandheight">
                      <div className="wallet-Transaction-contentBox-dateandheight-month">
                        {moment.unix(item.timestamp).fromNow()}
                      </div>
                      <div className="wallet-Transaction-contentBox-dateandheight-height">
                        Height : {item.height} (confirmed)
                      </div>
                    </section>
                  </Flex>
                  {/* {selected === i && item.type === 'out' && <RececipientAddress trasactionData={item} />} */}
                  {selected === i && <RececipientAddress trasactionData={item} />}
                </div>
              ))}
            {data.length == 0 ? (
              <div className={`wallet-Transaction-${emptyScreen.toLocaleLowerCase()}`}>
                <h4 className="wallet-Transaction-content">
                  {emptyScreen == 'All' ? (
                    <div>
                      {window.i18n('emptyTransaction')}
                      <h5
                        className="wallet-Transaction-content-subContent"
                        style={{ marginTop: '5px' }}
                      >
                        {window.i18n('emptyTransactionDiscription')}
                      </h5>
                    </div>
                  ) : emptyScreen == 'search' ? (
                    window.i18n('searchEmptyTransaction')
                  ) : emptyScreen == 'Outgoing' ? (
                    window.i18n('noOutgoingTransaction')
                  ) : emptyScreen == 'Pending' ? (
                    window.i18n('noPendingTransaction')
                  ) : (
                    window.i18n('noFailedTransaction')
                  )}
                </h4>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      )}
      {/* **********************Transaction Header************************* */}
    </div>
  );
};
