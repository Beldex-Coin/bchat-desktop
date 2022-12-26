import React from 'react';
import { SpacerLG, SpacerMD, SpacerXS } from '../basic/Text';
import { BchatIcon } from '../icon';

export const ProgressForSync = (props: any) => {
  // const [presentage,setPresentage]=useState(59)
  // const [blockCount,setBlockCount]=useState(1000);
  // const presentage = 59;
  return (
    <div className="wallet-walletPassword">
      <div className="wallet-walletPassword-contentBox">
        <SpacerLG />
        <div className="wallet-progressSync-presentage">{props.percentage}%</div>
        <section className="wallet-progressSync-barBg" >
          <article className="bar" style={{width:`${props.percentage}%`}}></article>
        </section>
        <SpacerMD />
        <div className="wallet-progressSync-reloadTxt">
          <span>{window.i18n('almostThere')}</span>
          <span>{window.i18n('walletSyncingNow')}</span>
          <BchatIcon iconType="reload" iconSize={'tiny'} />
        </div>
        <SpacerXS />
        <div className="wallet-progressSync-bRemaing">
          <span style={{ color: '#128B17', marginRight: '5px' }}>{props.remainingHeight}</span>
          <span>{window.i18n('blocksRemaining')}</span>
        </div>
        <SpacerLG />
      </div>
    </div>
  );
};
