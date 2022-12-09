/**
 * This slice is intended for the user configurable settings for the client such as appearance, autoplaying of links etc.
 * Anything setting under the cog wheel tab.
 */
 import { createSlice, PayloadAction } from '@reduxjs/toolkit';

 export interface WalletConfigState {
   walletsendAddress:any | null;
   walletExeCurrency:string|any;
   
 }
 
 export const initialWalletConfigState:WalletConfigState = {
    walletsendAddress:'bd...',
   walletExeCurrency:"USD",

   
 };
 
 const walletConfigSlice = createSlice({
   name: 'walletConfig',
   initialState: initialWalletConfigState,
   reducers: {
     updateSendAddress(state, action: PayloadAction<WalletConfigState> ) {
        return { ...state, walletsendAddress: action.payload };
      },
      updateExeCurrency(state, action: PayloadAction<WalletConfigState> ) {
        return { ...state, walletExeCurrency: action.payload };
      },
     
   },
 });
 
 export const { actions, reducer } = walletConfigSlice;
 export const {
    updateSendAddress,
    updateExeCurrency
 } = actions;
 export const walletConfigReducer = reducer;
 