import React, { useState } from 'react';
// tslint:disable: use-simple-attributes no-submodule-imports

import { useDispatch, useSelector } from 'react-redux';
// import { BchatButton, BchatButtonColor, BchatButtonType } from '../../basic/BchatButton';
import { BchatIdEditable } from '../../basic/BchatIdEditable';
import { BchatSpinner } from '../../basic/BchatSpinner';
// import { OverlayHeader } from './OverlayHeader';
import { setOverlayMode } from '../../../state/ducks/section';
import { PubKey } from '../../../bchat/types';
import { ConversationTypeEnum } from '../../../models/conversation';
import { SNodeAPI } from '../../../bchat/apis/snode_api';
//  import { onsNameRegex } from '../../../bchat/apis/snode_api/SNodeAPI';
import { getConversationController } from '../../../bchat/conversations';
// import { ToastUtils } from '../../../bchat/utils';
import { openConversationWithMessages } from '../../../state/ducks/conversations';
import useKey from 'react-use/lib/useKey';

import { getOurNumber } from '../../../state/selectors/user';
import { ToastUtils } from '../../../bchat/utils';
import SmileSymbolIcon from '../../icon/SmileSymbolIcon';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../../basic/BchatButton';

import { SpacerLG, SpacerMD, SpacerSM, SpacerXS } from '../../basic/Text';
import { Avatar, AvatarSize, BNSWrapper } from '../../avatar/Avatar';
import { CopyIconButton } from '../../icon/CopyIconButton';
import { BchatIconButton } from '../../icon';
import { QRView } from '../../dialog/EditProfileDialog';
import { Flex } from '../../basic/Flex';
import { getLeftPaneLists } from '../../../state/selectors/conversations';
import classNames from 'classnames';

export const OverlayMessage = () => {
  const dispatch = useDispatch();

  function closeOverlay() {
    dispatch(setOverlayMode(undefined));
  }

  useKey('Escape', closeOverlay);
  const [pubkeyOrOns, setPubkeyOrOns] = useState('');
  const [loading, setLoading] = useState(false);
  const [dispalyQR, setDispalyQR] = useState(false);
  const ourNumber = useSelector(getOurNumber);
  const ourconvo = getConversationController().get(ourNumber);
  const convoList = useSelector(getLeftPaneLists);
  const convolen: boolean =convoList?.contacts?.length === 0 || false;

  // const title = window.i18n('newBchat');
  // const buttonText = window.i18n('next');
  // const descriptionLong = window.i18n('usersCanShareTheir...');
  // const descriptionLong = window.i18n('shareBchatIdDiscription');

  // const subtitle = window.i18n('enterBchatIDOrBNSName');
  const placeholder = window.i18n('enterBchatID');

  async function handleMessageButtonClick() {
    const pubkeyorOnsTrimmed = pubkeyOrOns.trim();
    if (
      (!pubkeyOrOns || pubkeyOrOns.length !== 66) &&
      !pubkeyOrOns.toLowerCase().endsWith('.bdx')
    ) {
      ToastUtils.pushToastError('invalidPubKey', window.i18n('invalidNumberError')); // or Bns name
      return;
    }
    if (!PubKey.validateWithError(pubkeyorOnsTrimmed)) {
      // this is a pubkey
      await getConversationController().getOrCreateAndWait(
        pubkeyorOnsTrimmed,
        ConversationTypeEnum.PRIVATE
      );

      await openConversationWithMessages({ conversationKey: pubkeyorOnsTrimmed, messageId: null });
      closeOverlay();
    } else {
      setLoading(true);
      try {
        const resolvedBchatID = await SNodeAPI.getBchatIDForOnsName(pubkeyorOnsTrimmed);
        if (PubKey.validateWithError(resolvedBchatID)) {
          throw new Error('Got a resolved BNS but the returned entry is not a valid bchatID');
        }
        // this is a pubkey
        await getConversationController().getOrCreateAndWait(
          resolvedBchatID,
          ConversationTypeEnum.PRIVATE
        );
        await openConversationWithMessages({
          conversationKey: resolvedBchatID,
          messageId: null,
          bns: pubkeyorOnsTrimmed,
        });

        closeOverlay();
      } catch (e) {
        window?.log?.warn('failed to resolve bns name', pubkeyorOnsTrimmed, e);

        ToastUtils.pushToastError('invalidPubKey', window.i18n('failedResolveOns'));
      } finally {
        setLoading(false);
      }
    }
  }
  convolen
  return (
    <div  className={classNames('module-left-pane-overlay')}>
      {/* <OverlayHeader  subtitle={"Enter the Bchat"} /> */}
      <p className="module-left-pane__chatHeader">
        {' '}
        {window.i18n('startConversation')} <SmileSymbolIcon />
      </p>
      {/* <p className="module-left-pane__subHeader" >{window.i18n('BchatID')}</p> */}
      {/* <div className="bchat-description-long">{descriptionLong}</div> */}
      <section>
        <article className="bchatId_input_wrapper">
          <BchatIdEditable
            editable={!loading}
            placeholder={placeholder}
            onChange={setPubkeyOrOns}
            maxLength={66}
            dataTestId="new-bchat-conversation"
            // onPressEnter={handleMessageButtonClick}
          />
          {loading && (
            <div className="module-left-pane-overlay-loadingWrapper">
              <BchatSpinner loading={true} />
            </div>
          )}
          <SpacerSM />
          <BchatButton
            text={'Let’s Bchat'}
            buttonType={BchatButtonType.Default}
            buttonColor={BchatButtonColor.Primary}
            onClick={() => handleMessageButtonClick()}
          />
        </article>
        <SpacerLG />
        {/* <SpacerLG /> */}

        <article className="ourDetails_wrapper">
          <p className="module-left-pane__subHeader" style={{ marginBottom: '10px' }}>
            Your ID
          </p>

          <SpacerLG />
          {!dispalyQR ? (
            <>
              <div className="avatar-Wrapper">
                <BNSWrapper
                  // size={89}
                  position={{ left: '72px', top: '72px' }}
                  isBnsHolder={ourconvo.attributes.isBnsHolder}
                  size={{width:'20',height:'20'}}
                >
                  <Avatar size={AvatarSize.XL} pubkey={ourconvo.id} />
                </BNSWrapper>
                <div className="profile-name"> {ourconvo.getProfileName() || ''}</div>
              </div>
              <SpacerLG />

              <label className="label-txt">your BChat ID</label>
              <SpacerXS />
              <div className="id-Wrapper">
                <p>{ourconvo.id}</p>
                <CopyIconButton content={ourconvo.id} iconSize={22} onClick={() => {}} />
              </div>
              <SpacerMD />
              <label className="label-txt">Beldex Address</label>
              <SpacerXS />
              <div className="id-Wrapper">
                <p className="blue-color">{ourconvo.isWalletAddress()}</p>
                <CopyIconButton
                  content={ourconvo.isWalletAddress()}
                  iconSize={22}
                  onClick={() => {}}
                />
              </div>
              {/* <div className="bchat-description-long">
        Share your BChat ID with your friends. You can find your BChat ID below
      </div> */}
              {/* <BchatIdEditable
        // editable={!loading}
        value={ourNumber}
        // onChange={setPubkeyOrOns}
        dataTestId="new-bchat-conversation"
      /> */}

              {/* <button className="nextButton" onClick={handleMessageButtonClick}>
        {buttonText}
      </button> */}

              <SpacerMD />

              <BchatButton
                buttonColor={BchatButtonColor.Secondary}
                buttonType={BchatButtonType.Default}
                text={'Show QR'}
                disabled={false}
                iconType="qr"
                iconSize={24}
                onClick={() => setDispalyQR(true)}
              />
            </>
          ) : (
            <div>
              <Flex container={true} flexDirection="row" alignItems="center">
                <BchatIconButton
                  iconSize="huge"
                  iconType="KeyboardBackspaceArrow"
                  iconPadding="5px"
                  iconColor="#A9AEBA"
                  onClick={() => setDispalyQR(false)}
                />
                <span className="back-btn-txt">Your QR</span>
              </Flex>
              <SpacerLG />
              <SpacerLG />
              <Flex
                container={true}
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                width="100%"
              >
                <span className="qr-wrapper">
                  <QRView bchatID={ourconvo.id} />
                </span>
                <SpacerXS />
                <span className="qr-txt ">Scan QR to start the Chat</span>
              </Flex>
              <SpacerLG />
              <SpacerLG />
            </div>
          )}
        </article>
      </section>
    </div>
  );
};
