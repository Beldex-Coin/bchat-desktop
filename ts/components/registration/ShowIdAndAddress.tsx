import { useState } from 'react';

import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { Flex } from '../basic/Flex';
import { BchatToolTip } from '../leftpane/ActionsPanel';
// import { GoBackMainMenuButton } from './SignUpTab';
import { SpacerLG } from '../basic/Text';

import {CopyIconButton} from '../icon/CopyIconButton';
// import { BchatIconButton } from '../icon/BchatIconButton';

export const DisplayIdAndAddress = (props: any) => (
  <div className="bchat-registration-welcome-screen-container">
    {/* <div className='bchat-registration-welcome-screen-goback'>
          <GoBackMainMenuButton assent={()=>{props.assentAndGoBack()}} />
        </div> */}
    <h1 className="bchat-head">{window.i18n('welcome')}!</h1>
    <SpacerLG />
    {/* <div className='bchat-registration-welcome-screen-back'> */}
    <h6 className="bchat-registration-welcome-screen-chat">{window.i18n('bChatID')}</h6>
    <div className="bchat-registration-welcome-screen-chat-value">
      {/* <p style={{color: "#0BB70F"}}>{props.pubKey}</p> */}
      <p style={{ color: '#00A638' }}>{props.pubKey}</p>
    </div>
    <p className="bchat-registration-welcome-screen-chat-content">{window.i18n('yourBchatName')}</p>
    <h6 className="bchat-registration-welcome-screen-chat">{window.i18n('beldexAddress')}</h6>
    <div className="bchat-registration-welcome-screen-chat-value">
      {/* <p style={{color:"#1782FF"}}>{props.walletAddress}</p> */}
      <p style={{ color: '#2D81FF' }}>{props.walletAddress}</p>

      {/* </div> */}
    </div>
    <p className="bchat-registration-welcome-screen-chat-content">
      {window.i18n('beldexAddressConnection')}
    </p>
    <SpacerLG />
    <SpacerLG />
    <BchatButton
      onClick={props.nextFunc}
      buttonType={BchatButtonType.Default}
      buttonColor={BchatButtonColor.Primary}
      text={window.i18n('next')}
    />
  </div>
);

// export const Icons = (props: any) => (
//   <div
//     onClick={() => props.onClick()}
//     data-tip="Copy"
//     data-place="right"
//     data-offset="{'top':30,'left':15}"
//     className="iconBox"
//   >
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="18.151"
//       height="18.151"
//       viewBox="0 0 18.151 18.151"
//     >
//       <path
//         id="copy_icon"
//         d="M3.815,2A1.815,1.815,0,0,0,2,3.815V16.521H3.815V3.815H16.521V2Zm3.63,3.63A1.815,1.815,0,0,0,5.63,7.445V18.336a1.815,1.815,0,0,0,1.815,1.815H18.336a1.815,1.815,0,0,0,1.815-1.815V7.445A1.815,1.815,0,0,0,18.336,5.63Zm0,1.815H18.336V18.336H7.445Z"
//         transform="translate(-2 -2)"
//       />
//     </svg>
//   </div>
// );
const LoaderGif = () => {
  return (
    <div className="bchat-registration-loadingGif">
      <div
        style={{
          background: 'url(images/bchat/Load_animation.gif) no-repeat',
          width: "120px",
          height: "120px",
          margin: "0px auto",
          backgroundSize: "102px"
        }}
      ></div>
    </div>
  );
};

export const ShowRecoveryPhase = (props: any) => {
  const [seedCopied, setSeedCopied] = useState(false);
  return (
    <div className="bchat-registration-welcome-screen-container">
      {props.loading && <LoaderGif />}
      <Flex flexDirection="row" container={true} height="100%">
        <Flex
          alignItems="center"
          flexDirection="row"
          // height="100%"
          // width="86%"
          justifyContent="center"
        >
          {/* <div className="bchat-registration-welcome-screen-goback">
            <GoBackMainMenuButton
              assent={() => {
                props.assentAndGoBack();
              }}
            />
          </div> */}
          <h1 className="bchat-head">{window.i18n('recoveryPhrase')}</h1>
          <SpacerLG />
          <div className="bchat-registration-recovery-phrase">
            <p className="bchat-registration-recovery-phrase-txt">
              {props.mnemonic}
            </p>
            {/* <textarea
              className="bchat-registration-recovery-phrase-textarea"
              rows={4}
              cols={60}
              name="text"
              // value={props.mnemonic}
              value={
                'rockets tossed dewdrop unnoticed memoir gleeful skirting vexed syllabus wept baffles sash raking shuffled tusks  kangaroo afield loudly necklace mittens pager nabbing eluded faked faked'
              }
              placeholder="Enter your recovery seed to restore your account"
            ></textarea> */}
            <div>
              {/* <BchatIconButton
          iconType="arrow"
          iconSize={18}
          iconColor='var(--color-downArrow)'
          onClick={props.onClickScrollBottom}
          dataTestId="scroll-to-bottom-button"
        // iconRotation={3}
        /> */}
              <div
                data-tip="Copy"
                data-place="right"
                data-offset="{'top':30,'left':15}"
                className="iconBox"
              >
                <CopyIconButton  content={props.mnemonic}  iconSize={22} onClick={() => {
                 setSeedCopied(true);
                }}/>
              </div>
            </div>
          </div>
          <p className="bchat-registration-recovery-phrase-hintTxt">
            <span>Note :</span> {window.i18n('saveYourRecoveryPhrase')}
            {window.i18n('copyToContinueRecovery')}
            </p>
            <SpacerLG/>
            {/* <SpacerLG/> */}
          <BchatButton
            onClick={props.nextFunc}
            buttonType={BchatButtonType.Default}
            buttonColor={BchatButtonColor.Primary}
            text={window.i18n('continue')}
            disabled={!seedCopied}
          />
        </Flex>
      </Flex>
      <BchatToolTip effect="solid" />
    </div>
  );
};
