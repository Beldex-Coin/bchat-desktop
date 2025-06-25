import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type GlobalAudioPlaybackConfigStateType = {
  currentPlayingId: string | null;
  currentTime: number;
}

export const initialGlobalAudioPlaybackConfigState: GlobalAudioPlaybackConfigStateType = {
  currentPlayingId: null,
  currentTime: 0,
};

const globalAudioPlaybackConfigSlice = createSlice({
  name: 'globalAudioPlaybackConfig',
  initialState:initialGlobalAudioPlaybackConfigState,
  reducers: {
    setCurrentPlayingId: (state, action: PayloadAction<string | null>) => {
      state.currentPlayingId = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
  },
});


 const { actions, reducer } = globalAudioPlaybackConfigSlice;
export const {
    setCurrentPlayingId, setCurrentTime 
} = actions;
export const globalAudioPlaybackConfigReducer=reducer;



