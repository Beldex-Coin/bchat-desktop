import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { getHeight } from '../../state/selectors/walletConfig';
import { Flex } from '../basic/Flex';
import { updateWalletRescaning } from '../../state/ducks/walletConfig';
import { walletSettingsKey } from '../../data/settings-key';
import _ from 'lodash';
// import classNames from 'classnames';




const SyncStatusBar = (props: { from?: string }) => {
  const dispatch = useDispatch();
  const { from = "" } = props
  let currentHeight: any;
  let daemonHeight: any;

  const currentDaemon = window.getSettingValue(walletSettingsKey.settingsCurrentDeamon);
  const walletDetails = useSelector((state: any) => state.wallet);
  let decimalValue: any = window.getSettingValue(walletSettingsKey.settingsDecimal);
  decimalValue = decimalValue.charAt(0);

  if (currentDaemon?.type === 'Local') {
    currentHeight = useSelector((state: any) => state.daemon.height);
    daemonHeight = Number(useSelector(getHeight));
    console.log('currentDaemon?.type ::', currentDaemon?.type, currentHeight, daemonHeight)

  } else {
    currentHeight = Number(useSelector(getHeight));
    daemonHeight = useSelector((state: any) => state.daemon.height);
    console.log('currentDaemon sync ::', currentDaemon?.type, currentHeight, daemonHeight)

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
    <div className="syncStatus">
      <div  >
        {from !== "chat" && <Indicator
          style={{
            width: `${percentage}%`,
            backgroundColor: syncStatus.color,
          }}
        />
        }
        <Flex container={true} justifyContent="space-between" padding={from === "chat" ? "5px 18px" : "5px 0"}>
          <Flex container={true}>
            <div className="syncStatus-statusTxt">
              Status :{' '}
              <span
                className="syncStatus-statusTxt-greenTxt"
                style={{ color: syncStatus.color }}
              >
                {syncStatus.status}
              </span>
            </div>
          </Flex>
          <Flex container={true}>
            <div style={{ marginRight: '10px' }} className="syncStatus-statusvalue">
              {window.getSettingValue('current-deamon')?.type} : {daemonHeight}
            </div>
            <div className="syncStatus-statusvalue">
              Wallet : {currentHeight} / {daemonHeight} ({percentage}%)
            </div>
            {from == "chat" && <>
              <div className="syncStatus-statusvalue" style={{ marginLeft: '10px' }}>
                Balance : {(walletDetails.balance / 1e9).toFixed(decimalValue)}

              </div>
              <div className="syncStatus-statusvalue" style={{ marginLeft: '10px' }}>
                Unlocked Balance : {(walletDetails.unlocked_balance / 1e9).toFixed(decimalValue)}
              </div>
            </>
            }
          </Flex>
        </Flex>
        {from == "chat" && <Indicator
          style={{
            width: `${percentage}%`,
            backgroundColor: syncStatus.color,
          }}
        />
        }
      </div>
    </div>
  );
};

const Indicator = styled.div`
  width: 10%;
  height: 2px;
  background-color: #fdb12a;
`;

export const MemoSyncStatusBar = React.memo(SyncStatusBar);