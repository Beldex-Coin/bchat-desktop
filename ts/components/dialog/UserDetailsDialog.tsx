import React, { useState } from 'react';
// tslint:disable no-submodule-imports

// import useCopyToClipboard from 'react-use/lib/useCopyToClipboard';

import useKey from 'react-use/lib/useKey';
import { ConversationTypeEnum } from '../../models/conversation';
import { getConversationController } from '../../bchat/conversations';
import { ToastUtils } from '../../bchat/utils';
import { openConversationWithMessages } from '../../state/ducks/conversations';
import { updateUserDetailsModal } from '../../state/ducks/modalDialog';
import { Avatar, AvatarSize } from '../avatar/Avatar';
// import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
// import { BchatIdEditable } from '../basic/BchatIdEditable';
import { SpacerLG } from '../basic/Text';
import { BchatWrapperModal } from '../BchatWrapperModal';

type Props = {
  conversationId: string;
  authorAvatarPath: string | null;
  userName: string;
};

export const UserDetailsDialog = (props: Props) => {
  const [isEnlargedImageShown, setIsEnlargedImageShown] = useState(false);
  const convo = getConversationController().get(props.conversationId);

  const size = isEnlargedImageShown ? AvatarSize.HUGE : AvatarSize.XL;

  // const [_, copyToClipboard] = useCopyToClipboard();

  function closeDialog() {
    window.inboxStore?.dispatch(updateUserDetailsModal(null));
  }

  async function onClickStartConversation() {
    const conversation = await getConversationController().getOrCreateAndWait(
      convo.id,
      ConversationTypeEnum.PRIVATE
    );

    await openConversationWithMessages({ conversationKey: conversation.id, messageId: null });
    closeDialog();
  }

  useKey(
    'Enter',
    () => {
      void onClickStartConversation();
    },
    undefined,
    [props.conversationId]
  );
  function copyBchatID(bchatID: any) {
    window.clipboard.writeText(bchatID);
    ToastUtils.pushCopiedToClipBoard();
  }

  return (
    <BchatWrapperModal title={props.userName} onClose={closeDialog} showExitIcon={true}>
      <div style={{width:'410px',paddingTop:'20px'}}>
      <div className="avatar-center">
        <div className="avatar-center-inner">
          <Avatar
            size={size}
            onAvatarClick={() => {
              setIsEnlargedImageShown(!isEnlargedImageShown);
            }}
            pubkey={props.conversationId}
          />
        </div>
      </div>
      <div className='bchat-modal__centered-display'>
          <div className='profile-value'>{convo.id}</div>
          <div onClick={() => copyBchatID(convo.id)}
            className="bchat-modal__centered-display-icon"

          // style={{ 
          //  background:`url(images/bchat/copy_icon.svg) no-repeat`,
          //  width: "40px",
          //  height: "40px",
          //  position: 'relative',
          //  backgroundColor:"#353543",
          //  borderRadius:"30px",
          //  backgroundSize:'13px',
          //  backgroundPosition:"center",
          //  cursor:'pointer'
          //  }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18.151" height="18.151" viewBox="0 0 18.151 18.151">
              <path id="copy_icon" d="M3.815,2A1.815,1.815,0,0,0,2,3.815V16.521H3.815V3.815H16.521V2Zm3.63,3.63A1.815,1.815,0,0,0,5.63,7.445V18.336a1.815,1.815,0,0,0,1.815,1.815H18.336a1.815,1.815,0,0,0,1.815-1.815V7.445A1.815,1.815,0,0,0,18.336,5.63Zm0,1.815H18.336V18.336H7.445Z" transform="translate(-2 -2)"  />
            </svg>
          </div>
        </div>

      <SpacerLG />
      {/* <BchatIdEditable editable={false} text={convo.id} /> */}

      <div className="bchat-modal__button-group__center"> 
        {/* <BchatButton
          text={window.i18n('editMenuCopy')}
          buttonType={BchatButtonType.Default}
          buttonColor={BchatButtonColor.White}
          onClick={() => {
            copyToClipboard(props.conversationId);
            ToastUtils.pushCopiedToClipBoard();
          }}
        /> */}
        {/* <BchatButton
          text={window.i18n('startConversation')}
          buttonType={BchatButtonType.Default}
          buttonColor={BchatButtonColor.Green}
          onClick={onClickStartConversation}
        /> */}
      </div>
      </div>
    </BchatWrapperModal>
  );
};
