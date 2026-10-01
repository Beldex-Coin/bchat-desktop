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
import styled from 'styled-components';

export class MessageView extends React.Component<{ variant?: 'social' | 'secret' }> {
  public render() {
    // dark theme, Social Group overlay open (Figma 4:839): social-group illustration + the
    // description with "Social groups" picked out in white
    // same for the Secret Group overlay (Figma 73:4300): lock illustration + description
    if (this.props.variant === 'social' || this.props.variant === 'secret') {
      const secret = this.props.variant === 'secret';
      const text = window.i18n(secret ? 'secretGroupDescription' : 'socialGroupDescription');
      const lead = 'Social groups';
      const hasLead = text.startsWith(lead);
      return (
        <div className="conversation placeholder">
          <div className="conversation-header" />
          <div className="container">
            <div className="content">
              <div className={`empty-chat empty-chat--${this.props.variant}`}>
                <div className="empty-chat__art" aria-hidden="true" />
                <p className="empty-chat__note">
                  {secret ? (
                    text
                  ) : hasLead ? (
                    <>
                      <span className="empty-chat__lead">{lead}</span>
                      {text.slice(lead.length)}
                    </>
                  ) : (
                    text
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
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
            {/* Dark theme (Figma 1:56419): illustration + privacy note; hidden in light */}
            <div className="empty-chat">
              <div className="empty-chat__art" aria-hidden="true" />
              <p className="empty-chat__note">{window.i18n('emptyChatPrivacyNote')}</p>
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
    const pubkeyOrBnsTrimmed = bchatId.trim();
    if (!pubkeyOrBnsTrimmed) {
      ToastUtils.pushToastError('invalidPubKey', window.i18n('errMsgCreateConvo')); // or Bns name
      return;
    }
    if (
      (!pubkeyOrBnsTrimmed || pubkeyOrBnsTrimmed.length !== 66) &&
      !pubkeyOrBnsTrimmed.toLowerCase().endsWith('.bdx')
    ) {
      ToastUtils.pushToastError('invalidPubKey', window.i18n('invalidNumberError')); // or Bns name
      return;
    }
    if (!PubKey.validateWithError(pubkeyOrBnsTrimmed)) {
      // this is a pubkey
      await getConversationController().getOrCreateAndWait(
        pubkeyOrBnsTrimmed,
        ConversationTypeEnum.PRIVATE
      );

      await openConversationWithMessages({ conversationKey: pubkeyOrBnsTrimmed, messageId: null });
      // closeOverlay();
    } else {
      // setLoading(true);
      try {
        const resolvedBchatID = await SNodeAPI.getBchatIDForBnsName(pubkeyOrBnsTrimmed);
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
          bns: pubkeyOrBnsTrimmed,
        });
      } catch (e) {
        window?.log?.warn('failed to resolve bns name', pubkeyOrBnsTrimmed, e);

        ToastUtils.pushToastError('invalidPubKey', window.i18n('failedResolveBns'));
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
          <StartConvoWrapper>
            <div className="bchat-text">
              {window.i18n('startConversation')} <SmileSymbolIcon />
            </div>
            <SpacerLG />
            {/* <SpacerLG /> */}
            <div>
              <BchatIdEditable
                editable={true}
                placeholder={window.i18n('enterBChatIDorBNS')}
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
                text={window.i18n('letsBchat')}
                buttonType={BchatButtonType.Default}
                buttonColor={BchatButtonColor.Primary}
                onClick={() => handleMessageButtonClick()}
              />
            </div>
          </StartConvoWrapper>
        </div>
      </div>
    </div>
  );
};
const StartConvoWrapper = styled.div`
  width: 24vw;
  max-width: 470px;
  // margin-left: 43px;
  margin-inline-start: 100px;
`;
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

  // Offline, every invite fails, so the group's encryption keypair is never saved and it's never
  // polled (see createClosedGroup() in receiver/closedGroups.ts): we'd create a group nobody else
  // knows about and that we can't send in. Refuse up front instead. navigator.onLine covers the
  // 1s debounce before disconnect() flips window.isOnline.
  if (!window.isOnline || !window.navigator.onLine) {
    ToastUtils.pushToastError('checkInternetConnection', window.i18n('checkInternetConnection'));
    return false;
  }

  await createClosedGroupV2(groupName, groupMemberIds);

  return true;
}

export const MainViewController = {
  createClosedGroup,
};
