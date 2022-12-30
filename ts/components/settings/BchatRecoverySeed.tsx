import React from 'react';

import { BchatSeedModal } from '../dialog/BchatSeedModal';
import { useSelector } from 'react-redux';
import { getRecoveryPhraseDialog } from '../../state/selectors/modal';

import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { BchatIcon } from '../icon';
import { BchatSettingCategory } from './BchatSettings';
import { showSettingsSection } from '../../state/ducks/section';
import { displayPasswordModal } from './section/CategoryPrivacy';
import { SpacerMD } from '../basic/Text';

export const BchatRecoverySeed = (props: any) => {
  //  const [verify, setVerify] = useState(false)
  const recoveryPhraseModalState = useSelector(getRecoveryPhraseDialog);

  if (props.passwordLock) {
    return <BchatSeedModal {...recoveryPhraseModalState} />;
  }

  return (
    <div className="bchat-settings-warnUnsetpass">
      <div className="bchat-settings-warnUnsetpass-contentbox">
        <BchatIcon iconType="info" iconSize={60} iconColor="#2879FB" />
        <SpacerMD />

        <div className="fontSemiBold">{window.i18n('setPassword')}</div>
        <SpacerMD />
        <div>
          Set a Password before accessing the Recovery Phrase. You can set your password from{' '}
        </div>
        <div className="fontSemiBold">Settings -&gt; Privacy -&gt; Set Account Password.</div>
        <div style={{ padding: '15px 94px 15px', paddingTop: '30px' }}>
          <BchatButton
            text={'OK'}
            onClick={() => {
              window.inboxStore?.dispatch(showSettingsSection(BchatSettingCategory.Privacy));
              displayPasswordModal('set', props.onPasswordUpdated);
              // setVerify(true)
            }}
            buttonType={BchatButtonType.Brand}
            buttonColor={BchatButtonColor.Green}
          />
        </div>
      </div>
    </div>
  );

  // if(true)
  // {
  // return <WarningUnSetPassword onPasswordUpdated={props.onPasswordUpdated}/>
  // }

  // return <div className='bchat-settings-recovery-seed'>
  //   <img src="images/bchat/warning.svg" className="bchat-settings-recovery-seed-danger " />
  //   <p className="bchat-settings-recovery-seed-bold">IMPORTANT</p>
  //   <p className="bchat-settings-recovery-seed-red">Never Give your Seed to Anyone!</p>
  //   <p className="bchat-settings-recovery-seed-para">Never input your Seeds into any software or website other than the official beldex wallet or BChat directly from the play store, the beldex website or the beldex GitHub.</p>
  //   <p className="bchat-settings-recovery-seed-note">Are you sure you want to access your seed?</p>
  //   <div className='bchat-settings-recovery-seed-button'>
  //     <BchatButton
  //       text={"Yes, I am sure!"}
  //       onClick={() => setVerify(true)}
  //       buttonType={BchatButtonType.Brand}
  //       buttonColor={BchatButtonColor.Green}
  //     />
  //   </div>

  // </div>
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
