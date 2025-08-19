import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// tslint:disable-next-line: no-submodule-imports
import useKey from 'react-use/lib/useKey';
import styled from 'styled-components';
import { useVideoCallEventsListener } from '../../hooks/useVideoEventListener';
import { setFullScreenCall } from '../../state/ducks/call';
import {
  getCallIsInFullScreen,
  getHasOngoingCallWithFocusedConvo,
} from '../../state/selectors/call';
import { CallWindowControls } from './CallButtons';
import { StyledVideoElement } from './DraggableCallContainer';
import { Flex } from '../basic/Flex';
import { getSelectedConversation } from '../../state/selectors/conversations';

const CallInFullScreenVisible = styled.div`
  position: absolute;
  z-index: 999;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--color-inbox-background);
  opacity: 1;
  width:100vw;
  align-items: center;

  background-image: url('images/bchat/bgBlurLogo.png');
  height: 100%;
  background-size: cover;
  
`;

const StyledLocalVideoElement = styled.video<{ isVideoMuted: boolean }>`
  width: 18%;
  bottom: 30px;
  right: 10px;
  border-radius: 16px;
  overflow: hidden;
  position: absolute;
  transform: rotateY(180deg);
  opacity: ${props => (props.isVideoMuted ? 0 : 1)};
`;
const StyledFlex=styled(Flex)`
   position: absolute;
    bottom :20px;
    height: 90px;
`
export const CallInFullScreenContainer = () => {
  const dispatch = useDispatch();
  const ongoingCallWithFocused = useSelector(getHasOngoingCallWithFocusedConvo);
  const hasOngoingCallFullScreen = useSelector(getCallIsInFullScreen);
  const selectedConversation = useSelector(getSelectedConversation);
  const [isPortrait,setPortrait]=useState(false)
  const {
    remoteStream,
    remoteStreamVideoIsMuted,
    localStream,
    currentConnectedAudioInputs,
    currentConnectedAudioOutputs,
    currentConnectedCameras,
    isAudioMuted,
    isAudioOutputMuted,
    localStreamVideoIsMuted,
  } = useVideoCallEventsListener('CallInFullScreenContainer', true);

  const videoRefRemote = React.useRef<HTMLVideoElement>(null);
  const videoRefLocal = React.useRef<HTMLVideoElement>(null);

  function toggleFullScreenOFF() {
    dispatch(setFullScreenCall(false));
  }

  useKey('Escape', () => {
    toggleFullScreenOFF();
  });

  useEffect(() => {
    // close fullscreen mode if the remote video gets muted
    if (remoteStreamVideoIsMuted) {
      dispatch(setFullScreenCall(false));
    }
  }, [remoteStreamVideoIsMuted]);

 
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
  }, [remoteStream,hasOngoingCallFullScreen]);
  

  if (!ongoingCallWithFocused || !hasOngoingCallFullScreen) {
    return null;
  }

  if (videoRefRemote?.current) {
    if (videoRefRemote.current.srcObject !== remoteStream) {
      videoRefRemote.current.srcObject = remoteStream;
    }
  }

  if (videoRefLocal?.current) {
    if (videoRefLocal.current.srcObject !== localStream) {
      videoRefLocal.current.srcObject = localStream;
    }
  }

  const validateMemberName = (memberName: any) => {
    if (memberName == selectedConversation?.id) {
      let staringTwoString = memberName.substring(0, 2);
      let lastString = memberName.substring(58, 66);
      return `${staringTwoString}...${lastString}`;
    }
    return memberName;
  };
    
  return (
    <CallInFullScreenVisible className='module-message__attachment-container-displayBgBlur'>
      <StyledVideoElement
        ref={videoRefRemote}
        autoPlay={true}
        isVideoMuted={remoteStreamVideoIsMuted}
        width={isPortrait ?'700px':'100%'}
      />
      <StyledLocalVideoElement
        ref={videoRefLocal}
        autoPlay={true}
        isVideoMuted={localStreamVideoIsMuted}
      />
      <StyledFlex container={true} width='100%' justifyContent='center' alignItems='center'>
      <CallWindowControls
        currentConnectedAudioInputs={currentConnectedAudioInputs}
        currentConnectedAudioOutputs={currentConnectedAudioOutputs}
        currentConnectedCameras={currentConnectedCameras}
        isAudioMuted={isAudioMuted}
        isAudioOutputMuted={isAudioOutputMuted}
        localStreamVideoIsMuted={localStreamVideoIsMuted}
        remoteStreamVideoIsMuted={remoteStreamVideoIsMuted}
        isFullScreen={hasOngoingCallFullScreen}
        selectedName={validateMemberName(
          selectedConversation?.profileName || selectedConversation?.id
        )}
      />
      </StyledFlex>
    </CallInFullScreenVisible>
  );
};
