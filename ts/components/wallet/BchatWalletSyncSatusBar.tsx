import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { getHeight } from '../../state/selectors/walletConfig';
import { Flex } from '../basic/Flex';
import { updateWalletRescaning } from '../../state/ducks/walletConfig';
import { walletSettingsKey } from '../../data/settings-key';
import _ from 'lodash';
// import classNames from 'classnames';

const SyncStatusBar = () => {
  const dispatch = useDispatch();
  // const { from = "" } = props
  let currentHeight: any;
  let daemonHeight: any;

  const currentDaemon = window.getSettingValue(walletSettingsKey.settingsCurrentDeamon);
  const zoomLevel = window.getSettingValue('zoom-factor-setting');
  // const walletDetails = useSelector((state: any) => state.wallet);
  let decimalValue: any =
    window.getSettingValue(walletSettingsKey.settingsDecimal) || '2 - Two (0.00)';
  decimalValue = decimalValue.charAt(0);

  if (currentDaemon?.type === 'Local') {
    currentHeight = useSelector((state: any) => state.daemon.height);
    daemonHeight = Number(useSelector(getHeight));
  } else {
    currentHeight = Number(useSelector(getHeight));
    daemonHeight = useSelector((state: any) => state.daemon.height);
  }

  let pct: any =
    currentHeight == 0 || daemonHeight == 0 ? 0 : ((100 * currentHeight) / daemonHeight).toFixed(1);
  let percentage = pct == 100.0 && currentHeight < daemonHeight ? 99.9 : pct;

  const getSyncStatus = window.getSettingValue('syncStatus');
  const syncStatus = getSyncStatus
    ? { color: '#1DBF25', status: 'Synchronized' }
    : { color: '#FDB12A', status: 'Scanning' };

  window.setSettingValue('syncStatus', pct >= 99 ? true : false);
  let value: any = pct >= 99 ? true : false;
  dispatch(updateWalletRescaning(value));

  return (
    <div className="syncStatus" style={{height:zoomLevel>125?'unset':''}}>
      <div>
        <Flex
          container={true}
          justifyContent="space-between"
          alignItems="center"
          padding={'5px 15px'}
          height={zoomLevel>125?"":"43px"}
        >
          <Flex container={true}>
            <div className="syncStatus-statusTxt-wrapper">
              <span className="txt">Status </span>
              <span className="syncStatus-statusTxt-greenTxt" style={{ color: syncStatus.color }}>
                {syncStatus.status}
              </span>
            </div>
          </Flex>
          <Flex container={true}>
            {/* {from == "chat" && <>
              <div className={ (walletDetails.balance / 1e9) > 0 ?"syncStatus-balance":'syncStatus-disableBalance'} >
                Balance : <span className='syncStatus-disableBalance'>{(walletDetails.balance / 1e9).toFixed(decimalValue)}</span>

              </div>
              <div className={ (walletDetails.balance / 1e9) > 0 ?"syncStatus-unlocked-Balance":'syncStatus-disableBalance'} style={{ marginLeft: '10px' }}>
                Unlocked Balance : <span className='syncStatus-disableBalance'> {(walletDetails.unlocked_balance / 1e9).toFixed(decimalValue)}</span>
              </div>
            </>
            } */}
            <div className="syncStatus-statusvalue">
              <span className="type-txt">{window.getSettingValue('current-deamon')?.type} :</span>{' '}
              <span className="type-value">{daemonHeight}</span>
            </div>
            <div className="syncStatus-statusvalue" style={{ marginLeft: '10px' }}>
              <span className="type-txt">Wallet :</span>{' '}
              <span className="type-value">
                {currentHeight} / {daemonHeight}
              </span>
            </div>
            <div className="per-Wrapper" style={{ marginLeft: '10px' }}>
              {Math.floor(percentage)}%
            </div>
          </Flex>
        </Flex>
        <Indicator
          style={{
            width: `${percentage}%`,
            backgroundColor: syncStatus.color,
          }}
        />
      </div>
    </div>
  );
};

const Indicator = styled.div`
  width: 10%;
  height: 2px;
  background-color: #fdb12a;
  transition: width 3s ease-in-out;
`;

export const MemoSyncStatusBar = React.memo(SyncStatusBar);
