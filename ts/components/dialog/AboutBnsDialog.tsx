// import React from 'react';
import { BchatWrapperModal } from '../BchatWrapperModal';
// import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { editProfileModal, updateAboutBnsModal } from '../../state/ducks/modalDialog';

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
              <span>{window.i18n('pricingHeader')}:</span> {window.i18n('subscriptionDescription')} <span>650 BDX, 1000 BDX, 2000 BDX,</span> and <span>4000 BDX</span> {window.i18n('subscriptionDescriptionTail')}
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
