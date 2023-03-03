import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import {
  getRescaning,
  getwalletDecimalValue,
  getWalletSendAddress,
} from '../../state/selectors/walletConfig';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { Flex } from '../basic/Flex';
import { SpacerLG } from '../basic/Text';
import { BchatIcon } from '../icon/BchatIcon';
// import { contact } from '../../state/ducks/walletSection';
import { wallet } from '../../wallet/wallet-rpc';
import { ToastUtils } from '../../bchat/utils';
import { saveRecipientAddress } from '../../data/data';
import { walletSettingsKey } from '../../data/settings-key';
import { updateSendConfirmModal, updateTransactionInitModal } from '../../state/ducks/modalDialog';
import { updateSendAddress } from '../../state/ducks/walletConfig';
import { walletTransactionPage } from '../../state/ducks/walletInnerSection';
import { useKey } from 'react-use';
import { getwalletSendConfirmModal } from '../../state/selectors/modal';

export const SendForm = (props: any) => {
  const sendAddress = useSelector(getWalletSendAddress);
  const syncStatus = useSelector(getRescaning);
  const dispatch = useDispatch();
  const [address, setAddress] = useState(sendAddress);
  const [dropDown, setDropDown] = useState(false);
  let decimalValue: any = useSelector(getwalletDecimalValue);
  const walletDetails = useSelector((state: any) => state.wallet);
  const BchatSendConfirmState=useSelector(getwalletSendConfirmModal);
  function clearStateValue() {
    props.setAmount('');
    props.setPriority(window.i18n('flash'));
    setAddress('');
    props.setNotes('');
    let emtStr: any = '';
    dispatch(updateSendAddress(emtStr));
  }
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const handleClick = (e: any) => {
    if (!modalRef.current?.contains(e.target)) {
      setDropDown(false);
    }
  };
  useKey((event: KeyboardEvent) => {
    if (props.amount && address && syncStatus && event.key === 'Enter') {
      addressValidation();
    }
    return event.key === 'Enter';
  });
  async function addressValidation() {
    // console.log("netConnetion()",netConnetion())
    if (!window.globalOnlineStatus) {
       ToastUtils.pushToastError(
        'internetConnectionError',
        'Please check your internet connection'
      );
      return
    }
    if (props.amount > walletDetails.unlocked_balance / 1e9) {
      return ToastUtils.pushToastError('notEnoughBalance', 'Not enough unlocked balance');
    }
    if (address.length > 106 || address.length < 95) {
      return ToastUtils.pushToastError('invalidAddress', 'Invalid address');
    }
    if (props.amount == 0) {
      return ToastUtils.pushToastError('zeroAmount', 'Amount must be greater than zero');
    }
    let addressValidate = await wallet.validateAddres(address);
    if (!addressValidate) {
      return ToastUtils.pushToastError('invalidAddress', 'Invalid address');
    }
    !BchatSendConfirmState && sendConfirmModal();
  }

  function sendConfirmModal() {
    dispatch(
      updateSendConfirmModal({
        okTheme: BchatButtonColor.Green,
        address: address,
        amount: props.amount,
        fee: props.priority === 'Flash' ? 0.0042 : 0.0014,
        Priority: props.priority,
        onClickOk: async () => {
          await send();
        },
        onClickClose: () => {
          dispatch(updateSendConfirmModal(null));
        },
      })
    );
  }

  async function send() {
    const isSweepAll =
      props.amount == (walletDetails.unlocked_balance / 1e9).toFixed(decimalValue.charAt(0));
    dispatch(updateSendConfirmModal(null));
    dispatch(updateTransactionInitModal({}));
    let data: any = await wallet.transfer(
      address,
      props.amount * 1e9,
      props.priority === 'Flash' ? 0 : 1,
      isSweepAll
    );
    if (data.result) {
      const TransactionHistory = {
        tx_hash: data.result.tx_hash_list[0],
        address: address,
      };
      let getSettingvalue = window.getSettingValue(walletSettingsKey.settingSaveRecipient);
      if (getSettingvalue) {
        await saveRecipientAddress(TransactionHistory);
      }
      clearStateValue();
      dispatch(updateSendConfirmModal(null));
      dispatch(updateTransactionInitModal(null));
      ToastUtils.pushToastSuccess('successfully-sended', `Your transaction was successful.`);
      dispatch(walletTransactionPage());
    } else {
      clearStateValue();
      dispatch(updateSendConfirmModal(null));
      dispatch(updateTransactionInitModal(null));
      return data.result.tx_hash;
    }
  }

  return (
    <>
      <div className="wallet-sendForm">
        <Flex container={true} flexDirection="row" justifyContent="space-between">
          <Flex width="50%">
            <Flex
              container={true}
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              width="100%"
            >
              <span className="wallet-sendForm-label">{window.i18n('amount')}</span>

              <div className="wallet-sendForm-inputBox" style={{ width: '90%' }}>
                <input
                  value={props.amount}
                  onChange={(e: any) => {
                    props.setAmount(e.target.value);
                  }}
                  placeholder={window.i18n('enterAmount')}
                  type="text"
                  maxLength={16}
                />
              </div>
            </Flex>
          </Flex>
          <Flex width="49%">
            <Flex
              container={true}
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              width="100%"
            >
              <span className="wallet-sendForm-label">{window.i18n('priority')}</span>
              <div
                className="wallet-sendForm-inputBox"
                style={{ display: 'block', padding: '0px' }}
                ref={modalRef}
              >
                <div className="wallet-sendForm-inputBox" style={{ padding: '0px 8px' }}>
                  <span className="priortyBox">{props.priority}</span>

                  <span style={{ cursor: 'pointer' }} onClick={() => setDropDown(!dropDown)}>
                    <BchatIcon
                      iconType="dropdownArrow"
                      iconSize="small"
                      iconRotation={269}
                      iconColor={'var(--color-walDownthickArrow)'}
                    />
                  </span>
                </div>

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
                          props.setPriority(window.i18n('flash'));
                          setDropDown(!dropDown);
                        }}
                      >
                        {window.i18n('flash')}
                      </div>
                      <SpacerLG />
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
            <span className="wallet-sendForm-label">{window.i18n('address')}</span>
            <div className="wallet-sendForm-inputBox">
              <input
                value={address}
                placeholder="Enter Beldex address"
                onChange={(e: any) => {
                  setAddress(e.target.value);
                }}
                maxLength={120}
              />
              {/* <BchatButton
                text={window.i18n('contact')}
                onClick={() => {
                  const updateAddress: any = address;
                  dispatch(updateSendAddress(updateAddress));
                  dispatch(contact());
                }}
                buttonType={BchatButtonType.Brand}
                buttonColor={BchatButtonColor.Green}
              /> */}
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
            <span className="wallet-sendForm-label">{window.i18n('notes')}</span>
            <div className="wallet-sendForm-inputBox">
              <textarea
                value={props.notes}
                onChange={(e: any) => {
                  props.setNotes(e.target.value);
                }}
                placeholder="Notes"
                className="wallet-sendForm-textArea"
              />
            </div>
          </Flex>
        </div>
        <SpacerLG />
        <div className="wallet-sendForm-sendBtnBox">
          <BchatButton
            text={window.i18n('send')}
            onClick={() => addressValidation()}
            buttonType={BchatButtonType.Brand}
            buttonColor={BchatButtonColor.Green}
            disabled={!(props.amount && address && syncStatus)}
          />
        </div>
      </div>
    </>
  );
};
