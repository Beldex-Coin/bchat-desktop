
import { noop } from 'lodash';
import { useEffect, useState } from 'react';
import { computePeaks } from '../components/conversation/AudioPlayback';
import { DEFAULT_MIN_AUDIO_MEMORY_SIZE } from '../bchat/constants';


type WaveformData = {
  peaks: ReadonlyArray<number>;
  duration: number;
};

export function useAudioPeaks(
  audioUrl: string | undefined,
  barCount: number,
  slicedSrc:string,
  size:number
 
): { peaks: ReadonlyArray<number>; hasPeaks: boolean; duration: number } {
  const [waveformData, setWaveformData] = useState<WaveformData | undefined>(
    undefined
  );
  // This effect loads audio file and computes its RMS peak for displaying the
  // waveform.
  useEffect(() => {
    if (!audioUrl) {
      return noop;
    }
    if(size<DEFAULT_MIN_AUDIO_MEMORY_SIZE)
    {
      console.info('MessageAudio: memory size is too low');
      return 
    }

    console.info('MessageAudio: loading audio and computing waveform');
    let canceled = false;
    void (async () => {
      try {
        const { peaks: newPeaks, duration: newDuration } = await computePeaks(
          audioUrl,
          barCount,
          slicedSrc
        );
        if (canceled) {
          return;
        }
        setWaveformData({
          peaks: newPeaks,
          duration: Math.max(newDuration, 1e-23),
        });
      } catch (err) {
        console.error(
          'MessageAudio: computePeaks error,corrupted URL '+audioUrl ,
          err
        ); 
      }
    })();

    return () => {
      canceled = true;
    };
  }, [audioUrl, barCount]);
 
  return {
    duration: waveformData?.duration  ?? 1e-23,
    hasPeaks: waveformData !== undefined,
    peaks: waveformData?.peaks ?? new Array(barCount).fill(0),
  };
}

