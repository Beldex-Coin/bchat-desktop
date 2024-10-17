import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useEncryptedFileFetch } from '../../hooks/useEncryptedFileFetch';
import { Flex } from '../basic/Flex';
import { BchatIconButton } from '../icon';
import { SpacerSM } from '../basic/Text';
import { MessageModelType } from '../../models/messageType';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { getTheme } from '../../state/selectors/theme';

interface WaveFormAudioPlayerProps {
  src: string;
  contentType: string;
  messageId: string;
  direction: MessageModelType;
}

const WaveFormAudioPlayerWithEncryptedFile: React.FC<WaveFormAudioPlayerProps> = props => {
  const { contentType, src, direction } = props;
  const { urlToLoad } = useEncryptedFileFetch(src, contentType, false);
  const waveformRef = useRef(null);

  const waveSurferRef = useRef<WaveSurfer | null>(null);
  // const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLength, setAudioLength] = useState('')
  const [remainingTime, setRemainingTime] = useState('0.00');
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const darkMode = useSelector(getTheme) === 'dark';
  console.log("remainingTime:", remainingTime);
  console.log("audioLength:", audioLength)
  function validColor() {
    const incomingColors = {
      waveColor: darkMode ? '#647494' : '#ACACAC',
      progressColor: '#2F8FFF',
      cursorColor: '#2F8FFF',
    };

    const outgoingColors = {
      waveColor: '#00AA2E',
      progressColor: '#00DE16',
      cursorColor: '#00DE16',
    };

    const colors = direction === 'incoming' ? incomingColors : outgoingColors;
    // console.log(direction, { colors });
    return colors;
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
        barRadius: 1, // This is crucial for rounded bars
        cursorWidth: 0,
        height: 50,
        barGap: 2,
        barHeight: 2,
      });

      surfer.load(urlToLoad);

      surfer.on('ready', () => {
        waveSurferRef.current = surfer;
        const remainingTime = (surfer.getDuration() - surfer.getCurrentTime()) / 60;
        setRemainingTime(remainingTime.toFixed(2));
        setAudioLength(remainingTime.toFixed(2))
        setPlaybackSpeed(surfer.getPlaybackRate());
      });
      surfer.on('play', () => {
        setIsPlaying(true);
      });

      surfer.on('pause', () => {
        setIsPlaying(false);
      });

      surfer.on('audioprocess', () => {
        if (surfer.isPlaying()) {
          const totalTime = surfer.getDuration();
          const currentTime = surfer.getCurrentTime();
          const remainingTime = (totalTime - currentTime) / 60;
          if (remainingTime.toFixed(2) == '0.00') {
            const remainingTime = (surfer.getDuration()) / 60;
             setRemainingTime(remainingTime.toFixed(2));
          } else {
            setRemainingTime(remainingTime.toFixed(2));
          }
        }
      });
      // setWavesurfer(surfer);
    }
    console.log('surfer', surfer)
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

  return (
    <div className="audio-message">
      <Flex container={true} justifyContent="center" alignItems="center" height='40px' margin='10px 0 0 0'>
        <BchatIconButton
          iconType={isPlaying ? 'pause' : 'play'}
          iconSize="medium"
          iconColor="#F0F0F0"
          onClick={playAndPause}
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
        <div ref={waveformRef} style={{ width: '300px' }}></div>
        <div className={classNames("timer", `timer-${direction}`)}> {remainingTime}</div>
        {/* <button onClick={playAndPause}>Play/Pause</button> */}
      </Flex>
    </div>
  );
};

export default WaveFormAudioPlayerWithEncryptedFile;
