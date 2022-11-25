export const WALLET = "WALLET";

export type WalletStateType = {
  balance: number;
  height: number;
};
export const updateBalance = (wallet: WalletStateType) => {
  return {
    type: WALLET,
    payload: wallet,
  };
};

export const initialWalletState: WalletStateType = {
  balance: 0,
  height: 0,
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
