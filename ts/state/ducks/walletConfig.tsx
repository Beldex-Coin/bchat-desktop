/**
 * This slice is intended for the user configurable settings for the client such as appearance, autoplaying of links etc.
 * Anything setting under the cog wheel tab.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingsKey } from '../../data/settings-key';

export interface WalletConfigState {
  walletsendAddress: any | String;
  fiatBalance: string | any;
  walletHeight: number | any;
  walletDecimalValue:any;
  walletRescaning:boolean|any;
  WalletSyncInitiatedWithChat:boolean | any;
  walletSyncBarShowInChat:Boolean|any;
}

const chatwithWallet = window.getSettingValue(SettingsKey.settingsChatWithWallet) || true;

export const initialWalletConfigState: WalletConfigState = {
  walletsendAddress: '',
  fiatBalance: '',
  walletHeight: '',
   walletDecimalValue:'2 - Two (0.00)', 
   walletRescaning:false,
   WalletSyncInitiatedWithChat:chatwithWallet,
   walletSyncBarShowInChat:false

};


 
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
      updateWalletRescaning(state, action: PayloadAction<WalletConfigState>) {

        return { ...state, walletRescaning: action.payload };
      },

      // Wallet With chat
      // updateWalletSyncInitiatedWithChat(state, action: PayloadAction<WalletConfigState>) {
      //   return { ...state, WalletSyncInitiatedWithChat: action.payload };
      // },
      updatewalletSyncBarShowInChat(state, action: PayloadAction<WalletConfigState>) {
        return { ...state, walletSyncBarShowInChat: action.payload };
      },
   },
 });
 
 export const { actions, reducer } = walletConfigSlice;
 export const {
    updateSendAddress,
    updateFiatBalance, 
    updateDecimalValue,
    updateWalletHeight,
    updateWalletRescaning,
    // updateWalletSyncInitiatedWithChat,
    updatewalletSyncBarShowInChat
 } = actions;
 export const walletConfigReducer = reducer;
 
