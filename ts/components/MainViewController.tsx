import React, { useState } from 'react';

import { ToastUtils } from '../bchat/utils';
import { createClosedGroup as createClosedGroupV2 } from '../receiver/closedGroups';
import { VALIDATION } from '../bchat/constants';
import SmileSymbolIcon from './icon/SmileSymbolIcon';
// import { BchatInput } from './basic/BchatInput';
import { BchatButton, BchatButtonColor, BchatButtonType } from './basic/BchatButton';
import { SpacerLG } from './basic/Text';
import { BchatIdEditable } from './basic/BchatIdEditable';
import { PubKey } from '../bchat/types/PubKey';
import { getConversationController } from '../bchat/conversations';
import { ConversationTypeEnum } from '../models/conversation';
import { openConversationWithMessages } from '../state/ducks/conversations';
import { SNodeAPI } from '../bchat/apis/snode_api';

export class MessageView extends React.Component {
  public render() {
    return (
      <div className="conversation placeholder">
        <div className="conversation-header" />
        <div className="container">
          <div className="content bchat-full-logo">
            <div className="bchat-text-logo">
              {/* <p className="bchat-text">
                Much empty. Such wow.<br></br> Get some friends to BChat!
              </p> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const AddNewContactInEmptyConvo = () => {
  const [bchatId, setBchatId] = useState('');
  async function handleMessageButtonClick() {
    const pubkeyorOnsTrimmed = bchatId.trim();
    if (
      (!pubkeyorOnsTrimmed || pubkeyorOnsTrimmed.length !== 66) &&
      !pubkeyorOnsTrimmed.toLowerCase().endsWith('.bdx')
    ) {
      ToastUtils.pushToastError('invalidPubKey', window.i18n('invalidNumberError')); // or Bns name
      return;
    }
    if (!PubKey.validateWithError(pubkeyorOnsTrimmed)) {
      // this is a pubkey
      await getConversationController().getOrCreateAndWait(
        pubkeyorOnsTrimmed,
        ConversationTypeEnum.PRIVATE
      );

      await openConversationWithMessages({ conversationKey: pubkeyorOnsTrimmed, messageId: null });
      // closeOverlay();
    } else {
      // setLoading(true);
      try {
        const resolvedBchatID = await SNodeAPI.getBchatIDForOnsName(pubkeyorOnsTrimmed);
        if (PubKey.validateWithError(resolvedBchatID)) {
          throw new Error('Got a resolved BNS but the returned entry is not a valid bchatID');
        }
        // this is a pubkey
        await getConversationController().getOrCreateAndWait(
          resolvedBchatID,
          ConversationTypeEnum.PRIVATE
        );
        await openConversationWithMessages({
          conversationKey: resolvedBchatID,
          messageId: null,
          bns: pubkeyorOnsTrimmed,
        });
      } catch (e) {
        window?.log?.warn('failed to resolve bns name', pubkeyorOnsTrimmed, e);

        ToastUtils.pushToastError('invalidPubKey', window.i18n('failedResolveOns'));
      } finally {
      }
    }
  }
  return (
    <div className="conversation placeholder">
      <div className="conversation-header" />
      <div className="container">
        <div className="content bchat-full-logo">
          <div className="bchat-text-logo"></div>
          <section style={{ width: '450px' }}>
            <div className="bchat-text">
              Start a New Chat <SmileSymbolIcon />
            </div>
            <SpacerLG />
            <SpacerLG />
            <div>
              <BchatIdEditable
                editable={true}
                placeholder={'Enter BChat ID or BNS'}
                value={bchatId}
                isGroup={false}
                maxLength={66}
                onChange={setBchatId}
                dataTestId="new-closed-group-name"
              />
            </div>
            <SpacerLG />
            <div>
              <BchatButton
                text={'Let’s Bchat'}
                buttonType={BchatButtonType.Default}
                buttonColor={BchatButtonColor.Primary}
                onClick={() => handleMessageButtonClick()}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
// /////////////////////////////////////
// //////////// Management /////////////
// /////////////////////////////////////

/**
 * Returns true if the group was indead created
 */
async function createClosedGroup(
  groupName: string,
  groupMemberIds: Array<string>
): Promise<boolean> {
  // Validate groupName and groupMembers length
  if (groupName.length === 0) {
    ToastUtils.pushToastError('invalidGroupName', window.i18n('invalidGroupNameTooShort'));

    return false;
  } else if (groupName.length > VALIDATION.MAX_GROUP_NAME_LENGTH) {
    ToastUtils.pushToastError('invalidGroupName', window.i18n('invalidGroupNameTooLong'));
    return false;
  }

  // >= because we add ourself as a member AFTER this. so a 10 group is already invalid as it will be 11 with ourself
  // the same is valid with groups count < 1

  if (groupMemberIds.length < 1) {
    ToastUtils.pushToastError('pickSecretGroupMember', window.i18n('pickSecretGroupMember'));
    return false;
  } else if (groupMemberIds.length >= VALIDATION.CLOSED_GROUP_SIZE_LIMIT) {
    ToastUtils.pushToastError('secretGroupMaxSize', window.i18n('secretGroupMaxSize'));
    return false;
  }

  await createClosedGroupV2(groupName, groupMemberIds);

  return true;
}

export const MainViewController = {
  createClosedGroup,
};
