import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useEncryptedFileFetch } from '../../hooks/useEncryptedFileFetch';
import { Flex } from '../basic/Flex';
import { BchatIconButton } from '../icon';
import { SpacerSM } from '../basic/Text';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { getTheme } from '../../state/selectors/theme';
import { useAudioPeaks } from '../../hooks/useAudioPeaks';
import { AudioManager } from '../../util/audioManager';
import { getAudioAutoplay, getIsCurrentlyRecording } from '../../state/selectors/userConfig';
import {
  getNextMessageToPlayId,
  getSortedMessagesOfSelectedConversation,
} from '../../state/selectors/conversations';
import { setNextMessageToPlayId } from '../../state/ducks/conversations';
import { isAudio } from '../../types/Attachment';
import { setCurrentPlayingId, setCurrentTime } from '../../state/ducks/globalAudioPlaybackconfig';
import { getcurrentPlayingId, getCurrentTime } from '../../state/selectors/globalAudioPlaybackConfig';

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
  const minPeakHeight = 0.09;
  const { urlToLoad } = useEncryptedFileFetch(src, contentType, false);
  const slicedSrc = src.slice(-64);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [remainingTime, setRemainingTime] = useState('00:00');
  const [hasStarted, setHasStarted] = useState(false);
  const isDraggingRef = useRef(false);
  const autoPlaySetting = useSelector(getAudioAutoplay);
  const messageProps = useSelector(getSortedMessagesOfSelectedConversation);
  const nextMessageToPlayId = useSelector(getNextMessageToPlayId);
  const isCurrentlyRecording = useSelector(getIsCurrentlyRecording);
  const dispatch = useDispatch();
  const darkMode = useSelector(getTheme) === 'dark';
  const waveColor = direction === 'incoming' ? (darkMode ? '#16191F' : '#ACACAC') : '#1C581C';
  const progressColor = direction === 'incoming' ? '#2F8FFF' : '#C0FFC9';
  const barWidth = 2;
  const gap = 2;
  const totalBars: number = useMemo(() => Math.floor(300 / (barWidth + gap)), [barWidth, gap]);
  const { peaks, duration } = useAudioPeaks(urlToLoad, totalBars, slicedSrc, size);


  const currentPlayingId = useSelector(getcurrentPlayingId);
  const currentTime = useSelector(getCurrentTime);
  const isSameMessage = messageId === currentPlayingId;

  useEffect(() => {
    const audio = audioRef.current;
     const playingTime= isSameMessage  ?  currentTime:audio?.currentTime 
    const progvalue = playingTime ? playingTime / duration : 0;
    drawPeaksWithProgress(peaks, progvalue);
    setRemainingTime(convertMsToSec(duration, playingTime||0));
  }, [duration, peaks]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  useEffect(() => {
    if (messageId === nextMessageToPlayId) {
      togglePlay();
    }
  }, [messageId, nextMessageToPlayId]);

  useEffect(() => {
    if (isSameMessage&& (messageId !== nextMessageToPlayId)) {
      togglePlay();
    }
  }, [messageId]);

  

  const convertMsToSec = useCallback((duration: number, currentTime: number) => {
    let remainingTime = duration === currentTime ? duration : duration - currentTime; // Remaining time in seconds
    if (remainingTime < 0) {
      remainingTime = 0; // Prevent negative values
    }
    // Convert to mm:ss format
    const minutes = Math.floor(remainingTime / 60);
    const seconds = Math.floor(remainingTime % 60);
    const result = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    return result;
  }, []);

  const drawPeaksWithProgress = useCallback(
    (peaks: ReadonlyArray<number>, progress: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);
      // const radius = 2;

      const totalBars = Math.floor(width / (barWidth + gap));
      const step = Math.max(1, Math.floor(peaks.length / totalBars));
      const progressBars = Math.floor(totalBars * progress);
      let lastColor = '';
      for (let i = 0; i < totalBars; i++) {
        const peak = peaks[i * step] || 0;
        const validPeak = Math.max(peak, minPeakHeight);
        const scaled = validPeak * height;
        const barHeight = scaled;
        const maxRadius = Math.min(barWidth, barHeight) / 2;
        const radius = Math.min(2, maxRadius); // Or any value you prefer (e.g., 4), just clamp it

        const y = (height - scaled) / 2;
        const x = i * (barWidth + gap);
        const shouldHighlight = progressBars > 0 && i <= progressBars;
        const currentColor = shouldHighlight ? progressColor : waveColor;

        if (lastColor !== currentColor) {
          ctx.fillStyle = currentColor;
          lastColor = currentColor;
        }
        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.arcTo(x, y, x + barWidth, y, radius);
        ctx.arcTo(x + barWidth, y, x + barWidth, y + scaled, radius);
        ctx.arcTo(x + barWidth, y + scaled, x, y + scaled, radius);
        ctx.arcTo(x, y + scaled, x, y, radius);
        ctx.closePath();
        ctx.fill();
      }
      // calculate cursor pointer
      const preventCursorDisable =
        progressBars >= totalBars - 1
          ? progressBars - 1.2
          : progressBars <= 0
          ? 1.2
          : progressBars + 1.2;
      const cursorX = preventCursorDisable * (barWidth + gap);
      const cursorY = height / 2;
      const dotRadius = isDraggingRef.current ? 8 : 5;

      ctx.beginPath();
      ctx.arc(cursorX, cursorY, dotRadius, 0, Math.PI * 2);

      // Fill
      ctx.fillStyle = '#2F8FFF';
      ctx.fill();

      // Optional: Shadow for better contrast
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    },
    [canvasRef, progressColor, waveColor]
  );

  const animateProgress = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const isAtEnd = audio.currentTime >= audio.duration;
    const progress = isAtEnd ? 0 : audio.currentTime / audio.duration;
    setRemainingTime(convertMsToSec(audio.duration, audio.currentTime));
    drawPeaksWithProgress(peaks, progress);
    const resetCurrentTime = isAtEnd ? 0 : audio.currentTime;
    dispatch(setCurrentTime(resetCurrentTime));
    if (!audio.paused) {
      animationFrameRef.current = requestAnimationFrame(animateProgress);
    }
  }, [convertMsToSec, drawPeaksWithProgress, peaks]);

  const resetGlobalAudioPlayBack=()=>{
    dispatch(setCurrentTime(0));
    dispatch(setCurrentPlayingId(null));
  }

  const togglePlay = (manualTrigger?:boolean) => {
    const audio = audioRef.current;
    if (!audio || !urlToLoad || isCurrentlyRecording) return;
     const resetWaveform=()=>{
      audio.currentTime =  0; 
      handleEnded();
     }
    const playAudio = async() => {
      if (!manualTrigger) {
        const shouldResume =isSameMessage && (messageId !== nextMessageToPlayId);
        audio.currentTime = shouldResume ? (currentTime || 0) : 0;
      }
      AudioManager.setCurrent(audio, () => setHasStarted(false),resetWaveform);
      dispatch(setCurrentPlayingId(messageId));
      audio.play().catch(console.warn);
      setHasStarted(true);
      if (autoPlaySetting && nextMessageToPlayId) {
        dispatch(setNextMessageToPlayId(undefined)); // Reset chain state
      }
    };

    if (audio.readyState >= 3) {
      if (isPlaying && manualTrigger) {
        audio.pause();
        resetGlobalAudioPlayBack()
        setHasStarted(false);
      } else {
        playAudio();
      }
    } else {
      const onCanPlayThrough = () => {
        audio.removeEventListener('canplaythrough', onCanPlayThrough);
        playAudio();
      };
      audio.addEventListener('canplaythrough', onCanPlayThrough);
      audio.load(); // Start buffering
    }
  };
 
  const handlePlay = () => {
    setIsPlaying(true);
    animationFrameRef.current = requestAnimationFrame(animateProgress);
    
  };

  const handlePause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (hasStarted) {    
      audio.currentTime=0;
       onEnded();
    }
    setIsPlaying(false);
    cancelAnimationFrame(animationFrameRef.current!);
  
  };

  const beepSound = new Audio('sound/new_message.mp3');
  const playBeep = () => {
    beepSound.volume = 0.2;
    beepSound.play();
  };

  const handleEnded = () => {
    AudioManager.clearCurrent(audioRef.current!);
    resetGlobalAudioPlayBack();
    setIsPlaying(false);
    setRemainingTime(convertMsToSec(duration, 0));
    drawPeaksWithProgress(peaks, 0); // Reset waveform progress
    cancelAnimationFrame(animationFrameRef.current!);
  };

  const handleSeekStart = () => {
    isDraggingRef.current = true;
  };

  const handleSeekMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    handleCanvasClick(e);
  };

  const handleSeekEnd = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    handleCanvasClick(e);
  };

  const changeSpeed = () => {
    const nextSpeed = playbackSpeed >= 2 ? 1 : playbackSpeed + 0.5;
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
    setPlaybackSpeed(nextSpeed);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const audio = audioRef.current;
    if (!canvas || !audio || !audio.duration) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = clickX / rect.width;
    audio.currentTime = clickRatio * audio.duration;
    setRemainingTime(convertMsToSec(audio.duration, audio.currentTime));
    drawPeaksWithProgress(peaks, clickRatio);

    if (!audio.paused) {
      animationFrameRef.current = requestAnimationFrame(animateProgress);
    }
  };
  let playNextMessageTimeout: ReturnType<typeof setTimeout> | null = null;

  const triggerPlayNextMessageIfNeeded = (endedMessageId: string) => {
    if (playNextMessageTimeout) {
      clearTimeout(playNextMessageTimeout);
      playNextMessageTimeout = null;
    }

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
      const attachments = messageProps[nextMessageIndex].propsForMessage.attachments;
      if (attachments && isAudio(attachments)) {
        playBeep();
        playNextMessageTimeout=setTimeout(() => {
          dispatch(setNextMessageToPlayId(messageProps[nextMessageIndex].propsForMessage.id));
        }, 500);
      }
    }
  };
  const onEnded = () => {
    handleEnded();
    // if audio autoplay is enabled, call method to start playing
    // the next playable message
    if (autoPlaySetting && messageId) {
      triggerPlayNextMessageIfNeeded(messageId);
    }
  };
  return (
    <div className="audio-message">
      <Flex
        container
        justifyContent="center"
        alignItems="center"
        height={`${30}px`}
        margin="10px 0"
      >
        <BchatIconButton
          iconType={isPlaying ? 'pause' : 'play'}
          iconSize="medium"
          iconColor="#F0F0F0"
          onClick={() => togglePlay(true)}
          btnRadius="40px"
          btnBgColor="#2F8FFF"
          padding="7px"
        />
        <SpacerSM />
        <div
          role="button"
          onClick={changeSpeed}
          className={classNames(
            'play-speed-btn',
            direction === 'incoming' && 'play-speed-btn-incoming'
          )}
        >
          {playbackSpeed}x
        </div>
        <SpacerSM />
        <canvas
          ref={canvasRef}
          width={300}
          height={30}
          onClick={handleCanvasClick}
          style={{ cursor: 'pointer' }}
          onMouseDown={handleSeekStart}
          onMouseMove={handleSeekMove}
          onMouseUp={handleSeekEnd}
          onMouseLeave={handleSeekEnd}
        />
        <div style={{ wordBreak: 'keep-all', width: '40px', marginLeft: '5px' }}>
          {remainingTime}
        </div>

        <audio
          ref={audioRef}
          src={urlToLoad || ''}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={onEnded}
          onCanPlayThrough={() => console.info('Audio ready to play')}
          preload="auto"
        />
      </Flex>
    </div>
  );
};

export default WaveFormAudioPlayerWithEncryptedFile;
