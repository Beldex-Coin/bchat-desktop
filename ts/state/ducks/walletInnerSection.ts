
export const WALLETSEND = "WALLETSEND";
export const  WALLETRECEIVED= "WALLETRECEIVED";
export const WALLETTRANSACTION = "WALLETTRANSACTION";


export type WalletInnerSectionStateType = 'walletSend' | 'walletReceived'|'walletTransaction';
export function walletSendPage() {
    return {
        type: WALLETSEND,
        payload:"walletSend"
    }

}
export function walletReceivedPage() {
    return {
        type: WALLETRECEIVED,
        payload:"walletReceived"
    }
}
export function walletTransactionPage() {
    return {
        type: WALLETTRANSACTION,
        payload:"walletTransaction"
    }

}



export const initialWalletInnerSectionState: WalletInnerSectionStateType = "walletSend";

export const reducer = (
    state: WalletInnerSectionStateType = initialWalletInnerSectionState,
    {
        type,
        payload,
    }: {
        type: string;
        payload: any;
    }
): any => {
    switch (type) {
        case WALLETSEND:
            return payload;
        case WALLETRECEIVED:
            return payload;
        case WALLETTRANSACTION:
            return payload;
        default:
            return state;
    }
};

export const action = {
    walletSendPage,
walletReceivedPage,
walletTransactionPage
}