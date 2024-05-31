import React, { useState } from 'react';
// tslint:disable no-submodule-imports

import useKey from 'react-use/lib/useKey';
import { ConversationTypeEnum } from '../../models/conversation';
import { getConversationController } from '../../bchat/conversations';
import { ToastUtils } from '../../bchat/utils';
import { openConversationWithMessages } from '../../state/ducks/conversations';
import { updateUserDetailsModal } from '../../state/ducks/modalDialog';
import { Avatar, AvatarSize, BNSWrapper } from '../avatar/Avatar';
import { SpacerLG } from '../basic/Text';
import { BchatWrapperModal } from '../BchatWrapperModal';
import { Flex } from '../basic/Flex';

type Props = {
  conversationId: string;
  authorAvatarPath: string | null;
  userName: string;
};

export const UserDetailsDialog = (props: Props) => {
  const [isEnlargedImageShown, setIsEnlargedImageShown] = useState(false);
  const convo = getConversationController().get(props.conversationId);
  const size = isEnlargedImageShown ? AvatarSize.HUGE : AvatarSize.XL;
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
      <div style={{ width: '410px', paddingTop: '20px' }}>
        <Flex container={true} justifyContent="center">
          <BNSWrapper
            size={isEnlargedImageShown ? 305 : 89}
            position={{
              left: isEnlargedImageShown ? '288px' : '71px',
              top: isEnlargedImageShown ? '288px' : '71px',
            }}
            isBnsHolder={convo?.attributes?.isBnsHolder}
          >
            <Avatar
              size={size}
              onAvatarClick={() => {
                setIsEnlargedImageShown(!isEnlargedImageShown);
              }}
              pubkey={props.conversationId}
            />
          </BNSWrapper>
        </Flex>
        <div className="bchat-modal__centered-display">
          <div className="profile-value">{convo.id}</div>
          <div onClick={() => copyBchatID(convo.id)} className="bchat-modal__centered-display-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18.151"
              height="18.151"
              viewBox="0 0 18.151 18.151"
            >
              <path
                id="copy_icon"
                d="M3.815,2A1.815,1.815,0,0,0,2,3.815V16.521H3.815V3.815H16.521V2Zm3.63,3.63A1.815,1.815,0,0,0,5.63,7.445V18.336a1.815,1.815,0,0,0,1.815,1.815H18.336a1.815,1.815,0,0,0,1.815-1.815V7.445A1.815,1.815,0,0,0,18.336,5.63Zm0,1.815H18.336V18.336H7.445Z"
                transform="translate(-2 -2)"
              />
            </svg>
          </div>
        </div>

        <SpacerLG />

        <div className="bchat-modal__button-group__center"></div>
      </div>
    </BchatWrapperModal>
  );
};
