import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import classNames from 'classnames';
import {
  getRescaning,
  getwalletDecimalValue,
  getWalletSendAddress,
} from '../../state/selectors/walletConfig';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { Flex } from '../basic/Flex';
import { SpacerLG } from '../basic/Text';
// import { BchatIcon } from '../icon/BchatIcon';
// import { contact } from '../../state/ducks/walletSection';
import { wallet } from '../../wallet/wallet-rpc';
import { ToastUtils } from '../../bchat/utils';
import { saveRecipientAddress } from '../../data/data';
import { walletSettingsKey } from '../../data/settings-key';
import { updateSendConfirmModal, updateTransactionInitModal } from '../../state/ducks/modalDialog';
import { updateSendAddress } from '../../state/ducks/walletConfig';
import { useKey } from 'react-use';
import { getwalletSendConfirmModal } from '../../state/selectors/modal';
import { BchatIcon } from '../icon';

export const SendForm = (props: any) => {
  const sendAddress = useSelector(getWalletSendAddress);
  const syncStatus = useSelector(getRescaning);
  const dispatch = useDispatch();
  const [address, setAddress] = useState(sendAddress);
  // const [dropDown, setDropDown] = useState(false);
  const priority = window.getSettingValue(walletSettingsKey.settingsPriority) || 'Flash';

  let decimalValue: any = useSelector(getwalletDecimalValue);
  const walletDetails = useSelector((state: any) => state.wallet);
  const BchatSendConfirmState = useSelector(getwalletSendConfirmModal);
  const zoomLevel = window.getSettingValue('zoom-factor-setting');
  const validZoomLevel=window.screen.width <= 1920 && zoomLevel>100;
  // console.log('validZoomLevel -->',validZoomLevel,window.screen.width,window.screen.width <= 1920)
 
  function clearStateValue() {
    props.setAmount('');
    // props.setPriority(window.i18n('flash'));
    // props.setPriority(window.i18n('flash'));

    setAddress('');
    props.setNotes('');
    let emtStr: any = '';
    dispatch(updateSendAddress(emtStr));
  }
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    setAddress(sendAddress);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [sendAddress]);
  const handleClick = (e: any) => {
    if (!modalRef.current?.contains(e.target)) {
      // setDropDown(false);
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
      ToastUtils.pushToastError('internetConnectionError', 'Please check your internet connection');
      return;
    }

    if (props.amount > walletDetails.unlocked_balance / 1e9) {
      return ToastUtils.pushToastError('notEnoughBalance', 'Not enough unlocked balance');
    }
    if ((address.length > 106 || address.length < 95) && !address.toLowerCase().endsWith('.bdx')) {
      return ToastUtils.pushToastError('invalidAddress', 'Invalid address');
    }
    if (props.amount == 0) {
      return ToastUtils.pushToastError('zeroAmount', 'Amount must be greater than zero');
    }
    let addressValidate = await wallet.validateAddres(address);
    if (!address.toLowerCase().endsWith('.bdx') && !addressValidate) {
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
        fee: priority === 'Flash' ? 0.0042 : 0.0014,
        Priority: priority,
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
      priority === 'Flash' ? 0 : 1,
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
    } else {
      clearStateValue();
      dispatch(updateSendConfirmModal(null));
      dispatch(updateTransactionInitModal(null));
      if (data.error) {
        return ToastUtils.pushToastError('invalidAddress', data.error.message);
      }
      // return data.result.tx_hash;
    }
  }

  return (
    <>
      <div className="wallet-sendForm">
        <span className="wallet-sendForm-label">{window.i18n('amount')}</span>
        <Flex
          container={true}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap={validZoomLevel?'wrap':'nowrap'}
        >
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
            <BchatButton
              text="All"
              buttonType={BchatButtonType.Medium}
              buttonColor={BchatButtonColor.Success}
              style={{ minWidth: '50px', height: '30px' }}
              onClick={()=>props.fillAmount()}
            />
          </div>

          <div ref={modalRef}>
            <div className="wallet-sendForm-priorty-wrapper" style={{marginTop:validZoomLevel?'15px':''}}>
              <BchatIcon iconType={'lightning'} iconSize={16} />
              <span className="txt">{priority}</span>

              {/* <span style={{ cursor: 'pointer' }} onClick={() => setDropDown(!dropDown)}>
                    <BchatIcon
                      iconType="dropdownArrow"
                      iconSize="small"
                      iconRotation={269}
                      iconColor={'var(--color-walDownthickArrow)'}
                    />
                  </span> */}
            </div>
            {/* 
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
                )} */}
          </div>
        </Flex>
        <SpacerLG />

        <div>
          <span className="wallet-sendForm-label">Address or BNS Name</span>
          <div className="wallet-sendForm-inputBox">
          <textarea
              value={address}
              placeholder="Enter Beldex address or BNS Name"
              className="wallet-sendForm-textArea"
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
        </div>
        <SpacerLG />

        <div>
          <span className="wallet-sendForm-label">{window.i18n('notes')}</span>
          <div className="wallet-sendForm-inputBox">
            <textarea
              value={props.notes}
              onChange={(e: any) => {
                props.setNotes(e.target.value);
              }}
              placeholder="Add notes (optional)"
              className="wallet-sendForm-textArea"
            />
          </div>
        </div>
        <SpacerLG />
        <div className="wallet-sendForm-sendBtnBox">
          <BchatButton
            text={window.i18n('send')}
            onClick={() => addressValidation()}
            buttonType={BchatButtonType.Brand}
            buttonColor={BchatButtonColor.Primary}
            disabled={!(props.amount && address && syncStatus&&props.amount>=0.1)}
          />
        </div>
      </div>
    </>
  );
};
