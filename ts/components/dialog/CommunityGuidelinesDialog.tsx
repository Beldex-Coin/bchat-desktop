// import React from 'react';
import { BchatWrapperModal } from '../BchatWrapperModal';
import { BchatIcon } from '../icon';
// import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { updateCommunityGuidelinesModal } from '../../state/ducks/modalDialog';
import { shell } from 'electron';

export const CommunityGuidelinesDialog = () => {
  function closeDialog() {
    window.inboxStore?.dispatch(updateCommunityGuidelinesModal(null));
  }
  const openLink = (url: string) => {
    void shell.openExternal(url);
  };
  return (
    <div className="community-guidelines">
      <BchatWrapperModal
        showHeader={true}
        onClose={closeDialog}
        showExitIcon={false}
        isloading={false}
        title={window.i18n('communityGuidelines')}
        // dark: Figma 1:43583 - same scrolling card as About BNS, square close, no footer
        additionalClassName="card-dialog about-bns-dialog community-guidelines-dialog"
        okButton={{
          text: window.i18n('close'),
          onClickOkHandler: closeDialog,
        }}
      >
        <button className="close-square" onClick={closeDialog} aria-label={window.i18n('close')}>
          <BchatIcon iconType="x" iconSize={11} iconColor="#0B0B0B" />
        </button>
        <section>
          <article>
            <div>
              {window.i18n('guidelinesDescription')}
            </div>
            <div>
              {window.i18n('guidelinesDescription2')}
            </div>
            <div>
              {window.i18n('guidelinesDescription3')}
            </div>
            <div>{window.i18n('toKnowMore')}:<a onClick={()=>openLink('https://www.beldex.io')} style={{textDecoration: "underline"}}> https://www.beldex.io</a></div>
            <div>{window.i18n('marketingprop')} <a>marketing@beldex.io.</a></div>
            <div>{window.i18n('forInvest..')} <a >invest.bchat@beldex.io</a></div>
            <div>
              {window.i18n('guidelinesDescription4')}
            </div>
            <div>
              {window.i18n('guidelinesDescription5')}
            </div>
            <div>{window.i18n('guidelinesDescription6')}</div>
            <div>{window.i18n('guidelinesDescription7')}</div>
          </article>
        </section>
      </BchatWrapperModal>
    </div>
  );
};
