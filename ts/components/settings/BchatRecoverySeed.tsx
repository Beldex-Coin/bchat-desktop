// import React from 'react';

import { BchatSeedModal } from '../dialog/BchatSeedModal';
import { useSelector } from 'react-redux';
import { getRecoveryPhraseDialog } from '../../state/selectors/modal';
import { BchatWrapperModal } from '../BchatWrapperModal';

// import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
// import { BchatIcon } from '../icon';
import { BchatSettingCategory } from './BchatSettings';
import { showSettingsSection } from '../../state/ducks/section';
import { displayPasswordModal } from './section/CategoryPrivacy';
import { SpacerLG } from '../basic/Text';
import { BchatButtonColor } from '../basic/BchatButton';


export const BchatRecoverySeed = (props: any) => {

  //  const [verify, setVerify] = useState(false)
  const recoveryPhraseModalState = useSelector(getRecoveryPhraseDialog);

  if (props.passwordLock) {
    return <BchatSeedModal {...recoveryPhraseModalState} />;
  }

  const onClickOkHandler = () => {
    window.inboxStore?.dispatch(showSettingsSection(BchatSettingCategory.Privacy));
    displayPasswordModal('set', props.onPasswordUpdated);
  };

  const onClickCancelHandler = () => {
  window.inboxStore?.dispatch(showSettingsSection(BchatSettingCategory.Chat));
};

  return (
    <BchatWrapperModal title={''} showExitIcon={false} showHeader={false}
    additionalClassName="noir-set-password-modal"
    okButton={{
      text: window.i18n('ok'),
      onClickOkHandler,
      color: BchatButtonColor.Primary,
    }}
    cancelButton={{
      text: window.i18n('cancel'),
      status: true,
      onClickCancelHandler
    }}
    iconShow={false}
    >
      <div className="bchat-modal-setPasswordAccess">
        {/* NOIR: same airlock glyph as the home-screen password prompt */}
        <div className="noir-setpw-icon">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.4">
            <rect x="5" y="11" width="14" height="9" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            <circle cx="12" cy="15.5" r="1.1" fill="var(--color-accent)" stroke="none" />
          </svg>
        </div>
        <div className="contentbox">
          <div className="header">{window.i18n('setPassword')}</div>
          <div className="noir-setpw-sub">REQUIRED TO VIEW YOUR RECOVERY SEED</div>
          <SpacerLG />
          <div className='fontSemiBold'>
            Set a password before accessing the Recovery Phrase. You can set your password from{' '}
            <span className='span'>Settings -&gt; Privacy -&gt; Set Account Password.</span>
          </div>
        </div>
      </div>
    </BchatWrapperModal>
  );
};

// const WarningUnSetPassword = (props:any) => <div className='bchat-settings-warnUnsetpass'>
//   <div className='bchat-settings-warnUnsetpass-contentbox'>
//     <BchatIcon iconType="info" iconSize={60} iconColor="blue" />
//     <div className='fontSemiBold'>{window.i18n('setPassword')}</div>
//     <div>Set a Password before accessing the Recovery Phrase. You can set your password from </div>
//     <div className='fontSemiBold'>Settings -&gt; Privacy -&gt; Set Account Password.</div>
//     <div style={{padding: '15px 74px 0'}}>
//     <BchatButton
//       text={"ok"}
//        onClick={()=>{window.inboxStore?.dispatch(showSettingsSection(BchatSettingCategory.Privacy));
//         displayPasswordModal('set', props.onPasswordUpdated);
//         setVerify(true)
//         }}
//       buttonType={BchatButtonType.Brand}
//       buttonColor={BchatButtonColor.Green}
//     />
//     </div>
//   </div>

// </div>
