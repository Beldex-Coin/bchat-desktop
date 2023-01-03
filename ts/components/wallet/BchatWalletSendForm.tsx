import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { getwalletDecimalValue, getWalletSendAddress } from '../../state/selectors/walletConfig';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
// import { BchatDropdown } from "../basic/BchatDropdown"
// import { BchatInput } from "../basic/BchatInput"
// import { BchatIdEditable } from "../basic/BchatIdEditable"
import { Flex } from '../basic/Flex';
import { SpacerLG } from '../basic/Text';
import { BchatIcon } from '../icon/BchatIcon';
import { contact } from '../../state/ducks/walletSection';
import { wallet } from '../../wallet/wallet-rpc';
import { ToastUtils } from '../../bchat/utils';
import { saveRecipientAddress } from '../../data/data';
import { walletSettingsKey } from '../../data/settings-key';
import { updateTransactionInitModal } from '../../state/ducks/modalDialog';
// import { saveRecipientAddressvalid } from '../../data/data';

export const SendForm = (props: any) => {
  const sendAddress = useSelector(getWalletSendAddress);
  console.log("send-sendAddress:",sendAddress)
  const dispatch = useDispatch();
  // const [amount, setAmount] = useState(props.amount);
  // const [priority, setPriority] = useState(window.i18n("flash"));
  const [address, setAddress] = useState(sendAddress);
  console.log("Address:",address)
  // const [notes, setNotes] = useState('');
  const [dropDown, setDropDown] = useState(false);
  let decimalValue: any = useSelector(getwalletDecimalValue);
  const walletDetails = useSelector((state: any) => state.wallet);
  function clearStateValue()
  {
    props.setAmount("");
    props.setPriority(window.i18n('flash'));
    setAddress('');
    props.setNotes("")
  }

  async function send() {
    const isSweepAll =
      props.amount == (walletDetails.unlocked_balance / 1e9).toFixed(decimalValue.charAt(0));
      // dispatch(updateTransactionInitModal({}))
    if (props.amount > walletDetails.unlocked_balance / 1e9) {
      ToastUtils.pushToastError('notEnoughBalance', 'Not enough unlocked balance');
      return
    }
    dispatch(updateTransactionInitModal({}))
    let data: any = await wallet.transfer(
      address,
      props.amount * 1e9,
      props.priority === 'Flash' ? 0 : 1,
      isSweepAll
    );
    if (data.result) {
      dispatch(updateTransactionInitModal(null))
      ToastUtils.pushToastSuccess(
        'successfully-sended',
        `Your transaction was successful.`
      );
      const TransactionHistory = {
        tx_hash: data.result.tx_hash_list[0],
        address: address,
      };
      let getSettingvalue = window.getSettingValue(walletSettingsKey.settingSaveRecipient);
      console.log("getSettingvalue ::",getSettingvalue);
      
      if (getSettingvalue) {
        // console.log('TransactionHistory::',TransactionHistory);
        
        await saveRecipientAddress(TransactionHistory);
      }
      clearStateValue()
     
    } else {
      clearStateValue()
      dispatch(updateTransactionInitModal(null))
      // ToastUtils.pushToastError('transferFailed', data.error.message);
      return data.result.tx_hash;
    }
  }

  return (<>
    <div className="wallet-sendForm">
      {/* <button onClick={() => insertData()}>insertData</button> */}
      <Flex container={true} flexDirection="row" justifyContent="space-between">
        <Flex width="48%">
          <Flex
            container={true}
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            width="100%"
          >
            {/* <span style={{ width: '20%' }}>{window.i18n('amount')}</span> */}
            <span className='wallet-sendForm-label'>{window.i18n('amount')}</span>

            <div className="wallet-sendForm-inputBox">
              <input
                value={props.amount}
                onChange={(e: any) => {
                  // let amount = e.target.value.replace(/[^0-9\.]/g, '');
                  // console.log("word_Without_Numbers:",amount)
                  props.setAmount(e.target.value);
                }}
                placeholder={window.i18n('enterAmount')}
                type="text"
              />
            </div>
          </Flex>
        </Flex>
        <Flex width="48%">
          <Flex
            container={true}
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            width="100%"
          >
            <span className='wallet-sendForm-label'>{window.i18n('priority')}</span>
            <div className="wallet-sendForm-inputBox" style={{ display: 'block' }}>
              <div className="wallet-sendForm-inputBox" style={{ padding: 0 }}>
                <span className="priortyBox">{props.priority}</span>

                {/* <input value={priority} onChange={(e: any) => { setPriority(e.target.value) }}/> */}
                <span onClick={() => setDropDown(!dropDown)} style={{ cursor: 'pointer' }}>
                  <BchatIcon iconType="dropdownArrow" iconSize="small" iconRotation={269} iconColor={'var(--color-walDownthickArrow)'} />
                </span>
              </div>

              {/* <BchatDropdown label={'flash'} options={"flash",'slow'} /> */}
              {dropDown && (
                <div style={{ position: 'relative' }}>
                  <div className="wallet-settings-nodeSetting-sendDropDown">
                    <div
                      className={classNames(
                        `dropDownItem ${
                          props.priority === window.i18n('flash') ? 'fontSemiBold' : 'fontRegular'
                        } `
                      )}
                      onClick={() => {
                        props.setPriority(window.i18n('flash')), setDropDown(!dropDown);
                      }}
                    >
                      {window.i18n('flash')}
                    </div>
                    <div
                      className={classNames(
                        `dropDownItem ${
                          props.priority === window.i18n('slow') ? 'fontSemiBold' : 'fontRegular'
                        } `
                      )}
                      onClick={() => {
                        props.setPriority(window.i18n('slow')), setDropDown(!dropDown);
                      }}
                    >
                      {window.i18n('slow')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Flex>
        </Flex>
      </Flex>
      <SpacerLG />
      <div>
        <Flex
          container={true}
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <span style={{     width: "calc( 8.9% + 21px)" }}>{window.i18n('address')}</span>
          <div className="wallet-sendForm-inputBox">
            <input
              value={address}
              placeholder="Enter Beldex address"
              onChange={(e: any) => {
                setAddress(e.target.value);
              }}
            />
            <BchatButton
              text={window.i18n('contact')}
              onClick={() => dispatch(contact())}
              buttonType={BchatButtonType.Brand}
              buttonColor={BchatButtonColor.Green}
              //   disabled={!caption}
            />
          </div>
        </Flex>
      </div>
      <SpacerLG />
      <div>
        <Flex
          container={true}
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <span style={{ width: "calc( 8.9% + 21px)" }}>{window.i18n('notes')}</span>
          <div className="wallet-sendForm-inputBox">
            <textarea
              value={props.notes}
              onChange={(e: any) => {
                props.setNotes(e.target.value);
              }}
              placeholder='Notes'
              className="wallet-sendForm-textArea"
            />
          </div>
        </Flex>
      </div>
      <SpacerLG />
      <div className="wallet-sendForm-sendBtnBox">
        <BchatButton
          text={window.i18n('sent')}
          onClick={() => send()}
          buttonType={BchatButtonType.Brand}
          buttonColor={BchatButtonColor.Green}
          disabled={!(props.amount && address)}
        />
      </div>
    </div>
    <SpacerLG />
    <SpacerLG />
    </>
  );
};
