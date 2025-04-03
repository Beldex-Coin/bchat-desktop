import React, { useEffect, useRef, useState } from 'react';
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
import { DurationLabel, StyledCenteredLabel } from './InConversationCallContainer';
import { BchatIcon, BchatIconButton } from '../icon';
import { Flex } from '../basic/Flex';
import { SpacerSM, SpacerXS } from '../basic/Text';
import { getBchatWalletPasswordModal } from '../../state/selectors/modal';

export const DraggableCallWindow = styled.div`
  position: absolute;
  z-index: 9;
  box-shadow: 0px 0px 10px 0px #000000;
  max-height: 300px;
  width: 12vw;
  display: flex;
  flex-direction: column;
  background-color: var(--color-modal-background);
  border: var(--bchat-border);
`;

export const StyledVideoElement = styled.video<{ isVideoMuted: boolean; width?: string ; isLocalOnly?:boolean}>`
  // padding: 0 1rem;
  height: 100%;
  width: ${props => (props.width ? props.width : '100%')};
  opacity: ${props => (props.isVideoMuted ? 0 : 1)};
  display: ${props => (props.isVideoMuted ? 'none' : 'block')};
  object-fit: ${props => (props.isLocalOnly ? 'cover' : 'unset')};
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
  min-width: 85px;
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
const StyledDurationLabel = styled.div`
  padding: 10px;
  z-index:99;
`;
const StyledOngoingBar = styled.div`
  border-radius: 14px;
  background: #108d32;
  box-shadow: 0px 4px 16px 0px rgb(0 0 0 / 25%);
  padding: 10px;
  position: fixed;
  right: 20px;
  top: 50%;
  z-index: 10;
`;
const StyledText = styled.div`
  color: #fff;
  width: 55px;
  ${StyledCenteredLabel} {
    font-size: 14px;
  }
`;
const StyledCloseIcon = styled.div<{ positionX: number; positionY: number }>`
  position: absolute;
  left: ${props => props.positionX + 132}px;
  top: ${props => props.positionY}px;
  z-index: 99;
  display: flex;
  flex-direction: column;
`;
const StyledLocalVideoContainer = styled.div<{isLocalOnly:boolean}>`
  position: absolute;
  right: ${props=>props.isLocalOnly?'0':'5'}px;
  bottom:${props=>props.isLocalOnly?'0':'5'}px;
  width: ${props=>props.isLocalOnly?'164':'81'}px;
  height: ${props=>props.isLocalOnly?'146':'81'}px;
`;
export const DraggableCallContainer = () => {
  const ongoingCallProps = useSelector(getHasOngoingCallWith);
  const selectedConversationKey = useSelector(getSelectedConversationKey);
  const hasOngoingCall = useSelector(getHasOngoingCall);
  const BchatWalletPasswordModalState = useSelector(getBchatWalletPasswordModal);
  const selectedSection = useSelector(getSection);
  const dispatch=useDispatch();

  // the draggable container has a width of 12vw, so we just set it's X to a bit more than this
  const [positionX, setPositionX] = useState(window.innerWidth - (window.innerWidth * 1) / 6);
  // 90 px is a bit below the conversation header height
  const [positionY, setPositionY] = useState(90);
  const [lastPositionX, setLastPositionX] = useState(0);
  const [lastPositionY, setLastPositionY] = useState(0);
  const [barExpandView, setBarExpandView] = useState(false);
  const [isBarView, setBarView] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const DRAG_THRESHOLD = 5;
  const isNotInChat=selectedSection.focusedSection === SectionType.Settings || selectedSection.focusedSection === SectionType.Wallet

  const ongoingCallPubkey = ongoingCallProps?.id;
  const {
    remoteStreamVideoIsMuted,
    remoteStream,
    localStream,
    localStreamVideoIsMuted,
  } = useVideoCallEventsListener('DraggableCallContainer', true);
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
  useEffect(()=>{
    if (videoRefRemote?.current && videoRefLocal?.current) {
    videoRefRemote.current.srcObject = remoteStream;
    videoRefLocal.current.srcObject = localStream;
    }
  },[isBarView])

  const openCallingConversation = () => {
    if (ongoingCallPubkey && (ongoingCallPubkey !== selectedConversationKey || isNotInChat)) {
      dispatch(showLeftPaneSection(SectionType.Message));
      dispatch(setOverlayMode(undefined));
      void openConversationWithMessages({ conversationKey: ongoingCallPubkey, messageId: null });
    }
  };
 
  if (
    !hasOngoingCall ||
    !ongoingCallProps ||
    (ongoingCallPubkey === selectedConversationKey &&
      selectedSection.focusedSection !== SectionType.Settings && selectedSection.focusedSection !== SectionType.Wallet) && !BchatWalletPasswordModalState
  ) {
    return null;
  }
  if (isBarView) {
    return (
      <StyledOngoingBar
        onMouseEnter={() => setBarExpandView(true)}
        onMouseLeave={() => setBarExpandView(false)}
      >
        <Flex container={true} justifyContent="center" alignItems="center">
          <BchatIconButton
            iconType={'replyArrow'}
            iconSize={22}
            btnBgColor="#00BD40"
            iconColor="#FFFFFF"
            btnRadius="50px"
            onClick={() => {
              setBarExpandView(false);
              setBarView(false);
            }}
          />
          <SpacerSM />
          <div>
            <div className={`call-bar-expand-view ${barExpandView ? 'show' : ''}`}>
              <Flex container={true} alignItems="center">
                <BchatIcon
                  iconType={'call'}
                  iconSize={14}
                  iconColor="#fff"
                  fillRule="evenodd"
                  clipRule="evenodd"
                />
                <SpacerXS />
                <StyledText>Ongoing Call</StyledText>
              </Flex>
            </div>
            <StyledText>
              <DurationLabel />
            </StyledText>
          </div>
        </Flex>
      </StyledOngoingBar>
    );
  }

  return (
    <div>
      {!isDragging && (
        <StyledCloseIcon positionX={positionX} positionY={positionY}>
          <BchatIconButton
            iconType={'xWithCircle'}
            // iconColor="#FFFFFF"
            iconSize={22}
            onClick={e => {
              e.stopPropagation();
              if (!isDragging) setBarView(true); // ✅ Prevents drag triggering click
            }}
          />
          <SpacerSM />
          <BchatIconButton
            iconType={'replyArrow'}
            iconSize={22}
            // btnBgColor="#00BD40"
            // iconColor="#FFFFFF"
            btnRadius="50px"
            onClick={() => {
              openCallingConversation();
            }}
          />
        </StyledCloseIcon>
      )}
      <Draggable
        handle=".dragHandle"
        position={{ x: positionX, y: positionY }}
        onStart={(_e: DraggableEvent, data: DraggableData) => {
          setIsDragging(true);
          setLastPositionX(data.x);
          setLastPositionY(data.y);
        }}
        onDrag={(_e: DraggableEvent, data: DraggableData) => {
          if (
            Math.abs(data.x - lastPositionX) > DRAG_THRESHOLD ||
            Math.abs(data.y - lastPositionY) > DRAG_THRESHOLD
          ) {
            setIsDragging(true);
          }
        }}
        onStop={(e: DraggableEvent, data: DraggableData) => {
          e.stopPropagation();
          if (data.x === lastPositionX && data.y === lastPositionY) {
            // drag did not change anything. Consider this to be a click
            openCallingConversation();
          }
          setIsDragging(false);
          setPositionX(data.x);
          setPositionY(data.y);
        }}
      >
        <DraggableCallWindow className="dragHandle">
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
          <StyledLocalVideoContainer  isLocalOnly={remoteStreamVideoIsMuted}>
              <StyledDraggableVideoElement
              isLocalOnly={remoteStreamVideoIsMuted}
                ref={videoRefLocal}
                autoPlay={true}
                isVideoMuted={localStreamVideoIsMuted}
              />
             
            </StyledLocalVideoContainer>
          <StyledDurationLabel>
            <DurationLabel isDraggable={true}  isVideoCall={!remoteStreamVideoIsMuted || !localStreamVideoIsMuted} />
          </StyledDurationLabel>
        </DraggableCallWindow>
      </Draggable>
    </div>
  );
};
