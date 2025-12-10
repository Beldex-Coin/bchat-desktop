import  { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

import styled from 'styled-components';
import { getSelectedConversationKey } from '../../state/selectors/conversations';
import { getHasOngoingCall, getHasOngoingCallWith } from '../../state/selectors/call';
import { openConversationWithMessages } from '../../state/ducks/conversations';
import { Avatar, AvatarSize } from '../avatar/Avatar';
import { useVideoCallEventsListener } from '../../hooks/useVideoEventListener';
import { getSection } from '../../state/selectors/section';
import { SectionType, setOverlayMode, showLeftPaneSection } from '../../state/ducks/section';
import { ConnectingLabel, DurationLabel, RingingLabel } from './InConversationCallContainer';
import {  BchatIconButton } from '../icon';

import { getBchatWalletPasswordModal } from '../../state/selectors/modal';
import { updateBchatWalletPasswordModal } from '../../state/ducks/modalDialog';
import { isEmpty } from 'lodash';


export const DraggableCallWindow = styled.div`
  position: absolute;
  z-index: 999;
  box-shadow: 0px 0px 10px 0px #000000;
  max-height: 300px;
  min-width: 8vw;
  max-width: 12vw;
  display: flex;
  flex-direction: column;
  background-color: var(--color-modal-background);
  border: var(--bchat-border);
  overflow: hidden;
  border-radius: 10px;
`;

export const StyledVideoElement = styled.video<{
  isVideoMuted: boolean;
  width?: string;
  height?:string;
  isLocalOnly?: boolean;
  isCallModalExpandView?:boolean;
}>`
  // padding: 0 1rem;
  height: ${props => (props.height ? props.height : '100%')};
  width: ${props => (props.width ? props.width : '100%')};
  opacity: ${props => (props.isVideoMuted ? 0 : 1)};
  display: ${props => (props.isVideoMuted ? 'none' : 'block')};
  object-fit: cover;
  border-radius: ${props => (props.isCallModalExpandView ? '30px' : '16px')};
  /*Mirror code starts*/
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg); /* Safari and Chrome */
  -moz-transform: rotateY(180deg); /* Firefox */
  /*Mirror code ends*/
`;

const StyledDraggableVideoElement = styled(StyledVideoElement)`
  padding: 0 0;
`;

const DraggableCallWindowInner = styled.div`
  cursor: pointer;
  min-width: 170px;
  min-height: 85px;
`;

const CenteredAvatarInDraggable = styled.div`
  // position: absolute;
  // width: 100%;
  // top: 0;
  // bottom: 0;
  // left: 0;
  // right: 50%;
  min-height: 85px;
  min-width: 85px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
`;
const StyledDurationLabel = styled.div<{ remoteStreamVideoIsMuted: boolean }>`
  position: ${props => (props.remoteStreamVideoIsMuted ? 'unset' : 'absolute')};
  bottom: 0;
  padding: 5px 10px;
  z-index: 99;
`;


const StyledCloseIcon = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 99;
  display: flex;
  flex-direction: column;
`;
const StyledLocalVideoContainer = styled.div<{ isLocalOnly: boolean }>`
  position: absolute;
  right: ${props => (props.isLocalOnly ? '0' : '5')}px;
  bottom: ${props => (props.isLocalOnly ? '0' : '5')}px;
  width: ${props => (props.isLocalOnly ? '164' : '81')}px;
  height: ${props => (props.isLocalOnly ? '146' : '81')}px;
  overflow: hidden;
  border-radius: 10px;
`;
export const DraggableCallContainer = () => {
  const ongoingCallProps = useSelector(getHasOngoingCallWith);
  const selectedConversationKey = useSelector(getSelectedConversationKey);
  const hasOngoingCall = useSelector(getHasOngoingCall);
  const BchatWalletPasswordModalState = useSelector(getBchatWalletPasswordModal);
  const selectedSection = useSelector(getSection);
  const dispatch = useDispatch();

  // the draggable container has a width of 12vw, so we just set it's X to a bit more than this
  const [positionX, setPositionX] = useState(window.innerWidth - (window.innerWidth * 1) / 6);
  // 90 px is a bit below the conversation header height
  const [positionY, setPositionY] = useState(90);
  const [lastPositionX, setLastPositionX] = useState(0);
  const [lastPositionY, setLastPositionY] = useState(0);
  const DRAG_THRESHOLD = 5;
  const ongoingCallPubkey = ongoingCallProps?.id;
  const {
    remoteStreamVideoIsMuted,
    remoteStream,
    localStream,
    localStreamVideoIsMuted,
  } = useVideoCallEventsListener('DraggableCallContainer', false);
  const videoRefRemote = useRef<HTMLVideoElement>(null);
  const videoRefLocal = useRef<HTMLVideoElement>(null);

  function onWindowResize() {
    if (positionY + 50 > window.innerHeight || positionX + 50 > window.innerWidth) {
      setPositionX(window.innerWidth / 2);
      setPositionY(window.innerHeight / 2);
    }
  }

  useEffect(() => {
    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, [positionX, positionY]);

  if (videoRefRemote?.current && remoteStream) {
    
    if (videoRefRemote.current.srcObject !== remoteStream) {
      videoRefRemote.current.srcObject = remoteStream;
    }
  }
  if (videoRefLocal?.current && localStream) {
    if (videoRefLocal?.current.srcObject !== localStream) {
      videoRefLocal.current.srcObject = localStream;
    }
  }

  useEffect(() => {
    if (videoRefRemote?.current && videoRefLocal?.current) {
      videoRefRemote.current.srcObject = remoteStream;
      videoRefLocal.current.srcObject = localStream;
      
    }
  }, [ remoteStreamVideoIsMuted, localStreamVideoIsMuted]);

  const openCallingConversation = () => {
    if (ongoingCallPubkey)  {
      if (!isEmpty(BchatWalletPasswordModalState)) {
        dispatch(updateBchatWalletPasswordModal(null));
      }
    
      dispatch(showLeftPaneSection(SectionType.Message));
      dispatch(setOverlayMode(undefined));
      void openConversationWithMessages({ conversationKey: ongoingCallPubkey, messageId: null });
    }
  };
 
  const isDragCallValidation = ongoingCallPubkey === selectedConversationKey 
  if (
    !hasOngoingCall ||
    !ongoingCallProps ||
     isDragCallValidation &&
      selectedSection.focusedSection !== SectionType.Settings &&
      selectedSection.focusedSection !== SectionType.Wallet)
   
   {
    return null;
  }


  return (
    <div>
      <Draggable
        handle=".dragHandle"
        position={{ x: positionX, y: positionY }}
        onStart={(_e: DraggableEvent, data: DraggableData) => {
          setLastPositionX(data.x);
          setLastPositionY(data.y);
        }}
        onDrag={(_e: DraggableEvent, data: DraggableData) => {
          if (
            Math.abs(data.x - lastPositionX) > DRAG_THRESHOLD ||
            Math.abs(data.y - lastPositionY) > DRAG_THRESHOLD
          ) {
          }
        }}
        onStop={(e: DraggableEvent, data: DraggableData) => {
          e.stopPropagation();
          // if (data.x === lastPositionX && data.y === lastPositionY) {
          //   // drag did not change anything. Consider this to be a click
          //   openCallingConversation();
          // }
          setPositionX(data.x);
          setPositionY(data.y);
        }}
      >
        <DraggableCallWindow className="dragHandle">
          <StyledCloseIcon >
            <BchatIconButton
              iconType={'replyArrow'}
              iconSize={22}
              btnRadius="50px"
              onClick={() => {
                openCallingConversation();
              }}
            />
          </StyledCloseIcon>
          <DraggableCallWindowInner>
            <StyledDraggableVideoElement
              ref={videoRefRemote}
              autoPlay={true}
              isVideoMuted={remoteStreamVideoIsMuted}
            />
            {remoteStreamVideoIsMuted && ongoingCallPubkey && (
              <CenteredAvatarInDraggable>
                <Avatar size={AvatarSize.XL} pubkey={ongoingCallPubkey} />
              </CenteredAvatarInDraggable>
            )}
          </DraggableCallWindowInner>
          <StyledLocalVideoContainer isLocalOnly={remoteStreamVideoIsMuted}>
            <StyledDraggableVideoElement
              isLocalOnly={remoteStreamVideoIsMuted}
              ref={videoRefLocal}
              autoPlay={true}
              isVideoMuted={localStreamVideoIsMuted}
            />
          </StyledLocalVideoContainer>
          <StyledDurationLabel remoteStreamVideoIsMuted={remoteStreamVideoIsMuted}>
            <RingingLabel isOutSideInConvo={true}/>
            <DurationLabel
              isDraggable={true}
              isVideoCall={!remoteStreamVideoIsMuted || !localStreamVideoIsMuted}
            />
            <ConnectingLabel />
          </StyledDurationLabel>
        </DraggableCallWindow>
      </Draggable>
    </div>
  );
};
