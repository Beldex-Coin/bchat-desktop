import React from 'react';
import { useDispatch } from 'react-redux';
import { updateConfirmModal } from '../../state/ducks/modalDialog';
import { addressbook, setting } from '../../state/ducks/walletSection';
import { BchatButtonColor } from '../basic/BchatButton';
import { BchatIconButton, BchatIconSize, BchatIconType } from '../icon';
import { BchatIcon } from '../icon/BchatIcon';
import { wallet } from '../../wallet/wallet-rpc';
import { updateBalance } from '../../state/ducks/wallet';
import { updateFiatBalance } from '../../state/ducks/walletConfig';
import { ToastUtils } from '../../bchat/utils';

export async function rescanModalDialog() {
  if (!window.globalOnlineStatus) {
    return ToastUtils.pushToastError(
      'internetConnectionError',
      'Please check your internet connection'
    );
  }
  let Transactions:any='';
  window.inboxStore?.dispatch(
    updateConfirmModal({
      title: window.i18n('rescanWallet'),
      message: window.i18n('rescanWalletDiscription'),
      okTheme: BchatButtonColor.Green,
      okText: window.i18n('Rescan'),
      onClickOk: () => {
        wallet.rescanBlockchain();
        window.inboxStore?.dispatch(
          updateBalance({
            balance: 0,
            unlocked_balance: 0,
            transacations: [],
          })
        );
        window.inboxStore?.dispatch(updateFiatBalance(Transactions));
      }
    })
  );
}

export const WalletHeader = (props:any) => {
  const dispatch = useDispatch();
  return (
    <div className="wallet-header">
      <div className="wallet-header-left-side">
        {/* <BchatIcon iconSize="small" iconType="member"  />
                <div style={{marginLeft:'10px'}}>
                    Munavver
                </div> */}
        <div className="wallet-header-left-side-btn-box">
          <WalletButton
            name={'Add Address'}
            icontype="addressBook"
            iconSize={'medium'}
            submit={() => {dispatch(addressbook()),props.clearStates()}}
          />
        </div>
      </div>
      <div className="wallet-header-right-side">
        <WalletButton
          name={'Rescan'}
          icontype="reload"
          iconSize={'small'}
          submit={() => {
            window.setSettingValue('syncStatus', false);
            rescanModalDialog()}}
        />
        <span style={{ marginLeft: '10px' }}>
          <BchatIconButton
            iconSize="large"
            iconType="walletSetting"
            iconColor="#2879fb"
            onClick={() =>{ dispatch(setting()),props.clearStates()}}
          />

          {/* <BchatIcon iconSize="large" iconType="walletSetting"  iconColor="#2879fb" /> */}
        </span>
      </div>
    </div>
  );
};

export const WalletButton = (props: {
  name: string;
  icontype: BchatIconType;
  iconSize: BchatIconSize;
  submit: any;
}) => {
  const { name, icontype, iconSize, submit } = props;

  return (
    <div className="wallet-button" onClick={() => submit()}>
      <BchatIcon iconSize={iconSize} iconType={icontype} />
      <span style={{ marginLeft: '5px' }}>{name}</span>
    </div>
  );
};
