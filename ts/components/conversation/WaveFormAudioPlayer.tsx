import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useEncryptedFileFetch } from '../../hooks/useEncryptedFileFetch';
import { Flex } from '../basic/Flex';
import { BchatIconButton } from '../icon';
import { SpacerSM } from '../basic/Text';
import { MessageModelType } from '../../models/messageType';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { getTheme } from '../../state/selectors/theme';
import { getAudioAutoplay } from '../../state/selectors/userConfig';
import {
  getNextMessageToPlayId,
  getSortedMessagesOfSelectedConversation,
} from '../../state/selectors/conversations';
import { setNextMessageToPlayId } from '../../state/ducks/conversations';

interface WaveFormAudioPlayerProps {
  src: string;
  contentType: string;
  messageId: string;
  direction: MessageModelType;
}

const WaveFormAudioPlayerWithEncryptedFile: React.FC<WaveFormAudioPlayerProps> = props => {
  const { contentType, src, direction, messageId } = props;
  const { urlToLoad } = useEncryptedFileFetch(src, contentType, false);
  const waveformRef = useRef(null);

  const waveSurferRef = useRef<WaveSurfer | null>(null);
  // const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [remainingTime, setRemainingTime] = useState('0.00');
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const darkMode = useSelector(getTheme) === 'dark';
  const dispatch = useDispatch();
  function validColor() {
    const incomingColors = {
      waveColor: darkMode ? '#16191F' : '#ACACAC',
      progressColor: '#2F8FFF',
      cursorColor: '#2F8FFF',
    };

    const outgoingColors = {
      waveColor: '#1C581C',
      progressColor: '#C0FFC9',
      cursorColor: '#C0FFC9',
    };

    const colors = direction === 'incoming' ? incomingColors : outgoingColors;
    return colors;
  }
  const autoPlaySetting = useSelector(getAudioAutoplay);
  const messageProps = useSelector(getSortedMessagesOfSelectedConversation);
  const nextMessageToPlayId = useSelector(getNextMessageToPlayId);

  const getRemainingTime=(surfer:any)=>{
    const totalTime = surfer.getDuration(); // Get total duration in seconds
    const currentTime = surfer.getCurrentTime(); // Get current playtime in seconds
    let remainingTime =totalTime === currentTime ?totalTime :totalTime - currentTime; // Remaining time in seconds
    
    if (remainingTime < 0) {
      remainingTime = 0; // Prevent negative values
    }

    // Convert to mm:ss format
    const minutes = Math.floor(remainingTime / 60);
    const seconds = Math.floor(remainingTime % 60);
    const result=`${minutes}:${seconds.toString().padStart(2, '0')}`
    return result;
    
  }

  useEffect(() => {
    let surfer: any;
    if (waveformRef.current) {
      surfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: validColor().waveColor,
        progressColor: validColor().progressColor,
        cursorColor: validColor().cursorColor,

        barWidth: 3,
        barRadius: 4, // This is crucial for rounded bars
        cursorWidth: 0,
        height: 50,
        barGap: 2,
        barHeight: 2,
      
      });

      surfer.load(urlToLoad);
      surfer.on('ready', () => {
        waveSurferRef.current = surfer;
        const remainingTime=getRemainingTime(surfer);
        setRemainingTime(remainingTime)
        setPlaybackSpeed(surfer.getPlaybackRate());
      });
      surfer.on('play', () => {
        setIsPlaying(true);
       
      });

      surfer.on('pause', () => {
        setIsPlaying(false);
      });
      surfer.on('finish', () => {
        const remainingTime=getRemainingTime(surfer);
        setRemainingTime(remainingTime)
        surfer.seekTo(0);

        onEnded();
      });

      surfer.on('audioprocess', () => {
        if (surfer.isPlaying()) {
          const remainingTime=getRemainingTime(surfer);
          setRemainingTime(remainingTime);
        }
      });
      // setWavesurfer(surfer);
    }
    return () => surfer.destroy();
  }, [urlToLoad]);

  const playAndPause = () => {
    if (waveSurferRef.current) {
      waveSurferRef.current.playPause();
      setIsPlaying(waveSurferRef.current.isPlaying());
    }
  
  };

  const playSpeed = () => {
    if (waveSurferRef.current) {
      let newSpeed = playbackSpeed >= 3 ? 1 : playbackSpeed + 1;
      waveSurferRef.current.setPlaybackRate(newSpeed);
      setPlaybackSpeed(newSpeed);
    }
  };

  useEffect(() => {
    if (messageId !== undefined && messageId === nextMessageToPlayId) {
      waveSurferRef.current?.play();
    }
  }, [messageId, nextMessageToPlayId, waveSurferRef]);

  const triggerPlayNextMessageIfNeeded = (endedMessageId: string) => {
    const justEndedMessageIndex = messageProps.findIndex(
      m => m.propsForMessage.id === endedMessageId
    );
    if (justEndedMessageIndex === -1) {
      // make sure that even with switching convo or stuff, the next message to play is unset
      dispatch(setNextMessageToPlayId(undefined));

      return;
    }

    const isLastMessage = justEndedMessageIndex === 0;

    // to prevent autoplaying as soon as a message is received.
    if (isLastMessage) {
      dispatch(setNextMessageToPlayId(undefined));
      return;
    }
    // justEndedMessageIndex cannot be -1 nor 0, so it is >= 1
    const nextMessageIndex = justEndedMessageIndex - 1;
    // stop auto-playing when the audio messages change author.
    const prevAuthorNumber = messageProps[justEndedMessageIndex].propsForMessage.sender;
    const nextAuthorNumber = messageProps[nextMessageIndex].propsForMessage.sender;
    const differentAuthor = prevAuthorNumber !== nextAuthorNumber;
    if (differentAuthor) {
      dispatch(setNextMessageToPlayId(undefined));
    } else {
      dispatch(setNextMessageToPlayId(messageProps[nextMessageIndex].propsForMessage.id));
    }
  };

  const onEnded = () => {
    // if audio autoplay is enabled, call method to start playing
    // the next playable message
    if (autoPlaySetting === true && messageId) {
      triggerPlayNextMessageIfNeeded(messageId);
    }
  };

  return (
    <div className="audio-message">
      <Flex
        container={true}
        justifyContent="center"
        alignItems="center"
        height="40px"
        margin="10px 0 0 0"
      >

        <BchatIconButton
          iconType={isPlaying ? 'pause' : 'play'}
          iconSize="medium"
          iconColor="#F0F0F0"
          onClick={playAndPause}
          btnRadius='40px'
          btnBgColor='#2F8FFF'
          padding='7px'
          
        />
        <SpacerSM />
        <div
          role="button"
          onClick={playSpeed}
          className={classNames(
            'play-speed-btn',
            direction === 'incoming' && 'play-speed-btn-incoming'
          )}
        >
          {playbackSpeed}x
        </div>
        <SpacerSM />
        <div id="waveform" ref={waveformRef} style={{ width: '300px' }}></div>

        <div className={classNames('timer', `timer-${direction}`)}> {remainingTime}</div>
        {/* <button onClick={playAndPause}>Play/Pause</button> */}
      </Flex>
    </div>
  );
};

export default WaveFormAudioPlayerWithEncryptedFile;
