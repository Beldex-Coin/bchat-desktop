import React, { useState } from 'react';
import { getConversationController } from '../../bchat/conversations';

import _ from 'lodash';
import { SpacerLG } from '../basic/Text';
import { useDispatch } from 'react-redux';
import { changeNickNameModal } from '../../state/ducks/modalDialog';
import { BchatButton, BchatButtonColor } from '../basic/BchatButton';
import { BchatWrapperModal } from '../BchatWrapperModal';

type Props = {
  conversationId: string;
};

export const BchatNicknameDialog = (props: Props) => {
  const { conversationId } = props;
  const [nickname, setNickname] = useState('');

  const dispatch = useDispatch();

  /**
   * Changes the state of nickname variable. If enter is pressed, saves the current
   * entered nickname value as the nickname.
   */
  const onNicknameInput = async (event: any) => {
    if (event.key === 'Enter') {
      await saveNickname();
    } else {
      const currentNicknameEntered = event.target.value;
      setNickname(currentNicknameEntered);
    }
  };

  const onClickClose = () => {
    dispatch(changeNickNameModal(null));
  };

  /**
   * Saves the currently entered nickname.
   */
  const saveNickname = async () => {
    if (!conversationId) {
      throw new Error('Cant save without conversation id');
    }
    const conversation = getConversationController().get(conversationId);
    await conversation.setNickname(nickname);
    onClickClose();
  };

  return (
    <BchatWrapperModal
      title={window.i18n('changeNickname')}
      onClose={onClickClose}
      showExitIcon={false}
      showHeader={true}
    >
      <div className="bchat-modal__centered">
        <span className="subtle">{window.i18n('changeNicknameMessage')}</span>
        <SpacerLG />
      </div>

      <input
        autoFocus={true}
        type="nickname"
        id="nickname-modal-input"
        placeholder={window.i18n('nicknamePlaceholder')}
        onKeyUp={e => {
          void onNicknameInput(_.cloneDeep(e));
        }}
      />

      <div className="bchat-modal__button-group">
        <BchatButton text={window.i18n('cancel')} onClick={onClickClose} />
        <BchatButton
          text={window.i18n('ok')}
          onClick={saveNickname}
          buttonColor={BchatButtonColor.Green}
        />
      </div>
    </BchatWrapperModal>
  );
};
