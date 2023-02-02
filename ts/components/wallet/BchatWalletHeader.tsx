import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateConfirmModal } from '../../state/ducks/modalDialog';
import { addressbook, setting } from '../../state/ducks/walletSection';
import { BchatButtonColor } from '../basic/BchatButton';
import { BchatIconButton, BchatIconSize, BchatIconType } from '../icon';
import { BchatIcon } from '../icon/BchatIcon';
import { wallet } from '../../wallet/wallet-rpc';
import { updateBalance } from '../../state/ducks/wallet';
import { updateFiatBalance, updateWalletRescaning } from '../../state/ducks/walletConfig';
import { ToastUtils } from '../../bchat/utils';
import { getRescaning } from '../../state/selectors/walletConfig';

export async function rescanModalDialog(rescaning: boolean, dispatch: any) {



  if (!window.globalOnlineStatus) {
    return ToastUtils.pushToastError(
      'internetConnectionError',
      'Please check your internet connection'
    );
  }
  let rescan: any = true;
  let Transactions: any = '';
  dispatch(
    updateConfirmModal({
      title: window.i18n('rescanWallet'),
      message: window.i18n('rescanWalletDiscription'),
      okTheme: BchatButtonColor.Green,
      okText: window.i18n('Rescan'),
      btndisable: rescaning,
      onClickOk: () => {
        console.log('rescan0001', rescaning);

       
        dispatch(updateWalletRescaning(rescan));
        dispatch(updateFiatBalance(Transactions));
        window.setSettingValue('syncStatus', false);
        dispatch(
          updateBalance({
            balance: 0,
            unlocked_balance: 0,
            transacations: [],
          })

        );
        wallet.rescanBlockchain();


        // console.log('rescan0002',rescaning);
      }
    })
  );
}

export const WalletHeader = (props: any) => {
  const dispatch = useDispatch();
  const syncStatus = useSelector(getRescaning);

  return (
    <div className="wallet-header">
      <div className="wallet-header-left-side">
        {/* <BchatIcon iconSize="small" iconType="member"  />
                <div style={{marginLeft:'10px'}}>
                    Munavver
                </div> */}
        <div className="wallet-header-left-side-btn-box">
          <WalletButton
            name={'Address Book'}
            icontype="addressBook"
            iconSize={'medium'}
            submit={() => { dispatch(addressbook()), props.clearStates() }}
          />
        </div>
      </div>
      <div className="wallet-header-right-side">
        <WalletButton
          name={'Rescan'}
          icontype="reload"
          iconSize={'small'}
          submit={() => { 
            rescanModalDialog(!syncStatus, dispatch);
          }}
        />
        <span style={{ marginLeft: '10px' }}>
          <BchatIconButton
            iconSize="large"
            iconType="walletSetting"
            iconColor="#2879fb"
            onClick={() => { dispatch(setting()), props.clearStates() }}
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
