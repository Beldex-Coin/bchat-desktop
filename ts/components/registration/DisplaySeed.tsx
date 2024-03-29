import React from 'react';
// import { pushUserCopySuccess } from '../../bchat/utils/Toast';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { BchatToolTip } from '../leftpane/ActionsPanel';

export const Icons = (props: any) => (
  <div
    onClick={() => props.iconfunc()}
    className="paste-icon"
    data-tip="Paste"
    data-offset="{'top':30,'left':15}"
    data-place="right"
    style={{
      // background: `url(images/bchat/${props.icon}.svg) no-repeat`,
    //   width: '40px',
    //   height: '40px',
    //   backgroundColor: 'var(--color-inboxBgColor)',
    //   backgroundSize: '16px',
    //   borderRadius: '35px',
    //   backgroundPosition: 'center',
    //   left: '430px',
    //   top: '-92px',
    //   position: 'absolute',
    //   cursor: 'pointer',
     }}
  >
    
    <img  src="images/bchat/paste.svg"  width={20}  height={20}/>

  </div>
);

export const ClearIcon = (props: any) => (
  <div
    onClick={() => props.removeRecoveryPhrase()}
    data-tip="Clear"
    data-place="top"
    className="paste-icon"
    data-offset="{'right':35,'left':5}"
    style={{
      background: `url(images/bchat/clear.svg) no-repeat`,
      width: '10px',
      height: '10px',
      position: 'relative',
      top: '8px',
      marginLeft: '408px',
      cursor: 'pointer',
      backgroundSize: 'cover',
    }}
  ></div>
);

const handlePaste = (event: any) => {
  event.clipboardData.getData('text');
};

export const DisplaySeed = (props: any) => (
  <div className="bchat-restore-seed__address-container">
    <>
      <div className="bchat-registration-header">{window.i18n('restoreFromSeed')}</div>
      <div className="bchat-restore-seed-parent-box">
        <div className="bchat-restore-seed-text-box">
          <ClearIcon removeRecoveryPhrase={() => props.assignRecoveryPhase('')}></ClearIcon>
          <textarea
            className="bchat-restore-seed-text-area"
            name="text"
            onPaste={handlePaste}
            value={props.recoveryPhrase}
            placeholder="Enter your recovery seed to restore your account"
            onChange={e => props.assignRecoveryPhase(e.target.value)}
          ></textarea>
        </div>
        <div className="bchat-restore-seed-icon-box">
          {<Icons icon={'paste'} iconfunc={props.iconfunc} />}
        </div>
      </div>
    </>

    <div style={{ width: '95.5%' }}>
      <BchatButton
        onClick={props.onNext}
        buttonType={BchatButtonType.Brand}
        buttonColor={BchatButtonColor.Green}
        text={window.i18n('next')}
        // disabled={!enableCompleteSignUp}
      />
    </div>
    <BchatToolTip effect="solid" />
  </div>
);
