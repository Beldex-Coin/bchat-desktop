import { StateType } from '../reducer';
import { createSelector } from 'reselect';
import { WalletConfigState } from '../ducks/walletConfig';

export const getWalletConfig = (state: StateType): WalletConfigState => state.walletConfig;
export const getWalletSendAddress = createSelector(
    getWalletConfig,
    (state: WalletConfigState): string=> state.walletsendAddress
  );
  export const getFiatBalance = createSelector(
    getWalletConfig,
    (state: WalletConfigState): string=> state.fiatBalance
  );
  export const getwalletDecimalValue = createSelector(
    getWalletConfig,
    (state: WalletConfigState): string=> state.walletDecimalValue
  );
  export const getHeight = createSelector(
    getWalletConfig,
    (state: WalletConfigState): string => state.walletHeight
  );
  export const getRescaning = createSelector(
    getWalletConfig,
    (state: WalletConfigState):boolean => state.walletRescaning
  );

  // wallet with chat
  
  // export const getWalletSyncInitiatedWithChat = createSelector(
  //   getWalletConfig,
  //   (state: WalletConfigState):boolean => state.WalletSyncInitiatedWithChat
  // );
  export const getWalletSyncBarShowInChat = createSelector(
    getWalletConfig,
    (state: WalletConfigState):boolean => state.walletSyncBarShowInChat
  );
  export const getWalletPasswordPopUpFlag = createSelector(
    getWalletConfig,
    (state: WalletConfigState):boolean => state.walletPasswordPopUpFlag
  );
  // export const getwalletFiatCurrency = createSelector(
  //   getWalletConfig,
  //   (state: WalletConfigState): string=> state.walletFiatCurrency
  // );
  
