import React from 'react';
import { BchatIcon, BchatIconButton } from '../../icon';
import { BchatToolTip } from '../../leftpane/ActionsPanel';
import MicrophoneIcon from '../../icon/MicrophoneIcon';
import { CustomIconButton } from '../../icon/CustomIconButton';

export const AddStagedAttachmentButton = (props: { onClick: () => void }) => {
  return (
    <div
      className="attachment-box"
      data-tip="Attachment"
      data-place="top"
      data-offset="{'right':60}"
      onClick={props.onClick}
    >
      <BchatToolTip effect="solid" />
      <BchatIcon iconSize={24} iconType="attachment" iconColor="#A7A7BA" />
    </div>
  );
};

export const StartRecordingButton = (props: { onClick: () => void }) => {
  return (
    //   <div className='recorded-btn'  role='button' onClick={props.onClick}>

    //  </div>
    <CustomIconButton
      className="recorded-btn"
      customIcon={<MicrophoneIcon iconSize={30} />}
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

export const SendMessageButton = (props: { onClick: () => void; name?: string }) => {
  return (
    <div className="send-message-button" onClick={props.onClick}>
      {/* {props.name === 'Send' ? ( */}
        <BchatIconButton
          iconType="send"
          iconColor="#fff"
          iconSize={30}
          padding="15px 13px"
          onClick={props.onClick}
          dataTestId="send-message-button"
        />
      {/* )  */}
      {/* : (
        <img
          src="images/wallet/beldex_send.svg"
          className="bchat-text-logo"
          style={{ width: '20px', height: '20px' }}
        ></img>
      )}
      <div className="text">{props.name}</div> */}
    </div>
  );
};
// export const SendFundButton = (props: any) => {
//   return (
//     <div onClick={props.onClick}>
//       {/* <BchatIconButton
//         iconType="beldexCoinLogo"
//         iconColor='#159B24'
//         iconSize={32}
//         iconRotation={361}
//         borderRadius="300px"
//         // iconPadding="5px 0 0 5px"
//         onClick={props.onClick}
//         backgroundColor='black'
//         dataTestId="send-message-button"
//       /> */}
//       <div style={{ cursor: 'pointer' }}>
//         <img
//           src="images/wallet/beldexCoin.png"
//           className="bchat-text-logo"
//           style={{ width: '30px', height: '30px' }}
//         />
//       </div>
//     </div>
//   );
// };
export const SendFundDisableButton = (props: { onClick: () => void }) => {
  return (
    <div onClick={props.onClick}>
      <div
        data-tip="Chat With Wallet"
        className="coin-logo-wrapper"
        data-offset="{'top':10,'right':0}"
      >
        <BchatIcon iconType={'beldexCoinLogo'} iconSize={20} iconColor=" #888A8D" />
      </div>
    </div>
  );
};
