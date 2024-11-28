import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { getMessageCountByType } from '../../data/data';
import {
  approveConvoAndSendResponse,
  declineConversationWithConfirm,
} from '../../interactions/conversationInteractions';
import { MessageDirection } from '../../models/messageType';
import { getConversationController } from '../../bchat/conversations';
import { getSelectedConversation } from '../../state/selectors/conversations';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { setOverlayMode } from '../../state/ducks/section';
import DeclineMessageRequest from '../icon/DeclineMessageRequest';

export const ConversationMessageRequestButtons = () => {
  const selectedConversation = useSelector(getSelectedConversation);
  const [hasIncoming, setHasIncomingMsgs] = useState(false);
  const [incomingChecked, setIncomingChecked] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getIncomingMessages() {
      const id = selectedConversation?.id;
      if (id) {
        const msgCount = await getMessageCountByType(
          selectedConversation?.id,
          MessageDirection.incoming
        );
        if (msgCount > 0) {
          setHasIncomingMsgs(true);
        } else {
          setHasIncomingMsgs(false);
        }
        setIncomingChecked(true);
      }
    }
    // tslint:disable-next-line: no-floating-promises
    getIncomingMessages();
  }, []);


  if (!selectedConversation || !hasIncoming || !incomingChecked) {
    return null;
  }

  const convoModel = getConversationController().get(selectedConversation.id);
  const showMsgRequestUI = convoModel && convoModel.isIncomingRequest();

  const handleDeclineConversationRequest = () => {
    console.log("handleDeclineConversationRequest:")
    const customIcon = <DeclineMessageRequest iconSize={30} />
    declineConversationWithConfirm(selectedConversation.id, true, customIcon);
  };

  const handleAcceptConversationRequest = async () => {

    const { id } = selectedConversation;
    const convo = getConversationController().get(selectedConversation.id);
    await convo.setDidApproveMe(true);
    await convo.addOutgoingApprovalMessage(Date.now());
    dispatch(setOverlayMode(undefined));
    await approveConvoAndSendResponse(id, true);

  };

  if (!showMsgRequestUI) {
    return null;
  }

  return (
    <ConversationRequestBanner>
      Allow this person to chat with you?
      <ConversationBannerRow>

        <BchatButton
          buttonColor={BchatButtonColor.Danger}
          buttonType={BchatButtonType.Default}
          text={window.i18n('decline')}
          onClick={handleDeclineConversationRequest}
          dataTestId="decline-message-request"
        />
        <BchatButton
          buttonColor={BchatButtonColor.Green}
          buttonType={BchatButtonType.Default}
          onClick={handleAcceptConversationRequest}
          text={window.i18n('accept')}
          dataTestId="accept-message-request"
        />
      </ConversationBannerRow>
    </ConversationRequestBanner>
  );
};

const ConversationBannerRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--margins-lg);
  justify-content: center;
`;

const ConversationRequestBanner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--margins-lg);
  gap: var(--margins-lg);
  font-size: 22px;
  background: var(--color-MsgReqModal-bg);
  text-align: center;
  font-family: 'poppin-semibold';

`;
