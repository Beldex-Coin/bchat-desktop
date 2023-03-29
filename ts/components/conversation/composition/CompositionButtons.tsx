import React from 'react';
import { BchatIconButton } from '../../icon';
import { BchatToolTip } from '../../leftpane/ActionsPanel';

export const AddStagedAttachmentButton = (
  props: { onClick: () => void }
  ) => {
  return (
    <div className='attachment-box' data-tip="Attachment" data-place="top" data-offset="{'right':60}" onClick={props.onClick}>
              <BchatToolTip effect="solid" />
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="30" viewBox="0 0 27.685 33.158">
  <path id="attach" d="M25.815,3.018A7.7,7.7,0,0,0,20.2,5.44L9.108,17.145a11.578,11.578,0,0,0,0,15.795,1.386,1.386,0,0,0,.452.317l.008,0a10.344,10.344,0,0,0,14.715-.319L32.089,24.7A1.386,1.386,0,1,0,30.078,22.8l-7.805,8.236a7.528,7.528,0,0,1-11.151,0,8.841,8.841,0,0,1,0-11.984L22.216,7.345a4.84,4.84,0,0,1,7.2,0,5.778,5.778,0,0,1,0,7.816L19.32,25.817a2.151,2.151,0,0,1-3.253,0,2.718,2.718,0,0,1,0-3.651l8.122-8.571a1.386,1.386,0,1,0-2.011-1.905L14.053,20.26a5.453,5.453,0,0,0,0,7.462,1.386,1.386,0,0,0,.466.322,4.977,4.977,0,0,0,6.812-.322l10.1-10.655a8.463,8.463,0,0,0,.284-11.178,1.386,1.386,0,0,0-.284-.449A7.709,7.709,0,0,0,25.815,3.018Z" transform="translate(-5.997 -3.018)" fill="#fff"/>
</svg>
    </div>
  );
};

export const StartRecordingButton = (props: { onClick: () => void }) => {
  return (
    <BchatIconButton
      iconType="microphone"
      iconSize={'huge2'}
      backgroundColor={'transparent'}
      borderRadius="300px"
      iconPadding="6px"
      onClick={props.onClick}
    />
  );
};

export const ToggleEmojiButton = React.forwardRef<HTMLDivElement, { onClick: () => void }>(
  (props, ref) => {
    return (
      <BchatIconButton
        iconType="emoji"
        ref={ref}
        backgroundColor="var(--color-compose-view-button-background)"
        iconSize={'huge2'}
        borderRadius="300px"
        iconPadding="6px"
        onClick={props.onClick}
      />
    );
  }
);

export const SendMessageButton = (props: { onClick: () => void,name?:string }) => {
  return (
    <div className="send-message-button"
      onClick={props.onClick}>
      {props.name==="Send"?
      <BchatIconButton
        iconType="send"
        iconColor='#fff'
        iconSize={'small'}
        // iconRotation={321}
        // borderRadius="300px"
        // iconPadding="5px 0 0 5px"
        onClick={props.onClick}
        dataTestId="send-message-button"
      />:
      <img src="images/wallet/beldex_send.svg" className="bchat-text-logo" style={{width: '20px', height: '20px'}}></img>
  }
      <div className='text'>{props.name}</div>
    </div> 
  );
};
export const SendFundButton = (props:any) => {
  return (
    <div 
      onClick={props.onClick}
      >

      {/* <BchatIconButton
        iconType="beldexCoinLogo"
        iconColor='#159B24'
        iconSize={32}
        iconRotation={361}
        borderRadius="300px"
        // iconPadding="5px 0 0 5px"
        onClick={props.onClick}
        backgroundColor='black'
        dataTestId="send-message-button"
      /> */}
      <div style={{cursor:'pointer'}}>
      <img src="images/wallet/beldexCoin.png" className="bchat-text-logo" style={{width:'30px',height:'30px'}} />

      </div>
    </div> 
  );
};
export const SendFundDisableButton = (props: { onClick: () => void}) => {
  return (
    <div 
      onClick={props.onClick}>

      {/* <BchatIconButton
        iconType="beldexCoinLogo"
        iconColor='#159B24'
        iconSize={32}
        iconRotation={361}
        borderRadius="300px"
        // iconPadding="5px 0 0 5px"
        onClick={props.onClick}
        backgroundColor='black'
        dataTestId="send-message-button"
      /> */}
      <div style={{cursor:'pointer'}} 
       data-tip="Chat With Wallet"
        //  data-offset="{'right':60}"
        data-offset="{'top':10,'right':0}"
        >
      <img src="images/wallet/beldex_coinDisable.svg" className="bchat-text-logo" style={{width:'30px',height:'30px'}} />

      </div>
    </div> 
  );
};