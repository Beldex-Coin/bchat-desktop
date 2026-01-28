// import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateConfirmModal } from '../../state/ducks/modalDialog';
import { addressbook } from '../../state/ducks/walletSection';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { BchatIconSize, BchatIconType } from '../icon';
import { BchatIcon } from '../icon/BchatIcon';
import { wallet } from '../../wallet/wallet-rpc';
import { updateBalance } from '../../state/ducks/wallet';
import {
  updateFiatBalance,
  updateWalletHeight,
  updateWalletRescaning,
} from '../../state/ducks/walletConfig';
import { ToastUtils, UserUtils } from '../../bchat/utils';
import { getRescaning } from '../../state/selectors/walletConfig';
import { useConversationBnsHolder } from '../../hooks/useParamSelector';
import { Avatar, AvatarSize } from '../avatar/Avatar';

export async function rescanModalDialog(rescaning: boolean, dispatch: any) {
  if (!window.globalOnlineStatus) {
    return ToastUtils.pushToastError(
      'internetConnectionError',
      'Please check your internet connection'
    );
  }
  let rescan: any = true;
  let Transactions: any = '';
  let wallHeight: any = 0;
  dispatch(
    updateConfirmModal({
      title: window.i18n('rescanWallet'),
      message: window.i18n('rescanWalletDiscription'),
      okTheme: BchatButtonColor.Primary,
      okText: window.i18n('Rescan'),
      btndisable: rescaning,
      iconShow: true,
      customIcon: <BchatIcon iconType='rotatedArrow' iconSize={30} />,
      onClickOk: () => {
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
        dispatch(updateWalletHeight(wallHeight));
        wallet.rescanBlockchain();
      },
    })
  );
}

export const WalletHeader = () => {
  const dispatch = useDispatch();
  const ourPubkey: any = UserUtils.getOurPubKeyFromCache();
  const syncStatus = useSelector(getRescaning);
  const isBnsHolder = useConversationBnsHolder(ourPubkey);

  return (
    <div className="wallet-header">
      <div className="wallet-header-left-side">
        <Avatar size={AvatarSize.M} pubkey={ourPubkey} isBnsHolder={isBnsHolder}/>
        <span className="header-txt">{window.i18n('WalletSettingsTitle')}</span>
      </div>
      <div className="wallet-header-right-side">
        <div className="wallet-header-left-side-btn-box" style={{ marginRight: '15px' }}>
          <BchatButton
            iconType="addressBook"
            iconSize={20}
            fillRule="evenodd"
            clipRule="evenodd"
            text="Address Book"
            buttonType={BchatButtonType.Medium}
            buttonColor={BchatButtonColor.Secondary}
            onClick={() => {
              dispatch(addressbook());
              // props.clearStates()
            }}
          />
          {/* <WalletButton
            name={'Address Book'}
            icontype="addressBook"
            iconSize={'medium'}
            submit={() => {
              dispatch(addressbook()), props.clearStates();
            }}
          /> */}
        </div>
        <WalletButton
          // name={''}
          icontype="rotatedArrow"
          iconSize={20}
          submit={() => {
            rescanModalDialog(!syncStatus, dispatch);
          }}
        />
        {/* <span style={{ marginLeft: '10px' }}>
          <BchatIconButton
            iconSize="large"
            iconType="walletSetting"
            iconColor="#2879fb"
            onClick={() => { dispatch(setting()), props.clearStates() }}
          />
        </span> */}
      </div>
    </div>
  );
};

export const WalletButton = (props: {
  // name: string;
  icontype: BchatIconType;
  iconSize: BchatIconSize | number;
  submit: any;
}) => {
  const { icontype, iconSize, submit } = props;

  return (
    <div className="wallet-button" onClick={() => submit()}>
      <BchatIcon iconSize={iconSize} iconType={icontype} />
      {/* <span style={{ marginLeft: '5px' }}>{name}</span> */}
    </div>
  );
};
