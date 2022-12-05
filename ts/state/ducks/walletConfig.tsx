/**
 * This slice is intended for the user configurable settings for the client such as appearance, autoplaying of links etc.
 * Anything setting under the cog wheel tab.
 */
 import { createSlice, PayloadAction } from '@reduxjs/toolkit';

 export interface WalletConfigState {
   walletsendAddress:any | null;
   
 }
 
 export const initialWalletConfigState:WalletConfigState = {
    walletsendAddress:'bd...',
   
 };
 
 const walletConfigSlice = createSlice({
   name: 'walletConfig',
   initialState: initialWalletConfigState,
   reducers: {
     updateSendAddress(state, action: PayloadAction<WalletConfigState> ) {
        return { ...state, walletsendAddress: action.payload };
      },
     
   },
 });
 
 export const { actions, reducer } = walletConfigSlice;
 export const {
    updateSendAddress,
 } = actions;
 export const walletConfigReducer = reducer;
 