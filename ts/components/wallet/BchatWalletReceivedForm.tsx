import { useState } from 'react';
// import { QRCode } from "react-qr-svg"
import { SpacerLG, SpacerMD, SpacerSM, SpacerXS } from '../basic/Text';
import { QRCode } from 'react-qrcode-logo';
import { copyBchatID } from '../dialog/EditProfileDialog';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';

export const ReceivedForm = () => {
  const walletAddress = localStorage.getItem('userAddress');
  const [txnAmount, setTxnAmount] = useState('');
  const qrValue = `Beldex:${walletAddress}?tx_amount=${txnAmount}`;

  function validator(e: any) {
    // const numbersValidation = /^\d+\.?\d*$/; 
    const pattern = /^(\d{0,16}(\.\d{1,5})?|(\d{0,16}\.))$/;
    if (e === '' || pattern.test(e)) {
      setTxnAmount(e);
    }
  }

  return (
    <>
      <div className="wallet-receivedForm">
        <SpacerLG />
        <h5 className="wallet-receivedForm-title">Primary Account</h5>
        <SpacerSM />
        <section className="wallet-receivedForm-qrBox">
          <div className="wallet-receivedForm-qrBox-qrView">
            <QRCode
              value={qrValue}
              bgColor="#d9d9d9"
              fgColor="#1B1B1B"
              ecLevel="M"
              size={160}
              style={{width:'165px',height:"165px"}}
              qrStyle={'squares'}
              logoImage={'images/wallet/beldex_watermark_qr.svg'}
            />
          </div>
        </section>
        <SpacerMD/>
        <BchatButton
          text={window.i18n('copyAddress')}
          iconType="copy"
          iconSize={'small'}
          clipRule="evenodd"
          fillRule="evenodd"
          buttonType={BchatButtonType.Medium}
          buttonColor={BchatButtonColor.Primary}
          onClick={() => copyBchatID(walletAddress)}
        />
        <SpacerLG />
        <div className="wallet-receivedForm-rightSide">
          {/* <div className="wallet-receivedForm-rightSide-Title">{window.i18n('receiveBDX')}</div> */}
          <div className="wallet-receivedForm-rightSide-label">{window.i18n('hintReceiveBDX')}</div>
          <SpacerXS />
          <div>
            <input
              value={txnAmount}
              className="wallet-receivedForm-rightSide-input"
              placeholder={window.i18n('enterAmount')}
              type="text"
              onChange={(e: any) => validator(e.target.value)}
              maxLength={16}
            />
          </div>
          <SpacerLG />

        </div>
      </div>
    </>
  );
};
