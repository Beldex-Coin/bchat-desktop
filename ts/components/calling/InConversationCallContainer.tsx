import { useSelector } from 'react-redux';
import React, { useRef, useState } from 'react';

import styled from 'styled-components';
import { CallManager, UserUtils } from '../../bchat/utils';
import {
  getCallIsInFullScreen,
  getCallWithFocusedConvoIsOffering,
  getCallWithFocusedConvosIsConnected,
  getCallWithFocusedConvosIsConnecting,
  getHasOngoingCallWithFocusedConvo,
  getHasOngoingCallWithPubkey,
} from '../../state/selectors/call';
import { StyledVideoElement } from './DraggableCallContainer';
import { Avatar, AvatarSize, BNSWrapper } from '../avatar/Avatar';

import { useVideoCallEventsListener } from '../../hooks/useVideoEventListener';
import { useModuloWithTripleDots } from '../../hooks/useModuloWithTripleDots';
import { CallWindowControls } from './CallButtons';
import { DEVICE_DISABLED_DEVICE_ID } from '../../bchat/utils/calling/CallManager';
// tslint:disable-next-line: no-submodule-imports
import useInterval from 'react-use/lib/useInterval';
import moment from 'moment';
import { BchatSpinner } from '../basic/BchatSpinner';
import { getSelectedConversation } from '../../state/selectors/conversations';
import { getConversationController } from '../../bchat/conversations';
import { Flex } from '../basic/Flex';
import { SpacerLG, SpacerMD, SpacerXS } from '../basic/Text';

const VideoContainer = styled.div`
  height: 100%;
  width: 100%;
  z-index: 0;
  display:flex;
  justify-content:center;
  // padding-top: 30px; // leave some space at the top for the connecting/duration of the current call
`;

const InConvoCallWindow = styled.div`
  padding: 1rem;
  // display: flex;

  // background-color: var(--color-inbox-background);

  // flex-shrink: 1;
  // min-height: 80px;
  // align-items: center;
  // flex-grow: 1;

  border-radius: 32px;
  background-color: var(--color-hop-bg);
  height: 100%;
  // margin-top: 20px;
`;

const RelativeCallWindow = styled.div`
  // position: relative;
  // height: 100%;
  // display: flex;
  // flex-grow: 1;
`;

const CenteredAvatarInConversation = styled.div`
  // top: -50%;
  // transform: translateY(-50%);
  // position: relative;
  // bottom: 0;
  // left: 0;
  // right: 50%;

  display: flex;
  justify-content: center;
  align-items: center;
  width: 157px;
  flex-direction: column;
`;
const UserNameTxt = styled.div`
  font-size: 20px;
`;

const StyledCenteredLabel = styled.div`
  // position: absolute;
  // left: 50%;
  // transform: translateX(-50%);
  // height: min-content;
  // white-space: nowrap;
  color: var(--color-text);
  // text-shadow: 0px 0px 8px white;
  // z-index: 5;
  font-size: 22px;
  text-align: center;
`;

const RingingLabel = () => {
  const ongoingCallWithFocusedIsRinging = useSelector(getCallWithFocusedConvoIsOffering);
  const modulatedStr = useModuloWithTripleDots(window.i18n('ringing'), 3, 1000);
  if (!ongoingCallWithFocusedIsRinging) {
    return null;
  }
  return <StyledCenteredLabel>{modulatedStr}</StyledCenteredLabel>;
};

const ConnectingLabel = () => {
  const ongoingCallWithFocusedIsConnecting = useSelector(getCallWithFocusedConvosIsConnecting);

  const modulatedStr = useModuloWithTripleDots(window.i18n('establishingConnection'), 3, 1000);
  if (!ongoingCallWithFocusedIsConnecting) {
    return null;
  }

  return <StyledCenteredLabel>{modulatedStr}</StyledCenteredLabel>;
};

const DurationLabel = () => {
  const [callDuration, setCallDuration] = useState<undefined | number>(undefined);
  const ongoingCallWithFocusedIsConnected = useSelector(getCallWithFocusedConvosIsConnected);

  useInterval(() => {
    const duration = CallManager.getCurrentCallDuration();
    if (duration) {
      setCallDuration(duration);
    }
  }, 100);

  if (!ongoingCallWithFocusedIsConnected || !callDuration || callDuration < 0) {
    return null;
  }

  const ms = callDuration * 1000;
  const d = moment.duration(ms);

  // tslint:disable-next-line: restrict-plus-operands
  const dateString = Math.floor(d.asHours()) + moment.utc(ms).format(':mm:ss');
  return <StyledCenteredLabel>{dateString}</StyledCenteredLabel>;
};

const StyledSpinner = styled.div<{ fullWidth: boolean }>`
  height: 100%;
  width: ${props => (props.fullWidth ? '100%' : '50%')};
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: -1;
`;

export const VideoLoadingSpinner = (props: { fullWidth: boolean }) => {
  return (
    <StyledSpinner fullWidth={props.fullWidth}>
      <BchatSpinner loading={true} />
    </StyledSpinner>
  );
};

// tslint:disable-next-line: max-func-body-length
export const InConversationCallContainer = () => {
  const isInFullScreen = useSelector(getCallIsInFullScreen);

  const ongoingCallPubkey = useSelector(getHasOngoingCallWithPubkey);
  const ongoingCallWithFocused = useSelector(getHasOngoingCallWithFocusedConvo);
  const selectedConversation = useSelector(getSelectedConversation);
  const videoRefRemote = useRef<HTMLVideoElement>(null);
  const videoRefLocal = useRef<HTMLVideoElement>(null);
  const ourPubkey = UserUtils.getOurPubKeyStrFromCache();
  const conversation = getConversationController().get(ourPubkey);

  const {
    currentConnectedAudioInputs,
    currentConnectedCameras,
    currentConnectedAudioOutputs,
    currentSelectedAudioOutput,
    localStream,
    localStreamVideoIsMuted,
    remoteStream,
    remoteStreamVideoIsMuted,
    isAudioMuted,
    isAudioOutputMuted,
  } = useVideoCallEventsListener('InConversationCallContainer', true);

  if (videoRefRemote?.current && videoRefLocal?.current) {
    if (videoRefRemote.current.srcObject !== remoteStream) {
      videoRefRemote.current.srcObject = remoteStream;
    }

    if (videoRefLocal.current.srcObject !== localStream) {
      videoRefLocal.current.srcObject = localStream;
    }

    if (videoRefRemote.current) {
      if (currentSelectedAudioOutput === DEVICE_DISABLED_DEVICE_ID) {
        videoRefRemote.current.muted = true;
      } else {
        void (videoRefRemote.current as any)?.setSinkId(currentSelectedAudioOutput);
        videoRefRemote.current.muted = false;
      }
    }
  }

  if (isInFullScreen && videoRefRemote.current) {
    // disable this video element so the one in fullscreen is the only one playing audio
    videoRefRemote.current.muted = true;
  }

  if (!ongoingCallWithFocused || !ongoingCallPubkey) {
    return null;
  }
  console.log(
    'videoRefLocal -->',
    videoRefLocal,
    'localStreamVideoIsMuted--->',
    localStreamVideoIsMuted,
    'localStream -->',
    localStream
  );

  const validateMemberName = (memberName: any) => {
    if (memberName.length == 66) {
      let staringTwoString = memberName.substring(0, 2);
      let lastString = memberName.substring(58, 66);
      return `(${staringTwoString}...${lastString})`;
    }
    return memberName;
  };

  return (
    <div
      className={!localStreamVideoIsMuted && !remoteStreamVideoIsMuted ? 'videoCall' : 'voiceCall'}
    >
      <InConvoCallWindow>
        <RelativeCallWindow>
          <Flex container={true} justifyContent="center" alignItems="center" padding={'16px 0 0 0'}>
            <VideoContainer>
              <StyledVideoElement
                ref={videoRefRemote}
                autoPlay={true}
                isVideoMuted={remoteStreamVideoIsMuted || !localStreamVideoIsMuted}
                  width='50%'
              />
              {remoteStreamVideoIsMuted && (
                <CenteredAvatarInConversation>
                  <BNSWrapper
                    // size={89}
                    position={{ left: '75px', top: '72px' }}
                    isBnsHolder={selectedConversation?.isBnsHolder}
                    size={{ width: '20', height: '20' }}
                  >
                    <Avatar size={AvatarSize.XL} pubkey={ongoingCallPubkey} />
                  </BNSWrapper>
                  <SpacerXS />
                  <UserNameTxt>{validateMemberName(selectedConversation?.profileName)}</UserNameTxt>
                </CenteredAvatarInConversation>
              )}
            </VideoContainer>

            {/* {localStreamVideoIsMuted && (
              <CenteredAvatarInConversation>
                <BNSWrapper
                  // size={89}
                  position={{ left: '75px', top: '72px' }}
                  isBnsHolder={conversation?.attributes?.isBnsHolder}
                  size={{ width: '20', height: '20' }}
                >
                  <Avatar size={AvatarSize.XL} pubkey={ourPubkey} />
                </BNSWrapper>
                <SpacerXS />
                <UserNameTxt>{conversation.attributes.profileName}</UserNameTxt>
              </CenteredAvatarInConversation>
            )} */}

            <VideoContainer>
              <StyledVideoElement
                ref={videoRefLocal}
                autoPlay={true}
                muted={true}
                isVideoMuted={localStreamVideoIsMuted || !remoteStreamVideoIsMuted}
                width='76%'
              />
              {localStreamVideoIsMuted && (
                <CenteredAvatarInConversation>
                  <BNSWrapper
                    // size={89}
                    position={{ left: '75px', top: '72px' }}
                    isBnsHolder={conversation?.attributes?.isBnsHolder}
                    size={{ width: '20', height: '20' }}
                  >
                    <Avatar size={AvatarSize.XL} pubkey={ourPubkey} />
                  </BNSWrapper>
                  <SpacerXS />
                  <UserNameTxt>{conversation.attributes.profileName}</UserNameTxt>
                </CenteredAvatarInConversation>
              )}
            </VideoContainer>
          </Flex>

          {!localStreamVideoIsMuted && !remoteStreamVideoIsMuted && (
            <div className="remote-video">
              <VideoContainer>
                <StyledVideoElement
                  ref={videoRefRemote}
                  autoPlay={true}
                  isVideoMuted={remoteStreamVideoIsMuted}

                />
              </VideoContainer>
            </div>
          )}

          <SpacerLG />
          <RingingLabel />
          <ConnectingLabel />
          <DurationLabel />
          <SpacerMD />
          <CallWindowControls
            currentConnectedAudioInputs={currentConnectedAudioInputs}
            currentConnectedCameras={currentConnectedCameras}
            isAudioMuted={isAudioMuted}
            currentConnectedAudioOutputs={currentConnectedAudioOutputs}
            isAudioOutputMuted={isAudioOutputMuted}
            localStreamVideoIsMuted={localStreamVideoIsMuted}
            remoteStreamVideoIsMuted={remoteStreamVideoIsMuted}
            isFullScreen={isInFullScreen}
          />
        </RelativeCallWindow>
      </InConvoCallWindow>
      <div className="local-video">
        {!localStreamVideoIsMuted && !remoteStreamVideoIsMuted && (
          <VideoContainer>
            <StyledVideoElement
              ref={videoRefLocal}
              autoPlay={true}
              muted={true}
              isVideoMuted={localStreamVideoIsMuted}
            />
          </VideoContainer>
        )}
      </div>
    </div>
  );
};
