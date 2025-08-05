
let currentlyPlayingAudio: HTMLAudioElement | null = null;
let onAudioStopped: (() => void) | null = null;
let onAudioResetWaveform:(() => void) | null = null;
export const AudioManager = {
  setCurrent(audio: HTMLAudioElement, onStop?: () => void,onResetWaveform?:()=>void) {
    if (currentlyPlayingAudio && currentlyPlayingAudio !== audio) {
      currentlyPlayingAudio.pause();
      if (onAudioStopped) onAudioStopped(); // Notify previous component
      if(onAudioResetWaveform) onAudioResetWaveform();
    }
    currentlyPlayingAudio = audio;
    onAudioStopped = onStop || null;
    onAudioResetWaveform=onResetWaveform || null;
  },

  clearCurrent(audio: HTMLAudioElement) {
    if (currentlyPlayingAudio === audio) {
      currentlyPlayingAudio = null;
      if (onAudioStopped) onAudioStopped(); // Notify stopped
      onAudioStopped = null;
      onAudioResetWaveform=null;
    }
  },
};
