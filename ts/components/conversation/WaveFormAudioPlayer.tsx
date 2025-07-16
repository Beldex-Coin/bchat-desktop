import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useEncryptedFileFetch } from '../../hooks/useEncryptedFileFetch';
import { useAudioPeaks } from '../../hooks/useAudioPeaks';
import { useDispatch, useSelector } from 'react-redux';
import { getAudioAutoplay, getIsCurrentlyRecording } from '../../state/selectors/userConfig';
import { getTheme } from '../../state/selectors/theme';
import { getNextMessageToPlayId, getSortedMessagesOfSelectedConversation } from '../../state/selectors/conversations';
import { setNextMessageToPlayId } from '../../state/ducks/conversations';
import { isAudio } from '../../types/Attachment';
import { useAudioPlayer } from '../basic/AudioPlayerContext';
import WaveformBars from './WaveformBar';
import { Flex } from '../basic/Flex';
import { SpacerSM } from '../basic/Text';
import { BchatIconButton } from '../icon';
import classNames from 'classnames';
import { debounce } from 'lodash';

interface Props {
  src: string;
  contentType: string;
  messageId: string;
  direction: 'incoming' | 'outgoing';
  size: number;
}

const WaveFormAudioPlayerWithEncryptedFile: React.FC<Props> = ({
  src,
  contentType,
  direction,
  size,
  messageId,
}) => {

  const slicedSrc = src.slice(-64);
  const { urlToLoad } = useEncryptedFileFetch(src, contentType, false);
  const { peaks, duration } = useAudioPeaks(urlToLoad, Math.floor(300 / 4), slicedSrc, size);
  const dispatch = useDispatch();
  const messageProps = useSelector(getSortedMessagesOfSelectedConversation);
  const nextMessageToPlayId = useSelector(getNextMessageToPlayId);
  const isCurrentlyRecording = useSelector(getIsCurrentlyRecording);
  const autoPlaySetting = useSelector(getAudioAutoplay);
  const darkMode = useSelector(getTheme) === 'dark';
  const { currentPlayingId, playAudio, pauseAudio, seekTo, audioRef,handleAudioEnded } = useAudioPlayer();
  const isSameMessage = messageId == currentPlayingId;
  const [isPlaying, setIsPlaying] = useState(isSameMessage ? !audioRef.current?.audio?.current.paused:false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [remainingTime, setRemainingTime] = useState('00:00');
  const [progressTime,setProgressTime] =useState(audioRef.current?.audio?.current.currentTime);
  const isDraggingRef = useRef(false);
  const waveColor = direction === 'incoming' ? (darkMode ? '#16191F' : '#ACACAC') : '#1C581C';
  const progressColor = direction === 'incoming' ? '#2F8FFF' : '#C0FFC9';
  const beepRef = useRef<HTMLAudioElement | null>(null);
  const audioContextDuration=isSameMessage?audioRef.current?.audio?.current.duration:duration;

  const convertMsToSec = useCallback((duration: number, currentTime: number) => {
    let remaining = duration === currentTime ? duration : duration - currentTime;
    if (remaining < 0) remaining = 0;
    const minutes = Math.floor(remaining / 60);
    const seconds = Math.floor(remaining % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    setRemainingTime(convertMsToSec(duration, 0));
  }, [peaks, duration, convertMsToSec]);

  useEffect(() => {
    if (messageId === nextMessageToPlayId) {
      handlePlayPause();
    }
  }, [nextMessageToPlayId]);

  
  useEffect(() => {
    const audio = audioRef.current?.audio?.current;
    if (!audio || !isSameMessage) return;
    const handlePlay = () => {
      if (audio) {
        audio.playbackRate = playbackSpeed;
      }
    };
    const handlePause = () => {
      setIsPlaying(false)
    };
    const handleEnded = () => {
      handleAudioEnded()
      onEnded();
      
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
  
    return () => {
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioRef, isSameMessage, convertMsToSec, duration]);

  useEffect(() => {
    if (!isSameMessage || !audioRef.current?.audio?.current) return;
  
    let raf: number;
    let cancelled = false;
    const updateTime = () => {
      const audio = audioRef.current?.audio?.current;
      if (!audio || !duration || cancelled) return;
      setProgressTime(audioRef.current?.audio?.current.currentTime);
      setRemainingTime(convertMsToSec(duration, audio.currentTime));
      raf = requestAnimationFrame(updateTime);
    };
  
    raf = requestAnimationFrame(updateTime);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf)};
  }, [isSameMessage, audioRef, duration, convertMsToSec]);
    
useEffect(() => {
  beepRef.current = new Audio('sound/new_message.mp3');
  beepRef.current.volume = 0.2;
}, []);

const playBeep = () => {
  if (!beepRef.current) return;
  const sound = beepRef.current.cloneNode(true) as HTMLAudioElement;
  sound.volume = 0.2;
  sound.play().catch((err) => {
    console.warn('Beep sound failed to play:', err);
  });
};

const resetCurrentAudio=()=>{
  setIsPlaying(false)
}
  const handlePlayPause = (manualTrigger?:boolean) => {
    if (isCurrentlyRecording) return;
    if ((manualTrigger && !isPlaying)  || !isSameMessage ) {
      playAudio(messageId, urlToLoad || '',resetCurrentAudio);
      setIsPlaying(true);
      if(nextMessageToPlayId)dispatch(setNextMessageToPlayId(undefined));
      
    } else {
      pauseAudio();
    }
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSameMessage || !audioRef.current?.audio?.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = clickX / rect.width;
    seekTo(clickRatio * duration);
  };

  const handleSeekStart = () => {
    if (!isPlaying) return;
    setIsPlaying(false);
    isDraggingRef.current = true;
    audioRef.current?.audio?.current?.pause();
  };

  const handleSeekMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      handleWaveformClick(e);
    }
  };

  const handleSeekEnd = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    setIsPlaying(true);
    isDraggingRef.current = false;
    handleWaveformClick(e);
    audioRef.current?.audio?.current?.play();
  };

  const changeSpeed = () => {
    const nextSpeed = playbackSpeed >= 2 ? 1 : playbackSpeed + 0.5;
    if (audioRef.current?.audio?.current) {
      audioRef.current.audio.current.playbackRate = nextSpeed;
    }
    setPlaybackSpeed(nextSpeed);
  };

// Debounced dispatcher for autoplay next message
const debouncedPlayNextMessage = useMemo(() => 
  debounce((nextId: string) => {
    dispatch(setNextMessageToPlayId(nextId));
  }, 500), [dispatch]);



  const triggerPlayNextMessageIfNeeded = (endedMessageId: string) => {

    const justEndedMessageIndex = messageProps.findIndex(m => m.propsForMessage.id === endedMessageId);
    if (justEndedMessageIndex === -1) {
      dispatch(setNextMessageToPlayId(undefined));
      return;
    }

    const isLastMessage = justEndedMessageIndex === 0;
    if (isLastMessage) {
      dispatch(setNextMessageToPlayId(undefined));
      return;
    }

    const nextMessageIndex = justEndedMessageIndex - 1;
    const prevAuthor = messageProps[justEndedMessageIndex].propsForMessage.sender;
    const nextAuthor = messageProps[nextMessageIndex].propsForMessage.sender;

    if (prevAuthor !== nextAuthor) {
      dispatch(setNextMessageToPlayId(undefined));
    } else {
      const attachments = messageProps[nextMessageIndex].propsForMessage.attachments;
      if (attachments && isAudio(attachments)) {
        playBeep();
        debouncedPlayNextMessage(messageProps[nextMessageIndex].propsForMessage.id)
      }
    }
  };

  const onEnded = () => {
    setIsPlaying(false);
    setRemainingTime(convertMsToSec(duration, 0));
    if (autoPlaySetting && messageId) {
      triggerPlayNextMessageIfNeeded(messageId);
    }
  };
  const barProgressValue=isSameMessage && progressTime &&(progressTime !== duration )
  ?progressTime / Math.max(audioContextDuration , 0)
  : 0

  return (
    <div className="audio-message">
      <Flex container justifyContent="center" alignItems="center" height="30px" margin="10px 0">
        <BchatIconButton
          iconType={isPlaying ? 'pause' : 'play'}
          iconSize="medium"
          iconColor="#F0F0F0"
          onClick={()=>handlePlayPause(true) }
          btnRadius="40px"
          btnBgColor="#2F8FFF"
          padding="7px"
        />
        <SpacerSM />
        <div
          role="button"
          onClick={changeSpeed}
          className={classNames('play-speed-btn', direction === 'incoming' && 'play-speed-btn-incoming')}
        >
          {playbackSpeed}x
        </div>
        <SpacerSM />
        <WaveformBars
          peaks={peaks}
          progress={barProgressValue}
          onMouseDown={handleSeekStart}
          isDragging={isDraggingRef.current}
          onMouseMove={handleSeekMove}
          onMouseUp={handleSeekEnd}
          onMouseLeave={handleSeekEnd}
          waveColor={waveColor}
          progressColor={progressColor}
        />
        <div style={{ wordBreak: 'keep-all', width: '40px', marginLeft: '5px' }}>
          {remainingTime}
        </div>
      </Flex>
    </div>
  );
};

export default WaveFormAudioPlayerWithEncryptedFile;
