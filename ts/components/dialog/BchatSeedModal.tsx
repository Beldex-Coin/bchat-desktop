import React, { useEffect, useState } from 'react';

import { ToastUtils } from '../../bchat/utils';
import { matchesHash } from '../../util/passwordUtils';
import { getPasswordHash } from '../../data/data';
// import { QRCode } from 'react-qr-svg';
// import { mn_decode } from '../../Bchat/crypto/mnemonic';
import { SpacerLG, SpacerSM, SpacerXS } from '../basic/Text';
import { recoveryPhraseModal } from '../../state/ducks/modalDialog';
import { useDispatch } from 'react-redux';
import { BchatButton } from '../basic/BchatButton';

// import { BchatWrapperModal } from '../BchatWrapperModal';
import { getCurrentRecoveryPhrase } from '../../util/storage';

// import { BchatIcon } from '../icon';

interface PasswordProps {
  setPasswordValid: (val: boolean) => any;
  passwordHash: string;
}

const Password = (props: PasswordProps) => {
  const { setPasswordValid, passwordHash } = props;
  const i18n = window.i18n;
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const onClose = () => dispatch(recoveryPhraseModal(null));

  const confirmPassword = () => {
    const passwordValue = (document.getElementById('seed-input-password') as any)?.value;
    const isPasswordValid = matchesHash(passwordValue as string, passwordHash);

    if (!passwordValue) {
      setError('noGivenPassword');
      return false;
    }

    if (passwordHash && !isPasswordValid) {
      setError('invalidPassword');
      return false;
    }

    setPasswordValid(true);
    setError('');

    window.removeEventListener('keyup', onEnter);
    return true;
  };

  const onEnter = (event: any) => {
    if (event.key === 'Enter') {
      confirmPassword();
    }
  };

  return (
    <>
      <p>{i18n('showRecoveryPhrasePasswordRequest')}</p>
      <input
        type="password"
        id="seed-input-password"
        placeholder={i18n('password')}
        onKeyUp={onEnter}
      />

      {error && (
        <>
          <SpacerXS />
          <div className="bchat-label danger">{error}</div>
        </>
      )}

      <SpacerLG />

      <div className="bchat-modal__button-group">
        <BchatButton text={i18n('cancel')} onClick={onClose} />
        <BchatButton text={i18n('ok')} onClick={confirmPassword} />
      </div>
    </>
  );
};

interface SeedProps {
  recoveryPhrase: string;
  onClickCopy?: () => any;
}

const Seed = (props: SeedProps) => {
  const { recoveryPhrase, onClickCopy } = props;
  const i18n = window.i18n;
  // const bgColor = '#FFFFFF';
  // const fgColor = '#1B1B1B';
  const dispatch = useDispatch();

  // const hexEncodedSeed = mn_decode(recoveryPhrase, 'english');

  const copyRecoveryPhrase = (recoveryPhraseToCopy: string) => {
    window.clipboard.writeText(recoveryPhraseToCopy);
    ToastUtils.pushCopiedToClipBoard();
    if (onClickCopy) {
      onClickCopy();
    }
    dispatch(recoveryPhraseModal(null));
  }; 

  return (
    <div className="bchat-modal__box"> 
      <div className="bchat-modal__centered text-center ">
        <p className="bchat-modal__description">{i18n('recoveryPhrase')}</p>
        <SpacerXS />

        <i data-testid="recovery-phrase-seed-modal" className="bchat-modal__text-highlight">
          {recoveryPhrase}
        </i>
      </div>
      <SpacerLG />
      <div className="bchat-modal__button-group">
      
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18.151 18.151">
  <path id="copy_icon" d="M3.815,2A1.815,1.815,0,0,0,2,3.815V16.521H3.815V3.815H16.521V2Zm3.63,3.63A1.815,1.815,0,0,0,5.63,7.445V18.336a1.815,1.815,0,0,0,1.815,1.815H18.336a1.815,1.815,0,0,0,1.815-1.815V7.445A1.815,1.815,0,0,0,18.336,5.63Zm0,1.815H18.336V18.336H7.445Z" transform="translate(-2 -2)" fill="#fff"/>
    </svg>
    <div  role="button"   
    style={{marginLeft:"5px"}}
     onClick={() => {copyRecoveryPhrase(recoveryPhrase);}}
     >
      copy
    </div>
        {/* <BchatButton
          text={i18n('editMenuCopy')}
          buttonColor={BchatButtonColor.Green}
          onClick={() => {
            copyRecoveryPhrase(recoveryPhrase);
          }}
        /> */}
      </div>
      <SpacerLG />
      {/* <div className="qr-image">
        <QRCode value={hexEncodedSeed} bgColor={bgColor} fgColor={fgColor} level="L" />
      </div> */}
    </div>
  );
};

interface ModalInnerProps {
  onClickOk?: () => any;
}
 
const BchatSeedModalInner = (props: ModalInnerProps) => {
  const { onClickOk } = props;
  const [loadingPassword, setLoadingPassword] = useState(true);
  const [loadingSeed, setLoadingSeed] = useState(true);
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [hasPassword, setHasPassword] = useState<null | boolean>(null);
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordHash, setPasswordHash] = useState('');
  // const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => (document.getElementById('seed-input-password') as any)?.focus(), 100);
    void checkHasPassword();
    void getRecoveryPhrase();
  }, []);

  // const i18n = window.i18n;

  // const onClose = () => dispatch(recoveryPhraseModal(null));

  const checkHasPassword = async () => {
    if (!loadingPassword) {
      return;
    }

    const hash = await getPasswordHash();
    setHasPassword(!!hash);
    setPasswordHash(hash || '');
    setLoadingPassword(false);
  };

  const getRecoveryPhrase = async () => {
    if (recoveryPhrase) {
      return false;
    }
    const newRecoveryPhrase = getCurrentRecoveryPhrase();
    setRecoveryPhrase(newRecoveryPhrase);
    setLoadingSeed(false);

    return true;
  };

  return (
    <>
      {!loadingSeed && (
        // <BchatWrapperModal
        //   title={i18n('showRecoveryPhrase')}
        //   onClose={onClose}
        //   showExitIcon={true}
        // >
        <>
          <SpacerSM />

          {hasPassword && !passwordValid ? (
            <Password passwordHash={passwordHash} setPasswordValid={setPasswordValid} />
          ) : (
            <Seed recoveryPhrase={recoveryPhrase} onClickCopy={onClickOk} />
          )}</>
        // </BchatWrapperModal>
      )}
    </>
  );
};

export const BchatSeedModal = BchatSeedModalInner;
