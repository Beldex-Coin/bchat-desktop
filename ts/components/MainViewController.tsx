import React, { useState } from 'react';

import { ToastUtils } from '../bchat/utils';
import { createClosedGroup as createClosedGroupV2 } from '../receiver/closedGroups';
import { VALIDATION } from '../bchat/constants';
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
    // NOIR: no illustration — a quiet system void with one glyph and a hint.
    return (
      <div className="conversation placeholder">
        <div className="conversation-header" />
        <div className="container">
          <div className="noir-void">
            <svg
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            >
              <path d="M4 5h16v12H8l-4 4z" />
            </svg>
            <div className="noir-void__title">NO CONVERSATION SELECTED</div>
            <div className="noir-void__hint">
              PICK A CHAT // OR PRESS <b>+</b> TO START ONE
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
    if (!pubkeyorOnsTrimmed) {
      ToastUtils.pushToastError('invalidPubKey', 'Please enter the Id or BNS'); // or Bns name
      return;
    }
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
  // NOIR: no illustration — first contact is a terminal prompt on the field.
  return (
    <div className="conversation placeholder">
      <div className="conversation-header" />
      <div className="container">
        <div className="noir-first-contact">
          <div className="noir-step-line">FIRST CONTACT // DIRECT MESSAGE</div>
          <h1 className="noir-onb-h">
            Start a new chat<span className="noir-cursor">_</span>
          </h1>
          <p className="noir-onb-p">
            Reach anyone by their BChat ID or BNS name. No phone number. No email.
          </p>
          <SpacerLG />
          <label className="noir-data-label">BCHAT ID / BNS NAME</label>
          <div className="noir-id-field">
            <BchatIdEditable
              editable={true}
              placeholder={'ENTER A BCHAT ID OR BNS NAME'}
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
              text={'Start chat'}
              buttonType={BchatButtonType.Default}
              buttonColor={BchatButtonColor.Primary}
              onClick={() => handleMessageButtonClick()}
            />
          </div>
          <div className="noir-first-contact__foot">
            END-TO-END ENCRYPTED // ROUTED OVER THE BELDEX NETWORK
          </div>
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
  const regex = /^[a-zA-Z0-9\s]*$/;
  if (groupName.length === 0) {
    ToastUtils.pushToastError('invalidGroupName', window.i18n('invalidGroupNameTooShort'));

    return false;
  } else if (groupName.length > VALIDATION.MAX_GROUP_NAME_LENGTH) {
    ToastUtils.pushToastError('invalidGroupName', window.i18n('invalidGroupNameTooLong'));
    return false;
  } else if (!regex.test(groupName)) {
    ToastUtils.pushToastError('invalidGroupName', window.i18n('createSecretGroupNameError'));
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
