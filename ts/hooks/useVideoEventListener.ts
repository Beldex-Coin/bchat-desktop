import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// tslint:disable-next-line: no-submodule-imports
import useMountedState from 'react-use/lib/useMountedState';
import {
  addVideoEventsListener,
  CallManagerOptionsType,
  DEVICE_DISABLED_DEVICE_ID,
  InputItem,
  removeVideoEventsListener,
} from '../bchat/utils/calling/CallManager';
import { getSelectedConversationKey } from '../state/selectors/conversations';
import { getCallIsInFullScreen, getHasOngoingCallWithPubkey } from '../state/selectors/call';

export function useVideoCallEventsListener(uniqueId: string, onSame: boolean) {
  const selectedConversationKey = useSelector(getSelectedConversationKey);
  const ongoingCallPubkey = useSelector(getHasOngoingCallWithPubkey);
  const isFullScreen = useSelector(getCallIsInFullScreen);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [localStreamVideoIsMuted, setLocalStreamVideoIsMuted] = useState(true);
  const [ourAudioIsMuted, setOurAudioIsMuted] = useState(false);
  const [currentSelectedAudioOutput, setCurrentSelectedAudioOutput] = useState(
    DEVICE_DISABLED_DEVICE_ID
  );
  const [remoteStreamVideoIsMuted, setRemoteStreamVideoIsMuted] = useState(true);
  const mountedState = useMountedState();

  const [currentConnectedCameras, setCurrentConnectedCameras] = useState<Array<InputItem>>([]);
  const [currentConnectedAudioInputs, setCurrentConnectedAudioInputs] = useState<Array<InputItem>>(
    []
  );

  const [currentConnectedAudioOutputs, setCurrentConnectedAudioOutputs] = useState<
    Array<InputItem>
  >([]);

  useEffect(() => {
    if (
      (onSame && ongoingCallPubkey === selectedConversationKey) ||
      (!onSame && ongoingCallPubkey !== selectedConversationKey)
    ) {
      addVideoEventsListener(uniqueId, (options: CallManagerOptionsType) => {
        const {
          audioInputsList,
          audioOutputsList,
          camerasList,
          isLocalVideoStreamMuted,
          isRemoteVideoStreamMuted,
          localStream: lLocalStream,
          remoteStream: lRemoteStream,
          isAudioMuted,
          currentSelectedAudioOutput: outputSelected,
        } = options;
        if (mountedState()) {
          setLocalStream(lLocalStream);
          setRemoteStream(lRemoteStream);
          setRemoteStreamVideoIsMuted(isRemoteVideoStreamMuted);
          setLocalStreamVideoIsMuted(isLocalVideoStreamMuted);
          setOurAudioIsMuted(isAudioMuted);
          setCurrentSelectedAudioOutput(outputSelected);

          setCurrentConnectedCameras(camerasList);
          setCurrentConnectedAudioInputs(audioInputsList);
          setCurrentConnectedAudioOutputs(audioOutputsList);
        }
      });
    }

    return () => {
      removeVideoEventsListener(uniqueId);
    };
  }, [ongoingCallPubkey, selectedConversationKey, isFullScreen]);

  return {
    currentConnectedAudioInputs,
    currentConnectedAudioOutputs,
    currentSelectedAudioOutput,
    currentConnectedCameras,
    localStreamVideoIsMuted,
    remoteStreamVideoIsMuted,
    localStream,
    remoteStream,
    isAudioMuted: ourAudioIsMuted,
    isAudioOutputMuted: currentSelectedAudioOutput === DEVICE_DISABLED_DEVICE_ID,
  };
}
