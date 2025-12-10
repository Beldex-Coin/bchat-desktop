// import React from 'react';
// tslint:disable no-submodule-imports

import useKey from 'react-use/lib/useKey';
import { ConversationTypeEnum } from '../../models/conversation';
import { getConversationController } from '../../bchat/conversations';
import { ToastUtils } from '../../bchat/utils';
import { openConversationWithMessages } from '../../state/ducks/conversations';
import { updateUserDetailsModal } from '../../state/ducks/modalDialog';
import { Avatar, AvatarSize } from '../avatar/Avatar';
import { SpacerLG, SpacerMD, SpacerSM } from '../basic/Text';
import { BchatWrapperModal } from '../BchatWrapperModal';
import { Flex } from '../basic/Flex';
import { BchatIconButton } from '../icon';

type Props = {
  conversationId: string;
  authorAvatarPath: string | null;
  userName: string;
};

export const UserDetailsDialog = (props: Props) => {
  // const [isEnlargedImageShown, setIsEnlargedImageShown] = useState(false);
  const convo = getConversationController().get(props.conversationId);
  // const size = isEnlargedImageShown ? AvatarSize.HUGE : AvatarSize.XL;
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
    <BchatWrapperModal
      title={''}
      onClose={closeDialog}
      showExitIcon={false}
      showHeader={false}
      additionalClassName="user-details"
      okButton={{
        onClickOkHandler: () => closeDialog(),
      }}
    >
      <div style={{ width: '500px', paddingTop: '20px' }}>
        <Flex container={true} justifyContent="center" >
            <Avatar
            size={AvatarSize.HUGE}
              // size={size}
              // onAvatarClick={() => {
              //   setIsEnlargedImageShown(!isEnlargedImageShown);
              // }}
              pubkey={props.conversationId}
              isBnsHolder={convo?.attributes?.isBnsHolder}
            />
        </Flex>
        <SpacerSM />
        <div className="user-name">{props.userName}</div>
        <SpacerMD />
        <div className="user-id-wrapper">
          <Flex container={true} alignItems='baseline'>
            <div>
              <div className="user-id-wrapper-label">BChat Id</div>
              <div className="user-id">{convo.id}</div>
            </div>
            <BchatIconButton
              iconType="copy"
              iconSize={18}
              iconColor="#00A638"
              clipRule="evenodd"
              fillRule="evenodd"
              onClick={() => copyBchatID(convo.id)}
            />
          </Flex>
        </div>

        <SpacerLG />
      </div>
    </BchatWrapperModal>
  );
};
