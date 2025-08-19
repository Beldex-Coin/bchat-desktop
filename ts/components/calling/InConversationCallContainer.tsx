import {  useSelector } from 'react-redux';
import React, { useEffect, useRef, useState } from 'react';

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
import { BchatIconButton } from '../icon';
import classNames from 'classnames';

const VideoContainer = styled.div<{ isJustifyCenter?: boolean,isCallModalExpandView?:boolean, isPortrait?: boolean; }>`

  height: 100%;

  width:${props =>
    props.isCallModalExpandView && props.isPortrait
      ? '36%':
      props.isPortrait && !props.isCallModalExpandView
      ?'491px':'100%'};
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: ${({ isJustifyCenter }) => (isJustifyCenter ? 'center' : 'flex-end')};
  // padding-top: 30px; // leave some space at the top for the connecting/duration of the current call
  ${props => props.isPortrait && !props.isCallModalExpandView && `max-height:374px;overflow:hidden;`};
  // max-height:${props => (props.isPortrait && !props.isCallModalExpandView ? '374px' : 'unset')} ;
  // overflow:${props => (props.isPortrait && !props.isCallModalExpandView ? 'hidden' : 'unset')};
  border-radius: 15px;
`;
const StyledLocalVideoContainer = styled.div<{
  isCallModalExpandView?: boolean;
  isTurnOnRemoteVideo?: boolean;
  isTurnOnLocalVideo?: boolean;
 
}>`
//  height:${props => (props.isCallModalExpandView && props.isTurnOnLocalVideo ? '80%' : '100%')};
 height:${props =>
   props.isCallModalExpandView && props.isTurnOnRemoteVideo && props.isTurnOnLocalVideo
     ? '38%'
     : props.isTurnOnRemoteVideo && props.isTurnOnLocalVideo
     ? '29%'
     :props.isTurnOnLocalVideo
      ?"60%"
     : '80%'};
  width:${props =>
      props.isCallModalExpandView && props.isTurnOnRemoteVideo && props.isTurnOnLocalVideo
      ? '18%'
      : props.isTurnOnRemoteVideo && props.isTurnOnLocalVideo
      ? '29%'
      :props.isTurnOnLocalVideo
      ?"35%"
      : '100%'};
  z-index: 0;
  display: flex;
  justify-content:${props =>
    props.isTurnOnRemoteVideo || props.isTurnOnLocalVideo ? 'center' : 'flex-start'};
  align-items:center;
  position:${props =>
    props.isTurnOnRemoteVideo || props.isTurnOnLocalVideo ? 'absolute' : 'unset'}; 
  right:${props =>
    props.isCallModalExpandView && props.isTurnOnRemoteVideo && props.isTurnOnLocalVideo
      ? '-18px'
      : props.isTurnOnRemoteVideo && props.isTurnOnLocalVideo
      ? '5%'
      : '-18px'};
  bottom:${props =>
    props.isCallModalExpandView && props.isTurnOnRemoteVideo && props.isTurnOnLocalVideo
      ? 'unset'
      : props.isTurnOnRemoteVideo && props.isTurnOnLocalVideo
      ? '24%'
      : 'unset'};
     
      ${props =>
        props.isCallModalExpandView && props.isTurnOnRemoteVideo && props.isTurnOnLocalVideo && 
   ` min-width: 228px;
    max-height: 278px;`
      }

  
  
`;
const InConvoCallWindow = styled.div`
  padding: 1rem;
  // display: flex;

  // background-color: var(--color-inbox-background);

  // flex-shrink: 1;
  // min-height: 80px;
  // align-items: center;
  // flex-grow: 1;

  border-radius: 15px;
  background-color: var(--color-hop-bg);
  height: 100%;
  // margin-top: 20px;
`;

const RelativeCallWindow = styled.div`
  position: relative;
`;

const CenteredAvatarInConversation = styled.div<{
  isCallModalExpandView: boolean;
  isNeedBgColor?: boolean;
}>`
 

  display: flex;
  align-items: center;
  width: ${props => (props.isCallModalExpandView ? '250px' : '180px')};
  flex-direction: column;

  margin-left: ${props => (props.isNeedBgColor ? 'auto' : 'unset')};
  background-color: ${props => (props.isNeedBgColor ? '#131313' : 'unset')};
  border-radius: ${props => (props.isNeedBgColor ? '16px' : 'unset')};
  padding: ${props => (props.isNeedBgColor ? '31px 0' : 'unset')};
`;
const UserNameTxt = styled.div`
  font-size: 20px;
`;

export const StyledCenteredLabel = styled.div`

  font-size: 16px;
 
`;

const StyledVideoCallLabel = styled.div`
  font-size: 14px;
  color: white;
  z-index: 99;
`;
type RingingLabelProps = {
  isOutSideInConvo?: boolean;
};

export const RingingLabel = ({ isOutSideInConvo }: RingingLabelProps) => {
  const ongoingCallWithFocusedIsRinging = useSelector(getCallWithFocusedConvoIsOffering);
  const modulatedStr = isOutSideInConvo
    ? window.i18n('ringing')
    : useModuloWithTripleDots(window.i18n('ringing'), 3, 1000);
  if (!ongoingCallWithFocusedIsRinging) {
    return null;
  }
  return <StyledCenteredLabel>{modulatedStr}</StyledCenteredLabel>;
};

export const ConnectingLabel = () => {
  const ongoingCallWithFocusedIsConnecting = useSelector(getCallWithFocusedConvosIsConnecting);

  const modulatedStr = useModuloWithTripleDots(window.i18n('establishingConnection'), 3, 1000);
  if (!ongoingCallWithFocusedIsConnecting) {
    return null;
  }

  return <StyledCenteredLabel>{modulatedStr}</StyledCenteredLabel>;
};

export const DurationLabel = (props: { isVideoCall?: boolean; isDraggable?: boolean }) => {
  const [callDuration, setCallDuration] = useState<undefined | number>(undefined);
  const ongoingCallWithFocusedIsConnected = useSelector(getCallWithFocusedConvosIsConnected);
  const { isVideoCall, isDraggable } = props;

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
  if (isDraggable && isVideoCall) {
    return <StyledVideoCallLabel>{dateString}</StyledVideoCallLabel>;
  }
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


  const [isCallModalExpandView, setIsCallModalExpandView] = useState(false);
  const [isPortrait,setPortrait]=useState(false)

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
  useEffect(() => {
    if (videoRefRemote?.current && videoRefLocal?.current) {
      videoRefRemote.current.srcObject = remoteStream;
      videoRefLocal.current.srcObject = localStream;

    }
  }, [ remoteStream, videoRefRemote, videoRefLocal]);

  useEffect(() => {
    if (!videoRefRemote.current) return;
  
    const videoEl = videoRefRemote.current;
  
    const handleVideoResize = () => {
      if (!videoEl.videoWidth || !videoEl.videoHeight) return;
      if (videoEl.videoWidth < videoEl.videoHeight) {
        setPortrait(true);  // portrait
      } else {
        setPortrait(false); // landscape
      }
    };
  
    // Run once when metadata is loaded
    videoEl.addEventListener("loadedmetadata", handleVideoResize);
    return () => {
      videoEl.removeEventListener("loadedmetadata", handleVideoResize);
    };
  }, [remoteStream]);
  if (isInFullScreen && videoRefRemote.current) {
    // disable this video element so the one in fullscreen is the only one playing audio
    videoRefRemote.current.muted = true;
  }

  if (!ongoingCallWithFocused || !ongoingCallPubkey) {
    return null;
  }
  const validateMemberName = (memberName: any) => {
    if (memberName == selectedConversation?.id) {
      let staringTwoString = memberName.substring(0, 2);
      let lastString = memberName.substring(58, 66);
      return `${staringTwoString}...${lastString}`;
    }
    return memberName;
  };
  const isJustifyCenter =(!remoteStreamVideoIsMuted || !localStreamVideoIsMuted)

  return (
    <div className={classNames('voiceCall', isCallModalExpandView && 'expandView')}>
      <InConvoCallWindow>
        <Flex container={true} justifyContent={'flex-end'}>
          <BchatIconButton
            iconType={isCallModalExpandView ? 'callCollapse' : 'callExpand'}
            iconSize={30}
            onClick={() => {setIsCallModalExpandView(!isCallModalExpandView)}}
          />
        </Flex>
        <RelativeCallWindow>
          <Flex
            container={true}
            justifyContent="center"
            alignItems="center"
            padding={'16px 0 0 0'}
            height={isCallModalExpandView ? 'calc(100vh - 315px)' : 'unset'}
          >
            <VideoContainer isJustifyCenter={isJustifyCenter} isPortrait={isPortrait} isCallModalExpandView={isCallModalExpandView}>
              <StyledVideoElement
                ref={videoRefRemote}
                autoPlay={true}
                isVideoMuted={remoteStreamVideoIsMuted}
                width={isPortrait ?"100%":'90%'}
                height={"100%"}
                isCallModalExpandView={isCallModalExpandView}
              />
              {remoteStreamVideoIsMuted && (
                <CenteredAvatarInConversation isCallModalExpandView={isCallModalExpandView }>
                  <BNSWrapper
                    position={{ left: '75px', top: '72px' }}
                    isBnsHolder={selectedConversation?.isBnsHolder}
                    size={{ width: '20', height: '20' }}
                  >
                    <Avatar
                      size={isCallModalExpandView ? AvatarSize.XXXL : AvatarSize.XXL}
                      pubkey={ongoingCallPubkey}
                    />
                  </BNSWrapper>
                  <SpacerXS />
                  <UserNameTxt>
                    {validateMemberName(
                      selectedConversation?.profileName || selectedConversation?.id
                    )}
                  </UserNameTxt>
                </CenteredAvatarInConversation>
              )}
            </VideoContainer>
            <StyledLocalVideoContainer
              isCallModalExpandView={isCallModalExpandView}
              isTurnOnRemoteVideo={!remoteStreamVideoIsMuted}
              isTurnOnLocalVideo={!localStreamVideoIsMuted}
              
            >
              <StyledVideoElement
                ref={videoRefLocal}
                autoPlay={true}
                muted={true}
                isVideoMuted={localStreamVideoIsMuted}
                width="100%"
                height="100%"
                isCallModalExpandView={isCallModalExpandView}
              />
              {localStreamVideoIsMuted && (
                <CenteredAvatarInConversation
                  isCallModalExpandView={isCallModalExpandView}
                  isNeedBgColor={
                    !remoteStreamVideoIsMuted && localStreamVideoIsMuted 
                  }
                >
                  <BNSWrapper
                    position={{ left: '75px', top: '72px' }}
                    isBnsHolder={conversation?.attributes?.isBnsHolder}
                    size={{ width: '20', height: '20' }}
                  >
                    <Avatar
                      size={isCallModalExpandView ? AvatarSize.XXXL : AvatarSize.XXL}
                      pubkey={ourPubkey}
                    />
                  </BNSWrapper>
                  <SpacerXS />
                  <UserNameTxt>
                    {validateMemberName(conversation.attributes.profileName)}
                  </UserNameTxt>
                </CenteredAvatarInConversation>
              )}
            </StyledLocalVideoContainer>
          </Flex>

          <SpacerLG />

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
            selectedName={validateMemberName(
              selectedConversation?.profileName || selectedConversation?.id
            )}
            isCallModalExpandView={isCallModalExpandView}
          />
        </RelativeCallWindow>
      </InConvoCallWindow>
    </div>
  );
};
