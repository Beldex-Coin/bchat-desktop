import React, { useContext, useState } from 'react';
import { sanitizeBchatUsername } from '../../bchat/utils/String';
// import { Flex } from '../basic/Flex';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
// import { BchatSpinner } from '../basic/BchatSpinner';
// import { SpacerLG } from '../basic/Text';
import {
  LeftImage,
  MAX_USERNAME_LENGTH,
  RegistrationContext,
  RegistrationPhase,
  signInWithLinking,
  signInWithRecovery,
} from './RegistrationStages';
// import { RegistrationUserDetails } from './RegistrationUserDetails';
import { GoBackMainMenuButton } from './SignUpTab';
// import { TermsAndConditions } from './TermsAndConditions';
import { BchatInput } from '../basic/BchatInput';
import { DisplaySeed } from './DisplaySeed';
import { mn_decode } from '../../bchat/crypto/mnemonic';
import { ToastUtils } from '../../bchat/utils';
import { WalletPassword } from './WalletPass';
import { Flex } from '../basic/Flex';
import moment from 'moment';
import { BchatIcon } from '../icon/BchatIcon';
import { BchatConfirm } from '../dialog/BchatConfirm';

// import { BchatIconButton } from '../icon/BchatIconButton';
const { clipboard } = require('electron');

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
    <div className="signIn-btn">
      <BchatButton
        onClick={props.onRecoveryButtonClicked}
        buttonType={BchatButtonType.DefaultOutline}
        buttonColor={BchatButtonColor.Primary}
        text={window.i18n('signIn')}
        dataTestId="restore-using-recovery"
      />
    </div>
  );
};

const ContinueYourBchatButton = (props: {
  handleContinueYourBchatClick: () => any;
  disabled: boolean;
}) => {
  return (
    <BchatButton
      onClick={props.handleContinueYourBchatClick}
      buttonType={BchatButtonType.Default}
      buttonColor={BchatButtonColor.Primary}
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
      {/* <SpacerLG /> */}
      {/* <LinkDeviceButton onLinkDeviceButtonClicked={props.onLinkDeviceButtonClicked} /> */}
    </div>
  );
};

export const SignInTab = (props: any) => {
  const { setRegistrationPhase, signInMode, setSignInMode } = useContext(RegistrationContext);
  const today = moment().format('YYYY-MM-DD');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');

  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  // const [recoveryPhraseError, setRecoveryPhraseError] = useState(undefined as string | undefined);
  const [displayName, setDisplayName] = useState('');
  const [displayNameError, setDisplayNameError] = useState<string | undefined>('');
  const [loading, setIsLoading] = useState(false);
  // const [seedInputScreen,setSeedInputScreen] = useState(false);

  const isRecovery = signInMode === SignInMode.UsingRecoveryPhrase;
  const isLinking = signInMode === SignInMode.LinkDevice;
  // const showTermsAndConditions = signInMode !== SignInMode.Default;
  const [screenName, setScreenName] = useState(1);
  const [blockheight, setBlockheight] = useState('');
  const [restoreDate, setRestoreDate] = useState('');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  // show display name input only if we are trying to recover from seed.
  // We don't need a display name when we link a device, as the display name
  // from the configuration message will be used.
  // const showDisplayNameField = isRecovery;

  // Display name is required only on isRecoveryMode
  const displayNameOK = (isRecovery && !displayNameError && !!displayName) || isLinking;

  // Seed is mandatory no matter which mode
  // const seedOK = (blockheight && !recoveryPhraseError) || (restoreDate && !recoveryPhraseError);
  // const year = moment(restoreDate).year();
  const activateContinueButton = displayNameOK && !loading;
  const confirmProps = {
    title: 'Blockheight will be set to Zero(0)',
    message: 'Do you want to proceed Restore by syncing from Blockheight value 0?',
    okText: 'Proceed',
    cancelText: 'Cancel',
    showExitIcon: false,
    iconShow: true,
    customIcon: <BchatIcon iconType="blockSync" iconSize={58} fillRule='evenodd' clipRule='evenodd' />,
    okTheme: BchatButtonColor.Primary,
    onClickOk: () =>{ setConfirmModalOpen(false),continueYourBchat()},
    onClickCancel: () => {
      setConfirmModalOpen(false);
    },
  };
  localStorage.setItem('walletUserName', displayName);


  const validationForConfirmPopup = () => {
    if (!restoreDate && !blockheight) {
      setConfirmModalOpen(true);
    } else {
      continueYourBchat();
    }
  };

  const continueYourBchat = async () => {
    if (isRecovery) {
      setIsLoading(true);

      let refreshDetails = !restoreDate
        ? { refresh_start_timestamp_or_height: blockheight, refresh_type: 'height' }
        : { refresh_start_timestamp_or_height: restoreDate, refresh_type: 'date' };

      await signInWithRecovery({
        displayName,
        password,
        userRecoveryPhrase: recoveryPhrase,
        refreshDetails,
      });
      setIsLoading(false);
    } else if (isLinking) {
      setIsLoading(true);
      await signInWithLinking({
        userRecoveryPhrase: recoveryPhrase,
      });
      setIsLoading(false);
    }
  };

  const passValid = () => {
    if (!password || !repassword) {
      return ToastUtils.pushToastError('passwordFieldEmpty', window.i18n('passwordFieldEmpty'));
    }
    if (password !== repassword) {
      window?.log?.warn('invalid password');
      return ToastUtils.pushToastError('invalidPassword', 'Please Enter Same Password !');
    }
    if (
      (password.length < 4 && repassword.length < 4) ||
      (password.length > 13 && repassword.length > 13)
    ) {
      return ToastUtils.pushToastError(
        'walletPasswordLengthError',
        window.i18n('walletPasswordLengthError')
      );
    }
    setScreenName(3);
    props.imageValidator(LeftImage.recoveryseed);
  };

  // const clickGoBack = () => {
  //   setScreenName(0);
  // }

  async function assignSeed() {
    const recoverySeed = clipboard.readText();
    setRecoveryPhrase(recoverySeed);
  }

  const seedValidation = () => {
    if (!recoveryPhrase) {
      return ToastUtils.pushToastError('registrationError', `Please enter the seed`);
    } else {
      try {
        mn_decode(recoveryPhrase, 'english');
        setScreenName(2);
        props.imageValidator(LeftImage.password);
      } catch (e) {
        setScreenName(1);
        ToastUtils.pushToastError(
          'registrationError',
          `Error: ${e.message || 'Something went wrong'}`
        );
        window?.log?.warn('exception during registration:', e);
      }
    }
  };

  if (signInMode !== SignInMode.Default && screenName === 1) {
    return (
      <>
        {/* <div className="bchat-registration__backbutton">
          <GoBackMainMenuButton
            assent={() => {
              props.assent(true);
              setScreenName(1);
              setBlockheight('');
              setRestoreDate('');
              props.imageValidator(LeftImage.registration);
            }}
          />
        </div> */}
        <DisplaySeed
          backArrow={() => {
            props.assent(true);
            setScreenName(1);
            setBlockheight('');
            setRestoreDate('');
            props.imageValidator(LeftImage.registration);
          }}
          paste={() => assignSeed()}
          assignRecoveryPhase={(seed: string) => {
            setRecoveryPhrase(seed);
            // setRecoveryPhraseError(!seed ? window.i18n('recoveryPhraseEmpty') : undefined);
          }}
          onNext={() => {
            seedValidation();
          }}
          recoveryPhrase={recoveryPhrase}
        />
      </>
    );
  }
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, e: string) => {
    const newValue = e.replace(/\s+/g, '');
    setter(newValue);
  };

  if (screenName === 2) {
    return (
      <WalletPassword
        password={password}
        repassword={repassword}
        setPassword={(e: string) => handleInputChange(setPassword, e)}
        setRepassword={(e: string) => handleInputChange(setRepassword, e)}
        backArrow={() => {
          setScreenName(1);
          props.imageValidator(LeftImage.recoveryseed);
          setPassword('');
          setRepassword(''), props.assent(true);
        }}
        submit={passValid}
      />
    );
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
  const LoaderGif = () => {
    return (
      <div className="bchat-registration-loadingGif">
        <div
          style={{
            background: 'url(images/bchat/Load_animation.gif) no-repeat',
            width: '120px',
            height: '120px',
            margin: '0px auto',
            backgroundSize: '102px',
          }}
        ></div>
      </div>
    );
  };

  return (
    <div className="bchat-registration__content">
      {screenName === 3 && (
        <>
          {/* <div
            className="bchat-registration__backbutton"
          // data-tip="Back"
          // data-place="right"
          // data-offset="{top:10}"
          // style={{ left: '52px' }}
          >
            <GoBackMainMenuButton
              assent={() => {
                props.assent(true);
                setScreenName(1);
                setPassword('');
                setRepassword('');
                setBlockheight('');
                setRestoreDate('');
                props.imageValidator(LeftImage.registration);
              }}
            />
          </div>
          <div className="bchat-registration-header">{window.i18n('restoreFromSeed')}</div> */}
          <Flex flexDirection="row" container={true} alignItems="center" padding="20px 0px">
            <div className="bchat-registration-goback-icon">
              <GoBackMainMenuButton
                assent={() => {
                  props.assent(true);
                  setScreenName(1);
                  setPassword('');
                  setRepassword('');
                  setBlockheight('');
                  setRestoreDate('');
                  props.imageValidator(LeftImage.registration);
                }}
              />
            </div>
            <Flex className="bchat-registration__welcome-bchat">
              {window.i18n('restoreFromSeed')}
            </Flex>
          </Flex>
          <BchatInput
            autoFocus={true}
            // label={window.i18n('displayName')}
            type="text"
            placeholder={window.i18n('enterDisplayName')}
            value={displayName}
            maxLength={MAX_USERNAME_LENGTH}
            onValueChanged={(name: string) => {
              const sanitizedName = sanitizeBchatUsername(name);
              const trimName = sanitizedName.trim();
              // const alphanumericName = sanitizedName.replace(/[^a-zA-Z0-9]/g, '');
              setDisplayName(sanitizedName);
              setDisplayNameError(!trimName ? window.i18n('displayNameEmpty') : undefined);
            }}
            // onEnterPressed={props.handlePressEnter}
            onEnterPressed={validationForConfirmPopup}
            inputDataTestId="display-name-input"
          />
          <div>
            <hr className="bchat-registration-hr"></hr>
            <p className="bchat-restore-seed-textbox-message">
              If you dont know the restore blockheight, you can skip it.
            </p>
            <BchatInput
              autoFocus={true}
              type="text"
              placeholder={'Restore from Blockheight'}
              value={blockheight}
              maxLength={10}
              onValueChanged={e => {
                let checkHeight = /^[\d ]*$/.test(e);
                if (!checkHeight) return;
                setBlockheight(e);
              }}
              onEnterPressed={props.handlePressEnter}
              inputDataTestId="display-name-input"
            />
          </div>
          <div className="bchat-restore-seed-or"> OR </div>
          <div style={{ marginBottom: '25px' }}>
            <p className="bchat-restore-seed-textbox-message">
              If you dont know the restore Date, you can skip it.
            </p>

            <BchatInput
              autoFocus={true}
              type="date"
              max={today}
              placeholder={'Restore from Date'}
              value={restoreDate}
              maxLength={MAX_USERNAME_LENGTH}
              onValueChanged={e => setRestoreDate(e)}
              onEnterPressed={props.handlePressEnter}
              inputDataTestId="display-name-input"
              min="2020-01-01"
            />
          </div>
          <div style={{ width: '450px' }}>
            <SignInContinueButton
              signInMode={signInMode}
              handleContinueYourBchatClick={validationForConfirmPopup}
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
          props.imageValidator(LeftImage.recoveryseed);
        }}
        onLinkDeviceButtonClicked={() => {
          setRegistrationPhase(RegistrationPhase.SignIn);
          setSignInMode(SignInMode.LinkDevice);
          setRecoveryPhrase('');
          setDisplayName('');
          setIsLoading(false);
        }}
      />
      {loading && <LoaderGif />}
      {confirmModalOpen && <BchatConfirm {...confirmProps} />}

      {/* {loading && (
        <Flex
          container={true}
          justifyContent="center"
          alignItems="center"
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
      )} */}
    </div>
  );
};
