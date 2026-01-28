import React, { useRef, useState } from 'react';
import { PubKey } from '../../bchat/types';
import { ToastUtils } from '../../bchat/utils';
import { Flex } from '../basic/Flex';
import { useDispatch } from 'react-redux';
import { BanType, updateBanOrUnbanUserModal } from '../../state/ducks/modalDialog';
import { SpacerLG } from '../basic/Text';
import { getConversationController } from '../../bchat/conversations/ConversationController';
import { ApiV2 } from '../../bchat/apis/open_group_api/opengroupV2';
import { BchatWrapperModal } from '../BchatWrapperModal';

import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { ConversationModel } from '../../models/conversation';
import { useFocusMount } from '../../hooks/useFocusMount';
import { useConversationPropsById } from '../../hooks/useParamSelector';
import { BchatIcon } from '../icon/BchatIcon';


async function banOrUnBanUserCall(
  convo: ConversationModel,
  textValue: string,
  banType: BanType,
  deleteAll: boolean
) {
  // if we don't have valid data entered by the user
  const pubkey = PubKey.from(textValue);
  if (!pubkey) {
    window.log.info(`invalid pubkey for ${banType} user:${textValue}`);
    ToastUtils.pushInvalidBchatId();
    return false;
  }
  try {
    // this is a v2 opengroup
    const roomInfos = convo.toOpenGroupV2();
    const isChangeApplied =
      banType === 'ban'
        ? await ApiV2.banUser(pubkey, roomInfos, deleteAll)
        : await ApiV2.unbanUser(pubkey, roomInfos);

    if (!isChangeApplied) {
      window?.log?.warn(`failed to ${banType} user: ${isChangeApplied}`);
  // eslint-disable-next-line no-unused-expressions
      banType === 'ban' ? ToastUtils.pushUserBanFailure() : ToastUtils.pushUserUnbanSuccess();
      return false;
    }
    window?.log?.info(`${pubkey.key} user ${banType}ned successfully...`);
    // eslint-disable-next-line no-unused-expressions
    banType === 'ban' ? ToastUtils.pushUserBanSuccess() : ToastUtils.pushUserUnbanSuccess();
    return true;
  } catch (e) {
    window?.log?.error(`Got error while ${banType}ning user:`, e);

    return false;
  }
}

export const BanOrUnBanUserDialog = (props: {
  conversationId: string;
  banType: BanType;
  pubkey?: string;
}) => {
  const { conversationId, banType, pubkey } = props;
  const { i18n } = window;
  const isBan = banType === 'ban';
  const dispatch = useDispatch();
  const convo = getConversationController().get(conversationId);
  const inputRef = useRef(null);

  useFocusMount(inputRef, true);
  const wasGivenAPubkey = Boolean(pubkey?.length);
  const [inputBoxValue, setInputBoxValue] = useState('');
  const [inProgress, setInProgress] = useState(false);
  const [banUser, setBanUser] = useState(true);
  const sourceConvoProps = useConversationPropsById(pubkey);

  const inputTextToDisplay =
    wasGivenAPubkey && sourceConvoProps
      ? `${sourceConvoProps.profileName} ${PubKey.shorten(sourceConvoProps.id)}`
      : undefined;

  /**
   * Ban or Unban a user from an Social group
   * @param deleteAll Delete all messages for that user in the group (only works with ban)
   */
  const banOrUnBanUser = async (deleteAll: boolean = false) => {
    const castedPubkey = pubkey?.length ? pubkey : inputBoxValue;

    window?.log?.info(`asked to ${banType} user: ${castedPubkey}, banAndDeleteAll:${deleteAll}`);
    setInProgress(true);
    const isBanned = await banOrUnBanUserCall(convo, castedPubkey, banType, deleteAll);
    if (isBanned) {
      // clear input box
      setInputBoxValue('');
      // if (wasGivenAPubkey) {
      dispatch(updateBanOrUnbanUserModal(null));
      // }
    }

    setInProgress(false);
  };

  const chatName = convo.get('name');
  const title = `${isBan ? window.i18n('banUser') : window.i18n('unbanUser')}`;

  const onPubkeyBoxChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputBoxValue(e.target.value?.trim() || '');
  };

  /**
   * Starts procedure for banning/unbanning user and all their messages using dialog
   */
  const startBanAndDeleteAllSequence = async () => {
    await banOrUnBanUser(true);
  };

  const buttonText = isBan ? i18n('banUser') : i18n('unbanUser');

  return (
    <BchatWrapperModal
      showHeader={false}
      isloading={inProgress}
      okButton={{
        text: window.i18n('ok'),
        color: BchatButtonColor.Primary,
        onClickOkHandler: banUser ? banOrUnBanUser : startBanAndDeleteAllSequence,
      }}
      cancelButton={{
        status: true,
        text: window.i18n('cancel'),
        onClickCancelHandler: () => {
          dispatch(updateBanOrUnbanUserModal(null));
        },
      }}
    >
      <Flex container={true} flexDirection="column" alignItems="center">
        <Flex container={true} flexDirection="row" width="500px" style={{ marginTop: '30px' }}>
          <div className="banUnbanPopup">
            <BchatIcon
              iconType={isBan ? 'banUser' : 'unBanUser'}
              iconSize={30}
              iconColor={isBan ? '#FF3E3E' : 'var(--color-icon)'}
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <div className="banUser-title">{title}</div>
            <div className="banUser-message">{chatName}</div>
          </div>
        </Flex>
        <div className="banUser-box" style={{ width: '100%', padding: '20px 5px' }}>
          <div className="inputBox">
            <input
              style={{ backgroundColor: 'var(--color-hop-bg)' }}
              ref={inputRef}
              type="text"
              placeholder={i18n('enterBchatID')}
              dir="auto"
              onChange={onPubkeyBoxChanges}
              disabled={inProgress || wasGivenAPubkey}
              value={wasGivenAPubkey ? inputTextToDisplay : inputBoxValue}
            />
          </div>
          {isBan && <SpacerLG />}
          <Flex container={true} justifyContent="space-between">
            {isBan && (
              <>
                <BchatButton
                  buttonType={BchatButtonType.Default}
                  buttonColor={banUser ? BchatButtonColor.Danger : BchatButtonColor.Enable}
                  onClick={() => {
                    setBanUser(true);
                  }}
                  text={buttonText}
                  disabled={inProgress}
                  style={{
                    width: '230px',
                    height: '60px',
                    borderRadius: '16px',
                    fontSize: '20px',
                  }}
                  iconType={banUser ? 'dot' : null}
                  iconSize={10}
                />
                <BchatButton
                  buttonType={BchatButtonType.Default}
                  buttonColor={!banUser ? BchatButtonColor.Danger : BchatButtonColor.Enable}
                  onClick={() => {
                    setBanUser(false);
                  }}
                  text={i18n('banUserAndDeleteAll')}
                  disabled={inProgress}
                  style={{
                    width: '230px',
                    height: '60px',
                    borderRadius: '16px',
                    fontSize: '20px',
                  }}
                  iconType={!banUser ? 'dot' : null}
                  iconSize={10}
                />
              </>
            )}
          </Flex>
        </div>
      </Flex>
    </BchatWrapperModal>
  );
};
