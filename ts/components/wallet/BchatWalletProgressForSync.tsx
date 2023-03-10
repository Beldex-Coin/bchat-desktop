import React from 'react';
import { SpacerLG, SpacerMD, SpacerSM } from '../basic/Text';
import { BchatIcon, BchatIconButton } from '../icon';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';

export const ProgressForSync = (props: any) => {
  return (
    <div className="wallet-walletPassword ">
      <div className="wallet-walletPassword-contentBox progressSyncBox">
      <div  style={{width:'100%'}}>
      <div className='exitBtn'>
          <BchatIconButton
            iconType="exit"
            iconSize="small"
            onClick={props.exit}
            dataTestId="modal-close-button"
          />
        </div>
      </div>
     
        {/* <SpacerLG /> */}
        {/* <SpacerLG /> */}

        {/* <div className="wallet-progressSync-presentage">{props.percentage}%</div>
        <section className="wallet-progressSync-barBg">
          <article className="bar" style={{ width: `${props.percentage}%` }}></article>
        </section>
        <SpacerMD /> */}
        <div className='progress' >
          <CircularProgressbarWithChildren value={props.percentage}>
            {/* Put any JSX content in here that you'd like. It'll be vertically and horizonally centered. */}
            <BchatIconButton
              iconSize="medium"
              dataTestId="settings-section"
              iconType={'wallet'}
            />
          </CircularProgressbarWithChildren>
          <SpacerMD />
          <div className="wallet-progressSync-presentage">{props.percentage}%</div>
          <SpacerLG />
          {/* <div className="circle-wrap" >
            <div className="circle">
              <div className="mask full">
                <div className="fill"></div>
              </div>
              <div className="mask half">
                <div className="fill" ></div>
              </div>
              <div style={{ position: 'relative' }}>
                <div className="inside-circle" > 75% </div>
              </div>
            </div>
          </div> */}
        </div>
        <div className="wallet-progressSync-reloadTxt">
          <span>{window.i18n('almostThere')}</span>
          <span style={{ marginRight: '5px' }}>{window.i18n('walletSyncingNow')}</span>
          <BchatIcon iconType="reload" iconSize={'small'} />
        </div>
        <SpacerSM />
        <div className="wallet-progressSync-bRemaing">
          <span style={{ color: '#128B17', marginRight: '5px' }}>{props.remainingHeight}</span>
          <span>{window.i18n('blocksRemaining')}</span>
        </div>
        <SpacerLG />
        <SpacerLG />

      </div>
    </div>
  );
};
