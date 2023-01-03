import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { getHeight } from '../../state/selectors/walletConfig';
import { Flex } from '../basic/Flex';

export const SyncStatusBar = () => {
  const currentHeight: any = Number(useSelector(getHeight));
  let daemonHeight = useSelector((state: any) => state.daemon.height);
  let pct: any =
    currentHeight == 0 || daemonHeight == 0 ? 0 : ((100 * currentHeight) / daemonHeight).toFixed(1);
  let percentage = pct == 100.0 && currentHeight < daemonHeight ? 99.9 : pct;
  const getSyncStatus = localStorage.getItem('syncStatus');
  const syncStatus = getSyncStatus
    ? { color: '#1DBF25', status: 'Synchronized' }
    : { color: '#FDB12A', status: 'Scanning' };
  // currentHeight == daemonHeight && pct !== 0 ? localStorage.setItem('syncStatus', 'true') : '';
  console.log("percentage:",percentage)
  pct >= 99 ? localStorage.setItem('syncStatus', 'true') : '';

  return (
    <div className="wallet-syncStatus">
      <div className="wallet-syncStatus-absolute">
        <Indicator
          style={{
            width: `${percentage == 0 ? '10' : percentage}%`,
            backgroundColor: syncStatus.color,
          }}
        />
        <Flex container={true} justifyContent="space-between" padding="5px 0">
          <Flex container={true}>
            <div className="wallet-syncStatus-statusTxt">
              Status :{' '}
              <span
                className="wallet-syncStatus-statusTxt-greenTxt"
                style={{ color: syncStatus.color }}
              >
                {syncStatus.status}
              </span>
            </div>
          </Flex>
          <Flex container={true}>
            <div style={{ marginRight: '10px' }} className="wallet-syncStatus-statusvalue">
              Remote : {daemonHeight}
            </div>
            <div className="wallet-syncStatus-statusvalue">
              Wallet : {currentHeight} / {daemonHeight} ({percentage}%)
            </div>
          </Flex>
        </Flex>
      </div>
    </div>
  );
};

const Indicator = styled.div`
  width: 10%;
  height: 2px;
  background-color: #fdb12a;
`;
