import React, { useContext, useState } from 'react';
import { sanitizeBchatUsername } from '../../bchat/utils/String';
import { Flex } from '../basic/Flex';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { BchatSpinner } from '../basic/BchatSpinner';
import { SpacerLG } from '../basic/Text';
import {
  MAX_USERNAME_LENGTH,
  RegistrationContext,
  RegistrationPhase,
  signInWithLinking,
  signInWithRecovery,
} from './RegistrationStages';
// import { RegistrationUserDetails } from './RegistrationUserDetails';
// import { RestoreSeedInput } from './RestoreFromSeed';
import { GoBackMainMenuButton } from './SignUpTab';
// import { TermsAndConditions } from './TermsAndConditions';
import { BchatInput } from '../basic/BchatInput';
import { DisplaySeed } from './DisplaySeed';
import { mn_decode } from '../../bchat/crypto/mnemonic';
import { ToastUtils } from '../../bchat/utils';
// import { BchatIconButton } from '../icon/BchatIconButton';
const { clipboard } = require('electron')

export enum SignInMode {
  Default,
  UsingRecoveryPhrase,
  LinkDevice,
}
// tslint:disable: use-simple-attributes
// tslint:disable: react-unused-props-and-state

// const LinkDeviceButton = (props: { onLinkDeviceButtonClicked: () => any }) => {
//   return (
//     <BchatButton
//       onClick={props.onLinkDeviceButtonClicked}
//       buttonType={BchatButtonType.BrandOutline}
//       buttonColor={BchatButtonColor.Green}
//       text={window.i18n('linkDevice')}
//       dataTestId="link-device"
//     />
//   );
// };

const RestoreUsingRecoveryPhraseButton = (props: { onRecoveryButtonClicked: () => any }) => {
  return (
    <BchatButton
      onClick={props.onRecoveryButtonClicked}
      buttonType={BchatButtonType.BrandOutline}
      buttonColor={BchatButtonColor.White}
      text={window.i18n('signIn')}
      dataTestId="restore-using-recovery"
    />
  );
};

const ContinueYourBchatButton = (props: {
  handleContinueYourBchatClick: () => any;
  disabled: boolean;
}) => {
  return (
    <BchatButton
      onClick={props.handleContinueYourBchatClick}
      buttonType={BchatButtonType.Brand}
      buttonColor={BchatButtonColor.Green}
      text={window.i18n('restore')}
      disabled={props.disabled}
      dataTestId="continue-Bchat-button"
    />
  );
};

const SignInContinueButton = (props: {
  signInMode: SignInMode;
  disabled: boolean;
  handleContinueYourBchatClick: () => any;
}) => {
  if (props.signInMode === SignInMode.Default) {
    return null;
  }
  return (
    <ContinueYourBchatButton
    handleContinueYourBchatClick={props.handleContinueYourBchatClick}
      disabled={props.disabled}
    />
  );
};

const SignInButtons = (props: {
  signInMode: SignInMode;
  onRecoveryButtonClicked: () => any;
  onLinkDeviceButtonClicked: () => any;
}) => {
  if (props.signInMode !== SignInMode.Default) {
    return null;
  }
  return (
    <div>
      <RestoreUsingRecoveryPhraseButton onRecoveryButtonClicked={props.onRecoveryButtonClicked} />
      <SpacerLG />
      {/* <LinkDeviceButton onLinkDeviceButtonClicked={props.onLinkDeviceButtonClicked} /> */}
    </div>
  );
};

export const SignInTab = (props:any) => {
  const { setRegistrationPhase, signInMode, setSignInMode } = useContext(RegistrationContext);

  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [recoveryPhraseError, setRecoveryPhraseError] = useState(undefined as string | undefined);
  const [displayName, setDisplayName] = useState('');
  const [displayNameError, setDisplayNameError] = useState<string | undefined>('');
  const [loading, setIsLoading] = useState(false);
  // const [seedInputScreen,setSeedInputScreen] = useState(false);

  const isRecovery = signInMode === SignInMode.UsingRecoveryPhrase;
  const isLinking = signInMode === SignInMode.LinkDevice;
  // const showTermsAndConditions = signInMode !== SignInMode.Default;
  const [screenName, setScreenName] = useState(false)
  const [blockheight, setBlockheight] = useState('');
  const [restoreDate, setRestoreDate] = useState('');

  // show display name input only if we are trying to recover from seed.
  // We don't need a display name when we link a device, as the display name
  // from the configuration message will be used.
  // const showDisplayNameField = isRecovery;

  // Display name is required only on isRecoveryMode
  const displayNameOK = (isRecovery && !displayNameError && !!displayName) || isLinking;

  // Seed is mandatory no matter which mode
  const seedOK = (blockheight && !recoveryPhraseError)||(restoreDate && !recoveryPhraseError);
  const activateContinueButton = seedOK && displayNameOK && !loading;

  const continueYourBchat = async () => {
    if (isRecovery) {
      await signInWithRecovery({
        displayName,
        userRecoveryPhrase: recoveryPhrase,
      });
    } else if (isLinking) {
      setIsLoading(true);
      await signInWithLinking({
        userRecoveryPhrase: recoveryPhrase,
      });
      setIsLoading(false);
    }
  };

  const clickGoBack = () => {
    setScreenName(false);
    }

  async function assignSeed()
  {
   const recoverySeed = clipboard.readText();
   setRecoveryPhrase(recoverySeed); 
  }

  const seedValidation = () => {
    try{
      mn_decode(recoveryPhrase, 'english');
      setScreenName(true)    
    }catch(e){
    setScreenName(false)
    ToastUtils.pushToastError('registrationError', `Error: ${e.message || 'Something went wrong'}`);
    window?.log?.warn('exception during registration:', e);
    }
  }

  if (signInMode !== SignInMode.Default && !screenName) {

    return <>
      <div className='bchat-registration__backbutton'> 
        <GoBackMainMenuButton assent={()=>props.assent(true)} />
      </div>
      <DisplaySeed
      iconfunc={()=>assignSeed()}
      assignRecoveryPhase={(seed: string) => {
              setRecoveryPhrase(seed);
              setRecoveryPhraseError(!seed ? window.i18n('recoveryPhraseEmpty') : undefined);
            }}
      onNext={() => {seedValidation()}} 
      recoveryPhrase={recoveryPhrase} 
      />
    </>

  }

  // if(signInMode == SignInMode.UsingRecoveryPhrase){
  //  return( <div className="bchat-registration__content">

  //   <>
  //     <GoBackMainMenuButton />
  //     <RestoreSeedInput nextScreen={(value:boolean)=>{setSeedInputScreen(value)}} ></RestoreSeedInput>
  //    </>
  //   </div>
  //  )
  // }
  
  return (
    <div className="bchat-registration__content">
      {screenName && (
        <>
          <div className='bchat-registration__backbutton' style={{left:'52px'}}>
          <GoBackMainMenuButton assent={()=>{
            props.assent(true);
            clickGoBack()}}
          />
          </div>
          <div className='bchat-registration-header'>{window.i18n('restoreFromSeed')}</div>
          <BchatInput
            autoFocus={true}
            label={window.i18n('displayName')}
            type="text"
            placeholder={window.i18n('enterDisplayName')}
            value={props.displayName}
            maxLength={MAX_USERNAME_LENGTH}
            onValueChanged={(name: string) => {
              const sanitizedName = sanitizeBchatUsername(name);
              const trimName = sanitizedName.trim();
              setDisplayName(sanitizedName);
              setDisplayNameError(!trimName ? window.i18n('displayNameEmpty') : undefined);}}
            onEnterPressed={props.handlePressEnter}
            inputDataTestId="display-name-input"
          />
          <div>
            <hr className='bchat-registration-hr'></hr>
            <p className='bchat-restore-seed-textbox-message'>If you dont know the restore blockheight, you can skip it.</p>
            <BchatInput
              autoFocus={true}
              type="text"
              placeholder={'Restore from Blockheight'}
              value={blockheight}
              maxLength={10}
              onValueChanged={(e) => {
                let checkHeight = /^[\d ]*$/.test(e);
              if(!checkHeight)
                return;
              setBlockheight(e); 
          }}
              onEnterPressed={props.handlePressEnter}
              inputDataTestId="display-name-input"
            />

          </div>
          <div className='bchat-restore-seed-or'> OR </div>
          <div style={{marginBottom:"56px"}} >
            <p className='bchat-restore-seed-textbox-message'>If you dont know the restore Date, you can skip it.</p>

            <BchatInput
              autoFocus={true}
              type="date"
              placeholder={'Restore from Date'}
              value={restoreDate}
              maxLength={MAX_USERNAME_LENGTH}
              onValueChanged={(e) => setRestoreDate(e)}
              onEnterPressed={props.handlePressEnter}
              inputDataTestId="display-name-input"
            />
          </div>
          <div style={{width:'75%',marginLeft:'57px'}}>
          <SignInContinueButton
            signInMode={signInMode}
            handleContinueYourBchatClick={continueYourBchat}
            disabled={!activateContinueButton}
          />
          </div>
        </>
      )}
      <SignInButtons
        signInMode={signInMode}
        onRecoveryButtonClicked={() => {
          setRegistrationPhase(RegistrationPhase.SignIn);
          setSignInMode(SignInMode.UsingRecoveryPhrase);
          setRecoveryPhrase('');
          setDisplayName('');
          setIsLoading(false);
          props.assent(false);
        }}

        onLinkDeviceButtonClicked={() => {
          setRegistrationPhase(RegistrationPhase.SignIn);
          setSignInMode(SignInMode.LinkDevice);
          setRecoveryPhrase('');
          setDisplayName('');
          setIsLoading(false);
        }}
      />
      {loading && (
        <Flex container={true} justifyContent="center" alignItems="center"
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            pointerEvents: 'all',
            backgroundColor: '#00000088',
          }}
        >
          <BchatSpinner loading={true} />
        </Flex>
      )}
    </div>
  );
};
