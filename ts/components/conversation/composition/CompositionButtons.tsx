import React from 'react';
import { BchatIcon, BchatIconButton } from '../../icon';
import { BchatToolTip } from '../../leftpane/ActionsPanel';
import MicrophoneIcon from '../../icon/MicrophoneIcon';
import { CustomIconButton } from '../../icon/CustomIconButton';
import { useSelector } from 'react-redux';
import { getTheme } from '../../../state/selectors/theme';

export const AddStagedAttachmentButton = (props: { onClick: () => void }) => {
  return (
    <div
      className="attachment-box"
      data-tip="Attachment"
      data-place="top"
      data-offset="{'right':10}"
      onClick={props.onClick}
    >
      <BchatToolTip effect="solid" />
      <BchatIcon iconSize={24} iconType="attachment" iconColor="var(--color-icon)" />
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
// eslint-disable-next-line react/display-name
export const ToggleEmojiButton = React.forwardRef<HTMLDivElement, { onClick: () => void }>(
  (props, ref) => {
    const darkMode = useSelector(getTheme) === 'dark';
    return (
      <BchatIconButton
        iconType="emoji"
        ref={ref}
        iconColor={darkMode ?'#A7A7BA': '#ACACAC'}
        iconSize={'huge'}
        // borderRadius="300px"
     
        // iconPadding="6px"
        
        onClick={props.onClick}
      />
    );
  }
);

export const SendMessageButton = (props: { onClick: () => void; name?: string}) => {
  return (
    <div  onClick={props.onClick}>
        <BchatIconButton
          iconType="send"
          // iconColor="#fff"
          iconSize={30}
          padding="15px 13px"
          onClick={props.onClick}
          
          dataTestId="send-message-button"
        />
    </div>
  );
};
export const SendFundDisableButton = (props: { onClick: () => void }) => {
  return (
    <div onClick={props.onClick}>
      <div
        data-tip="Send BDX"
        className="coin-logo-wrapper"
        data-offset="{'top':10,'right':0}"
      >
        <BchatIcon iconType={'beldexCoinLogo'} iconSize={20} iconColor=" #888A8D" />
      </div>
    </div>
  );
};
