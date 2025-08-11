import { useDispatch, useSelector } from 'react-redux';
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
  getIsCallModalType,
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
import { setIsCallModalType } from '../../state/ducks/call';
import classNames from 'classnames';

const VideoContainer = styled.div <{isCallModalExpandView?:boolean,isTurnOnVideo?:boolean}>`
  height: 100%;
  width: 100%;
  z-index: 0;
  display: flex;
  justify-content:${props=>props.isCallModalExpandView && props.isTurnOnVideo?'center':'flex-end'} ;
  align-items:center;
  // padding-top: 30px; // leave some space at the top for the connecting/duration of the current call
`;
const StyledLocalVideoContainer=styled.div <{isCallModalExpandView?:boolean,isTurnOnVideo?:boolean}>`
 height:${props=>props.isCallModalExpandView&&props.isTurnOnVideo?'80%':'100%'};
  width:${props=>props.isCallModalExpandView&&props.isTurnOnVideo?'35%':'100%'};
  z-index: 0;
  display: flex;
  justify-content:${props=>props.isCallModalExpandView && props.isTurnOnVideo?'center':'flex-start'};
  align-items:center;
  position:${props=>props.isCallModalExpandView&&props.isTurnOnVideo?'absolute':'unset'}; 
  right:10px;
`
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
  // position: relative;
  // height: 100%;
  // display: flex;
  // flex-grow: 1;
`;

const CenteredAvatarInConversation = styled.div <{isCallModalExpandView:boolean,isNeedBgColor?:boolean}>`
  // top: -50%;
  // transform: translateY(-50%);
  // position: relative;
  // bottom: 0;
  // left: 0;
  // right: 50%;

  display: flex;
  align-items: center;
  width:${props=>props.isCallModalExpandView? '250px': '157px'};
  flex-direction: column;

  margin-left: ${props=>props.isNeedBgColor?'auto':'unset'};
  background-color:  ${props=>props.isNeedBgColor ?'#131313':'unset'};
  border-radius:  ${props=>props.isNeedBgColor? '16px':'unset'};
  padding:${props=>props.isNeedBgColor? '31px 0':'unset'} ; 
`;
const UserNameTxt = styled.div`
  font-size: 20px;
`;


export const StyledCenteredLabel = styled.div`
  // position: absolute;
  // left: 50%;
  // transform: translateX(-50%);
  // height: min-content;
  // white-space: nowrap;
  // color: var(--color-text);
  // text-shadow: 0px 0px 8px white;
  // z-index: 5;
  font-size: 16px;
  // text-align: center;
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
  const dispatch = useDispatch();
  const isInFullScreen = useSelector(getCallIsInFullScreen);

  const ongoingCallPubkey = useSelector(getHasOngoingCallWithPubkey);
  const ongoingCallWithFocused = useSelector(getHasOngoingCallWithFocusedConvo);
  const selectedConversation = useSelector(getSelectedConversation);
  const videoRefRemote = useRef<HTMLVideoElement>(null);
  const videoRefLocal = useRef<HTMLVideoElement>(null);
  const ourPubkey = UserUtils.getOurPubKeyStrFromCache();
  const conversation = getConversationController().get(ourPubkey);
  const isCallModalType = useSelector(getIsCallModalType);

  const [isCallModalExpandView,setIsCallModalExpandView]=useState(false)

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
  }, [isCallModalType, remoteStream, videoRefRemote, videoRefLocal]);

  if (isInFullScreen && videoRefRemote.current) {
    // disable this video element so the one in fullscreen is the only one playing audio
    videoRefRemote.current.muted = true;
  }
 
  if (isCallModalType !== 'inchat' || !ongoingCallWithFocused || !ongoingCallPubkey) {
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

  return (
    <div
      className={classNames(!localStreamVideoIsMuted && !remoteStreamVideoIsMuted ? 'videoCall' : 'voiceCall',isCallModalExpandView && 'expandView',)}
    >
      <InConvoCallWindow>
        <Flex container={true} justifyContent={'flex-end'}>
          <BchatIconButton
            iconType={isCallModalExpandView ?'callCollapse':'callExpand'}
            iconSize={30}
            onClick={() =>{false && dispatch(setIsCallModalType('drag')),setIsCallModalExpandView(!isCallModalExpandView)}}

          />
        </Flex>
        <RelativeCallWindow>
          <Flex container={true} justifyContent="center" alignItems="center" padding={'16px 0 0 0'} height={isCallModalExpandView ?'calc(100vh - 315px)':'unset'}>
            {/* <VideoContainer style={{justifyContent:remoteStreamVideoIsMuted && localStreamVideoIsMuted? 'flex-end':'center'}} > */}
            <VideoContainer  isCallModalExpandView={isCallModalExpandView} isTurnOnVideo={!remoteStreamVideoIsMuted || !localStreamVideoIsMuted }  >

              <StyledVideoElement
                ref={videoRefRemote}
                autoPlay={true}
                isVideoMuted={remoteStreamVideoIsMuted || !localStreamVideoIsMuted}
                width="90%"
                isCallModalExpandView={isCallModalExpandView}
              
              />
              {remoteStreamVideoIsMuted && (
                <CenteredAvatarInConversation  isCallModalExpandView={isCallModalExpandView} >
                  <BNSWrapper
                    position={{ left: '75px', top: '72px' }}
                    isBnsHolder={selectedConversation?.isBnsHolder}
                    size={{ width: '20', height: '20' }}
                  >
                    <Avatar size={isCallModalExpandView ? AvatarSize.XXXL:AvatarSize.XXL} pubkey={ongoingCallPubkey} />
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

            <StyledLocalVideoContainer isCallModalExpandView={isCallModalExpandView} isTurnOnVideo={!remoteStreamVideoIsMuted || !localStreamVideoIsMuted} >

              <StyledVideoElement
                ref={videoRefLocal}
                autoPlay={true}
                muted={true}
                isVideoMuted={localStreamVideoIsMuted || !remoteStreamVideoIsMuted}
                // width="80%"
                width='95%'
                isCallModalExpandView={isCallModalExpandView}
              />
              {localStreamVideoIsMuted && (
                <CenteredAvatarInConversation isCallModalExpandView={isCallModalExpandView} isNeedBgColor={!remoteStreamVideoIsMuted && localStreamVideoIsMuted}>
                  <BNSWrapper
                    // size={89}
                    position={{ left: '75px', top: '72px' }}
                    isBnsHolder={conversation?.attributes?.isBnsHolder}
                    size={{ width: '20', height: '20' }}
                  >
                    <Avatar size={isCallModalExpandView ? AvatarSize.XXXL:AvatarSize.XXL} pubkey={ourPubkey} />
                  </BNSWrapper>
                  <SpacerXS />
                  <UserNameTxt>
                    {validateMemberName(conversation.attributes.profileName)}
                  </UserNameTxt>
                </CenteredAvatarInConversation>
              )}
            </StyledLocalVideoContainer>
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
