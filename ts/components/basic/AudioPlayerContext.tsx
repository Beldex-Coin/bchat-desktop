
import React, { createContext, useContext, useRef, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';

interface AudioPlayerContextValue {
  currentPlayingId: string | null;
  playAudio: (id: string, src: string,resetPlayBtn:()=>void) => void;
  pauseAudio: () => void;
  seekTo: (time: number) => void;
  audioRef: React.RefObject<any>;
  playNextMessageInChain?: () => void,
  handleAudioEnded: () => void,
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | undefined>(undefined);

export const useAudioPlayer = () => {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error("useAudioPlayer must be used inside AudioPlayerProvider");
  return ctx;
};

let onResetCurrentAudio:()=>void|undefined;
export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<any>(null);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);

  const playAudio = (id: string, src: string,resetCurrentAudio:()=>void) => {
    if (audioRef.current?.audio?.current) {
      const audioEl = audioRef.current.audio.current;
      if (audioEl.src !== src) {

        if(onResetCurrentAudio)
        {
          onResetCurrentAudio()
        }
        audioEl.src = src;
      }
      onResetCurrentAudio=resetCurrentAudio;
      setCurrentPlayingId(id);
      audioEl.play().catch(console.error);
    }
  };

  const pauseAudio = () => {
    audioRef.current?.audio?.current?.pause();
    // setCurrentPlayingId(null);
  };

  const seekTo = (time: number) => {
    if (audioRef.current?.audio?.current) {
      audioRef.current.audio.current.currentTime = time;
    }
  };
 
  const handleAudioEnded = () => {
    if (audioRef.current?.audio?.current) {
      const audioEl = audioRef.current.audio.current;
      audioEl.src = '';
      audioEl.remove();
      audioEl.srcObject = null;
    }
    
    setCurrentPlayingId(null);
  };


  return (
    <AudioPlayerContext.Provider value={{ playAudio, pauseAudio, seekTo, currentPlayingId, audioRef,handleAudioEnded }}>
      {children}
      <AudioPlayer
        ref={audioRef}
        autoPlayAfterSrcChange={false}
        autoPlay={false}
        showJumpControls={false}
        customAdditionalControls={[]}
        customVolumeControls={[]}
        preload="metadata"
        onEnded={() => handleAudioEnded()}
      />
    </AudioPlayerContext.Provider>
  );    
};


