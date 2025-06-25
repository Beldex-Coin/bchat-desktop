import { StateType } from '../reducer';

import { createSelector } from 'reselect';
import { GlobalAudioPlaybackConfigStateType } from '../ducks/globalAudioPlaybackconfig';

export const getGlobalAudioPlaybackconfig = (
  state: StateType
): GlobalAudioPlaybackConfigStateType => state.globalAudioPlaybackConfig;

export const getcurrentPlayingId = createSelector(
  getGlobalAudioPlaybackconfig,
  (state: GlobalAudioPlaybackConfigStateType):string | null => state.currentPlayingId
);

export const getCurrentTime = createSelector(
  getGlobalAudioPlaybackconfig,
  (state: GlobalAudioPlaybackConfigStateType):number => state.currentTime
);
