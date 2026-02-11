import  { useState } from 'react';
import { SpacerLG, SpacerSM } from '../basic/Text';
import { getConversationController } from '../../bchat/conversations';
import { adminLeaveClosedGroup } from '../../state/ducks/modalDialog';
import { BchatButtonColor } from '../basic/BchatButton';
import { BchatWrapperModal } from '../BchatWrapperModal';
import { BchatIcon } from '../icon/BchatIcon';
import styled from 'styled-components';

type Props = {
  conversationId: string;
};

export const AdminLeaveClosedGroupDialog = (props: Props) => {
  // const convo = getConversationController().get(props.conversationId);
  const titleText = `${window.i18n('leaveGroup')} ?`;
  const warningAsAdmin = `${window.i18n('leaveGroupConfirmationAdmin')}`;
  const okText = window.i18n('leaveAndRemoveForEveryone');
  const cancelText = window.i18n('cancel');
  const [_isLoading, setIsLoading] = useState(false);

  const onClickOK = async () => {
    setIsLoading(true);
    await getConversationController()
      .get(props.conversationId)
      .leaveClosedGroup();
    setIsLoading(false);

    closeDialog();
  };

  const closeDialog = () => {
    window.inboxStore?.dispatch(adminLeaveClosedGroup(null));
  };

  return (
    <BchatWrapperModal
      title={titleText}
      onClose={closeDialog}
      okButton={{
        text: okText,
        onClickOkHandler: () => onClickOK(),
        color: BchatButtonColor.Danger,
        disabled: false,
      }}
      cancelButton={{
        text: cancelText,
        status: true,
        color: BchatButtonColor.Secondary,
        onClickCancelHandler: () => closeDialog(),
      }}
      iconShow={true}
      customIcon={<BchatIcon iconType={'leaveGroup'} iconSize={24} iconColor='#FF3E3E' />}
    >
      <SpacerSM/>
      <ContentWrapper>
        {warningAsAdmin}
      </ContentWrapper>
      <SpacerLG />
      {/* <div className="bchat-modal__button-group">
        <BchatButton text={cancelText} onClick={closeDialog} buttonColor={BchatButtonColor.White}/>
        <BchatButton text={okText} onClick={onClickOK} buttonColor={BchatButtonColor.Danger} />
      </div> */}
    </BchatWrapperModal>
  );
};

const ContentWrapper=styled.p`
max-width: 450px;
margin-top: 0px;
text-align: initial;
color: #A7A7BA;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: 20px;

`
