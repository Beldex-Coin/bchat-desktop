import React from 'react';
import { BchatIcon, BchatIconButton } from '../../icon';
import { BchatToolTip } from '../../leftpane/ActionsPanel';
import MicrophoneIcon from '../../icon/MicrophoneIcon';
import { CustomIconButton } from '../../icon/CustomIconButton';
import { useSelector } from 'react-redux';
import { getTheme } from '../../../state/selectors/theme';

export const AddStagedAttachmentButton = (props: { onClick: () => void }) => {
  const darkMode = useSelector(getTheme) === 'dark';
  return (
    <div
      className="attachment-box"
      data-tip={window.i18n('attachment')}
      data-place="top"
      data-offset="{'right':10}"
      onClick={props.onClick}
    >
      <BchatToolTip effect="solid" />
      {darkMode ? (
        // Dark theme (Figma 5296:30566 "Attach"): the "Add New" glyph - a thin outlined square with a
        // "+" in it - on its own, no box behind it (the box only appears on hover / menu open)
        <svg className="attachment-box__glyph" viewBox="0 0 11.77 11.77" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M0 0V11.769H11.769V0H0ZM0.692 0.692H11.077V11.077H0.692V0.692ZM5.525 2.783V5.538H2.769V6.231H5.525V8.986H6.217V6.231H8.973V5.538H6.217V2.783H5.525Z"
            fill="currentColor"
          />
        </svg>
      ) : (
        <BchatIcon iconSize={24} iconType="attachment" iconColor="var(--color-icon)" />
      )}
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
          flipInRtl={true}
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
        data-tip={window.i18n('sendBDXTooltip')}
        className="coin-logo-wrapper"
        data-offset="{'top':10,'right':0}"
      >
        <BchatIcon iconType={'beldexCoinLogo'} iconSize={20} iconColor=" #888A8D" />
      </div>
    </div>
  );
};
