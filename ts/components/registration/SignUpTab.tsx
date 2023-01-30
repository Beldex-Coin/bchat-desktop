import React, { useContext, useEffect, useState } from 'react';
import { fromHex, sanitizeBchatUsername } from '../../bchat/utils/String';
import { Flex } from '../basic/Flex';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { BchatIconButton } from '../icon';
import { RegistrationContext, RegistrationPhase, signUp } from './RegistrationStages';
import { RegistrationUserDetails } from './RegistrationUserDetails';
import { SignInMode } from './SignInTab';
import {
  DisplayIdAndAddress,
  ShowRecoveryPhase
} from "./ShowIdAndAddress";
import { StringUtils, ToastUtils } from '../../bchat/utils';
import { wallet } from '../../wallet/wallet-rpc';
import { mn_decode } from '../../bchat/crypto/mnemonic';
import { bchatGenerateKeyPair } from '../../util/accountManager';
import { WalletPassword } from './WalletPass';

const { clipboard } = require('electron')

export enum SignUpMode {
  Default,
  BchatIDShown,
  EnterDetails,

}

const CreateBchatIdButton = ({ createBchatID }: { createBchatID: any }) => {
  return (
    <BchatButton
      onClick={createBchatID}
      buttonType={BchatButtonType.BrandOutline}
      buttonColor={BchatButtonColor.Green}
      text={window.i18n('createAccount')}
    />
  );
};

const SignUpDefault = (props: { createBchatID: () => void }) => {
  return (
    <div className="bchat-registration__content">
      <CreateBchatIdButton createBchatID={props.createBchatID} />
    </div>
  );
};

export const GoBackMainMenuButton = (props: any) => {
  const { setRegistrationPhase, setSignInMode, setSignUpMode } = useContext(RegistrationContext);
  return (
    <BchatIconButton
      iconSize="huge"
      iconType="chevron"
      iconRotation={90}
      iconPadding="5px"
      onClick={() => {
        setRegistrationPhase(RegistrationPhase.Start);
        setSignInMode(SignInMode.Default);
        setSignUpMode(SignUpMode.Default);
        props.assent ? props.assent() : '';
        props.goBack ? props.goBack() : '';
      }}
    />
  );
};

export const SignUpTab = (props: any) => {
  const {
    signUpMode,
    setRegistrationPhase,
    setSignUpMode,
  } = useContext(RegistrationContext);
  const [displayName, setDisplayName] = useState('');
  const [displayNameError, setDisplayNameError] = useState<undefined | string>('');
  const [displayNameScreen, setDisplayNameScreen] = useState(0);
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState("");
  const [generatedRecoveryPhrase, setGeneratedRecoveryPhrase] = useState('');
  const [showSeedLoading,setShowSeedLoading]=useState(false)
  // const [daemonHeight,setDaemonHeight]=useState(0);
  const [hexGeneratedPubKey, setHexGeneratedPubKey] = useState('');
     
     
  useEffect(() => {
    if (signUpMode === SignUpMode.BchatIDShown) {
      window.bchat.setNewBchatID(hexGeneratedPubKey);
    }
  }, [signUpMode]);

  const generateMnemonicAndKeyPairCreate = async (props: any) => {
    if (generatedRecoveryPhrase === '') {
      const mnemonic = await wallet.generateMnemonic(props); 
      // let data=await wallet.sendRPC('getheight', {}, 5000);
    //  let  daemonBlockHeight=data.result?.height;
      let seedHex = mn_decode(mnemonic);
      // handle shorter than 32 bytes seeds
      const privKeyHexLength = 32 * 2;
      if (seedHex.length !== privKeyHexLength) {
        seedHex = seedHex.concat('0'.repeat(32));
        seedHex = seedHex.substring(0, privKeyHexLength);
      }
      const seed = fromHex(seedHex);
      const keyPair = await bchatGenerateKeyPair(seed);
      const newHexPubKey = StringUtils.decode(keyPair.pubKey, 'hex');
      // setDaemonHeight(data.result?.height)
      setGeneratedRecoveryPhrase(mnemonic);
      setHexGeneratedPubKey(newHexPubKey); // our 'frontend' bchatID
    }
  };

  if (signUpMode === SignUpMode.Default) {
    return (
      <SignUpDefault
        createBchatID={() => {
          setRegistrationPhase(RegistrationPhase.SignUp);
          setSignUpMode(SignUpMode.EnterDetails);
          props.assent(false)
        }}
      />
    );
  }

  // can only be the EnterDetails step

  // Display name is required
  const displayNameOK = !displayNameError && !!displayName;

  const enableCompleteSignUp = displayNameOK;
  const signUpWithDetails = async () => {
    setShowSeedLoading(true);
    localStorage.setItem("walletUserName",displayName);
    await signUp({
      displayName,
      generatedRecoveryPhrase: generatedRecoveryPhrase,
     
    });
    setShowSeedLoading(false);
  };
  const LoaderGif = () => {
    return <div className="bchat-registration-loadingGif">
      <div style={{ background: "url(images/bchat/Load_animation.gif) no-repeat", width: "151px", height: "128px", margin: "0 auto" }}>
      </div>
    </div>
  }
  const clickGoBack = () => {
    setDisplayName('')
    setDisplayNameScreen(0);
  }
  const verifyUserName = () => {
    if (!displayName) {
      window?.log?.warn('invalid trimmed name for registration');
      ToastUtils.pushToastError('invalidDisplayName', window.i18n('displayNameEmpty'));
    } else {
      setDisplayNameScreen(1);
    }
  }

  const passValid = () => { 
    if (!password || !repassword) {
      ToastUtils.pushToastError('invalidPassword', 'Please Enter Password !');

    }
    else if (
      (password.length < 4 && repassword.length < 4) ||
      (password.length > 13 && repassword.length > 13)
    ) {

       ToastUtils.pushToastError(
        'walletPasswordLengthError',
        window.i18n('walletPasswordLengthError')
      );

    }
    else if (password !== repassword) {
      window?.log?.warn('invalid password');
      ToastUtils.pushToastError('invalidPassword', 'Please Enter Same Password !');
    }
    else {
      const walletData = { displayName, password }
      void generateMnemonicAndKeyPairCreate(walletData);
      setDisplayNameScreen(2);
      setRepassword("")
      setPassword("")

    }
  }
  const goback = () => {
    props.assent(true);
    clickGoBack();
    if (displayNameScreen === 1) {
      setPassword("");
      setRepassword("");
    }
  }
  if (displayNameScreen === 1) {
    return <WalletPassword
      password={password}
      repassword={repassword}
      setPassword={(e: any) => setPassword(e)}
      setRepassword={(e: any) => setRepassword(e)}
      backArrow={goback}
      submit={passValid}
    />
  }

  if (displayNameScreen === 0) {
    return (
      <div className="bchat-registration__content" style={{ paddingTop: '0px' }}>
        <Flex flexDirection="row" container={true} alignItems="center" padding="14px 0px" margin='0px 0px 0px 65px'>
          <div className='bchat-registration-goback-icon' >
            <GoBackMainMenuButton assent={goback} />
          </div>
          <Flex className="bchat-registration__welcome-bchat">
            {window.i18n('welcomeToYourBchat')}
          </Flex>
        </Flex>
        <RegistrationUserDetails
          showDisplayNameField={true}
          showSeedField={false}
          displayName={displayName}
          handlePressEnter={() => { verifyUserName() }}
          onDisplayNameChanged={(name: string) => {
            const sanitizedName = sanitizeBchatUsername(name);
            const trimName = sanitizedName.trim();
            setDisplayName(sanitizedName);
            setDisplayNameError(!trimName ? window.i18n('displayNameEmpty') : undefined);
          }}
          stealAutoFocus={true}
        />
        <div style={{ width: '76%', marginLeft: '55px' }}>
          <BchatButton
            onClick={() => { verifyUserName() }}
            buttonType={BchatButtonType.Brand}
            buttonColor={BchatButtonColor.Green}
            text={window.i18n('getStarted')}
          />
        </div>
      </div>
    );
  }



  const handlePaste = () => {
    clipboard.writeText(generatedRecoveryPhrase, 'clipboard');
  };
  if (displayNameScreen === 2) {
    return (
      <>
        {!localStorage.getItem("userAddress") || !hexGeneratedPubKey ? <LoaderGif /> : null}
        <DisplayIdAndAddress nextFunc={() => { setDisplayNameScreen(3) }} pubKey={hexGeneratedPubKey} walletAddress={localStorage.getItem("userAddress")} assentAndGoBack={() => { props.assent(true); clickGoBack() }} />
      </>
    );
  }

  return (

    <>
      <ShowRecoveryPhase
        assentAndGoBack={() => { props.assent(true); clickGoBack() }}
        mnemonic={generatedRecoveryPhrase}
        nextFunc={signUpWithDetails}
        enableCompleteSignUp={enableCompleteSignUp}
        copySeed={handlePaste}
        loading={showSeedLoading}

      >
        
      </ShowRecoveryPhase>
    </>

  )
};