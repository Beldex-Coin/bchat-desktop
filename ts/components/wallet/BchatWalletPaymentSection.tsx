import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  walletReceivedPage,
  walletSendPage,
  walletTransactionPage,
} from '../../state/ducks/walletInnerSection';
import { Flex } from '../basic/Flex';
import { BchatIcon } from '../icon/BchatIcon';
import { BchatIconSize, BchatIconType } from '../icon/Icons';
import { WalletDashboard } from './BchatWalletMainPanel';
// import { updateSendAddress } from '../../state/ducks/walletConfig';

export const WalletPaymentSection = (props:any) => {
  const dispatch = useDispatch();
  const focusedInnersection = useSelector((state: any) => state.walletInnerFocused);
  const zoomLevel=window.getSettingValue('zoom-factor-setting')

  // console.log('props ::',props);
  
  function tabBtn()
  {
    // let emtStr:any=""
   
    // props.setAmount('');
    // props.setNotes('');
    // dispatch(updateSendAddress(emtStr));
    props.clearStates()
    dispatch(walletSendPage());
  }
  return (
    <div className="wallet-squarBox-tran" style={zoomLevel>100?{width: '46.4%'}:{}}>
      <Flex container={true} flexDirection="column" justifyContent="center" height="100%">
        <div>
          <Flex container={true} flexDirection="row" justifyContent="space-between">
            <BchatButtonIcon
              name={window.i18n('sent')}
              iconSize="small"
              iconType="paySend"
              iconColor={WalletDashboard.walletSend === focusedInnersection ? '#fff' : '#FC2727'}
              onClick={() => tabBtn()}
              isSelected={WalletDashboard.walletSend === focusedInnersection}
            />
            <span style={{ width: '5%', height: '20px' }}></span>
            <BchatButtonIcon
              name={window.i18n('received')}
              iconSize="small"
              iconType="payRecieved"
              iconColor={
                WalletDashboard.walletReceived === focusedInnersection ? '#fff' : '#159B24'
              }
              onClick={() => {dispatch(walletReceivedPage())}}
              isSelected={WalletDashboard.walletReceived === focusedInnersection}
            />
          </Flex>
        </div>
        <Flex
          container={true}
          flexDirection="row"
          justifyContent="space-between"
          margin="15px 0 0 0"
        >
          <BchatButtonIcon
            name={window.i18n('transactionDetails')}
            iconSize="large"
            iconType="payTransaction"
            iconColor={WalletDashboard.walletTransaction === focusedInnersection?"#fff":'var(--color-text)'}
            onClick={() => {dispatch(walletTransactionPage())}}
            isSelected={WalletDashboard.walletTransaction === focusedInnersection}
          />
        </Flex>
      </Flex>
    </div>
  );
};

export const BchatButtonIcon = (props: {
  name: string;
  iconType: BchatIconType;
  iconColor: string;
  iconSize: BchatIconSize;
  onClick: () => void;
  isSelected: boolean;
}) => {
  return (
    <div onClick={props.onClick} style={{ width: '100%' }}>
      <Button isSelected={props.isSelected}>
        <BchatIcon
          iconSize={props.iconSize}
          iconType={props.iconType}
          iconColor={props.iconColor}
        />
        <span className="font-medium" style={{ marginLeft: '5px' }}>
          {props.name}
        </span>
      </Button>
    </div>
  );
};

export interface ButtonProps {
  isSelected?: boolean;
}
const Button = styled.button<ButtonProps>`
  outline: none;
  border: none;
  background-color: ${props => (props.isSelected ? 'var(--button-color)' : 'var(--color-walTransacBtn)')};
  width: 100%;
  height: 60px;
  border-radius: 10px;
  font-size: 16px;
  color:${props => (props.isSelected ? '#fff' : '')};
`;
