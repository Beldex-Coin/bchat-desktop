/**
 * This slice is intended for the user configurable settings for the client such as appearance, autoplaying of links etc.
 * Anything setting under the cog wheel tab.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { walletSettingsKey } from '../../data/settings-key';

export interface WalletConfigState {
  walletsendAddress: any | String;
  fiatBalance: string | any;
  walletHeight: number | any;
  walletDecimalValue:any;
  // walletFiatCurrency:any;
}

export const initialWalletConfigState: WalletConfigState = {
  walletsendAddress: '',
  fiatBalance: '',
  walletHeight: '',
   walletDecimalValue:'2 - Two (0.00)', 
  //  walletFiatCurrency:'USD'
  // walletDecimalValue:window.getSettingValue(walletSettingsKey.settingsDecimal), 

  
};

//  export interface WalletConfigState {
//    walletsendAddress:any | null;
//    fiatBalance:string|any;
//    walletDecimalValue:any;
//    walletFiatCurrency:any
   
//  }
 
 const walletConfigSlice = createSlice({
   name: 'walletConfig',
   initialState: initialWalletConfigState,
   reducers: {
     updateSendAddress(state, action: PayloadAction<WalletConfigState> ) {
        return { ...state, walletsendAddress: action.payload };
      },
      updateFiatBalance(state, action: PayloadAction<WalletConfigState> ) {
        return { ...state, fiatBalance: action.payload };
      },
      updateDecimalValue(state, action: PayloadAction<WalletConfigState> ) {
        return { ...state, walletDecimalValue: action.payload };
      },
      updateWalletHeight(state, action: PayloadAction<WalletConfigState>) {
        return { ...state, walletHeight: action.payload };
      },
      // updateWalletFiatCurrency(state, action: PayloadAction<WalletConfigState>) {
      //   return { ...state, walletFiatCurrency: action.payload };
      // },
     
   },
 });
 
 export const { actions, reducer } = walletConfigSlice;
 export const {
    updateSendAddress,
    updateFiatBalance, 
    updateDecimalValue,
    updateWalletHeight,
    // updateWalletFiatCurrency,
 } = actions;
 export const walletConfigReducer = reducer;
 
