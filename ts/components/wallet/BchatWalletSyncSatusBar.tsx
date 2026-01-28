import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import styled from 'styled-components';
import { getHeight } from '../../state/selectors/walletConfig';
import { Flex } from '../basic/Flex';
import { updateWalletRescaning } from '../../state/ducks/walletConfig';
import { walletSettingsKey } from '../../data/settings-key';
import _ from 'lodash';
import styled from 'styled-components';
// import classNames from 'classnames';

const SyncStatusBar = () => {
  const dispatch = useDispatch();


  const daemonHeight = useSelector((state: any) => state.daemon.height);
  const walletHeight = Number(useSelector(getHeight)); 

  const currentDaemon = window.getSettingValue(walletSettingsKey.settingsCurrentDeamon);
  const zoomLevel = window.getSettingValue('zoom-factor-setting');

  const { currentHeight, optimizedDaemonHeight, percentage, isSynced } = useMemo(() => {
    let current, total;

    if (currentDaemon?.type === 'Local') {
      current = Math.min(daemonHeight, walletHeight);
      total = Math.max(daemonHeight, walletHeight);
    } else {
      current = walletHeight;
      total = daemonHeight;
     }

    let pct = (current === 0 || total === 0) ? 0 : (100 * current) / total;
  
    if (pct >= 100 && current < total) {
      pct = 99.9;
    }

    const formattedPct = pct.toFixed(1);
    const synced = pct >= 99; // Threshold for "Synchronized" status

    return { 
      currentHeight: current, 
      optimizedDaemonHeight: total, 
      percentage: formattedPct,
      isSynced: synced
    };
  }, [currentDaemon?.type, daemonHeight, walletHeight]);
  // 4. SIDE EFFECTS: Handle Dispatch and Window Setters here
  useEffect(() => {
    // window.setSettingValue('sync_bar', percentage);
    window.setSettingValue('syncStatus', isSynced);
    
    // Only dispatch if necessary to avoid loops
    const isscaning:any = isSynced;
    dispatch(updateWalletRescaning(isscaning));
  }, [percentage, isSynced, dispatch]);

  // 5. UI CONSTANTS
  const statusConfig =walletHeight===0?{ color: '#FDB12A', text: 'Scanning' } : isSynced 
    ? { color: '#1DBF25', text: 'Synchronized' }
    : { color: '#1DBF25', text: 'Syncing' };

  return (
     <SyncStatusBox width={percentage} color={statusConfig.color}>
    <div className="syncStatus" style={{ height: zoomLevel > 125 ? 'unset' : '' }}>
      <Flex
        container={true}
        justifyContent="space-between"
        alignItems="center"
        padding={'5px 15px'}
        height={zoomLevel > 125 ? "" : "100%"}
      >
        <Flex container={true}>
          <div className="syncStatus-statusTxt-wrapper">
            <span className="txt">Status </span>
            <span className="syncStatus-statusTxt-greenTxt" style={{ color: statusConfig.color }}>
              {statusConfig.text}
            </span>
          </div>
        </Flex>
        <Flex container={true}>
          <div className="syncStatus-statusvalue">
            <span className="type-txt">{currentDaemon?.type} :</span>{' '}
            <span className="type-value">{optimizedDaemonHeight}</span>
          </div>
          
          <div className="syncStatus-statusvalue" style={{ marginLeft: '10px' }}>
            <span className="type-txt">Wallet :</span>{' '}
            <span className="type-value">
              {currentHeight} / {optimizedDaemonHeight}
            </span>
          </div>
          
          <div className="per-Wrapper" style={{ marginLeft: '10px' }}>
            {Math.floor(Number(percentage))}%
          </div>
        </Flex>
      </Flex>
    </div>
    </SyncStatusBox>
  );
};

export const MemoSyncStatusBar = React.memo(SyncStatusBar);

type Syncbar = {
  width:string;
  color:string
};

const SyncStatusBox = styled.div<Syncbar>`
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: 0px;
    left: ;
    padding: 10px;
    width: ${props => (props.width ? `${props.width}%` : '10%')};
    border-bottom: 2px solid ${props =>(props.color)};
    transition: width 3s ease-in-out;
    // border-bottom-left-radius: 12px;
    // border-bottom-right-radius: ${props => ((props.width == '100.0')? '12px'  : 'none')};

`;