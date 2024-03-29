import React, { useState } from 'react';
import { SpacerLG } from '../basic/Text';
import { getConversationController } from '../../bchat/conversations';
import { adminLeaveClosedGroup } from '../../state/ducks/modalDialog';
import { BchatButton, BchatButtonColor } from '../basic/BchatButton';
import { BchatWrapperModal } from '../BchatWrapperModal';

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
    <BchatWrapperModal title={titleText} onClose={closeDialog}>
      <SpacerLG />
      <p style={{maxWidth:"450px",color:'#6A6A77',marginTop:0}}>{warningAsAdmin}</p>

      <div className="bchat-modal__button-group">
        <BchatButton text={cancelText} onClick={closeDialog} buttonColor={BchatButtonColor.White}/>
        <BchatButton text={okText} onClick={onClickOK} buttonColor={BchatButtonColor.Danger} />
      </div>
    </BchatWrapperModal>
  );
};
