import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { BchatButton, BchatButtonColor, BchatButtonType } from '../../basic/BchatButton';
import { BchatIdEditable } from '../../basic/BchatIdEditable';
import { BchatSpinner } from '../../basic/BchatSpinner';
// import { OverlayHeader } from './OverlayHeader';
import { setOverlayMode, showLeftPaneSection } from '../../../state/ducks/section';
import { PubKey } from '../../../bchat/types';
import { ConversationTypeEnum } from '../../../models/conversation';
import { SNodeAPI } from '../../../bchat/apis/snode_api';
//  import { bnsNameRegex } from '../../../bchat/apis/snode_api/SNodeAPI';
import { getConversationController } from '../../../bchat/conversations';
// import { ToastUtils } from '../../../bchat/utils';
import { openConversationWithMessages } from '../../../state/ducks/conversations';
import useKey from 'react-use/lib/useKey';

import { getOurNumber } from '../../../state/selectors/user';
import { ToastUtils } from '../../../bchat/utils';
import SmileSymbolIcon from '../../icon/SmileSymbolIcon';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../../basic/BchatButton';

import { SpacerLG, SpacerMD, SpacerSM, SpacerXS } from '../../basic/Text';
import { Avatar, AvatarSize } from '../../avatar/Avatar';
import { CopyIconButton } from '../../icon/CopyIconButton';
import { BchatIconButton } from '../../icon';
import { QRView } from '../../dialog/EditProfileDialog';
import { Flex } from '../../basic/Flex';
// import { getLeftPaneLists } from '../../../state/selectors/conversations';
import classNames from 'classnames';
import { getTheme } from '../../../state/selectors/theme';
import { Loader } from '../../BchatWrapperModal';


export const OverlayMessage = () => {
  const dispatch = useDispatch();

  function closeOverlay() {
    dispatch(showLeftPaneSection(0));
    dispatch(setOverlayMode(undefined));
  }

  useKey('Escape', closeOverlay);
  const [pubkeyOrBns, setPubkeyOrBns] = useState('');
  const [loading, setLoading] = useState(false);
  const [dispalyQR, setDispalyQR] = useState(false);
  const ourNumber = useSelector(getOurNumber);
  const ourconvo = getConversationController().get(ourNumber);

  // const convoList = useSelector(getLeftPaneLists);
  const walletAddress: any = localStorage.getItem('userAddress');
  const isDark = useSelector(getTheme) === 'dark';
  // const convolen: boolean =convoList?.contacts?.length === 0 || false;

  // const title = window.i18n('newBchat');
  // const buttonText = window.i18n('next');
  // const descriptionLong = window.i18n('usersCanShareTheir...');
  // const descriptionLong = window.i18n('shareBchatIdDiscription');

  const placeholder = window.i18n('enterBchatIDOrBNSName');

  async function handleMessageButtonClick() {
    const pubkeyOrBnsTrimmed = pubkeyOrBns.trim();
    if (!pubkeyOrBnsTrimmed) {
      ToastUtils.pushToastError('invalidPubKey', window.i18n('errMsgCreateConvo')); // or Bns name
      return;
    }
    if (
      PubKey.validateWithError(pubkeyOrBnsTrimmed) &&
      !pubkeyOrBns.toLowerCase().endsWith('.bdx')
    ) {
      ToastUtils.pushToastError('invalidPubKey', window.i18n('invalidNumberError')); // or Bns name
      return;
    }

    if (!PubKey.validateWithError(pubkeyOrBnsTrimmed)) {
      // this is a pubkey
      await getConversationController().getOrCreateAndWait(
        pubkeyOrBnsTrimmed,
        ConversationTypeEnum.PRIVATE
      );

      await openConversationWithMessages({ conversationKey: pubkeyOrBnsTrimmed, messageId: null });
      closeOverlay();
    } else {
      setLoading(true);
      try {
        const resolvedBchatID = await SNodeAPI.getBchatIDForBnsName(pubkeyOrBnsTrimmed);
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
          bns: pubkeyOrBnsTrimmed,
        });

        closeOverlay();
      } catch (e) {
        window?.log?.warn('failed to resolve bns name', pubkeyOrBnsTrimmed, e);

        ToastUtils.pushToastError('invalidPubKey', window.i18n('failedResolveBns'));
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className={classNames('module-left-pane-overlay')}>
      {/* <OverlayHeader  subtitle={"Enter the Bchat"} /> */}
      <p className="module-left-pane__chatHeader">
        {' '}
        {window.i18n('startConversation')} <SmileSymbolIcon />
      </p>
      {/* <p className="module-left-pane__subHeader" >{window.i18n('bChatID')}</p> */}
      {/* <div className="bchat-description-long">{descriptionLong}</div> */}
      <section>
        <article className="bchatId_input_wrapper">
          <BchatIdEditable
            editable={!loading}
            placeholder={placeholder}
            onChange={setPubkeyOrBns}
            maxLength={66}
            dataTestId="new-bchat-conversation"
          // onPressEnter={handleMessageButtonClick}
          />
          {loading && (
            <Loader>
              <BchatSpinner loading={true} />
            </Loader>
          )}
          <SpacerSM />
          <BchatButton
            text={window.i18n('letsBchat')}
            buttonType={BchatButtonType.Default}
            buttonColor={BchatButtonColor.Primary}
            disabled={!pubkeyOrBns.trim()}
            onClick={() => handleMessageButtonClick()}
          />
        </article>
        <SpacerLG />
        {/* <SpacerLG /> */}

        <article className="ourDetails_wrapper">
          <p className="module-left-pane__subHeader" style={{ marginBottom: '10px' }}>
           {window.i18n('yourID')}
          </p>

          <SpacerLG />
          {!dispalyQR ? (
            <>
              <div className="avatar-Wrapper">
                <Avatar
                  size={AvatarSize.XL}
                  pubkey={ourconvo.id}
                  isBnsHolder={ourconvo.attributes.isBnsHolder}
                />
                <div className="profile-name"> {ourconvo.getProfileName() || ''}</div>
              </div>
              <SpacerLG />

              <label className="label-txt">{window.i18n('yourBchatID')}</label>
              <SpacerXS />
              <div className="id-Wrapper">
                <p>{ourconvo.id}</p>
                <CopyIconButton
                  content={ourconvo.id}
                  // dark: the Figma copy glyph (5296:28850), green
                  iconType={isDark ? 'copy' : undefined}
                  iconColor={isDark ? '#00BC33' : undefined}
                  iconSize={isDark ? 18 : 22}
                  onClick={() => {}}
                />
              </div>
              <SpacerMD />

              <label className="label-txt">{window.i18n('beldexAddress')}</label>
              <SpacerXS />
              <div className="id-Wrapper">
                <p className="blue-color">{walletAddress}</p>
                <CopyIconButton
                  content={walletAddress}
                  // dark: the Figma copy glyph (5296:28850), green
                  iconType={isDark ? 'copy' : undefined}
                  iconColor={isDark ? '#00BC33' : undefined}
                  iconSize={isDark ? 18 : 22}
                  onClick={() => {}}
                />
              </div>
              <SpacerMD />
              <BchatButton
                buttonColor={BchatButtonColor.Secondary}
                buttonType={BchatButtonType.Default}
                text={window.i18n('showQR')}
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
                <span className="back-btn-txt">{window.i18n('yourQR')}</span>
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
                <span className="qr-txt ">{window.i18n('scanQr')}</span>
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
