import { useState } from 'react';
import { clipboard } from 'electron';

import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { Flex } from '../basic/Flex';
import { BchatToolTip } from '../leftpane/ActionsPanel';
import { SpacerLG, SpacerMD, SpacerSM, SpacerXS } from '../basic/Text';
import { pushUserCopySuccess } from '../../bchat/utils/Toast';

// NOIR: step 02 — the identity handed over as data plates.
export const DisplayIdAndAddress = (props: any) => (
  <div className="bchat-registration-welcome-screen-container noir-onb-screen">
    <div className="noir-step-line">STEP 02 / 03 // YOUR IDENTITY</div>
    <h1 className="noir-onb-h">
      Welcome to BChat<span className="noir-cursor">_</span>
    </h1>
    <SpacerMD />
    <label className="noir-data-label">BCHAT ID</label>
    <SpacerXS />
    <div className="noir-data-plate is-accent">{props.pubKey}</div>
    <p className="noir-data-hint">{window.i18n('yourBchatName')}</p>
    <SpacerSM />
    <label className="noir-data-label">BELDEX ADDRESS</label>
    <SpacerXS />
    <div className="noir-data-plate">{props.walletAddress}</div>
    <p className="noir-data-hint">{window.i18n('beldexAddressConnection')}</p>
    <SpacerLG />
    <BchatButton
      onClick={props.nextFunc}
      buttonType={BchatButtonType.Default}
      buttonColor={BchatButtonColor.Primary}
      text={window.i18n('next')}
    />
  </div>
);

// BChat's own animated mark as the loading state.
const LoaderGif = () => {
  return (
    <div className="bchat-registration-loadingGif">
      <img src="images/bchat/BChat_animi_logo.gif" width={110} height={110} alt="Loading" />
    </div>
  );
};

// NOIR: step 03 — the seed ceremony. Numbered mono chips, one red rule.
export const ShowRecoveryPhase = (props: any) => {
  const [seedCopied, setSeedCopied] = useState(false);
  const words: Array<string> = (props.mnemonic || '').trim().split(/\s+/).filter(Boolean);

  const handleCopy = () => {
    clipboard.writeText(props.mnemonic, 'clipboard');
    pushUserCopySuccess();
    setSeedCopied(true);
  };

  return (
    <div className="bchat-registration-welcome-screen-container noir-onb-screen">
      {props.loading && <LoaderGif />}
      <div className="noir-step-line">STEP 03 / 03 // RECOVERY SEED</div>
      <h1 className="noir-onb-h">
        Your keys.
        <br />
        Your identity.
      </h1>
      <p className="noir-onb-p">
        No phone number. No email. This seed is the only way back into your BChat ID — store it
        offline.
      </p>
      <div className="noir-seed-grid">
        {words.map((word, i) => (
          <div className="noir-seed" key={`${word}-${i}`}>
            <i>{String(i + 1).padStart(2, '0')}</i>
            {word}
          </div>
        ))}
      </div>
      <div className="noir-seed-warn">▲ NEVER SHARE. ANYONE WITH THIS SEED IS YOU.</div>
      <SpacerLG />
      <Flex container={true} flexDirection="row" alignItems="center">
        <BchatButton
          onClick={props.nextFunc}
          buttonType={BchatButtonType.Default}
          buttonColor={BchatButtonColor.Primary}
          text={'I saved my seed'}
          disabled={!seedCopied}
        />
        <div style={{ width: '14px' }} />
        <BchatButton
          onClick={handleCopy}
          buttonType={BchatButtonType.Default}
          buttonColor={BchatButtonColor.Secondary}
          text={'Copy'}
        />
      </Flex>
      <BchatToolTip effect="solid" />
    </div>
  );
};
