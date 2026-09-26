// import React from 'react';
import { BchatWrapperModal } from '../BchatWrapperModal';
// import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { editProfileModal, updateAboutBnsModal } from '../../state/ducks/modalDialog';

// Filled into the $p1$..$p4$ placeholders of bnsPricingDescription; each price (with a following " BDX") renders bold
const bnsPrices: Record<string, string> = { $p1$: '650', $p2$: '1000', $p3$: '2000', $p4$: '4000' };

// Keeps "650 BDX" as one LTR unit so RTL text (ar) does not split or reorder it
const renderPricingDescription = () =>
  window.i18n('bnsPricingDescription')
    .split(/(\$p[1-4]\$(?: BDX)?)/)
    .map((part, i) => {
      const price = bnsPrices[part.slice(0, 4)];
      return price ? (
        <span key={i} dir="ltr" style={{ whiteSpace: 'nowrap' }}>
          {price + part.slice(4)}
        </span>
      ) : (
        part
      );
    });

export const AboutBnsDialog = () => {
  function closeDialog() {
    window.inboxStore?.dispatch(updateAboutBnsModal(null));
    window.inboxStore?.dispatch(editProfileModal({}));
  }
  return (
    <div className="about-bns">
      <BchatWrapperModal
        showHeader={true}
        onClose={closeDialog}
        showExitIcon={false}
        isloading={false}
        title={window.i18n('aboutBNS')}
        okButton={{
          text: window.i18n('close'),
          onClickOkHandler: closeDialog,
        }}
        // buttons={
        //   <div >
        //     <BchatButton
        //       text={window.i18n('close')}
        //       buttonColor={BchatButtonColor.Secondary}
        //       buttonType={BchatButtonType.Brand}
        //       // style={{ minWidth: '135px', height: '45px', margin: "15px 0" }}
        //       onClick={closeDialog}
        //     />
        //   </div>}
      >
        <section>
          <article>
            <div className="about-bns-header">
              {window.i18n('aboutBNSHeader')}
            </div>
            <div className="about-bns-txt">
              {window.i18n('aboutBNSDescription')}
            </div>
            <div className="about-bns-header">
              {window.i18n('keyBenefits')}
            </div>
            <ul>
              <li className="about-bns-txt">
                {window.i18n('keyBenefits1')}
              </li>
              <li className="about-bns-txt">
                {window.i18n('keyBenefits2')}
              </li>
              <li className="about-bns-txt">
                {window.i18n('keyBenefits3')}
              </li>
            </ul>
            <div className="about-bns-txt-bold">
              <span>{window.i18n('pricingHeader')}</span>{' '}
              {renderPricingDescription()}
            </div>
            <div className="about-bns-txt">
              {window.i18n('aboutBNSDescription2')}
            </div>
            <div className="about-bns-txt" style={{marginBottom:'0px'}}>
              {window.i18n('aboutBNSFooter')}
            </div>
          </article>
        </section>
      </BchatWrapperModal>
    </div>
  );
};
