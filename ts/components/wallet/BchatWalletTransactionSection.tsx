import classNames from 'classnames';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { getRecipientAddress } from '../../data/data';
import { Flex } from '../basic/Flex';
import { SpacerLG } from '../basic/Text';
import { BchatIcon } from '../icon/BchatIcon';
import { shell } from 'electron';
import { getRescaning } from '../../state/selectors/walletConfig';
import { useSelector } from 'react-redux';

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
  const syncStatus: boolean = useSelector(getRescaning);
  const recip: any = receipientData;
  const zoomLevel = window.getSettingValue('zoom-factor-setting');

  useEffect(() => {
    document.removeEventListener('click', handleClick);
    switch (filter) {
      case 'Outgoing':
        filterTransaction('out');
        break;
      case 'Pending':
        filterTransaction('pending');
        break;
      case 'Failed':
        filterTransaction('failed');
        break;
      case 'Incoming':
        filterTransaction('in');
        break;
      default:
        filterTransaction('All');
        break;
    }
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [transactionsHistory]);

  const handleClick = (e: any) => {
    if (!modalRef.current?.contains(e.target)) {
      setVisible(!visible);
    }
  };
  function openToExplore(traxId: string) {
    if (window.networkType === 'mainnet') {
      void shell.openExternal(`http://explorer.beldex.io/tx/${traxId}`);
    } else {
      void shell.openExternal(`http://154.26.139.105/tx/${traxId}`);
    }
  }
  function closeDropDown(params: any, type: any) {
    setFilter(params);
    setEmptyScreen(params);
    setVisible(!visible);
    filterTransaction(type);
  }

  async function showdata(item: any, i: any) {
    if (selected === i) {
      setSelected(null);
    } else {
      setSelected(i);
    }

    if (item.type !== 'in') {
      let recipientAddress = await getRecipientAddress(item.txid);
      setRecipientdata(recipientAddress);
      return;
    }
    setRecipientdata([]);
  }

  const TransactionIndication = (props: any) => {
    const { type } = props;
    let item: any = {
      iconType: 'payRecieved',
      iconColor: '#00A638',
      type: window.i18n('received'),
    };
    switch (type) {
      case 'out':
        (item.iconType = 'paySend'),
          (item.iconColor = '#FF3E3E'),
          (item.type = window.i18n('sent'));
        break;
      case 'pending':
        (item.iconType = 'pendingTransaction'),
          (item.iconColor = '#A7A7BA'),
          (item.type = window.i18n('pending'));
        break;
      case 'bns':
        (item.iconType = 'bnsTransaction'),
          (item.iconColor = 'var(--color-bns-transaction)'),
          (item.type = window.i18n('bns'));
        break;
      case 'failed':
        (item.iconType = 'xWithCircle'),
          (item.iconColor = '#FC2727'),
          (item.type = window.i18n('failed'));
        break;

      default:
        break;
    }
    return (
      <>
        <BchatIcon
          iconType={item.iconType}
          iconSize={26}
          iconColor={item.iconColor}
          clipRule="evenodd"
          fillRule="evenodd"
        />
        {/* <div>{item.type}</div> */}
      </>
    );
  };

  function filterText(value: any) {
    var letters = /^[0-9a-zA-Z]+\.?\d*$/;
    if (value === '' || value.match(letters)) {
    } else {
      return;
    }
    setSearchText(value);
    searchTransaction(searchData);
  }

  function searchTransaction(filteredTransaction: any) {
    // console.log("filteredTransaction ::",searchText)
    let data =
      filteredTransaction.length > 0
        ? filteredTransaction.filter(
            (item: any) =>
              String(item.amount / 1e9).includes(searchText.toLowerCase()) ||
              item.txid.toLowerCase().includes(searchText.toLowerCase())
          )
        : [];
    setData(data);
  }

  function filterTransaction(filterType: string) {
    let allTransaction: any;
    if (filterType === window.i18n('filterAll')) {
      allTransaction = transactionsHistory;
    } else {
      allTransaction =
        transactionsHistory.length > 0 &&
        transactionsHistory.filter((data: any) => data.type === filterType);
    }
    setSearchData(allTransaction);
    if (searchText) {
      searchTransaction(allTransaction);
    } else {
      setData(allTransaction);
    }
  }

  const modalRef = useRef<HTMLDivElement>(null);

  return (
    <div className="wallet-Transaction">
      <div style={{ height: '98%' }} onClick={() => (visible ? setVisible(false) : '')}>
        <Flex container={true} justifyContent="space-between" flexDirection="row">
          <div className="wallet-Transaction-title">
            <BchatIcon
              iconType="oppositeDirDoubleArrow"
              iconSize={20}
              clipRule="evenodd"
              fillRule="evenodd"
            />
            <span style={{ marginLeft: '10px' }}>{window.i18n('transactions')}</span>
          </div>
          <Flex container={true} justifyContent="flex-end" flexDirection="row">
            {transactionsHistory.length !== 0 || searchText ? (
              <div className="wallet-Transaction-filter-wrapper">
                <input
                  placeholder={window.i18n('filterPlaceHolder')}
                  className="wallet-Transaction-filterInput"
                  onChange={(e: any) => filterText(e.target.value)}
                  value={searchText}
                />
                <BchatIcon
                  iconType={'funnelWithBorder'}
                  iconSize={20}
                  clipRule="evenodd"
                  fillRule="evenodd"
                />
              </div>
            ) : (
              ''
            )}
            {transactionsHistory.length > 0 && (
              <div className="wallet-Transaction-filterWithIcon">
                <span className="wallet-Transaction-filterWithIcon-inputBox">{filter}</span>
                <span onClick={() => setVisible(!visible)} style={{ cursor: 'pointer' }}>
                  <BchatIcon
                    iconType="filter"
                    iconSize={'medium'}
                    clipRule="evenodd"
                    fillRule="evenodd"
                  />
                </span>
                {visible && (
                  <div style={{ position: 'relative' }}>
                    <div className="wallet-settings-nodeSetting-sendDropDown">
                      <div
                        className={classNames(
                          `dropDownItem `,
                          filter === window.i18n('filterAll') && 'dropDownItem-selected'
                        )}
                        onClick={() => closeDropDown(window.i18n('filterAll'), 'All')}
                      >
                        {filter === window.i18n('filterAll') ? (
                          <span className={classNames('dropDownItem-blockAndMargin')}>
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
                        className={classNames(
                          `dropDownItem `,
                          filter === window.i18n('filterIncoming') && 'dropDownItem-selected'
                        )}
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
                        className={classNames(
                          `dropDownItem `,
                          filter === window.i18n('filterOutgoing') && 'dropDownItem-selected'
                        )}
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
                        className={classNames(
                          `dropDownItem `,
                          filter === window.i18n('filterPending') && 'dropDownItem-selected'
                        )}
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
                        className={classNames(
                          `dropDownItem `,
                          filter === window.i18n('failed') && 'dropDownItem-selected'
                        )}
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
              <div
                className="wallet-Transaction-contentBox"
                key={i}
                onClick={() => showdata(item, i)}
                style={{ cursor: 'pointer' }}
              >
                <Flex container={true} justifyContent="space-between" flexDirection="row">
                  <Flex container={true} height=" 60px" width="64%">
                    <article className="wallet-Transaction-contentBox-sendIndicationBox">
                      <TransactionIndication type={item.type} />
                    </article>
                    <div
                      className="wallet-Transaction-contentBox-balanceBox"
                      style={{ width: zoomLevel > 100 ? '44%' : '' }}
                    >
                      <div className="wallet-Transaction-contentBox-balanceBox-amount">
                        {item.type === 'out' ? '-' : ''}
                        {Number((item.amount / 1e9).toFixed(4))} BDX
                      </div>
                      <div
                        className="wallet-Transaction-contentBox-balanceBox-address"
                        onClick={() => openToExplore(item.txid)}
                      >
                        {item.txid}
                      </div>
                    </div>
                  </Flex>
                  <Flex>
                    <section className="wallet-Transaction-contentBox-dateandheight">
                      <div
                        className="wallet-Transaction-contentBox-dateandheight-month"
                        style={{ marginBottom: '7px' }}
                      >
                        {moment.unix(item.timestamp).format('ll')}
                      </div>
                      <div className="wallet-Transaction-contentBox-dateandheight-height">
                        Height : {item.height}{' '}
                        {item.type === 'out' || item.type === 'in' ? '(confirmed)' : ''}
                      </div>
                    </section>
                  </Flex>
                </Flex>

                {selected === i && (
                  <>
                    <Flex
                      container={true}
                      justifyContent={
                        recip.address && zoomLevel <= 100 ? 'space-between' : 'flex-start'
                      }
                      flexDirection="row"
                      width={'100%'}
                    >
                      <Flex container={true}>
                        <article
                          style={
                            recip.address && zoomLevel > 100 ? { width: '30px' } : { width: '21px' }
                          }
                        ></article>
                        {recip.address && (
                          <div
                            style={{ marginLeft: '20px', width: zoomLevel > 100 ? '44%' : '49%' }}
                            className="wallet-Transaction-recipitentBox-adddressBox"
                          >
                            <span>{window.i18n('recipientAddress')} : </span>
                            <span className="wallet-Transaction-recipitentBox-adddressBox-address">
                              {recip.address}
                            </span>
                          </div>
                        )}

                        <section style={{ marginLeft: '20px' }}>
                          <article className="wallet-Transaction-recipitentBox-transactionFee-header">
                            {window.i18n('transactionFee')}
                          </article>
                          <article className="wallet-Transaction-recipitentBox-transactionFee-text">
                            {item.fee / 1e9} BDX
                          </article>
                        </section>

                        {item.payment_id != '0000000000000000' && (
                          <section style={{ marginLeft: '20px' }}>
                            <article className="wallet-Transaction-recipitentBox-transactionFee-header">
                              {window.i18n('paymentID')}
                            </article>
                            <article className="wallet-Transaction-recipitentBox-transactionFee-text">
                              {item.payment_id}
                            </article>
                          </section>
                        )}
                      </Flex>

                      <section
                        style={{
                          width: zoomLevel > 100 ? '40%' : '209px',
                          marginLeft: zoomLevel && recip.address > 100 ? '20px' : '20px',
                          paddingTop: 0,
                        }}
                      >
                        <div className="wallet-Transaction-contentBox-dateandheight-title">
                          {window.i18n('dateTime')}
                        </div>
                        <div className="wallet-Transaction-contentBox-dateandheight-content">
                          {moment.unix(item.timestamp).format('DD/MM/YYYY HH:mm')}
                        </div>
                      </section>
                    </Flex>
                  </>
                )}
              </div>
            ))}
          {!syncStatus && (
            <Flex container={true} flexDirection="column" justifyContent="center" height="100%">
              <div className="wallet-syncing"></div>
              <h3 className="wallet-syncing-title">Wallet Syncing..</h3>
              <h5 className="wallet-syncing-content">{window.i18n('walletSyncingDiscription')}</h5>
            </Flex>
          )}
          {syncStatus && data.length == 0 ? (
            <>
              <div className="wallet-Transaction-empty-parentBox">
                <div className={`wallet-Transaction-${emptyScreen.toLocaleLowerCase()}`}></div>

                <h4 style={{ marginTop: '5px' }}>
                  {emptyScreen == 'All' ? (
                    <>
                      <div className="wallet-Transaction-content">
                        {window.i18n('emptyTransaction')}
                      </div>
                      {!searchText && (
                        <h5 className="wallet-Transaction-subContent" style={{ marginTop: '5px' }}>
                          {window.i18n('emptyTransactionDiscription')}
                        </h5>
                      )}
                    </>
                  ) : emptyScreen == 'imcoming' ? (
                    <h5 className="wallet-Transaction-subContent" style={{ marginTop: '0px' }}>
                      {window.i18n('noIncomingTransaction')}
                    </h5>
                  ) : emptyScreen == 'search' ? (
                    <h5 className="wallet-Transaction-subContent" style={{ marginTop: '0px' }}>
                      {window.i18n('searchEmptyTransaction')}
                    </h5>
                  ) : emptyScreen == 'Outgoing' ? (
                    <h5 className="wallet-Transaction-subContent" style={{ marginTop: '0px' }}>
                      {window.i18n('noOutgoingTransaction')}
                    </h5>
                  ) : emptyScreen == 'Pending' ? (
                    <h5 className="wallet-Transaction-subContent" style={{ marginTop: '0px' }}>
                      {window.i18n('noPendingTransaction')}
                    </h5>
                  ) : (
                    <h5 className="wallet-Transaction-subContent" style={{ marginTop: '0px' }}>
                      {window.i18n('noFailedTransaction')}
                    </h5>
                  )}
                </h4>
              </div>
            </>
          ) : (
            ''
          )}
        </div>
        {zoomLevel > 100 && <SpacerLG />}
      </div>

      {/* **********************Transaction Header************************* */}
    </div>
  );
};
