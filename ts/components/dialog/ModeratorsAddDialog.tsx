import React, { useState } from 'react';
import { PubKey } from '../../bchat/types';
import { ToastUtils } from '../../bchat/utils';
import { Flex } from '../basic/Flex';
import { ApiV2 } from '../../bchat/apis/open_group_api/opengroupV2';
import { getConversationController } from '../../bchat/conversations';
import { useDispatch } from 'react-redux';
import { updateAddModeratorsModal } from '../../state/ducks/modalDialog';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { BchatSpinner } from '../basic/BchatSpinner';
import { BchatWrapperModal } from '../BchatWrapperModal';

type Props = {
  conversationId: string;
};

export const AddModeratorsDialog = (props: Props) => {
  const { conversationId } = props;

  const dispatch = useDispatch();
  const convo = getConversationController().get(conversationId);

  const [inputBoxValue, setInputBoxValue] = useState('');
  const [addingInProgress, setAddingInProgress] = useState(false);

  const addAsModerator = async () => {
    // if we don't have valid data entered by the user
    const pubkey = PubKey.from(inputBoxValue);
    if (!pubkey) {
      window.log.info('invalid pubkey for adding as moderator:', inputBoxValue);
      ToastUtils.pushInvalidPubKey();
      return;
    }

    window?.log?.info(`asked to add moderator: ${pubkey.key}`);

    try {
      setAddingInProgress(true);
      let isAdded: any;
      // this is a v2 opengroup
      const roomInfos = convo.toOpenGroupV2();
      isAdded = await ApiV2.addModerator(pubkey, roomInfos);

      if (!isAdded) {
        window?.log?.warn('failed to add moderators:', isAdded);

        ToastUtils.pushFailedToAddAsModerator();
      } else {
        window?.log?.info(`${pubkey.key} added as moderator...`);
        ToastUtils.pushUserAddedToModerators();

        // clear input box
        setInputBoxValue('');
      }
    } catch (e) {
      window?.log?.error('Got error while adding moderator:', e);
    } finally {
      setAddingInProgress(false);
    }
  };

  const { i18n } = window;
  const chatName = convo.get('name');

  const title = `${i18n('addModerators')}: ${chatName}`;

  const onPubkeyBoxChanges = (e: any) => {
    const val = e.target.value;
    setInputBoxValue(val);
  };

  return (
    <BchatWrapperModal
      showExitIcon={true}
      title={title}
      onClose={() => {
        dispatch(updateAddModeratorsModal(null));
      }}
    >
      <Flex container={true} flexDirection="column" alignItems="center">
        <p>Add Moderator:</p>
        <input
          type="text"
          className="module-main-header__search__input"
          placeholder={i18n('enterBchatID')}
          dir="auto"
          onChange={onPubkeyBoxChanges}
          disabled={addingInProgress}
          value={inputBoxValue}
        />
        <BchatButton
          buttonType={BchatButtonType.Brand}
          buttonColor={BchatButtonColor.Primary}
          onClick={addAsModerator}
          text={i18n('add')}
          disabled={addingInProgress}
        />

        <BchatSpinner loading={addingInProgress} />
      </Flex>
    </BchatWrapperModal>
  );
};
