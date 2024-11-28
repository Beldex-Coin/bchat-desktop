import React from 'react';
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
        title="About BNS"
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
              BNS: Your Decentralized Identity in the Beldex Ecosystem ?
            </div>
            <div className="about-bns-txt">
              BNS (Beldex Name Service) is your gateway to a seamless experience within the Beldex
              ecosystem. With BNS, you can create a unique, easy-to-remember name that links to your
              various Beldex identities.
            </div>
            <div className="about-bns-header">Key Benefits:</div>
            <ul>
              <li className="about-bns-txt">
                Unified Identity: Connect your BChat ID, Beldex Wallet Address, and BelNet ID to a
                single BNS name. This simplifies your interactions across the Beldex ecosystem.
              </li>
              <li className="about-bns-txt">
                Ease of Use: Say goodbye to complicated alphanumeric strings. With your BNS name,
                messaging and transactions become straightforward and user-friendly.
              </li>
              <li className="about-bns-txt">
                Badge of Trust: Link your BChat ID to your BNS name and complete the verification
                process to earn a BNS badge. This badge adds a layer of trust and recognition within
                the community.
              </li>
            </ul>
            <div className="about-bns-txt-bold">
              <span>Pricing:</span> Users can register their BNS names for 1, 2, 5, and 10 years for
              as low as <span>650 BDX, 1000 BDX, 2000 BDX,</span> and <span>4000 BDX</span>
              respectively.
            </div>
            <div className="about-bns-txt">
              Using BNS names enhances your privacy, security, and convenience. Whether you’re sending
              a message, making a transaction, or using decentralized services, your BNS name ensures
              a consistent and simplified experience.
            </div>
            <div className="about-bns-txt" style={{marginBottom:'0px'}}>
              Get started with your BNS name today and enjoy the benefits of a decentralized identity
              across all your Beldex services!
            </div>
          </article>
        </section>
      </BchatWrapperModal>
    </div>
  );
};
