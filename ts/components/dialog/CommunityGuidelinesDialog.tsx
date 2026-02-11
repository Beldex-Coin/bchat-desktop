// import React from 'react';
import { BchatWrapperModal } from '../BchatWrapperModal';
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
        title="Community Guidelines"
        okButton={{
          text: window.i18n('close'),
          onClickOkHandler: closeDialog,
        }}
      >
        <section>
          <article>
            <div>
              BChat is a decentralized messaging platform that protects your privacy. When you're
              using BChat, you own your conversations and data. It does not collect or store any of
              your personal information. BChat is where you chat with freedom.
            </div>
            <div>
              BChat is also more than a messaging application. You can send and receive BDX right
              from your chat box.
            </div>
            <div>
              BChat is built on top of the Beldex network. Masternodes on the Beldex network store
              and relay encrypted messages between clients. Other projects that are currently being
              researched or developed by Beldex include BelNet (a decentralized VPN service), Beldex
              Browser (an ad-free Web3 browser), and the Beldex Privacy Protocol (to anonymize every
              other asset).
            </div>
            <div>To know more, visit:<a onClick={()=>openLink('https://www.beldex.io')} style={{textDecoration: "underline"}}> https://www.beldex.io</a></div>
            <div>For collabs or marketing proposals, contact <a>marketing@beldex.io.</a></div>
            <div>For investments, contact <a >invest.bchat@beldex.io</a></div>
            <div>
              To protect and preserve this community, kindly follow the group rules and guidelines.
            </div>
            <div>
              Be civil. You can share your opinions and constructive criticisms but harassment is
              not permitted. Don't promote or shill your token/project. This group is dedicated to
              BChat and the Beldex ecosystem. Spammers will be banned.
            </div>
            <div>Do not share NSFW content or use profane language.</div>
            <div>Beware of scammers. Admins will not DM you first.</div>
          </article>
        </section>
      </BchatWrapperModal>
    </div>
  );
};
