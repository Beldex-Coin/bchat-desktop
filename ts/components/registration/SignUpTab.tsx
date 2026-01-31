import  { useContext, useEffect, useState } from 'react';
import { fromHex, sanitizeBchatUsername } from '../../bchat/utils/String';
import { Flex } from '../basic/Flex';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { BchatIconButton } from '../icon';
import { LeftImage, NetType, RegistrationContext, RegistrationPhase, signUp } from './RegistrationStages';
import { RegistrationUserDetails } from './RegistrationUserDetails';
import { SignInMode } from './SignInTab';
import { DisplayIdAndAddress, ShowRecoveryPhase } from './ShowIdAndAddress';
import { StringUtils, ToastUtils } from '../../bchat/utils';
import { mnDecode } from '../../bchat/crypto/mnemonic';
import { bchatGenerateKeyPair } from '../../util/accountManager';


const coreBridgeInstance = require('@bdxi/beldex-app-bridge')

// const { clipboard } = require('electron');

export enum SignUpMode {
  Default,
  BchatIDShown,
  EnterDetails,
}

const CreateBchatIdButton = ({ createBchatID }: { createBchatID: any }) => {
  return (
    <div className="signUp-btn">
      <BchatButton
        onClick={createBchatID}
        buttonType={BchatButtonType.Default}
        buttonColor={BchatButtonColor.Primary}
        text={window.i18n('createAccount')}
      />
    </div>
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
      iconType="KeyboardBackspaceArrow"
      // iconPadding="5px"
      iconColor="#A9AEBA"
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
  const { signUpMode, setRegistrationPhase, setSignUpMode } = useContext(RegistrationContext);
  const [displayName, setDisplayName] = useState('');
  const [displayNameError, setDisplayNameError] = useState<undefined | string>('');
  const [displayNameScreen, setDisplayNameScreen] = useState(0);
  const [generatedRecoveryPhrase, setGeneratedRecoveryPhrase] = useState('');
  const [showSeedLoading, setShowSeedLoading] = useState(false);
  const [hexGeneratedPubKey, setHexGeneratedPubKey] = useState('');

  useEffect(() => {
    if (signUpMode === SignUpMode.BchatIDShown) {
      window.bchat.setNewBchatID(hexGeneratedPubKey);
    }
  }, [signUpMode]);

  const getWalletDetails = async () => {
    const bridgeInstance = await coreBridgeInstance({});
    const walletdetails = bridgeInstance.newly_created_wallet('english',NetType.Mainnet);
    return walletdetails;
        // params address and network type (MAINNET 1 TESTNET 0)    
  }
  const generateMnemonicAndKeyPairCreate = async () => {
    if (generatedRecoveryPhrase === '') {
      const walletDetails = await getWalletDetails();
      const mnemonic = walletDetails.mnemonic_string;
      const walletAddress = walletDetails.address_string;
     
      let seedHex = mnDecode(mnemonic);
      // handle shorter than 32 bytes seeds
      const privKeyHexLength = 32 * 2;
      if (seedHex.length !== privKeyHexLength) {
        seedHex = seedHex.concat('0'.repeat(32));
        seedHex = seedHex.substring(0, privKeyHexLength);
      }
      const seed = fromHex(seedHex);
      const keyPair = await bchatGenerateKeyPair(seed);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error -- returning Uint8Array intentionally
      const newHexPubKey = StringUtils.decode(keyPair.pubKey, 'hex');
      setGeneratedRecoveryPhrase(mnemonic);
      setHexGeneratedPubKey(newHexPubKey); // our 'frontend' bchatID
      localStorage.setItem('userAddress', walletAddress);
      
    }
  };

  if (signUpMode === SignUpMode.Default) {
    return (
      <SignUpDefault
        createBchatID={() => {
          setRegistrationPhase(RegistrationPhase.SignUp);
          setSignUpMode(SignUpMode.EnterDetails);
          props.assent(false);
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
    localStorage.setItem('walletUserName', displayName);
    await signUp({
      displayName,
      generatedRecoveryPhrase: generatedRecoveryPhrase,
    });
    setShowSeedLoading(false);
  };
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
  const clickGoBack = () => {
    setDisplayName('');
    setDisplayNameScreen(0);
    props.imageValidator(LeftImage.registration);
  };
  const verifyUserName = () => {
    if (!displayName) {
      window?.log?.warn('invalid trimmed name for registration');
      ToastUtils.pushToastError('invalidDisplayName', window.i18n('displayNameEmpty'));
    } else {
      void generateMnemonicAndKeyPairCreate();
      setDisplayNameScreen(2);
      props.imageValidator(LeftImage.address);
    }
  };

  
  const goback = () => {
    props.assent(true);
    clickGoBack();
    if (displayNameScreen === 1) {
      props.imageValidator(LeftImage.registration);
    }
  };

  if (displayNameScreen === 0) {
    return (
      <div className="bchat-registration__content" style={{ paddingTop: '0px' }}>
        <Flex
          flexDirection="row"
          container={true}
          alignItems="center"
          // padding="14px 0px"
          // margin="0px 0px 0px 65px"
        >
          <div className="bchat-registration-goback-icon">
            <GoBackMainMenuButton assent={goback} />
          </div>
          <Flex className="bchat-registration__welcome-bchat">{window.i18n('displayName')}</Flex>
        </Flex>
        <RegistrationUserDetails
          showDisplayNameField={true}
          showSeedField={false}
          displayName={displayName}
          handlePressEnter={() => {
            verifyUserName();
          }}
          onDisplayNameChanged={(name: string) => {
            const sanitizedName = sanitizeBchatUsername(name);
            const trimName = sanitizedName.trim();
            // const alphanumericName = sanitizedName.replace(/[^a-zA-Z0-9]/g, '');
            setDisplayName(sanitizedName);
            setDisplayNameError(!trimName ? window.i18n('displayNameEmpty') : undefined);
          }}
          stealAutoFocus={true}
        />
        <div style={{ width: '450px' }}>
          <BchatButton
            onClick={() => {
              verifyUserName();
            }}
            buttonType={BchatButtonType.Default}
            buttonColor={BchatButtonColor.Primary}
            text={window.i18n('continue')}
            disabled={!displayName}
          />
        </div>
      </div>
    );
  }

  // const handlePaste = () => {
  //   clipboard.writeText(generatedRecoveryPhrase, 'clipboard');
  // };

  if (displayNameScreen === 2) {
    return (
      <>
        {!localStorage.getItem('userAddress') || !hexGeneratedPubKey ? <LoaderGif /> : null}
        <DisplayIdAndAddress
          nextFunc={() => {
            setDisplayNameScreen(3);
            props.imageValidator(LeftImage.recoveryseed);
          }}
          pubKey={hexGeneratedPubKey}
          walletAddress={localStorage.getItem('userAddress')}
          assentAndGoBack={() => {
            props.assent(true);
            clickGoBack();
          }}
        />
      </>
    );
  }

  return (
    <>
      <ShowRecoveryPhase
        assentAndGoBack={() => {
          props.assent(true);
          clickGoBack();
        }}
        mnemonic={generatedRecoveryPhrase}
        nextFunc={signUpWithDetails}
        enableCompleteSignUp={enableCompleteSignUp}
        // copySeed={handlePaste}
        loading={showSeedLoading}
      ></ShowRecoveryPhase>
    </>
  );
};
