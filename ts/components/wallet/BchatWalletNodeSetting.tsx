import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { setting } from '../../state/ducks/walletSection';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { Flex } from '../basic/Flex';
import { SpacerLG, SpacerMD } from '../basic/Text';
import { BchatIcon } from '../icon/BchatIcon';
import classNames from 'classnames';
import { walletSettingsKey } from '../../data/settings-key';
import { workingStatusForDeamon } from '../../wallet/BchatWalletHelper';
import { LocalDeamon } from './BchatWalletLocalDeamonsettings';
import { ToastUtils } from '../../bchat/utils';
import { useKey } from 'react-use';
import {
  updateFiatBalance,
  updateWalletHeight,
  updateWalletRescaning,
} from '../../state/ducks/walletConfig';
import { updateBalance } from '../../state/ducks/wallet';
import { BchatIconButton } from '../icon';
import { getTheme } from '../../state/selectors/theme';
// import { WalletSettings } from './BchatWalletSettings';

export const NodeSetting = (props: any) => {
  const dispatch = useDispatch();

  const currentDeamon = window.getSettingValue(walletSettingsKey.settingsCurrentDeamon)
    ? window.getSettingValue(walletSettingsKey.settingsCurrentDeamon)
    : window.currentDaemon;
  const deamonList = window.getSettingValue(walletSettingsKey.settingsDeamonList);
  const currentHost =
    currentDeamon.host == '127.0.0.1' ? window.currentDaemon.host : currentDeamon.host;
  const currentPort =
    currentDeamon.host == '127.0.0.1' ? window.currentDaemon.port : currentDeamon.port;
  const [viewBox1, setViewBox1] = useState(false);
  const [viewBox2, setViewBox2] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  const [port, setPort] = useState('');
  const [dropdown, setDropdown] = useState(false);
  const [chooseDeamon, setChooseDeamon] = useState(currentHost);
  const [chooseDeamonPort, setChooseDeamonPort] = useState(currentPort);
  const [option, setOption] = useState(deamonList);
  const [verifyDeamon, setVerifyDeamon] = useState({});
  const [testNotify, setTestNotify] = useState({ status: '', content: '', StatusIcon: true });
  const [testbtnDisable, setTestbtnDisable] = useState(false);
  const [localDeamonVisible, setLocalDeamonVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const zoomLevel = window.getSettingValue('zoom-factor-setting');
  const testBottonEnable = !(ipAddress && port);
  const savebtnValidation =
    currentDeamon.host === chooseDeamon && currentDeamon.port === chooseDeamonPort;
  const darkMode = useSelector(getTheme) === 'dark';
  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  function portValidation(value: any) {
    const regex = /^[0-9\b]+$/;
    if (value === '' || regex.test(value)) {
      setPort(value);
      setVerifyDeamon({});
      setTestNotify({ status: '', content: ``, StatusIcon: true });
    }
  }

  function assignHost(e: any) {
    setIpAddress(e);
    setVerifyDeamon({});
    setTestNotify({ status: '', content: ``, StatusIcon: true });
  }

  function addDeamonNet() {
    let data: any = verifyDeamon;
    if (Object.keys(data).length === 0) {
      return;
    }
    data.type = 'Remote';
    let deamon_list = window.getSettingValue(walletSettingsKey.settingsDeamonList);
    let checkVerifiedDaemon = deamon_list.find((daemon: any) => daemon.host == data.host);
    if (checkVerifiedDaemon) {
      return ToastUtils.pushToastInfo('daemonAlreadyAdded', `This daemon already added.`);
    }

    if (deamon_list) {
      deamon_list.push(data);
    }
    window.setSettingValue(walletSettingsKey.settingsDeamonList, deamon_list);
    setOption(deamon_list);
    assignHost('');
    setPort('');
    setVerifyDeamon({});
    setTestNotify({ status: '', content: '', StatusIcon: true });
    return ToastUtils.pushToastSuccess('daemonAddedSuccessfully', `Daemon added successfully.`);
  }

  function currentDeamonNet() {
    let choosenDaemon = { host: chooseDeamon, port: chooseDeamonPort, active: 1, type: 'Remote' };
    window.setSettingValue(walletSettingsKey.settingsCurrentDeamon, choosenDaemon);

    let rescan: any = true;
    let Transactions: any = '';
    let wallHeight: any = 0;
    dispatch(updateWalletRescaning(rescan));
    dispatch(updateFiatBalance(Transactions));
    window.setSettingValue('syncStatus', false);
    dispatch(
      updateBalance({
        balance: 0,
        unlocked_balance: 0,
        transacations: [],
      })
    );
    dispatch(updateWalletHeight(wallHeight));
    ToastUtils.pushToastSuccess(
      'successfully-updated-current-daemon',
      `Successfully ${choosenDaemon.host}:${choosenDaemon.port} daemon updated.`
    );
    setDropdown(false);
  }

  async function showDropDown() {
    setViewBox2(!viewBox2);
    let data = window.getSettingValue(walletSettingsKey.settingsDeamonList);
    let status = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].type == 'Remote') {
        const deamonStatus = await workingStatusForDeamon(data[i], 'daemonValidation');
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
  };

  useKey((event: KeyboardEvent) => {
    if (!localDeamonVisible && event.key === 'Enter') {
      if (!testBottonEnable) {
        validationForDeamon();
      }
      if (Object.keys(verifyDeamon).length !== 0) {
        addDeamonNet();
      }
    }
    return event.key === 'Enter';
  });

  async function validationForDeamon() {
    setTestbtnDisable(true);
    let data = { host: ipAddress, port: port, active: 1, type: 'Remote' };
    const confirmation: any = await workingStatusForDeamon(data, 'daemonValidation');
    if (confirmation && confirmation.status === 'OK') {
      if (confirmation.nettype === window.networkType) {
        setVerifyDeamon(data);
        setTestNotify({ status: 'ok', content: `Success`, StatusIcon: true });
        return;
      }
      setTestNotify({
        status: 'ok',
        content: `You're using ${confirmation.nettype} IP. Use a ${window.networkType} IP`,
        StatusIcon: false,
      });
      return;
    }
    setTestNotify({ status: 'failed', content: `Error`, StatusIcon: true });
    setVerifyDeamon({});
    setTestbtnDisable(false);
  }

  return (
    <div>
      <div style={{ cursor: 'pointer' }}>
        <Flex container={true} alignItems="center">
          <div className="marginRight">
            <BchatIconButton
              iconType="walletBackArrow"
              iconSize={'medium'}
              iconColor={darkMode ? '#F0F0F0' : '#333333'}
              onClick={() => props.onClick()}
            />
          </div>
          <div className="wallet-settings-tabBox-subtle">{window.i18n('node')}</div>
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
          style={{ fontSize: '16px' }}
        >
          <article className="wallet-settings-nodeSetting-FlexBox">
            <div
              onClick={() => setLocalDeamonVisible(false)}
              className="wallet-settings-nodeSetting-FlexBox-outlineCircle"
              style={
                !localDeamonVisible
                  ? { border: '2px solid var(--color-walletNodeHeader)' }
                  : { border: '2px solid var(--color-radio-icon)' }
              }
            >
              {!localDeamonVisible && (
                <BchatIcon
                  iconType="circle"
                  iconSize={11}
                  iconColor="var(--color-walletNodeHeader)"
                />
              )}
            </div>
            <div className="marginLeft wallet-settings-nodeSetting-FlexBox-radio-label">
              {' '}
              {window.i18n('remoteDaemonOnly')}
            </div>
          </article>
          <article className="wallet-settings-nodeSetting-FlexBox" style={{ marginLeft: '50px' }}>
            <div
              onClick={() => {
                setLocalDeamonVisible(true);
                setTestNotify({ status: '', content: '', StatusIcon: true });
                setIpAddress('');
                setPort('');
                setVerifyDeamon({});
              }}
              className="wallet-settings-nodeSetting-FlexBox-outlineCircle"
              style={
                localDeamonVisible
                  ? { border: '2px solid var(--color-walletNodeHeader)' }
                  : { border: '2px solid var(--color-radio-icon)' }
              }
            >
              {localDeamonVisible && (
                <BchatIcon
                  iconType="circle"
                  iconSize={11}
                  iconColor="var(--color-walletNodeHeader)"
                />
              )}
            </div>
            <div className="marginLeft wallet-settings-nodeSetting-FlexBox-radio-label">
              {' '}
              {window.i18n('localDaemonOnly')}
            </div>
          </article>
        </Flex>
        <SpacerMD />
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
            {/* ******************************Add deamon section****************************************** */}

            <Flex
              className="wallet-settings-nodeSetting-dropDownHeaderTxt"
              container={true}
              justifyContent="space-between"
              cursor={'pointer'}
              onClick={() => setViewBox1(!viewBox1)}
            >
              <div className="text">{window.i18n('addRemoteDaemonNode')}</div>
              <div>
                <BchatIcon
                  iconColor="#A7A7BA"
                  iconType="chevron"
                  iconSize={'small'}
                  iconRotation={viewBox1 ? 178 : 0}
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
                    className="wallet-settings-nodeSetting-remoteContentBox-inputBox-input"
                    onChange={(e: any) => {
                      assignHost(e.target.value);
                    }}
                    style={zoomLevel > 125 ? { paddingLeft: '10px' } : {}}
                  />
                </article>
                <article className="wallet-settings-nodeSetting-remoteContentBox">
                  <div className="wallet-settings-nodeSetting-remoteContentBox-labelTxt">
                    {window.i18n('remoteNodePort')}
                  </div>

                  <input
                    value={port}
                    className="wallet-settings-nodeSetting-remoteContentBox-inputBox-input"
                    onChange={(e: any) => portValidation(e.target.value)}
                    placeholder="Enter your port"
                    style={zoomLevel > 125 ? { paddingLeft: '10px' } : {}}
                    maxLength={5}
                  />
                </article>
              </Flex>
              <SpacerLG />
              {/* <SpacerLG /> */}

              <div className="wallet-settings-nodeSetting-FlexBox wallet-settings-nodeSetting-remoteContentBox-btnBox">
                <div>
                  <BchatButton
                    // buttonColor={
                    //   !ipAddress && !port
                    //     ? BchatButtonColor.Disable
                    //     : !ipAddress
                    //       ? BchatButtonColor.Disable
                    //       : !port
                    //         ? BchatButtonColor.Disable
                    //         : BchatButtonColor.Primary
                    // }
                    buttonType={BchatButtonType.Brand}
                    buttonColor={
                      !testBottonEnable ? BchatButtonColor.Primary : BchatButtonColor.Secondary
                    }
                    text={window.i18n('test')}
                    onClick={() => !testBottonEnable && !testbtnDisable && validationForDeamon()}
                    style={{ cursor: !testBottonEnable ? 'pointer' : 'default' }}
                    disabled={testbtnDisable}
                  />
                </div>
                <div style={{ marginLeft: '15px' }}></div>
                <div>
                  <BchatButton
                    buttonType={BchatButtonType.Brand}
                    buttonColor={
                      Object.keys(verifyDeamon).length !== 0
                        ? BchatButtonColor.Primary
                        : BchatButtonColor.Secondary
                    }
                    text={window.i18n('add')}
                    onClick={() => Object.keys(verifyDeamon).length !== 0 && addDeamonNet()}
                    style={{
                      cursor: Object.keys(verifyDeamon).length !== 0 ? 'pointer' : 'default',
                    }}
                  />
                </div>
              </div>
              <SpacerLG />
              {/* <div className="wallet-settings-nodeSetting-remoteContentBox-warning-box"> */}
              {testNotify.status && (
                <div className="wallet-settings-nodeSetting-remoteContentBox-warning-box">

                  <>
                    <span className="result">{window.i18n('NodeTestResult')}</span>
                    {/* {testNotify.status === 'ok' ? (
                      <span className="result-msg">{testNotify.content}</span>
                    ) : ( */}
                    <span className="result-msg">
                      Connection : <span className="error-msg">{testNotify.content}</span>
                    </span>
                    {/* )} */}

                    <BchatIcon
                      iconType={testNotify.status === 'ok' ? 'check' : 'warning'}
                      iconSize={20}
                      iconColor={testNotify.status === 'ok' ? 'green' : 'red'}
                      iconPadding={'0 0 0 3px'}
                    />
                  </>
                </div>
              )}
            </div>

            {/* <SpacerLG /> */}
            {/* // </div> */}

        {/* <div className="wallet-settings-nodeSetting-horizontalLine"></div> */}
        <SpacerLG />
        {/* ******************************Choose deamon section****************************************** */}

        <Flex
          className="wallet-settings-nodeSetting-dropDownHeaderTxt"
          container={true}
          justifyContent="space-between"
          cursor={'pointer'}
          onClick={() => showDropDown()}
        >
          <div className="text">{window.i18n('chooseRemoteDaemonNode')}</div>
          <div
            // onClick={() => showDropDown()}
            style={{ cursor: 'pointer' }}
          >
            <BchatIcon
              iconColor="#A7A7BA"
              iconType="chevron"
              iconSize={'small'}
              iconRotation={viewBox2 ? 178 : 0}
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
                style={{ flexDirection: 'column', padding: 0 }}
                ref={modalRef}
              >
                <div
                  className="wallet-settings-nodeSetting-remoteContentBox-inputBox"
                  style={{ width: '100%' }}
                >
                  <div
                    className="wallet-settings-nodeSetting-remoteContentBox-inputBox-dropdown"
                    style={{ padding: 0 }}
                  >
                    <input
                      value={chooseDeamon}
                      className="wallet-settings-nodeSetting-remoteContentBox-inputBox-dropdown"
                      style={{ width: '95%', padding: 0 }}
                      disabled={true}
                      placeholder="Choose your daemon IP"
                    />
                  </div>

                  <div
                    className="wallet-settings-nodeSetting-remoteContentBox-inputBox-dropDownBtn"
                    onClick={() => setDropdown(!dropdown)}
                  >
                    <BchatIcon iconSize={20} iconType="chevron" iconColor="#A7A7BA" />
                  </div>
                </div>
                <div style={{ width: '100%' }}>
                  {dropdown && (
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div className="wallet-settings-nodeSetting-dropDownModal">
                        {option.length > 0 &&
                          option.map((item: any, i: number) => (
                            <div
                              style={{ cursor: 'pointer' }}
                              key={i}
                              className="wallet-settings-nodeSetting-dropDownModal-items"
                              onClick={() => AssignCurrentDeamon(item)}
                            >
                              <BchatIcon
                                iconType="circle"
                                iconSize={8}
                                iconColor={item.active ? '#108D32' : '#FF3E3E'}
                              />
                              <span
                                style={{ marginLeft: '10px', color: item.active ? '' : 'red' }}
                              >
                                {item.host}:{item.port}
                              </span>
                            </div>
                          ))}
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
                className="wallet-settings-nodeSetting-remoteContentBox-inputBox-input"
                disabled={true}
                placeholder="Choose your daemon port"
              />
            </article>
          </Flex>

          <SpacerLG />
          <SpacerLG />

          <Flex container={true} justifyContent="center" alignItems="center">
            <BchatButton
              buttonColor={
                savebtnValidation ? BchatButtonColor.Secondary : BchatButtonColor.Primary
              }
              buttonType={BchatButtonType.Brand}
              text={window.i18n('save')}
              onClick={() => !savebtnValidation && currentDeamonNet()}
              style={{ cursor: savebtnValidation ? 'default' : 'pointer' }}
            />
          </Flex>
          <SpacerLG />
          {/* <SpacerLG /> */}
        </div>
        {/* <div className="wallet-settings-nodeSetting-horizontalLine"></div> */}
        {/* <SpacerLG /> */}
      </>
        )}
    </section>
    </div >
  );
};
