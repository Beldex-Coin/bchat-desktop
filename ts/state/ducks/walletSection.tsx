
export const PASSWORD = "PASSWORD";
export const DASHBOARD = "DASHBOARD";
export const ADDRESSBOOK = "ADDRESSBOOK";
export const SETTING = "SETTING";
export const NODESETTING="NODESETTING";

export type WalletStateType = 'walletPassword' | 'dashboard';
export function password() {
    return {
        type: PASSWORD,
        payload: "walletPassword"
    }

}
export function dashboard() {
    return {
        type: DASHBOARD,
        payload: "dashboard"
    }

}
export function addressbook() {
    return {
        type: ADDRESSBOOK,
        payload: "addressbook"
    }

}
export function setting() {
    return {
        type: SETTING,
        payload: "setting"
    }

}
export function nodeSetting() {
    return {
        type: NODESETTING,
        payload: "nodeSetting"
    }

}
export const initialWalletState: WalletStateType = "walletPassword";

export const reducer = (
    state: WalletStateType = initialWalletState,
    {
        type,
        payload,
    }: {
        type: string;
        payload: any;
    }
): any => {
    switch (type) {
        case PASSWORD:
            return payload;
        case DASHBOARD:
            return payload;
        case ADDRESSBOOK:
            return payload;
        case SETTING:
            return payload;
            case NODESETTING:
                return payload;
        default:
            return state;
    }
};

export const action = {
    password, dashboard,addressbook,setting,nodeSetting
}