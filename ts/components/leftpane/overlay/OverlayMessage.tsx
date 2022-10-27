import React, { useState } from 'react';
// tslint:disable: use-simple-attributes no-submodule-imports

import { useDispatch ,useSelector} from 'react-redux';
// import { BchatButton, BchatButtonColor, BchatButtonType } from '../../basic/BchatButton';
import { BchatIdEditable } from '../../basic/BchatIdEditable';
import { BchatSpinner } from '../../basic/BchatSpinner';
// import { OverlayHeader } from './OverlayHeader';
import { setOverlayMode } from '../../../state/ducks/section';
import { PubKey } from '../../../bchat/types';
import { ConversationTypeEnum } from '../../../models/conversation';
import { SNodeAPI } from '../../../bchat/apis/snode_api';
 import { onsNameRegex } from '../../../bchat/apis/snode_api/SNodeAPI';
import { getConversationController } from '../../../bchat/conversations';
// import { ToastUtils } from '../../../bchat/utils';
import { openConversationWithMessages } from '../../../state/ducks/conversations';
import useKey from 'react-use/lib/useKey';

import { getOurNumber } from '../../../state/selectors/user';

export const OverlayMessage = () => {
  const dispatch = useDispatch();

  function closeOverlay() {
    dispatch(setOverlayMode(undefined));
  }

  useKey('Escape', closeOverlay);
  const [pubkeyOrOns, setPubkeyOrOns] = useState('');
  const [loading, setLoading] = useState(false);
const ourNumber = useSelector(getOurNumber);


useKey('Enter', handleMessageButtonClick);

  // const title = window.i18n('newBchat');
  const buttonText = window.i18n('next');
  // const descriptionLong = window.i18n('usersCanShareTheir...');
  const descriptionLong = window.i18n('shareBchatIdDiscription')

  // const subtitle = window.i18n('enterBchatIDOrBNSName');
  const placeholder = window.i18n('enterBchatID');

  async function handleMessageButtonClick() {
    const pubkeyorOnsTrimmed = pubkeyOrOns.trim();
  console.log('pubkeyorOnsTrimmed :: ',pubkeyorOnsTrimmed,'pubkeyOrOns ::',pubkeyOrOns);
  
    // if ( !pubkeyOrOns||pubkeyOrOns.length!==66) {
    //   console.log("test1");
    //   ToastUtils.pushToastError('invalidPubKey', window.i18n('invalidNumberError')); // or Bns name
    //   return;
    // }
     if (!PubKey.validateWithError(pubkeyorOnsTrimmed)) {
      console.log("test2");
     
      // this is a pubkey
      await getConversationController().getOrCreateAndWait(
        pubkeyorOnsTrimmed,
        ConversationTypeEnum.PRIVATE
      );

      await openConversationWithMessages({ conversationKey: pubkeyorOnsTrimmed, messageId: null });
      closeOverlay();
    } else {
      
      // this might be an BNS, validate the regex first
      const mightBeOnsName = new RegExp(onsNameRegex, 'g').test(pubkeyorOnsTrimmed);
      console.log("mightBeOnsName ::",mightBeOnsName);
      
      // if (!mightBeOnsName) {
      //   ToastUtils.pushToastError('invalidPubKey', window.i18n('invalidNumberError'));
      //   console.log("test3")
      //   return;
      // }
      console.log("test4");
      
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

        await openConversationWithMessages({ conversationKey: resolvedBchatID, messageId: null });

        closeOverlay();
      } catch (e) {
        window?.log?.warn('failed to resolve bns name', pubkeyorOnsTrimmed, e);
        console.log("test5");
      
        // ToastUtils.pushToastError('invalidPubKey', window.i18n('failedResolveOns'));
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="module-left-pane-overlay">
      {/* <OverlayHeader  subtitle={"Enter the Bchat"} /> */}
      <p className='module-left-pane__chatHeader'>{window.i18n('startConversation')}</p>
      <p className="module-left-pane__subHeader" >{window.i18n('BchatID')}</p>
      <BchatIdEditable
        editable={!loading}
        placeholder={placeholder}
        onChange={setPubkeyOrOns}
        dataTestId="new-bchat-conversation"
        // onPressEnter={handleMessageButtonClick}
      />

      <BchatSpinner loading={loading} />

      <div className="bchat-description-long">{descriptionLong}</div>

      <p className="module-left-pane__subHeader">{window.i18n('BchatID')}</p>
      <BchatIdEditable
        // editable={!loading}
        value={ourNumber}
        // onChange={setPubkeyOrOns}
        dataTestId="new-bchat-conversation"
      />

     <button className='nextButton'  onClick={handleMessageButtonClick}>{buttonText}</button>
      {/* <BchatButton
        buttonColor={BchatButtonColor.Green}
        buttonType={BchatButtonType.BrandOutline}
        text={buttonText}
        disabled={false}
        onClick={handleMessageButtonClick}
      /> */}
    </div>
  );
};
