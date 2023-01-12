import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setting } from '../../state/ducks/walletSection';
import { BchatButton, BchatButtonColor } from '../basic/BchatButton';
import { Flex } from '../basic/Flex';
import { SpacerLG, SpacerMD } from '../basic/Text';
import { BchatIcon } from '../icon/BchatIcon';
import classNames from 'classnames';
import { walletSettingsKey } from '../../data/settings-key';
import { workingStatusForDeamon } from '../../wallet/BchatWalletHelper';
import { LocalDeamon } from './BchatWalletLocalDeamonsettings';
import { ToastUtils } from '../../bchat/utils';

export const NodeSetting = () => {
  const dispatch = useDispatch();
  console.log(
    'current deamon ::NodeSetting',
    window.getSettingValue(walletSettingsKey.settingsCurrentDeamon)
  );

  const currentDeamon = window.getSettingValue(walletSettingsKey.settingsCurrentDeamon)
    ? window.getSettingValue(walletSettingsKey.settingsCurrentDeamon)
    : window.currentDaemon;
  const deamonList = window.getSettingValue(walletSettingsKey.settingsDeamonList);

  const [viewBox1, setViewBox1] = useState(true);
  const [viewBox2, setViewBox2] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  const [port, setPort] = useState('');
  const [dropdown, setDropdown] = useState(false);
  const [chooseDeamon, setChooseDeamon] = useState(currentDeamon.host);
  const [chooseDeamonPort, setChooseDeamonPort] = useState(currentDeamon.port);
  const [option, setOption] = useState(deamonList);
  const [verifyDeamon, setVerifyDeamon] = useState({});
  const [testNotify, setTestNotify] = useState({ status: '', content: '' });
  const [localDeamonVisible, setLocalDeamonVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
  function numberOnly(e: any) {
    const re = /^[0-9\b]+$/;
    if (e === '' || re.test(e)) {
      setPort(e);
      setVerifyDeamon({});
      setTestNotify({ status: '', content: `` });
    }
  }
  function assignHost(e: any) {
    setIpAddress(e);
    setVerifyDeamon({});
    setTestNotify({ status: '', content: `` });
  }
  function addDeamonNet() {
    let data: any = verifyDeamon;
    if (Object.keys(data).length === 0) {
      return;
    }
    data.type = 'Remote';
    let deamon_list = window.getSettingValue(walletSettingsKey.settingsDeamonList);
    let checkVerifiedDaemon = deamon_list.find((daemon: any) => daemon.ip == data.ip);
    if (checkVerifiedDaemon) {
      return ToastUtils.pushToastSuccess('daemonAlreadyAdded', `This daemon already added.`);
    }

    if (deamon_list) {
      deamon_list.push(data);
      // window.setSettingValue(walletSettingsKey.settingsDeamonList,data);
    }
    window.setSettingValue(walletSettingsKey.settingsDeamonList, deamon_list);
    setOption(deamon_list);
  }

  function currentDeamonNet() {
    let data = { host: chooseDeamon, port: chooseDeamonPort, active: 1 };
    window.setSettingValue(walletSettingsKey.settingsCurrentDeamon, data);
    ToastUtils.pushToastSuccess(
      'successfully-updated-current-daemon',
      `Successfully ${chooseDeamon}:${chooseDeamonPort} daemon updated.`
    );
  }

  async function showDropDown() {
    setViewBox2(!viewBox2);

    let data = window.getSettingValue(walletSettingsKey.settingsDeamonList);
    let status = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].type == 'Remote') {
        const deamonStatus = await workingStatusForDeamon(data[i]);
        if (deamonStatus.status === 'OK') {
          data[i].active = true;
          status.push(data[i]);
        } else {
          data[i].active = false;
          status.push(data[i]);
        }
      }
    }
    setOption(status);
    setViewBox2(!viewBox2);
  }

  function AssignCurrentDeamon(item: any) {
    setChooseDeamon(item.host);
    setDropdown(false);
    setChooseDeamonPort(item.port);
  }

  const handleClick = (e: any) => {
    if (!modalRef.current?.contains(e.target)) {
      setDropdown(false);
    }
  }

  async function validationForDeamon() {
    let data = { host: ipAddress, port: port, active: 0 };
    const confirmation: any = await workingStatusForDeamon(data);

    if (confirmation && confirmation.status === 'OK') {
      console.log('confirmation ok');
      if (confirmation.nettype === window.networkType) {
        setVerifyDeamon(data);
        setTestNotify({ status: 'ok', content: `Success` });
        return;
      }
      setTestNotify({
        status: 'failed',
        content: `You're using ${confirmation.nettype} IP. Use a ${window.networkType} IP`,
      });
      return;
    }
    // setIpAddress('');
    // setPort('');
    setTestNotify({ status: 'failed', content: `Connection Error` });
    setVerifyDeamon({});
  }

  console.log('!ipAddress && !port ::', !ipAddress && !port);


  return (
    <div>
      <div onClick={() => dispatch(setting())} style={{ cursor: 'pointer' }}>
        <Flex container={true} alignItems="center">
          <BchatIcon iconType="walletBackArrow" iconSize={'huge'} iconColor={'#9393af'} />
          <div className="wallet-addressBook-header-txt">{window.i18n('node')}</div>
        </Flex>
      </div>
      <SpacerLG />
      <section className="wallet-settings-nodeSetting-contentBox">
        <Flex
          container={true}
          alignItems="center"
          flexDirection="row"
          width="100%"
          justifyContent="flex-start"
        >
          <article
            className="wallet-settings-nodeSetting-FlexBox"
            onClick={() => setLocalDeamonVisible(false)}
          >
            <div
              className="wallet-settings-nodeSetting-FlexBox-outlineCircle"
              style={!localDeamonVisible ? { border: '2px solid #20d024' } : { border: '2px solid' }}
            >
              {!localDeamonVisible && (
                <BchatIcon iconType="circle" iconSize="tiny" iconColor="#20D024" />
              )}
            </div>
            <div className="marginLeft"> {window.i18n('remoteDaemonOnly')}</div>
          </article>
          {/* <div className="marginLeft marginRight "></div> */}

          <article
            className="wallet-settings-nodeSetting-FlexBox"
            style={{ marginLeft: '100px' }}
            onClick={() => {
              setLocalDeamonVisible(true);
              setTestNotify({ status: '', content: '' });
              setIpAddress('');
              setPort('');
              setVerifyDeamon({});
            }}
          >
            <div
              className="wallet-settings-nodeSetting-FlexBox-outlineCircle"
              style={localDeamonVisible ? { border: '2px solid green' } : { border: '2px solid' }}
            >
              {localDeamonVisible && (
                <BchatIcon iconType="circle" iconSize="tiny" iconColor="#20D024" />
              )}
            </div>
            <div className="marginLeft"> {window.i18n('localDaemonOnly')}</div>
          </article>
        </Flex>
        <SpacerMD />

        <div className="wallet-settings-nodeSetting-notesTxt">
          {localDeamonVisible
            ? window.i18n('localDeamonheadetcntent')
            : window.i18n('remoteNoteToAllTransactions')}
          { }
        </div>

        <SpacerLG />

        {localDeamonVisible ? (
          <LocalDeamon />
        ) : (
          <>
            <Flex container={true} justifyContent="space-between">
              <div className="wallet-settings-nodeSetting-dropDownHeaderTxt">
                {window.i18n('addRemoteDaemonNode')}
              </div>
              <div onClick={() => setViewBox1(!viewBox1)} style={{ cursor: 'pointer' }}>
                <BchatIcon
                  iconType="circleChevron"
                  iconSize={'medium'}
                  iconRotation={viewBox1 ? 0 : 178}
                />
              </div>
            </Flex>
            <SpacerLG />

            <div
              className={classNames(
                'wallet-settings-nodeSetting-remoteContentBox-content-hidden-Box'
              )}
              style={viewBox1 ? { display: 'block' } : {}}
            >
              <Flex container={true} justifyContent="space-between">
                <article className="wallet-settings-nodeSetting-remoteContentBox">
                  <div className="wallet-settings-nodeSetting-remoteContentBox-labelTxt">
                    {window.i18n('remoteNodeHost')}
                  </div>

                  <input
                    value={ipAddress}
                    placeholder="Enter your IP address"
                    className="wallet-settings-nodeSetting-remoteContentBox-inputBox"
                    onChange={(e: any) => {
                      assignHost(e.target.value);
                    }}
                  />
                </article>
                <article className="wallet-settings-nodeSetting-remoteContentBox">
                  <div className="wallet-settings-nodeSetting-remoteContentBox-labelTxt">
                    {window.i18n('remoteNodePort')}
                  </div>

                  <input
                    value={port}
                    className="wallet-settings-nodeSetting-remoteContentBox-inputBox"
                    onChange={(e: any) => numberOnly(e.target.value)}
                    placeholder="Enter your port"
                  />
                </article>
              </Flex>
              <SpacerLG />
              <SpacerLG />

              <div className="wallet-settings-nodeSetting-FlexBox wallet-settings-nodeSetting-remoteContentBox-btnBox">
                <div>
                  <BchatButton
                    buttonColor={BchatButtonColor.Primary}
                    text={window.i18n('test')}
                    onClick={() => validationForDeamon()}
                    disabled={!ipAddress && !port}
                  />
                </div>
                <div>
                  <BchatButton
                    buttonColor={BchatButtonColor.Green}
                    text={window.i18n('add')}
                    onClick={() => addDeamonNet()}
                    disabled={Object.keys(verifyDeamon).length === 0 ? true : false}
                  />
                </div>
              </div>
              {/* {testNotify.status ? ( */}
              <div className="wallet-settings-nodeSetting-remoteContentBox-warning-box">
                {testNotify.status && <>

                  <span style={testNotify.status == 'ok' ? { color: 'green' } : { color: 'red' }}>
                    Test Result :
                  </span>
                  <span style={{ paddingLeft: '6px' }}>{testNotify.content}</span>
                  <BchatIcon
                    iconType={testNotify.status === 'fail' ? 'warning' : 'tickCircle'}
                    iconSize={16}
                    iconColor={testNotify.status === 'fail' ? 'red' : 'green'}
                    iconPadding={'2px'}

                  />
                </>}
              </div>

              {/* )  */}
              {/* : (
                <SpacerLG />
              ) */}
              {/* } */}

              <SpacerLG />
            </div>

            <div className="wallet-settings-nodeSetting-horizontalLine"></div>
            <SpacerLG />

            {/* ******************************Choose deamon section****************************************** */}

            <Flex container={true} justifyContent="space-between">
              <div className="wallet-settings-nodeSetting-dropDownHeaderTxt">
                {window.i18n('chooseRemoteDaemonNode')}
              </div>
              <div onClick={() => showDropDown()} style={{ cursor: 'pointer' }}>
                <BchatIcon
                  iconType="circleChevron"
                  iconSize={'medium'}
                  iconRotation={viewBox2 ? 0 : 178}
                />
              </div>
            </Flex>
            <SpacerLG />

            <div
              className={classNames(
                'wallet-settings-nodeSetting-remoteContentBox-content-hidden-Box'
              )}
              style={viewBox2 ? { display: 'block' } : {}}
            >
              <Flex container={true} justifyContent="space-between">
                <article className="wallet-settings-nodeSetting-remoteContentBox">
                  <div className="wallet-settings-nodeSetting-remoteContentBox-labelTxt">
                    {window.i18n('remoteNodeHost')}
                  </div>
                  <div
                    className="wallet-settings-nodeSetting-remoteContentBox-inputBox"
                    style={{flexDirection: 'column',padding: 0}}
                    ref={modalRef}
                  >
                    <div 
                    className="wallet-settings-nodeSetting-remoteContentBox-inputBox"
                    style={{width:'100%'}}

                    >
                      <div
                        className="wallet-settings-nodeSetting-remoteContentBox-inputBox-input"
                        style={{ padding: 0 }}
                      >
                        <input
                          value={chooseDeamon}
                          className="wallet-settings-nodeSetting-remoteContentBox-inputBox-input"
                          style={{ width: '95%', padding: 0 }}
                          disabled={true}
                        />

                      </div>

                      <div
                        className="wallet-settings-nodeSetting-remoteContentBox-inputBox-dropDownBtn"
                        onClick={() => setDropdown(!dropdown)}
                      >
                        <BchatIcon iconSize={20} iconType="chevron" />
                      </div>
                    </div>
                    <div>


                      {dropdown && (
                        <div style={{ position: 'relative' }}>
                          <div className="wallet-settings-nodeSetting-dropDownModal">
                            {option.length > 0 &&
                              option.map((item: any, i: number) => (
                                <div
                                  key={i}
                                  style={{ marginBottom: '5px' }}
                                  onClick={() => AssignCurrentDeamon(item)}
                                >
                                  <BchatIcon
                                    iconType="circle"
                                    iconSize={8}
                                    iconColor={item.active ? '#20D024' : 'red'}
                                  />
                                  <span style={{ marginLeft: '10px' }}>
                                    {item.host}:{item.port}
                                  </span>
                                </div>
                              ))}
                            {/* <div style={{ marginBottom: '5px' }} onClick={()=>{setChooseDeamon('mainnet.beldex.io'),setDropdown(false),setChooseDeamonPort(29095)}}>
                                            <BchatIcon iconType="circle" iconSize={8} iconColor='#20D024' />
                                            <span style={{ marginLeft: "10px" }}>mainnet.beldex.io:29095</span>
                                        </div> */}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>

                <article className="wallet-settings-nodeSetting-remoteContentBox">
                  <div className="wallet-settings-nodeSetting-remoteContentBox-labelTxt">
                    {window.i18n('remoteNodePort')}
                  </div>

                  <input
                    value={chooseDeamonPort}
                    className="wallet-settings-nodeSetting-remoteContentBox-inputBox"
                    disabled={true}
                  />
                </article>
              </Flex>

              <SpacerLG />
              <SpacerLG />
              <div className="wallet-settings-nodeSetting-FlexBox wallet-settings-nodeSetting-remoteContentBox-btnBox">
                <div>
                  <BchatButton
                    buttonColor={BchatButtonColor.Green}
                    text={window.i18n('save')}
                    onClick={() => currentDeamonNet()}
                  />
                </div>
              </div>
              <SpacerLG />
              <SpacerLG />
              <div className="wallet-settings-nodeSetting-horizontalLine"></div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};
