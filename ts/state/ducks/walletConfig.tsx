/**
 * This slice is intended for the user configurable settings for the client such as appearance, autoplaying of links etc.
 * Anything setting under the cog wheel tab.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WalletConfigState {
  walletsendAddress: any | null;
  walletExeCurrency: string | any;
  walletHeight: number | any;
  walletDecimalValue:any;
}

export const initialWalletConfigState: WalletConfigState = {
  walletsendAddress: '',
  walletExeCurrency: 'USD',
  walletHeight: 100,
  walletDecimalValue:'2 - Two (0.00)',

  
};

 export interface WalletConfigState {
   walletsendAddress:any | null;
   walletExeCurrency:string|any;
   walletDecimalValue:any;
   
 }
 
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
      updateDecimalValue(state, action: PayloadAction<WalletConfigState> ) {
        return { ...state, walletDecimalValue: action.payload };
      },
      updateWalletHeight(state, action: PayloadAction<WalletConfigState>) {
        return { ...state, walletHeight: action.payload };
      },
     
   },
 });
 
 export const { actions, reducer } = walletConfigSlice;
 export const {
    updateSendAddress,
    updateExeCurrency,
    updateDecimalValue,
    updateWalletHeight,
 } = actions;
 export const walletConfigReducer = reducer;
 
