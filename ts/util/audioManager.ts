
let currentlyPlayingAudio: HTMLAudioElement | null = null;

export const AudioManager = {
  setCurrent(audio: HTMLAudioElement) {
    if (currentlyPlayingAudio && currentlyPlayingAudio !== audio) {
      currentlyPlayingAudio.pause();
    }
    currentlyPlayingAudio = audio;
  },

  clearCurrent(audio: HTMLAudioElement) {
    if (currentlyPlayingAudio === audio) {
      currentlyPlayingAudio = null;
    }
  },
};
