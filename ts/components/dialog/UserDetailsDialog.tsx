import React, { useState } from 'react';
// tslint:disable no-submodule-imports

import useCopyToClipboard from 'react-use/lib/useCopyToClipboard';

import useKey from 'react-use/lib/useKey';
import { ConversationTypeEnum } from '../../models/conversation';
import { getConversationController } from '../../bchat/conversations';
import { ToastUtils } from '../../bchat/utils';
import { openConversationWithMessages } from '../../state/ducks/conversations';
import { updateUserDetailsModal } from '../../state/ducks/modalDialog';
import { Avatar, AvatarSize } from '../avatar/Avatar';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { BchatIdEditable } from '../basic/BchatIdEditable';
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

  const [_, copyToClipboard] = useCopyToClipboard();

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

  return (
    <BchatWrapperModal title={props.userName} onClose={closeDialog} showExitIcon={true}>
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

      <SpacerLG />
      <BchatIdEditable editable={false} text={convo.id} />

      <div className="bchat-modal__button-group__center">
        <BchatButton
          text={window.i18n('editMenuCopy')}
          buttonType={BchatButtonType.Default}
          buttonColor={BchatButtonColor.Primary}
          onClick={() => {
            copyToClipboard(props.conversationId);
            ToastUtils.pushCopiedToClipBoard();
          }}
        />
        <BchatButton
          text={window.i18n('startConversation')}
          buttonType={BchatButtonType.Default}
          buttonColor={BchatButtonColor.Green}
          onClick={onClickStartConversation}
        />
      </div>
    </BchatWrapperModal>
  );
};
