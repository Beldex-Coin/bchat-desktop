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
import { BchatIcon } from '../icon/BchatIcon';


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
    iconShow={true}
    customIcon={<BchatIcon iconType="enablePasswordIcon" iconSize={26} />}
    >
      {/* <div className="bchat-modal__centered"> */}
        <div className="bchat-modal-setPasswordAccess">
          <div className="contentbox">
            <div className="header">{window.i18n('setPassword')}</div>
            <SpacerLG />
            <div className='fontSemiBold'>
              Set a Password before accessing the Recovery Phrase. You can set your password from{' '}
              <span className='span'>Settings -&gt; Privacy -&gt; Set Account Password.</span> 
            </div>
            {/* <div className="fontSemiBold">Settings -&gt; Privacy -&gt; Set Account Password.</div> */}
          </div>
        </div>
      {/* </div> */}
    </BchatWrapperModal>
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
