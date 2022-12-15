export const WALLET = 'WALLET';

export type WalletStateType = {
  balance: number;
  unlocked_balance: number;
  transacations: any;
};
export const updateBalance = (wallet: WalletStateType) => {
  
  return {
    type: WALLET,
    payload: wallet,
  };
};

export const initialWalletState: WalletStateType = {
  balance: 0,
  unlocked_balance: 0,
  transacations: {},
};

export const reducer = (
  state: any = initialWalletState,
  {
    type,
    payload,
  }: {
    type: string;
    payload: WalletStateType;
  }
): WalletStateType => {
  switch (type) {
    case WALLET:
      return payload;
    default:
      return state;
  }
};

export const actions = {
  updateBalance,
};
