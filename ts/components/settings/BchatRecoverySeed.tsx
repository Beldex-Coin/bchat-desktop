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
