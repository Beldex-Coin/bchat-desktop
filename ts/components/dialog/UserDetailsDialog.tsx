// import React from 'react';


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
import { useSelector } from 'react-redux';
import { getTheme } from '../../state/selectors/theme';

type Props = {
  conversationId: string;
  authorAvatarPath: string | null;
  userName: string;
  isAdmin?: boolean;
};

export const UserDetailsDialog = (props: Props) => {
  // const [isEnlargedImageShown, setIsEnlargedImageShown] = useState(false);
  const convo = getConversationController().get(props.conversationId);
  const isDark = useSelector(getTheme) === 'dark';
  // group admin (opened from their message in a group): the crown on the picture's corner and the
  // green ADMIN tag under the name
  const showAdmin = isDark && !!props.isAdmin;
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
          <span className="user-details__avatar">
            <Avatar
            size={AvatarSize.HUGE}
              // size={size}
              // onAvatarClick={() => {
              //   setIsEnlargedImageShown(!isEnlargedImageShown);
              // }}
              pubkey={props.conversationId}
              isBnsHolder={convo?.attributes?.isBnsHolder}
            />
            {showAdmin && (
              // the admin crown on the picture's top-end corner, as on their avatar in the chat
              <img
                className="user-details__crown"
                src="images/dark-theme/crown.svg"
                width={40}
                height={38}
                alt=""
              />
            )}
          </span>
        </Flex>
        <SpacerSM />
        <div className="user-name">{props.userName}</div>
        {showAdmin && <div className="user-admin-tag">{window.i18n('admin')}</div>}
        <SpacerMD />
        <div className="user-id-wrapper">
          <Flex container={true} alignItems='baseline'>
            <div>
              <div className="user-id-wrapper-label">{window.i18n('bChatID')}</div>
              <div className="user-id" dir="ltr">{convo.id}</div>
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
