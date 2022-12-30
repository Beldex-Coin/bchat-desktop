import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setting } from '../../state/ducks/walletSection';
import { BchatButton, BchatButtonColor } from '../basic/BchatButton';
import { Flex } from '../basic/Flex';
import { SpacerLG, SpacerMD } from '../basic/Text';
import { BchatIcon } from '../icon/BchatIcon';
import classNames from 'classnames';
import { walletSettingsKey } from '../../data/settings-key';
import {  workingStatusForDeamon } from '../../wallet/BchatWalletHelper';
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
  const [verifyDeamon, setvSerifyDeamon] = useState({});
  const [testNotify, setTestNotify] = useState({status:'',content:``});
  const [localDeamonVisible, setLocalDeamonVisible] = useState(false);

  // console.log("current deamon ::",window.getSettingValue(walletSettingsKey.settingsCurrentDeamon));

  
  function numberOnly(e:any) {
    const re = /^[0-9\b]+$/;
    if (e === '' || re.test(e)) {
      setPort(e)
      setvSerifyDeamon({});
   setTestNotify({status:'',content:``})
    }
    // if (isNaN(e)) {
    //    return
    // }
    // setAmount(e)
 }
 function assignHost(e:any) {
  setIpAddress(e);
   setvSerifyDeamon({});
   setTestNotify({status:'',content:``})
 }
  function addDeamonNet() {
    let data: any = verifyDeamon;
    if (Object.keys(data).length === 0) {
      return;
    }
    let deamon_list = window.getSettingValue(walletSettingsKey.settingsDeamonList);
    console.log('datadata1 ::', deamon_list, data);
    console.log('datadata 9898898998::', data);
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
    console.log('datadata 2::', deamon_list, data);
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
    let data = window.getSettingValue(walletSettingsKey.settingsDeamonList);
    // setOption(data)
    let status = [];
    for (let index = 0; index < data.length; index++) {
      const deamonStatus = await workingStatusForDeamon(data[index]);

      if (deamonStatus.status === 'OK') {
        data[index].active = true;
        status.push(data[index]);
      } else {
        data[index].active = false;
        status.push(data[index]);
      }
    }
    setOption(status);
    setDropdown(!dropdown);

    // console.log("option ::", option);
  }
  function AssignCurrentDeamon(item: any) {
    setChooseDeamon(item.host);
    setDropdown(false);
    setChooseDeamonPort(item.port);
    currentDeamonNet();
  }

  async function validationForDeamon() {
    let data = { host: ipAddress, port: port, active: 0 };
    const confirmation: any = await workingStatusForDeamon(data);
    console.log('confirmation::', confirmation);

    if (confirmation && confirmation.status === 'OK') {
      console.log('confirmation ok');
      if(confirmation.nettype===window.networkType )
      {
        setvSerifyDeamon(data);
        setTestNotify({status:"ok",content:`Height:${confirmation.height}`});
        return
      }
      
      // setvSerifyDeamon(data);
      // setTestNotify(`this Ip is ${confirmation.nettype}`);
      setTestNotify({status:"fail",content:`this Ip is ${confirmation.nettype} but Started net work type is ${window.networkType}`});
      return;
    }
    setIpAddress('');
    setPort('');
    setTestNotify({status:'fail',content:`Connection Error`});

    setvSerifyDeamon({});
  }

  return (
    <div>
      <div onClick={() => dispatch(setting())} style={{ cursor: 'pointer' }}>
        <Flex container={true} alignItems="center">
          <BchatIcon iconType="walletBackArrow" iconSize={'huge'}  iconColor={'#9393af'}/>
          <div className="wallet-addressBook-header-txt">{window.i18n('node')}</div>
        </Flex>
      </div>
      <SpacerLG />
      <section className="wallet-settings-nodeSetting-contentBox">
        <Flex
          container={true}
          alignItems="center"
          flexDirection="row"
          width="40%"
          justifyContent="space-between"
        >
          <article
            className="wallet-settings-nodeSetting-FlexBox"
            onClick={() => setLocalDeamonVisible(false)}
          >
            <div className="wallet-settings-nodeSetting-FlexBox-outlineCircle">
              {!localDeamonVisible && (
                <BchatIcon iconType="circle" iconSize="tiny" iconColor="#20D024" />
              )}
            </div>
            <div className="marginLeft"> {window.i18n('remoteDaemonOnly')}</div>
          </article>
          {/* <div className="marginLeft marginRight "></div> */}

          <article
            className="wallet-settings-nodeSetting-FlexBox"
            onClick={() => setLocalDeamonVisible(true)}
          >
            <div className="wallet-settings-nodeSetting-FlexBox-outlineCircle">
              {localDeamonVisible && (
                <BchatIcon iconType="circle" iconSize="tiny" iconColor="#20D024" />
              )}
            </div>
            <div className="marginLeft"> {window.i18n('localDaemonOnly')}</div>
          </article>
        </Flex>
        <SpacerMD />

        <div className="wallet-settings-nodeSetting-notesTxt">
          {localDeamonVisible ?window.i18n('localDeamonheadetcntent'):window.i18n('remoteNoteToAllTransactions')}
          {}
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
              <div onClick={() => setViewBox1(!viewBox1)} style={{cursor:'pointer'}}>
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
                    onChange={(e: any) => {assignHost(e.target.value)}}
                  />
                </article>
                <article className="wallet-settings-nodeSetting-remoteContentBox">
                  <div className="wallet-settings-nodeSetting-remoteContentBox-labelTxt">
                    {window.i18n('remoteNodePort')}
                  </div>

                  <input
                    value={port}
                    className="wallet-settings-nodeSetting-remoteContentBox-inputBox"
                    onChange={(e: any) =>numberOnly(e.target.value)}
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
              {testNotify.status && (
                <div className="wallet-settings-nodeSetting-remoteContentBox-warning-box">
                  <span
                    style={testNotify.status ? { color: 'red' } : { color: 'green' }}
                  >
                    Test Result :
                  </span>
                  <span>{testNotify.content}</span>
                  <BchatIcon iconType={testNotify.status === 'fail' ?'warning':"tickCircle"} 
                  iconSize={12} iconColor={testNotify.status === 'fail' ?"red":"green"} iconPadding={'0 0 0 3px'} />
                </div>
              )}

              <SpacerLG />
              <SpacerLG />
            </div>

            <div className="wallet-settings-nodeSetting-horizontalLine"></div>
            <SpacerLG />
            <Flex container={true} justifyContent="space-between">
              <div className="wallet-settings-nodeSetting-dropDownHeaderTxt">
                {window.i18n('chooseRemoteDaemonNode')}
              </div>
              <div onClick={() => setViewBox2(!viewBox2)} style={{cursor:'pointer'}}>
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
                  <div className="wallet-settings-nodeSetting-remoteContentBox-inputBox">
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

                    <div
                      className="wallet-settings-nodeSetting-remoteContentBox-inputBox-dropDownBtn"
                      onClick={() => showDropDown()}
                    >
                      <BchatIcon iconSize={20} iconType="chevron" />
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
