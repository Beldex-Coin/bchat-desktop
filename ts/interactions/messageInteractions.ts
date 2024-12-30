import _ from 'lodash';
import { ApiV2 } from '../bchat/apis/open_group_api/opengroupV2';
import { joinOpenGroupV2WithUIEvents } from '../bchat/apis/open_group_api/opengroupV2/JoinOpenGroupV2';
import {
  isOpenGroupV2,
  openGroupV2CompleteURLRegex,
} from '../bchat/apis/open_group_api/utils/OpenGroupUtils';
import { getConversationController } from '../bchat/conversations';
import { PubKey } from '../bchat/types';

import { BchatButtonColor } from '../components/basic/BchatButton';

import { updateBanOrUnbanUserModal, updateConfirmModal } from '../state/ducks/modalDialog';

import { getMessagesBySentAt } from '../data/data';
import { MessageModel } from '../models/message';
import { SignalService } from '../protobuf';
import { ReactionList } from '../types/Message';
import { ToastUtils } from '../bchat/utils';

export function banUser(userToBan: string, conversationId: string) {
  let pubKeyToBan: PubKey;
  try {
    pubKeyToBan = PubKey.cast(userToBan);
  } catch (e) {
    window?.log?.warn(e);
    ToastUtils.pushUserBanFailure();
    return;
  }
  if (!isOpenGroupV2(conversationId)) {
    window.log.warn(`Conversation ${conversationId} is not an Social group`);
    ToastUtils.pushUserBanFailure();

    return;
  }

  window.inboxStore?.dispatch(
    updateBanOrUnbanUserModal({ banType: 'ban', conversationId, pubkey: pubKeyToBan.key })
  );
}

/**
 * There is no way to unban on an socialgroupv1 server.
 * This function only works for socialgroupv2 server
 */
export function unbanUser(userToUnBan: string, conversationId: string) {
  let pubKeyToUnban: PubKey;
  try {
    pubKeyToUnban = PubKey.cast(userToUnBan);
  } catch (e) {
    window?.log?.warn(e);
    ToastUtils.pushUserBanFailure();
    return;
  }
  if (!isOpenGroupV2(conversationId)) {
    window.log.warn(`Conversation ${conversationId} is not an Social group`);
    ToastUtils.pushUserUnbanFailure();

    return;
  }
  window.inboxStore?.dispatch(
    updateBanOrUnbanUserModal({ banType: 'unban', conversationId, pubkey: pubKeyToUnban.key })
  );
}

/**
 * Handle reactions on the client by updating the state of the source message
 *
 */
export const handleMessageReaction = async (reaction: SignalService.DataMessage.IReaction) => {
  const timestamp = Number(reaction.id);

  if (!reaction.emoji) {
    window?.log?.warn(`There is no emoji for the reaction ${timestamp}.`);
    return;
  }

  const collection = await getMessagesBySentAt(timestamp);
  const originalMessage = collection.find((item: MessageModel) => {
    const messageTimestamp = item.get('sent_at');
    return Boolean(messageTimestamp && messageTimestamp === timestamp);
  });

  if (!originalMessage) {
    window?.log?.warn(`We did not find reacted message ${timestamp}.`);
    return;
  }

  let reacts: ReactionList = originalMessage.get('reacts') ?? {};
  reacts[reaction.emoji] = reacts[reaction.emoji] || {};
  const senders:any = reacts[reaction.emoji].senders ?? [];

  switch (reaction.action) {
    // Add reaction
    case 0:
      if (senders.includes(reaction.author)) {
        window?.log?.info('Received duplicate message reaction. Dropping it.');
        return;
      }
      senders.push(reaction.author);
      break;
    // Remove reaction
    case 1:
    default:
      if (senders.length > 0) {
        const deleteIndex = senders.indexOf(reaction.author);
        // TODO better edge cases
        senders.splice(deleteIndex, 1);
      }
  }

  if (senders.length > 0) {
    reacts[reaction.emoji].senders = senders;
  } else {
    // tslint:disable-next-line: no-dynamic-delete
    delete reacts[reaction.emoji];
  }
  originalMessage.set({
    reacts: !_.isEmpty(reacts) ? reacts: undefined,
  });

  await originalMessage.commit();
};

export function copyBodyToClipboard(body?: string | null) {
  window.clipboard.writeText(body);

  ToastUtils.pushCopiedToClipBoard();
}

export async function removeSenderFromModerator(sender: string, convoId: string) {
  try {
    const pubKeyToRemove = PubKey.cast(sender);
    const convo = getConversationController().getOrThrow(convoId);

    const roomInfo = convo.toOpenGroupV2();
    const res = await ApiV2.removeModerator(pubKeyToRemove, roomInfo);
    if (!res) {
      window?.log?.warn('failed to remove moderator:', res);

      ToastUtils.pushFailedToRemoveFromModerator();
    } else {
      window?.log?.info(`${pubKeyToRemove.key} removed from moderators...`);
      ToastUtils.pushUserRemovedFromModerators();
    }
  } catch (e) {
    window?.log?.error('Got error while removing moderator:', e);
  }
}

export async function addSenderAsModerator(sender: string, convoId: string) {
  try {
    const pubKeyToAdd = PubKey.cast(sender);
    const convo = getConversationController().getOrThrow(convoId);

    const roomInfo = convo.toOpenGroupV2();
    const res = await ApiV2.addModerator(pubKeyToAdd, roomInfo);
    if (!res) {
      window?.log?.warn('failed to add moderator:', res);

      ToastUtils.pushFailedToAddAsModerator();
    } else {
      window?.log?.info(`${pubKeyToAdd.key} added to moderators...`);
      ToastUtils.pushUserAddedToModerators();
    }
  } catch (e) {
    window?.log?.error('Got error while adding moderator:', e);
  }
}

const acceptSocialGroupInvitationV2 = (completeUrl: string, roomName?: string) => {
  const onClickClose = () => {
    window.inboxStore?.dispatch(updateConfirmModal(null));
  };

  window.inboxStore?.dispatch(
    updateConfirmModal({
      title: window.i18n('joinSocialGroupAfterInvitationConfirmationTitle', [
        roomName || 'Unknown',
      ]),
      message: window.i18n('joinSocialGroupAfterInvitationConfirmationDesc', [
        roomName || 'Unknown',
      ]),

      okText: 'Yes',
      okTheme: BchatButtonColor.Primary,
      cancelText: 'No',
      iconShow: true,
      iconSize: 30,
      bchatIcon: 'peopleGrp',
      // customIcon:customIcon,

      onClickOk: async () => {
        await joinOpenGroupV2WithUIEvents(completeUrl, true, false);
      },
      onClickClose,
    })
  );
  // this function does not throw, and will showToasts if anything happens
};

/**
 * Accepts a v2 url Social group invitation (with pubkey) or just log an error
 */
export const acceptOpenGroupInvitation = (completeUrl: string, roomName?: string) => {
  if (completeUrl.match(openGroupV2CompleteURLRegex)) {
    acceptSocialGroupInvitationV2(completeUrl, roomName);
  } else {
    window?.log?.warn('Invalid opengroup url:', completeUrl);
  }
};
