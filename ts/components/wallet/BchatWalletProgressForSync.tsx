// import React from 'react';
import { SpacerLG,   SpacerSM } from '../basic/Text';
import { BchatIcon } from '../icon';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import styled from 'styled-components';
// import 'react-circular-progressbar/dist/styles.css';

export const ProgressForSync = (props: any) => {
  return (
    <div className="wallet-walletPassword ">
      <div className="wallet-walletPassword-contentBox progressSyncBox">
        {/* <div style={{ width: '100%' }}> */}
          {/* <div className='exitBtn'>
            <article >
              <BchatIconButton
                iconType="exit"
                iconSize="small"
                onClick={props.exit}
                dataTestId="modal-close-button"
              />
            </article>
          </div> */}
        {/* </div> */}

        {/* <SpacerLG /> */}
        {/* <SpacerLG /> */}

        {/* <div className="wallet-progressSync-presentage">{props.percentage}%</div>
        <section className="wallet-progressSync-barBg">
          <article className="bar" style={{ width: `${props.percentage}%` }}></article>
        </section>
        <SpacerMD /> */}
           <SpacerLG />
           <SpacerLG />
        <div className='progress' >
          <CircularProgressbarWithChildren value={props.percentage}>
            {/* Put any JSX content in here that you'd like. It'll be vertically and horizonally centered. */}
            <BchatIcon
              iconSize={40}
              iconType={'wallet'}
            />
          </CircularProgressbarWithChildren>
         
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
        <SpacerLG />
          <div className="wallet-progressSync-presentage">{props.percentage}%</div>
          <SpacerLG />
        <div className="wallet-progressSync-reloadTxt">
          <span>{window.i18n('almostThere')}</span>
          <span style={{ marginRight: '5px' }}>{window.i18n('walletSyncingNow')}</span>
          <BchatIcon iconType="rotatedArrow" iconSize={'small'} />
        </div>
        <SpacerSM />
        <div className="wallet-progressSync-bRemaing">
          <RemainHeight>{props.remainingHeight}</RemainHeight>
          <span>{window.i18n('blocksRemaining')}</span>
        </div>
        <SpacerLG />
        <SpacerLG />

      </div>
    </div>
  );
};

const RemainHeight=styled.span`
color: #108D32;
font-size: 18px;
font-weight: 700;
margin-right: 5px;`