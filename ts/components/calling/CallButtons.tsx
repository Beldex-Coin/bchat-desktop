import { BchatIcon  } from '../icon';
import { animation, contextMenu, Item, Menu } from 'react-contexify';
import { InputItem } from '../../bchat/utils/calling/CallManager';
import { setFullScreenCall } from '../../state/ducks/call';
import { CallManager, ToastUtils } from '../../bchat/utils';
import React, {  useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getHasOngoingCallWithPubkey } from '../../state/selectors/call';
import { DropDownAndToggleButton } from '../icon/DropDownAndToggleButton';
import styled from 'styled-components';
import { Flex } from '../basic/Flex';
import { ConnectingLabel, DurationLabel, RingingLabel } from './InConversationCallContainer';

const videoTriggerId = 'video-menu-trigger-id';
const audioTriggerId = 'audio-menu-trigger-id';
const audioOutputTriggerId = 'audio-output-menu-trigger-id';

export const VideoInputButton = ({
  currentConnectedCameras,
  localStreamVideoIsMuted,
  hideArrowIcon = false,
  isCallModalExpandView
}: {
  currentConnectedCameras: Array<InputItem>;
  localStreamVideoIsMuted: boolean;
  hideArrowIcon?: boolean;
  isCallModalExpandView?:boolean;
}) => {
  return (
    <>
      <DropDownAndToggleButton
        iconType={localStreamVideoIsMuted?'callCameraDisabled':'callCamera'}
        isMuted={localStreamVideoIsMuted}
        onMainButtonClick={() => {
          void handleCameraToggle(currentConnectedCameras, localStreamVideoIsMuted);
        }}
        onArrowClick={e => {
          showVideoInputMenu(currentConnectedCameras, e);
        }}
        hidePopoverArrow={hideArrowIcon}
        isCallModalExpandView={isCallModalExpandView}
      />

      <VideoInputMenu triggerId={videoTriggerId} camerasList={currentConnectedCameras} />
    </>
  );
};

export const AudioInputButton = ({
  currentConnectedAudioInputs,
  isAudioMuted,
  hideArrowIcon = false,
  isCallModalExpandView
}: {
  currentConnectedAudioInputs: Array<InputItem>;
  isAudioMuted: boolean;
  hideArrowIcon?: boolean;
  isCallModalExpandView?:boolean;
}) => {
  return (
    <>
      <DropDownAndToggleButton
        iconType={isAudioMuted?'callMicrophoneDisabled':'callMicrophone'}
        isMuted={isAudioMuted}
        onMainButtonClick={() => {
          void handleMicrophoneToggle(currentConnectedAudioInputs, isAudioMuted);
        }}
        onArrowClick={e => {
          showAudioInputMenu(currentConnectedAudioInputs, e);
        }}
        hidePopoverArrow={hideArrowIcon}
        isCallModalExpandView={isCallModalExpandView}
      />

      <AudioInputMenu triggerId={audioTriggerId} audioInputsList={currentConnectedAudioInputs} />
    </>
  );
};

export const AudioOutputButton = ({
  currentConnectedAudioOutputs,
  isAudioOutputMuted,
  hideArrowIcon = false,
  isCallModalExpandView
}: {
  currentConnectedAudioOutputs: Array<InputItem>;
  isAudioOutputMuted: boolean;
  hideArrowIcon?: boolean;
  isCallModalExpandView?:boolean;
}) => {
  return (
    <>
      <DropDownAndToggleButton
        iconType={isAudioOutputMuted?"callSpeakerDisabled":"callSpeaker"}
        isMuted={isAudioOutputMuted}
        onMainButtonClick={() => {
          void handleSpeakerToggle(currentConnectedAudioOutputs, isAudioOutputMuted);
        }}
        onArrowClick={e => {
          showAudioOutputMenu(currentConnectedAudioOutputs, e);
        }}
        hidePopoverArrow={hideArrowIcon}
        isCallModalExpandView={isCallModalExpandView}
      />

      <AudioOutputMenu
        triggerId={audioOutputTriggerId}
        audioOutputsList={currentConnectedAudioOutputs}
      />
    </>
  );
};

const VideoInputMenu = ({
  triggerId,
  camerasList,
}: {
  triggerId: string;
  camerasList: Array<InputItem>;
}) => {
  return (
    <Menu id={triggerId} animation={animation.fade}>
      {camerasList.map(m => {
        return (
          <Item
            key={m.deviceId}
            onClick={() => {
              void CallManager.selectCameraByDeviceId(m.deviceId);
            }}
          >
            {m.label.substr(0, 40)}
          </Item>
        );
      })}
    </Menu>
  );
};

const AudioInputMenu = ({
  triggerId,
  audioInputsList,
}: {
  triggerId: string;
  audioInputsList: Array<InputItem>;
}) => {
  return (
    <Menu id={triggerId} animation={animation.fade}>
      {audioInputsList.map(m => {
        return (
          <Item
            key={m.deviceId}
            onClick={() => {
              void CallManager.selectAudioInputByDeviceId(m.deviceId);
            }}
          >
            {m.label.substr(0, 40)}
          </Item>
        );
      })}
    </Menu>
  );
};

const AudioOutputMenu = ({
  triggerId,
  audioOutputsList,
}: {
  triggerId: string;
  audioOutputsList: Array<InputItem>;
}) => {
  return (
    <Menu id={triggerId} animation={animation.fade}>
      {audioOutputsList.map(m => {
        return (
          <Item
            key={m.deviceId}
            onClick={() => {
              void CallManager.selectAudioOutputByDeviceId(m.deviceId);
            }}
          >
            {m.label.substr(0, 40)}
          </Item>
        );
      })}
    </Menu>
  );
};

const ShowInFullScreenButton = ({ isFullScreen,isCallModalExpandView }: { isFullScreen: boolean ,isCallModalExpandView?:boolean}) => {
  const dispatch = useDispatch();

  const showInFullScreen = () => {
    if (isFullScreen) {
      dispatch(setFullScreenCall(false));
    } else {
      dispatch(setFullScreenCall(true));
    }
  };

  return (

    <>
    <DropDownAndToggleButton
      iconType={isFullScreen?'fullScreenCollapse':'fullscreen'}
      isMuted={!isFullScreen}
      onMainButtonClick={() => {
        showInFullScreen()
      }}
      onArrowClick={()=>{}}
      hidePopoverArrow={true}
      isCallModalExpandView={isCallModalExpandView}
    />
  </>
   
  );
};

export const HangUpButton = () => {
  const ongoingCallPubkey = useSelector(getHasOngoingCallWithPubkey);

  const handleEndCall = async () => {
    // call method to end call connection
    if (ongoingCallPubkey) {
      await CallManager.USER_hangup(ongoingCallPubkey);
    }
  };

  return (
    <div
      className="hangingBtn"
      role="button"
      style={{
        backgroundColor: '#FC3B3B',
      }}
      onClick={handleEndCall}
    >
      <BchatIcon iconSize={27} iconType="hangup" clipRule="evenodd" fillRule="evenodd" />
    </div>
  );
};

const showAudioInputMenu = (
  currentConnectedAudioInputs: Array<any>,
  e: React.MouseEvent<HTMLDivElement>
) => {
  if (currentConnectedAudioInputs.length === 0) {
    ToastUtils.pushNoAudioInputFound();
    return;
  }
  contextMenu.show({
    id: audioTriggerId,
    event: e,
  });
};

const showAudioOutputMenu = (
  currentConnectedAudioOutputs: Array<any>,
  e: React.MouseEvent<HTMLDivElement>
) => {
  if (currentConnectedAudioOutputs.length === 0) {
    ToastUtils.pushNoAudioOutputFound();
    return;
  }
  contextMenu.show({
    id: audioOutputTriggerId,
    event: e,
  });
};

const showVideoInputMenu = (
  currentConnectedCameras: Array<InputItem>,
  e: React.MouseEvent<HTMLDivElement>
) => {
  if (currentConnectedCameras.length === 0) {
    ToastUtils.pushNoCameraFound();
    return;
  }
  contextMenu.show({
    id: videoTriggerId,
    event: e,
  });
};

const handleCameraToggle = async (
  currentConnectedCameras: Array<InputItem>,
  localStreamVideoIsMuted: boolean
) => {
  if (!currentConnectedCameras.length) {
    ToastUtils.pushNoCameraFound();

    return;
  }
  if (localStreamVideoIsMuted) {
    // select the first one
    await CallManager.selectCameraByDeviceId(currentConnectedCameras[0].deviceId);
  } else {
    await CallManager.selectCameraByDeviceId(CallManager.DEVICE_DISABLED_DEVICE_ID);
  }
};

const handleMicrophoneToggle = async (
  currentConnectedAudioInputs: Array<InputItem>,
  isAudioMuted: boolean
) => {
  if (!currentConnectedAudioInputs.length) {
    ToastUtils.pushNoAudioInputFound();

    return;
  }
  if (isAudioMuted) {
    // selects the first one
    await CallManager.selectAudioInputByDeviceId(currentConnectedAudioInputs[0].deviceId);
  } else {
    await CallManager.selectAudioInputByDeviceId(CallManager.DEVICE_DISABLED_DEVICE_ID);
  }
};

const handleSpeakerToggle = async (
  currentConnectedAudioOutputs: Array<InputItem>,
  isAudioOutputMuted: boolean
) => {
  if (!currentConnectedAudioOutputs.length) {
    ToastUtils.pushNoAudioInputFound();

    return;
  }
  if (isAudioOutputMuted) {
    // selects the first one
    await CallManager.selectAudioOutputByDeviceId(currentConnectedAudioOutputs[0].deviceId);
  } else {
    await CallManager.selectAudioOutputByDeviceId(CallManager.DEVICE_DISABLED_DEVICE_ID);
  }
};

const StyledCallWindowControls = styled.div<{ makeVisible: boolean; isFullScreen: boolean,isCallModalExpandView?:boolean }>`
  
  width: ${props => (props.isFullScreen ? '70%' :props.isCallModalExpandView?'unset':'100%')};
  min-width:${props => (props.isCallModalExpandView?'570px':'100%')} ;
  max-width:${props => (props.isCallModalExpandView?'45%':'100%')} ;
    
  height: 100%;
  padding: 10px 25px;


  display: flex;
  justify-content: space-between;
  align-items:center;

  border-radius: 26px;
  background:${props => (props.isCallModalExpandView || props.isFullScreen?'var(--color-received-message-background)':'unset')} ;
  margin: auto;

  ${props => props.isFullScreen &&`
    max-width:668px;
     min-width:unset;
    ` }
  
   opacity: ${props => (props.makeVisible  ? 1 : 0)};
`;
const UserNameTxtBold = styled.div`
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
`;

export const CallWindowControls = ({
  currentConnectedCameras,
  currentConnectedAudioInputs,
  currentConnectedAudioOutputs,
  isAudioMuted,
  isAudioOutputMuted,
  remoteStreamVideoIsMuted,
  localStreamVideoIsMuted,
  isFullScreen,
  selectedName,
  isCallModalExpandView,
}: {
  isAudioMuted: boolean;
  isAudioOutputMuted: boolean;
  localStreamVideoIsMuted: boolean;
  remoteStreamVideoIsMuted: boolean;
  currentConnectedAudioInputs: Array<InputItem>;
  currentConnectedAudioOutputs: Array<InputItem>;
  currentConnectedCameras: Array<InputItem>;
  isFullScreen: boolean;
  selectedName?: string;
  isCallModalExpandView?:boolean;
}) => {
  const [makeVisible, setMakeVisible] = useState(true);

  const setMakeVisibleTrue = () => {
    setMakeVisible(true);
  };
  const setMakeVisibleFalse = () => {
    setMakeVisible(false);
  };

  useEffect(() => {
    
    let hideTimer: ReturnType<typeof setTimeout>;
  
    const showAndDelayHide = () => {
      if (!isFullScreen) return;
      setMakeVisibleTrue();
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        setMakeVisibleFalse();
      }, 5000); // hide after 5s
    };
  
    document.addEventListener('mousemove', showAndDelayHide);
  
    return () => {
      document.removeEventListener('mousemove', showAndDelayHide);
      clearTimeout(hideTimer);
    };
  }, [isFullScreen, setMakeVisibleTrue, setMakeVisibleFalse]);
  return (
    <StyledCallWindowControls makeVisible={makeVisible} isFullScreen={isFullScreen} isCallModalExpandView={isCallModalExpandView}>
      <Flex
        container={true}
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="center"
      >
        <UserNameTxtBold>{selectedName}</UserNameTxtBold>

        <RingingLabel />
        <ConnectingLabel />
        <DurationLabel />
      </Flex>
      <Flex container={true} flexDirection="row">
        {!remoteStreamVideoIsMuted && <ShowInFullScreenButton isFullScreen={isFullScreen} isCallModalExpandView={isCallModalExpandView} />}
        <AudioOutputButton
          currentConnectedAudioOutputs={currentConnectedAudioOutputs}
          isAudioOutputMuted={isAudioOutputMuted}
          hideArrowIcon={isFullScreen}
          isCallModalExpandView={isCallModalExpandView}
        />
        <VideoInputButton
          currentConnectedCameras={currentConnectedCameras}
          localStreamVideoIsMuted={localStreamVideoIsMuted}
          hideArrowIcon={isFullScreen}
          isCallModalExpandView={isCallModalExpandView}
        />
        <AudioInputButton
          currentConnectedAudioInputs={currentConnectedAudioInputs}
          isAudioMuted={isAudioMuted}
          hideArrowIcon={isFullScreen}
          isCallModalExpandView={isCallModalExpandView}
        />
        
      </Flex>

      <HangUpButton />
    </StyledCallWindowControls>
  );
};
