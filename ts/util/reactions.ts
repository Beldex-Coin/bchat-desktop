import { UserUtils } from '../bchat/utils';
import { getRecentReactions, saveRecentReations } from './storage';
import { SignalService } from '../protobuf';
import { MessageModel } from '../models/message';

import { Data, getMessageById } from '../data/data';
import { isEmpty, isString } from 'lodash';
import { OpenGroupReactionList, ReactionList, RecentReactions } from '../types/Reaction';
import { ConversationModel } from '../models/conversation';
import { getConversationController } from '../bchat/conversations';
import { roomHasBlindEnabled } from '../types/sqlSharedTypes';
import { OpenGroupData } from '../data/opengroups';
import { PubKey } from '../bchat/types/PubKey';


export type BlindedIdMapping = {
  blindedId: string;
  serverPublicKey: string;
  realSessionId: string;
};

// for now, we assume we won't find a lot of blinded keys.
// So we can store all of those in a single JSON string in the db.
let cachedKnownMapping: Array<BlindedIdMapping> | null = null;

const rateCountLimit = 20;
const rateTimeLimit = 60 * 1000;
const latestReactionTimestamps: Array<number> = [];

/**
 * Retrieves the original message of a reaction
 */
const getMessageByReaction = async (
  reaction: SignalService.DataMessage.IReaction,
  isOpenGroup: boolean
): Promise<MessageModel | null> => {
  let originalMessage = null;
  const originalMessageId = Number(reaction.id);
  //support only desktop versions
  // const originalMessageAuthor = reaction.author;

  if (isOpenGroup) {
    originalMessage = await Data.getMessageByServerId(originalMessageId);
  } else {
    const collection = await Data.getMessagesBySentAt(originalMessageId);
    originalMessage = collection.find((item: MessageModel) => {
      const messageTimestamp = item.get('sent_at');
      //support only desktop versions
      // const author = item.get('source');
      return Boolean(
        messageTimestamp &&
          messageTimestamp === originalMessageId
          //support only desktop versions
          //  &&
          // author &&
          // author === originalMessageAuthor
      );
    });
  }

  if (!originalMessage) {
    window?.log?.warn(`Cannot find the original reacted message ${originalMessageId}.`);
    return null;
  }
  return originalMessage;
};
/**
 * Sends a Reaction Data Message, don't use for OpenGroups
 */
export const sendMessageReaction = async (messageId: string, emoji: string) => {
  const found = await getMessageById(messageId);
  if (found) {
    const conversationModel = found?.getConversation();
    if (!conversationModel) {
      window.log.warn(`Conversation for ${messageId} not found in db`);
      return;
    }
    if (!conversationModel.hasReactions) {
      window.log.warn("This conversation doesn't have reaction support");
      return;
    }

    const timestamp = Date.now();
    latestReactionTimestamps.push(timestamp);

    if (latestReactionTimestamps.length > rateCountLimit) {
      const firstTimestamp = latestReactionTimestamps[0];
      if (timestamp - firstTimestamp < rateTimeLimit) {
        latestReactionTimestamps.pop();
        return;
      } else {
        latestReactionTimestamps.shift();
      }
    }
    const isOpenGroup = Boolean(found?.get('isPublic'));
    const id = (isOpenGroup && found.get('serverId')) || Number(found.get('sent_at'));
    const me: any = isOpenGroup || UserUtils.getOurPubKeyStrFromCache();
    //support only desktop versions
    // const author = found.get('source');
    let action = 0;

    const reacts = found.get('reacts');

    const findEmojiForSender = (data: any, targetKey: string) => {
      for (const emoji in data) {
        const { senders } = data[emoji];
        if (targetKey in senders) {
          return emoji;
        }
      }
      return null;
    };
    const result =reacts? findEmojiForSender(reacts, me):null;
    if (
      reacts &&
      Object.keys(reacts).includes(emoji) &&
      Object.keys(reacts[emoji].senders).includes(me)
    ) {
      window.log.info('found matching reaction removing it');
      action = 1;
    } else if (result) {
      let reaction = {
        id,
        //support for cross platforms
        author:UserUtils.getOurPubKeyStrFromCache(),
        emoji: result,
        action:1,
      };
      window.log.info('found matching reaction removing it, limit user has react one reaction');
      await conversationModel.sendReaction(messageId, reaction);
     
    } 
    // else {
      const reactions = getRecentReactions();
      if (reactions) {
        await updateRecentReactions(reactions, emoji);
      }
    // }
    const reaction = {
      id,
      //support for cross platforms
      author:UserUtils.getOurPubKeyStrFromCache(),
      emoji,
      action,
    };
    await conversationModel.sendReaction(messageId, reaction);

    window.log.info(`${action === 0 ? 'added' : 'removed'} `, emoji, 'reaction at', id);
    return reaction;
  } else {
    window.log.warn(`Message ${messageId} not found in db`);
    return;
  }
};

/**
 * Handle reactions on the client by updating the state of the source message
 */
export const handleMessageReaction = async (
  reaction: SignalService.DataMessage.IReaction,
  sender: string,
  isOpenGroup: boolean,
  messageId?: string
) => {
  window?.log?.warn(`reaction: DataMessage ID: ${messageId}.`);

  if (!reaction.emoji) {
    window?.log?.warn(`There is no emoji for the reaction ${messageId}.`);
    return;
  }

  const originalMessage = await getMessageByReaction(reaction, isOpenGroup);

  if (!originalMessage) {
    return;
  }
  if (originalMessage.get('isPublic')) {
    return;
  }
  const reacts: ReactionList = originalMessage.get('reacts') ?? {};
  reacts[reaction.emoji] = reacts[reaction.emoji] || { count: null, senders: {} };
  const details = reacts[reaction.emoji] ?? {};
  const senders = Object.keys(details.senders);
  window.log.info(
    `${sender} ${reaction.action === 0 ? 'added' : 'removed'} a ${reaction.emoji} reaction`
  );
  switch (reaction.action) {
    // Add reaction
    case SignalService.DataMessage.Reaction.Action.REACT:
      if (senders.includes(sender) && details.senders[sender] !== '') {
        window?.log?.info(
          'Received duplicate message reaction. Dropping it. id:',
          details.senders[sender]
        );
        return;
      }
      details.senders[sender] = messageId ?? '';
      break;
    // Remove reaction
    case SignalService.DataMessage.Reaction.Action.REMOVE:
    default:
      if (senders.length > 0) {
        if (senders.indexOf(sender) >= 0) {
          // tslint:disable-next-line: no-dynamic-delete
          delete details.senders[sender];
        }
      }
  }

  const count = Object.keys(details.senders).length;
  if (count > 0) {
    reacts[reaction.emoji].count = count;
    reacts[reaction.emoji].senders = details.senders;
    if (details && details.index === undefined) {
      reacts[reaction.emoji].index = originalMessage.get('reactsIndex') ?? 0;
      originalMessage.set('reactsIndex', (originalMessage.get('reactsIndex') ?? 0) + 1);
    }
  } else {
    // tslint:disable-next-line: no-dynamic-delete
    delete reacts[reaction.emoji];
  }

  originalMessage.set({
    reacts: !isEmpty(reacts) ? reacts : undefined,
  });

  await originalMessage.commit();
  return originalMessage;
};

export const handleOpenGroupMessageReactions = async (
  reactions: OpenGroupReactionList,
  serverId: number
) => {
  const originalMessage = await Data.getMessageByServerId(serverId);
  if (!originalMessage) {
    window?.log?.warn(`Cannot find the original reacted message ${serverId}.`);
    return;
  }
  if (isEmpty(reactions)) {
    if (originalMessage.get('reacts')) {
      originalMessage.set({
        reacts: undefined,
      });
    }
  } else {
    const reacts: ReactionList = {};
    Object.keys(reactions).forEach(key => {
      const emoji = decodeURI(key);
      const senders: Record<string, string> = {};
      reactions[key].reactors.forEach(reactor => {
        senders[reactor] = String(serverId);
      });
      reacts[emoji] = { count: reactions[key].count, index: reactions[key].index, senders };
    });
    originalMessage.set({
      reacts,
    });
  }
  await originalMessage.commit();
  return originalMessage;
};

export const updateRecentReactions = async (reactions: Array<string>, newReaction: string) => {
  window?.log?.info('updating recent reactions with', newReaction);
  const recentReactions = new RecentReactions(reactions);
  const foundIndex = recentReactions.items.indexOf(newReaction);
  if (foundIndex >= 0) {
    if (foundIndex === 0) {
      return;
    }
    recentReactions.swap(foundIndex);
  } else {
    recentReactions.push(newReaction);
  }
  await saveRecentReations(recentReactions.items);
};

/**
 * This function returns the cached blindedId for us, given a public conversation.
 */
export function getUsBlindedInThatServer(convo: ConversationModel | string): string | undefined {
  if (!convo) {
    return undefined;
  }
  const convoId = isString(convo) ? convo : convo.id;

  if (
    !getConversationController()
      .get(convoId)
      ?.isOpenGroupV2()
  ) {
    return undefined;
  }
  const room = OpenGroupData.getV2OpenGroupRoom(isString(convo) ? convo : convo.id);
  if (!room || !roomHasBlindEnabled(room) || !room.serverPublicKey) {
    return undefined;
  }
  const usNaked = UserUtils.getOurPubKeyStrFromCache();

  const found = assertLoaded().find(
    m => m.serverPublicKey === room.serverPublicKey && m.realSessionId === usNaked
  );
  return found?.blindedId;
}
function assertLoaded(): Array<BlindedIdMapping> {
  if (cachedKnownMapping === null) {
    throw new Error('loadKnownBlindedKeys must be called on app start');
  }
  return cachedKnownMapping;
}

export function isUsAnySogsFromCache(blindedOrNakedId: string): boolean {
  const usUnblinded = UserUtils.getOurPubKeyStrFromCache();

  if (!PubKey?.isBlinded(blindedOrNakedId)) {
    return blindedOrNakedId === usUnblinded;
  }
  const found = assertLoaded().find(
    m => m.blindedId === blindedOrNakedId && m.realSessionId === usUnblinded
  );
  return Boolean(found);
}
