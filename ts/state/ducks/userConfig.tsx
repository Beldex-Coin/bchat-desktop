/**
 * This slice is intended for the user configurable settings for the client such as appearance, autoplaying of links etc.
 * Anything setting under the cog wheel tab.
 */
import { createSlice } from '@reduxjs/toolkit';

export interface UserConfigState {
  audioAutoplay: boolean;
  showRecoveryPhrasePrompt: boolean;
  hideMessageRequests: boolean;
   multipleSelection:boolean;
}

export const initialUserConfigState = {
  audioAutoplay: false,
  showRecoveryPhrasePrompt: true,
  hideMessageRequests: false,
  multipleSelection:false,
};

const userConfigSlice = createSlice({
  name: 'userConfig',
  initialState: initialUserConfigState,
  reducers: {
    toggleAudioAutoplay: state => {
      state.audioAutoplay = !state.audioAutoplay;
    },
    disableRecoveryPhrasePrompt: state => {
      state.showRecoveryPhrasePrompt = false;
    },
    toggleMessageRequests: state => {
      state.hideMessageRequests = !state.hideMessageRequests;
    },
    showMessageRequestBanner: state => {
      state.hideMessageRequests = false;
    },
    hideMessageRequestBanner: state => {
      state.hideMessageRequests = true;
    },
    hideMultipleSelection: state => {
      state.multipleSelection = false;
    },
    toggleMultipleSelection: state => {
      state.multipleSelection = !state.multipleSelection;
    },
  },
});

const { actions, reducer } = userConfigSlice;
export const {
  toggleAudioAutoplay,
  disableRecoveryPhrasePrompt,
  toggleMessageRequests,
  showMessageRequestBanner,
  hideMessageRequestBanner,
  hideMultipleSelection,
  toggleMultipleSelection
} = actions;
export const userConfigReducer = reducer;
