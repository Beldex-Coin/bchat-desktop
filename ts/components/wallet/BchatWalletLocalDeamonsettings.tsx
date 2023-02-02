import classNames from 'classnames';
import React, { useState } from 'react';
import { Flex } from '../basic/Flex';
import { SpacerLG } from '../basic/Text';
import { BchatButton, BchatButtonColor } from '../basic/BchatButton';
import { workingStatusForDeamon } from '../../wallet/BchatWalletHelper';
import { walletSettingsKey } from '../../data/settings-key';
import { ToastUtils } from '../../bchat/utils';
import { BchatIcon } from '../icon/BchatIcon';
import { useKey } from 'react-use';

export function LocalDeamon() {
  const localDeamonHost = '127.0.0.1';
  const [localDeamonPort, setLocalDeamonPort] = useState('');
  const [testNotify, setTestNotify] = useState('');
  const [verifyDeamon, setvSerifyDeamon] = useState({});


  async function validationForDeamon() {
    let data = { host: localDeamonHost, port: localDeamonPort, active: 1, type: 'Local' };
    const confirmation: any = await workingStatusForDeamon(data, 'daemonValidation');
    if (confirmation && confirmation.status === 'OK') {
      setvSerifyDeamon(data);
      setTestNotify(`Success`);
      return;
    }
    setTestNotify(`Connection Error`);
  }

  useKey((event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (localDeamonPort) {
        validationForDeamon();
      }
      if (Object.keys(verifyDeamon).length !== 0) {
        addDeamonNet();
      }
    }
    return event.key === 'Enter';
  });

  function addDeamonNet() {
    let data: any = verifyDeamon;
    if (Object.keys(data).length === 0) {
      return;
    }
    const currentDaemon = window.getSettingValue(walletSettingsKey.settingsCurrentDeamon);
    if (currentDaemon.host == data.host) {
      return ToastUtils.pushToastInfo('daemonAlreadyAdded', `This daemon already added.`);
    }
    window.setSettingValue(walletSettingsKey.settingsCurrentDeamon, verifyDeamon);
    return ToastUtils.pushToastSuccess(
      'successfully-added-daemon',
      `Successfully ${data.host}:${data.port} daemon added.`
    );
  }

  function portValidation(value: any) {
    const regex = /^[0-9\b]+$/;
    if (value === '' || regex.test(value)) {
      setLocalDeamonPort(value);
      setTestNotify('');
      setvSerifyDeamon({});
    }
  }

  return (
    <>
      <div
        className={classNames('wallet-settings-nodeSetting-remoteContentBox-content-hidden-Box')}
        style={{ display: 'block' }}
      >
        <Flex container={true} justifyContent="space-between">
          <article className="wallet-settings-nodeSetting-remoteContentBox">
            <div className="wallet-settings-nodeSetting-remoteContentBox-labelTxt">
              {window.i18n('localNodeHost')}
            </div>

            <input
              value={localDeamonHost}
              placeholder="Enter your IP address"
              className="wallet-settings-nodeSetting-remoteContentBox-inputBox"
              disabled={true}
              //   onChange={(e: any) => setLocalDeamonHost(e.target.value)}
            />
          </article>
          <article className="wallet-settings-nodeSetting-remoteContentBox">
            <div className="wallet-settings-nodeSetting-remoteContentBox-labelTxt">
              {window.i18n('localNodePort')}
            </div>

            <input
              value={localDeamonPort}
              className="wallet-settings-nodeSetting-remoteContentBox-inputBox"
              onChange={(e: any) => {
                portValidation(e.target.value);
                // !isNaN(e.target.value) &&
                // setTestNotify('');
                //  setLocalDeamonPort(e.target.value)}
              }}
              placeholder="Enter your port"
              maxLength={5}
            />
          </article>
        </Flex>
        <SpacerLG />
        <SpacerLG />

        <div className="wallet-settings-nodeSetting-FlexBox wallet-settings-nodeSetting-remoteContentBox-btnBox">
          <div>
            <BchatButton
              buttonColor={!localDeamonPort ? BchatButtonColor.Disable : BchatButtonColor.Primary}
              text={window.i18n('test')}
              onClick={() => validationForDeamon()}
              disabled={!localDeamonPort}
            />
          </div>
          <div style={{ marginRight: '20px' }}></div>
          <div>
            <BchatButton
              buttonColor={
                Object.keys(verifyDeamon).length === 0
                  ? BchatButtonColor.Disable
                  : BchatButtonColor.Green
              }
              text={window.i18n('save')}
              onClick={() => addDeamonNet()}
              disabled={Object.keys(verifyDeamon).length === 0 ? true : false}
            />
          </div>
        </div>
        <div className="wallet-settings-nodeSetting-remoteContentBox-warning-box">
          {testNotify && (
            <>
              <span
                className="result"
                style={
                  testNotify === 'Connection Error' ? { color: '#FF2F2F' } : { color: 'green' }
                }
              >
                {window.i18n('NodeTestResult')} :
              </span>
              <span style={{ paddingLeft: '6px' }}>{testNotify}</span>
              <BchatIcon
                iconType={testNotify === 'Connection Error' ? 'warning' : 'tickCircle'}
                iconSize={16}
                iconColor={testNotify === 'Connection Error' ? 'red' : 'green'}
                iconPadding={'0 0 0 3px'}
              />
            </>
          )}
        </div>

        <SpacerLG />
      </div>
    </>
  );
}
