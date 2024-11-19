import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { walletReceivedPage, walletSendPage } from '../../state/ducks/walletInnerSection';
import { Flex } from '../basic/Flex';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { WalletDashboard } from './BchatWalletMainPanel';

export const WalletPaymentSection = (props: any) => {
  const dispatch = useDispatch();
  const focusedInnersection = useSelector((state: any) => state.walletInnerFocused);
  // const zoomLevel = window.getSettingValue('zoom-factor-setting');

  function tabBtn() {
    props.clearStates();
    dispatch(walletSendPage());
  }
  return (
    <div className="wallet-squarBox-tran">
      <Flex container={true} flexDirection="column" justifyContent="center" height="100%">
        <div className="wallet-btn-wrapper">
          <Flex container={true} flexDirection="row" justifyContent="center">
            <BchatButton
              text={window.i18n('send')}
              iconSize="small"
              iconType="paySend"
              onClick={() => tabBtn()}
              buttonType={BchatButtonType.Brand}
              buttonColor={
                WalletDashboard.walletSend === focusedInnersection
                  ? BchatButtonColor.Primary
                  : BchatButtonColor.Secondary
              }
              style={{minWidth:'unset', width: '45%' }}
            />
            <span style={{ width: '5%', height: '20px' }}></span>

            <BchatButton
              text={window.i18n('received')}
              iconSize="small"
              iconType="payRecieved"
              buttonType={BchatButtonType.Brand}
              buttonColor={
                WalletDashboard.walletReceived === focusedInnersection
                  ? BchatButtonColor.Primary
                  : BchatButtonColor.Secondary
              }
              onClick={() => {
                dispatch(walletReceivedPage());
              }}
              style={{minWidth:'unset', width: '45%' }}
            />
          </Flex>
        </div>
      </Flex>
    </div>
  );
};

export interface ButtonProps {
  isSelected?: boolean;
}
// const Button = styled.button<ButtonProps>`
//   outline: none;
//   border: none;
//   background-color: ${props =>
//     props.isSelected ? 'var(--button-color)' : 'var(--color-walTransacBtn)'};
//   width: 100%;
//   height: 60px;
//   border-radius: 10px;
//   font-size: 16px;
//   color: ${props => (props.isSelected ? '#fff' : '')};

//   &:hover {
//     background-color: ${props =>
//       props.isSelected ? 'var(--button-color)' : 'var(--color-walletSelectOption)'};
//   }
// `;
