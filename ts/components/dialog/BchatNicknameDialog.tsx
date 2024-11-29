import React, { useState } from 'react';
import { getConversationController } from '../../bchat/conversations';

import _ from 'lodash';
import { SpacerLG } from '../basic/Text';
import { useDispatch } from 'react-redux';
import { changeNickNameModal } from '../../state/ducks/modalDialog';
import { BchatButtonColor } from '../basic/BchatButton';
import { BchatWrapperModal } from '../BchatWrapperModal';
import { BchatIconButton } from '../icon';
// import { useConversationUsername } from '../../hooks/useParamSelector';

type Props = {
  conversationId: string;
};

export const BchatNicknameDialog = (props: Props) => {
  const { conversationId } = props;
  const [nickname, setNickname] = useState('');
  // const usernames = String(useConversationUsername(conversationId));
  // console.log("username ::",usernames);

  const dispatch = useDispatch();

  /**
   * Changes the state of nickname variable. If enter is pressed, saves the current
   * entered nickname value as the nickname.
   */
  const onNicknameInput = async (event: any) => {
    if (event.key === 'Enter') {
      await saveNickname();
    } else if (event.target.value.length <= 26) {
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
      additionalClassName="nickNameDialog"
      okButton={{
        text: window.i18n('ok'),
        // onClick: { saveNickname },
        color: BchatButtonColor.Primary,
        onClickOkHandler: () => saveNickname(),
      }}
      cancelButton={{
        status: true,
        text: window.i18n('cancel'),
        buttonColor: BchatButtonColor.Secondary,
        onClickCancelHandler: () => onClickClose(),
      }}
    >
      <SpacerLG />
      {/* <div className="bchat-modal__centered">
        <span className="subtle">{window.i18n('changeNicknameMessage',[usernames])}</span>
        <SpacerMD />
      </div> */}

      <div className="input-wrapper">
        <input
          autoFocus={true}
          className=""
          type="nickname"
          id="nickname-modal-input"
          value={nickname}
          placeholder={window.i18n('nicknamePlaceholder')}
          onKeyUp={e => {
            void onNicknameInput(_.cloneDeep(e));
          }}
          onChange={e => {
            void onNicknameInput(_.cloneDeep(e));
          }}
        />
        <BchatIconButton iconType={'xWithCircle'} iconSize={24} onClick={() => setNickname('')} />
      </div>
      <SpacerLG />
      {/* <div className="bchat-modal__button-group">
        <BchatButton
          text={window.i18n('cancel')}
          onClick={onClickClose}
          buttonColor={BchatButtonColor.White}
        />
        <BchatButton
          text={window.i18n('ok')}
          onClick={saveNickname}
          buttonColor={BchatButtonColor.Green}
        />
      </div> */}
    </BchatWrapperModal>
  );
};
