import React, { useEffect } from 'react';
import {useSelector } from 'react-redux';

import styled from 'styled-components';
import { useConversationBnsHolder, useConversationUsername } from '../../hooks/useParamSelector';
import { ed25519Str } from '../../bchat/onions/onionPath';
import { CallManager } from '../../bchat/utils';
import { callTimeoutMs } from '../../bchat/utils/calling/CallManager';
import { getHasIncomingCall, getHasIncomingCallFrom } from '../../state/selectors/call';
import { Avatar, AvatarSize } from '../avatar/Avatar';
import { SpacerLG, SpacerSM } from '../basic/Text';
import { BchatIcon } from '../icon';
import { useModuloWithTripleDots } from '../../hooks/useModuloWithTripleDots';


export const CallWindow = styled.div`
  position: absolute;
  z-index: 9;
  padding: 1rem;
  top: 50vh;
  left: 50vw;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  background-color:var(--color-hop-bg);
  border: var(--bchat-border);
`;

const IncomingCallAvatarContainer = styled.div`
  padding: 0 0 1rem 0;
  width: 400px;
  text-align: center;
`;
const UserName = styled.div`
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;
const IncomingTxt = styled.div`
  color: var(--color-hop-txt);
  text-align: center;
  font-family: Poppins;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
export const IncomingCallDialog = () => {
  const hasIncomingCall = useSelector(getHasIncomingCall);
  const incomingCallFromPubkey = useSelector(getHasIncomingCallFrom);
  const isBnsHolder = useConversationBnsHolder(incomingCallFromPubkey);
  const modulatedStr = useModuloWithTripleDots('Incoming...', 3, 1000);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (incomingCallFromPubkey) {
      timeout = global.setTimeout(async () => {
        if (incomingCallFromPubkey) {
          window.log.info(
            `call missed with ${ed25519Str(
              incomingCallFromPubkey
            )} as the dialog was not interacted with for ${callTimeoutMs} ms`
          );
          await CallManager.USER_rejectIncomingCallRequest(incomingCallFromPubkey);
        }
      }, callTimeoutMs);
    }

    return () => {
      if (timeout) {
        global.clearTimeout(timeout);
      }
    };
  }, [incomingCallFromPubkey]);

  //#region input handlers
  const handleAcceptIncomingCall = async () => {
    if (incomingCallFromPubkey) {
      await CallManager.USER_acceptIncomingCallRequest(incomingCallFromPubkey);
    }
  };

  const handleDeclineIncomingCall = async () => {
    // close the modal
    if (incomingCallFromPubkey) {
      await CallManager.USER_rejectIncomingCallRequest(incomingCallFromPubkey);
    }
  };
  const from = useConversationUsername(incomingCallFromPubkey);

  if (!hasIncomingCall || !incomingCallFromPubkey) {
    return null;
  }

  if (hasIncomingCall) {
    return (

      <div className="bchat-dialog modal">
        <div className="bchat-modal">
          <IncomingCallAvatarContainer>
            <SpacerLG />
              <Avatar size={AvatarSize.XL} pubkey={incomingCallFromPubkey}  isBnsHolder={isBnsHolder} /> 
            <UserName>{from}</UserName>
          </IncomingCallAvatarContainer>
          <IncomingTxt>{modulatedStr}</IncomingTxt>
          <SpacerSM />
          <div className="bchat-modal__button-group">
            <div
              className="hangingBtn"
              role="button"
              style={{
                backgroundColor: '#FC3B3B',
              }}
              onClick={handleDeclineIncomingCall}
            >
              <BchatIcon iconSize={27} iconType="hangup" clipRule="evenodd" fillRule="evenodd" />
            </div>
            <SpacerLG/>
            <div
              className="hangingBtn"
              role="button"
              style={{
                backgroundColor: '#108D32',
              }}
              onClick={handleAcceptIncomingCall}
            >
              <BchatIcon iconSize={27} iconType="hangIn" clipRule="evenodd" fillRule="evenodd" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};
