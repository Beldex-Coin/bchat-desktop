import React, { useEffect, useState } from 'react';

import { ToastUtils } from '../../bchat/utils';
import { SpacerLG, SpacerSM, SpacerXS } from '../basic/Text';
import { recoveryPhraseModal } from '../../state/ducks/modalDialog';
import { useDispatch } from 'react-redux';
import { getCurrentRecoveryPhrase } from '../../util/storage';
import { BchatToolTip } from '../leftpane/ActionsPanel';


interface SeedProps {
  recoveryPhrase: string;
  onClickCopy?: () => any;
}

const Seed = (props: SeedProps) => {
  const { recoveryPhrase, onClickCopy } = props;
  const i18n = window.i18n;
  const dispatch = useDispatch();

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
        <p className="bchat-modal__description" style={{ fontSize: '22px' }}>{i18n('recoveryPhrase')}</p>
        <SpacerXS />

        <i data-testid="recovery-phrase-seed-modal" className="bchat-modal__text-highlight">
          {recoveryPhrase}
        </i>
      </div>
      <SpacerLG />
      <div className="bchat-modal__button-group">
        <div className='copyIconBtn' onClick={() => { copyRecoveryPhrase(recoveryPhrase); }} data-tip="Copy" data-place="right">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18.151 18.151">
            <path id="copy_icon" d="M3.815,2A1.815,1.815,0,0,0,2,3.815V16.521H3.815V3.815H16.521V2Zm3.63,3.63A1.815,1.815,0,0,0,5.63,7.445V18.336a1.815,1.815,0,0,0,1.815,1.815H18.336a1.815,1.815,0,0,0,1.815-1.815V7.445A1.815,1.815,0,0,0,18.336,5.63Zm0,1.815H18.336V18.336H7.445Z" transform="translate(-2 -2)" />
          </svg>
          <div role="button" style={{ marginLeft: "5px" }}
          >{window.i18n('editMenuCopy')}
          </div>
        </div>
      </div>
      <SpacerLG />
      <BchatToolTip effect="solid" />
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

  useEffect(() => {
    setTimeout(() => (document.getElementById('seed-input-password') as any)?.focus(), 100);
    void checkHasPassword();
    void getRecoveryPhrase();
  }, []);
  const checkHasPassword = async () => {
    if (!loadingPassword) {
      return;
    }
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
        <>
          <SpacerSM />
          <Seed recoveryPhrase={recoveryPhrase} onClickCopy={onClickOk} />
        </>
      )}
    </>
  );
};

export const BchatSeedModal = BchatSeedModalInner;
