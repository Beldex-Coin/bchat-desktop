import React, { useEffect } from 'react';
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

const CallInFullScreenVisible = styled.div`
  position: absolute;
  z-index: 13;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--color-inbox-background);
  // border: var(--bchat-border);
  opacity: 1;
  width:100vw;
`;

const StyledLocalVideoElement = styled.video<{ isVideoMuted: boolean }>`
  height: 30%;
  width: 16%;
  bottom: 0;
  right: 0;
  position: absolute;
  transform: rotateY(180deg);
  opacity: ${props => (props.isVideoMuted ? 0 : 1)};
`;

export const CallInFullScreenContainer = () => {
  const dispatch = useDispatch();
  const ongoingCallWithFocused = useSelector(getHasOngoingCallWithFocusedConvo);
  const hasOngoingCallFullScreen = useSelector(getCallIsInFullScreen);

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

  return (
    <CallInFullScreenVisible onClick={toggleFullScreenOFF}>
      <StyledVideoElement
        ref={videoRefRemote}
        autoPlay={true}
        isVideoMuted={remoteStreamVideoIsMuted}
      />
      <StyledLocalVideoElement
        ref={videoRefLocal}
        autoPlay={true}
        isVideoMuted={localStreamVideoIsMuted}
      />
      <CallWindowControls
        currentConnectedAudioInputs={currentConnectedAudioInputs}
        currentConnectedAudioOutputs={currentConnectedAudioOutputs}
        currentConnectedCameras={currentConnectedCameras}
        isAudioMuted={isAudioMuted}
        isAudioOutputMuted={isAudioOutputMuted}
        localStreamVideoIsMuted={localStreamVideoIsMuted}
        remoteStreamVideoIsMuted={remoteStreamVideoIsMuted}
        isFullScreen={hasOngoingCallFullScreen}
      />
    </CallInFullScreenVisible>
  );
};
