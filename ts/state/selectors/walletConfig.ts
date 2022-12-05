
import { StateType } from '../reducer';
import { createSelector } from 'reselect';
import { WalletConfigState } from '../ducks/walletConfig';

export const getWalletConfig = (state: StateType): WalletConfigState => state.walletConfig;
export const getWalletSendAddress = createSelector(
    getWalletConfig,
    (state: WalletConfigState): string=> state.walletsendAddress
  );