import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { disableRecoveryPhrasePrompt } from '../../state/ducks/userConfig';
// import { getShowRecoveryPhrasePrompt } from '../../state/selectors/userConfig';
import { recoveryPhraseModal } from '../../state/ducks/modalDialog';
import { Flex } from '../basic/Flex';
import { getFocusedSection, getOverlayMode } from '../../state/selectors/section';
import {
  SectionType,
  setOverlayMode,
  showLeftPaneSection,
  // showSettingsSection,
} from '../../state/ducks/section';
import {
  BchatButton,
  // BchatButtonColor,
  BchatButtonType,
} from '../basic/BchatButton';
import { BchatIcon, BchatIconButton } from '../icon';
import { isSignWithRecoveryPhrase } from '../../util/storage';

import { Avatar, AvatarSize } from '../avatar/Avatar';
import { getOurNumber } from '../../state/selectors/user';
import { editProfileModal } from '../../state/ducks/modalDialog';
import { ActionPanelOnionStatusLight } from '../dialog/OnionStatusPathDialog';

import { switchHtmlToDarkTheme, switchHtmlToLightTheme } from '../../state/ducks/BchatTheme';
import { BchatToolTip } from './ActionsPanel';
import { applyTheme } from '../../state/ducks/theme';
import { getIsOnline } from '../../state/selectors/onions';
// import { BchatSettingCategory } from '../settings/BchatSettings';
import { clearSearch } from '../../state/ducks/search';
import { getConversationController } from '../../bchat/conversations';
// import { ConversationTypeEnum } from '../../models/conversation';
// import { getOurPubKeyStrFromCache } from '../../bchat/utils/User';
import { isLinkedBchatIDWithBnsForDeamon } from '../../wallet/BchatWalletHelper';
import { getOurPubKeyStrFromCache } from '../../bchat/utils/User';
// import ReactTooltip from 'react-tooltip';

// const SectionTitle = styled.h1`
//   padding: 0 var(--margins-sm);
//   flex-grow: 1;
//   color: var(--color-text);
//   font-family:$bchat-font-poppin-semibold;
// `;

export const LeftPaneSectionHeader = () => {
  // const showRecoveryPhrasePrompt = useSelector(getShowRecoveryPhrasePrompt);
  const focusedSection = useSelector(getFocusedSection);
  const overlayMode = useSelector(getOverlayMode);
  const bChatId = useSelector(getOurNumber);
  const dispatch = useDispatch();

  const [bnsName, setBnsName] = useState('');

  let label: string | undefined;

  const isMessageSection = focusedSection === SectionType.Message;
  const isMessageRequestOverlay = overlayMode === 'message-requests';

  const showBackButton = isMessageRequestOverlay && isMessageSection;
  const conversation = getConversationController().get(getOurPubKeyStrFromCache());
  console.log('LeftPaneSectionHeader----------------->',conversation?.attributes?.isBnsHolder)
  switch (focusedSection) {
    case SectionType.Contact:
      label = window.i18n('contactsHeader');
      break;
    case SectionType.Settings:
      label = window.i18n('settingsHeader');
      break;
    case SectionType.Wallet:
      label = window.i18n('wallet');
      break;
    case SectionType.Message:
      label = isMessageRequestOverlay
        ? window.i18n('messageRequests')
        : // : window.i18n('messagesHeader');
          'BChat';

      break;
    default:
      label = 'BChat';
  }

  async function printlog() {
    isLinkedBchatIDWithBnsForDeamon(bnsName);
    // console.log('conversation data 0 ----->')

    // //  const conversation = await getConversationController().getOrCreateAndWait(
    // //   bChatId,ConversationTypeEnum.PRIVATE

    // // );
    // const conversation =getConversationController().get(
    //   getOurPubKeyStrFromCache()

    // );
    // console.log('conversation data ----->',conversation)
  }
  // async function updatebnsholder(e:any)
  // {
  //   setbnsName(e.target.value)
  //   console.log('updatebnsholder ----------->')
  //   const conversation = await getConversationController().getOrCreateAndWait(
  //     bChatId,ConversationTypeEnum.PRIVATE

  //   );
  //   console.log('updatebnsholder 0----------->',conversation.attributes.isBnsHolder);
  //   let conditon=false
  //   if(e.target.value ==='true' )
  //   {
  //     conditon=true
  //   }
  //   console.log('updatebnsholder 1----------->',conditon);

  //   console.log('set value ->>>>>>>>>>>',e.target.value,conditon)

  //   await conversation.setIsBnsHolder(conditon);

  //   const conversation_1 = getConversationController().get(
  //     getOurPubKeyStrFromCache()
  //   );
  //   console.log('updatebnsholder 2----------->', getOurPubKeyStrFromCache(),conversation_1.attributes.isBnsHolder);
  // }
  function handleClick() {
    const themeFromSettings = window.Events.getThemeSetting();
    const updatedTheme = themeFromSettings === 'dark' ? 'light' : 'dark';
    window.setTheme(updatedTheme);
    dispatch(applyTheme(updatedTheme));

    if (updatedTheme === 'dark') {
      switchHtmlToDarkTheme();
    } else {
      switchHtmlToLightTheme();
    }
  }

  // function switchToWalletSec() {
  //   dispatch(showLeftPaneSection(3));
  //   dispatch(showSettingsSection(BchatSettingCategory.Wallet));
  // }

  function verifyScreens() {
    if (SectionType.Settings !== focusedSection) {
      return (
        <div style={{ position: 'relative' }}>
          <Avatar
            size={AvatarSize.M}
            onAvatarClick={() => dispatch(editProfileModal({}))}
            pubkey={bChatId}
            dataTestId="leftpane-primary-avatar"
          />
         {!!conversation?.attributes?.isBnsHolder &&  <div
            style={{
              position: 'absolute',
              width: '27px',
              height: '16px',
              left: '-4px',
              top: '-1px',
              boxShadow: '4px 7px 5px black',
            }}
          >
            <span className="module-contact-name-bns-tag ">Bns</span>
            </div>}
        </div>
      );
    } else {
      return (
        <div className="module-left-pane__header_gearIcon">
          <BchatIcon
            iconType={'gear'}
            //  iconColor={"#fff"}
            iconSize={'large'}
          />
        </div>
      );
    }
  }

  const IsOnline = () => {
    const isOnline = useSelector(getIsOnline);
    const status = isOnline ? 'Online' : 'Offline';
    if (SectionType.Settings !== focusedSection) {
      return (
        <Hops data-tip={status} data-offset="{'right':30}" data-place="bottom">
          <ActionPanelOnionStatusLight
            isSelected={false}
            handleClick={function(): void {
              throw new Error('Function not implemented.');
            }}
            id={''}
            size="tiny"
          />
        </Hops>
      );
    } else {
      return null;
    }
  };

  function Moon() {
    return (
      <div
        // style={{ marginRight: '13px' }}
        className="dayAndNightIcon"
        onClick={handleClick}
        data-tip="Themes"
        data-offset="{'right':43}"
        data-place="bottom"
      ></div>
    );
  }

  function Settings() {
    return (
      <span style={{ marginRight: '15px', marginTop: '8px' }}>
        <BchatIconButton
          iconSize="large"
          iconType="walletSetting"
          iconColor="#2879fb"
          onClick={() => {
            dispatch(clearSearch());
            dispatch(showLeftPaneSection(3));
            dispatch(setOverlayMode(undefined));
          }}
        />
      </span>
    );
  }
  return (
    <Flex flexDirection="column">
      <div
        className="module-left-pane__header"
        style={SectionType.Settings == focusedSection ? { boxShadow: 'none' } : {}}
      >
        {showBackButton && (
          <BchatIconButton
            onClick={() => {
              dispatch(setOverlayMode(undefined));
            }}
            iconType="chevron"
            iconRotation={90}
            iconSize="medium"
            margin="0 0 var(--margins-xs) var(--margins-xs)"
          />
        )}

        <div className="">{verifyScreens()}</div>

        <div>
          <input
            style={{ width: '130px' }}
            value={bnsName} // ...force the select's value to match the state variable...
            onChange={e => setBnsName(e.target.value)} // ... and update the state variable on any change!
            placeholder="enter your bdx"
          />

          <button onClick={() => printlog()}>submit</button>
        </div>

        {/* <button onClick={()=>updatebnsholder()}>updatetag</button> */}
        <div className="module-left-pane__header__title">{label}</div>
        {/* <div onClick={() => switchToWalletSec()} style={{ marginRight: '19px', cursor: 'pointer' }}>
          <BchatIcon iconSize={18} iconType="wallet" iconColor="#16A51C" />
        </div> */}
        <IsOnline />
        <Moon />
        <Settings />

        {/* {isMessageSection && !isMessageRequestOverlay && (
          <div
            onClick={props.buttonClicked}
            className="addContact"
            data-tip="Add Contacts"
            data-offset="{'right':60}"
            data-place="bottom"
          > */}
        {/* <div className='addContactIcon'></div> */}
        {/* <img className="addContactIcon" /> */}
        {/* </div>
        )} */}
      </div>
      <BchatToolTip effect="solid" />
    </Flex>
  );
};

const BannerInner = () => {
  const dispatch = useDispatch();

  const showRecoveryPhraseModal = () => {
    dispatch(disableRecoveryPhrasePrompt());
    dispatch(recoveryPhraseModal({}));
  };

  return (
    <StyledBannerInner>
      <p>{window.i18n('recoveryPhraseRevealMessage')}</p>
      <BchatButton
        buttonType={BchatButtonType.Default}
        text={window.i18n('recoveryPhraseRevealButtonText')}
        onClick={showRecoveryPhraseModal}
        dataTestId="reveal-recovery-phrase"
      />
    </StyledBannerInner>
  );
};

export const LeftPaneBanner = () => {
  const section = useSelector(getFocusedSection);
  const isSignInWithRecoveryPhrase = isSignWithRecoveryPhrase();

  if (section !== SectionType.Message || isSignInWithRecoveryPhrase) {
    return null;
  }

  return (
    <StyledLeftPaneBanner>
      <StyledProgressBarContainer>
        <StyledProgressBarInner />
      </StyledProgressBarContainer>
      <StyledBannerTitle>
        {window.i18n('recoveryPhraseSecureTitle')} <span>90%</span>
      </StyledBannerTitle>
      <Flex flexDirection="column" justifyContent="space-between" padding={'var(--margins-sm)'}>
        <BannerInner />
      </Flex>
    </StyledLeftPaneBanner>
  );
};

const StyledProgressBarContainer = styled.div`
  width: 100%;
  height: 5px;
  flex-direction: row;
  background: var(--color-bchat-border);
`;

const StyledProgressBarInner = styled.div`
  background: var(--color-accent);
  width: 90%;
  transition: width 0.5s ease-in;
  height: 100%;
`;

export const StyledBannerTitle = styled.div`
  line-height: 1.3;
  font-size: var(--font-size-md);
  font-weight: bold;
  margin: var(--margins-sm) var(--margins-sm) 0 var(--margins-sm);

  span {
    color: var(--color-text-accent);
  }
`;

export const StyledLeftPaneBanner = styled.div`
  background: var(--color-recovery-phrase-banner-background);
  display: flex;
  flex-direction: column;
  border-bottom: var(--bchat-border);
`;

const StyledBannerInner = styled.div`
  p {
    margin: 0;
  }

  .left-pane-banner___phrase {
    margin-top: var(--margins-md);
  }

  .bchat-button {
    margin-top: var(--margins-sm);
  }
`;
const Hops = styled.div`
  position: absolute;
  left: 47px;
  top: 43px;
`;
