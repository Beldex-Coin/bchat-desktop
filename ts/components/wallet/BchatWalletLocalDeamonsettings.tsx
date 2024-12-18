import classNames from 'classnames';
import React, { useState } from 'react';
import { Flex } from '../basic/Flex';
import { SpacerLG } from '../basic/Text';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { workingStatusForDeamon } from '../../wallet/BchatWalletHelper';
import { walletSettingsKey } from '../../data/settings-key';
import { ToastUtils } from '../../bchat/utils';
import { BchatIcon } from '../icon/BchatIcon';
import { useKey } from 'react-use';
import { useDispatch } from 'react-redux';
import {
  updateFiatBalance,
  updateWalletHeight,
  updateWalletRescaning,
} from '../../state/ducks/walletConfig';
import { updateBalance } from '../../state/ducks/wallet';

export function LocalDeamon() {
  const localDeamonHost = '127.0.0.1';
  const [localDeamonPort, setLocalDeamonPort] = useState('');
  const [testNotify, setTestNotify] = useState('');
  const [verifyDeamon, setvSerifyDeamon] = useState({});
  const dispatch = useDispatch();

  async function validationForDeamon() {
    let data = { host: localDeamonHost, port: localDeamonPort, active: 1, type: 'Local' };
    const confirmation: any = await workingStatusForDeamon(data, 'daemonValidation');
    if (confirmation && confirmation.status === 'OK') {
      setvSerifyDeamon(data);
      setTestNotify(`Success`);
      return;
    }
    setTestNotify(`Error`);
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
      return ToastUtils.pushToastInfo('localAlreadyAdded', `Local daemon already connected.`);
    }

    let rescan: any = true;
    let Transactions: any = '';
    let wallHeight: any = 0;
    dispatch(
      updateBalance({
        balance: 0,
        unlocked_balance: 0,
        transacations: [],
      })
    );
    dispatch(updateWalletRescaning(rescan));
    dispatch(updateFiatBalance(Transactions));
    window.setSettingValue('syncStatus', false);

    dispatch(updateWalletHeight(wallHeight));

    setLocalDeamonPort('');
    setTestNotify('');
    setvSerifyDeamon({});
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
              className="wallet-settings-nodeSetting-remoteContentBox-inputBox-input"
              onChange={(e: any) => {
                portValidation(e.target.value);
              }}
              placeholder="Enter your port"
              maxLength={5}
            />
          </article>
        </Flex>
        <SpacerLG />
        {/* <SpacerLG /> */}

        <div className="wallet-settings-nodeSetting-FlexBox wallet-settings-nodeSetting-remoteContentBox-btnBox">
          <div>
            <BchatButton
              // buttonColor={BchatButtonColor.Primary}
              buttonType={BchatButtonType.Brand}
              buttonColor={!localDeamonPort ? BchatButtonColor.Secondary : BchatButtonColor.Primary}
              text={window.i18n('test')}
              onClick={() => localDeamonPort && validationForDeamon()}
              style={{ cursor: !localDeamonPort ? 'default' : 'pointer' }}
            />
          </div>
          <div style={{ marginRight: '20px' }}></div>
          <div>
            <BchatButton
              buttonColor={
                Object.keys(verifyDeamon).length === 0
                  ? BchatButtonColor.Secondary
                  : BchatButtonColor.Primary
              }
              buttonType={BchatButtonType.Brand}
              text={window.i18n('save')}
              onClick={() => Object.keys(verifyDeamon).length !== 0 && addDeamonNet()}
              style={{ cursor: Object.keys(verifyDeamon).length === 0 ? 'default' : 'pointer' }}

            />
          </div>
        </div>
        <SpacerLG />
        {/* <div className="wallet-settings-nodeSetting-remoteContentBox-warning-box"> */}
        {testNotify && (
          <div className="wallet-settings-nodeSetting-remoteContentBox-warning-box">

            <>
              <span className="result">{window.i18n('NodeTestResult')}</span>
              {testNotify === 'Success' ? (
                <span className="result-msg">{testNotify}</span>
              ) : (
                <span className="result-msg">
                  Connection : <span className="error-msg">{testNotify}</span>
                </span>
              )}

              <BchatIcon
                iconType={testNotify === 'Success' ? 'tickCircle' : 'warning'}
                iconSize={20}
                iconColor={testNotify === 'Success' ? 'green' : 'red'}
                iconPadding={'0 0 0 3px'}
              />
            </>
          </div>
        )}
        {/* </div> */}
        {/* <SpacerLG /> */}
      </div>
    </>
  );
}
