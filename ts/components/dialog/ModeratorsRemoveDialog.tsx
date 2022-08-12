import React, { useState } from 'react';
import { ApiV2 } from '../../bchat/apis/open_group_api/opengroupV2';
import { getConversationController } from '../../bchat/conversations';
import { PubKey } from '../../bchat/types';
import { ToastUtils } from '../../bchat/utils';
import { Flex } from '../basic/Flex';
import _ from 'lodash';
import { updateRemoveModeratorsModal } from '../../state/ducks/modalDialog';
import { BchatWrapperModal } from '../BchatWrapperModal';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { BchatSpinner } from '../basic/BchatSpinner';
import { MemberListItem } from '../MemberListItem';
import { useDispatch } from 'react-redux';
import { useConversationPropsById } from '../../hooks/useParamSelector';

type Props = {
  conversationId: string;
};

async function removeMods(convoId: string, modsToRemove: Array<string>) {
  if (modsToRemove.length === 0) {
    window?.log?.info('No moderators removed. Nothing todo');
    return false;
  }
  window?.log?.info(`asked to remove moderators: ${modsToRemove}`);

  try {
    let res;
    const convo = getConversationController().get(convoId);

    const roomInfos = convo.toOpenGroupV2();
    const modsToRemovePubkey = _.compact(modsToRemove.map(m => PubKey.from(m)));
    res = await Promise.all(
      modsToRemovePubkey.map(async m => {
        return ApiV2.removeModerator(m, roomInfos);
      })
    );
    // all moderators are removed means all promise resolved with bool= true
    res = res.every(r => !!r);

    if (!res) {
      window?.log?.warn('failed to remove moderators:', res);

      ToastUtils.pushFailedToRemoveFromModerator();
      return false;
    } else {
      window?.log?.info(`${modsToRemove} removed from moderators...`);
      ToastUtils.pushUserRemovedFromModerators();
      return true;
    }
  } catch (e) {
    window?.log?.error('Got error while removing moderator:', e);
    return false;
  }
}

export const RemoveModeratorsDialog = (props: Props) => {
  const { conversationId } = props;
  const [removingInProgress, setRemovingInProgress] = useState(false);
  const [modsToRemove, setModsToRemove] = useState<Array<string>>([]);
  const { i18n } = window;
  const dispatch = useDispatch();
  const closeDialog = () => {
    dispatch(updateRemoveModeratorsModal(null));
  };

  const removeModsCall = async () => {
    if (modsToRemove.length) {
      setRemovingInProgress(true);
      const removed = await removeMods(conversationId, modsToRemove);
      setRemovingInProgress(false);
      if (removed) {
        closeDialog();
      }
    }
  };

  const convoProps = useConversationPropsById(conversationId);
  if (!convoProps || !convoProps.isPublic || !convoProps.weAreAdmin) {
    throw new Error('RemoveModeratorsDialog: convoProps invalid');
  }

  const existingMods = convoProps.groupAdmins || [];
  const hasMods = existingMods.length !== 0;

  const title = `${i18n('removeModerators')}: ${convoProps.name}`;
  return (
    <BchatWrapperModal title={title} onClose={closeDialog}>
      <Flex container={true} flexDirection="column" alignItems="center">
        {hasMods ? (
          <div className="contact-selection-list">
            {existingMods.map(modId => (
              <MemberListItem
                key={modId}
                pubkey={modId}
                isSelected={modsToRemove.some(m => m === modId)}
                onSelect={(selectedMember: string) => {
                  const updatedList = [...modsToRemove, selectedMember];
                  setModsToRemove(updatedList);
                }}
                onUnselect={(selectedMember: string) => {
                  const updatedList = modsToRemove.filter(m => m !== selectedMember);
                  setModsToRemove(updatedList);
                }}
              />
            ))}
          </div>
        ) : (
          <p>{i18n('noModeratorsToRemove')}</p>
        )}
        <BchatSpinner loading={removingInProgress} />

        <div className="bchat-modal__button-group">
          <BchatButton
            buttonType={BchatButtonType.Brand}
            buttonColor={BchatButtonColor.Green}
            onClick={removeModsCall}
            disabled={removingInProgress}
            text={i18n('ok')}
          />
          <BchatButton
            buttonType={BchatButtonType.Brand}
            buttonColor={BchatButtonColor.Primary}
            onClick={closeDialog}
            disabled={removingInProgress}
            text={i18n('cancel')}
          />
        </div>

        <BchatSpinner loading={removingInProgress} />
      </Flex>
    </BchatWrapperModal>
  );
};
