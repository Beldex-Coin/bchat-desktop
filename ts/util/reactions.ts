

import { UserUtils } from '../bchat/utils';
import { getRecentReactions, saveRecentReations } from './storage';
import { SignalService } from '../protobuf';
import { MessageModel } from '../models/message';

import { getMessageById, getMessagesBySentAt } from '../data/data';
import { isEmpty } from 'lodash';
import { ReactionList, RecentReactions } from '../types/Reaction';

const rateCountLimit = 20;
const rateTimeLimit = 60 * 1000;
const latestReactionTimestamps: Array<number> = [];

export const sendMessageReaction = async (messageId: string, emoji: string) => {
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
  
  const found = await getMessageById(messageId);
  if (found && found.get('sent_at')) {
    const conversationModel = found?.getConversation();
    if (!conversationModel) {
      window.log.warn(`Conversation for ${messageId} not found in db`);
      return;
    }

    const me = UserUtils.getOurPubKeyStrFromCache();
    const author = found.get('source');
    let action = 0;

    const reacts = found.get('reacts');
    if (reacts && Object.keys(reacts).includes(emoji) && Object.keys(reacts[emoji]).includes(me)) {
      window.log.info('found matching reaction removing it');
      action = 1;
    } else {
      const reactions = getRecentReactions();
      if (reactions) {
        await updateRecentReactions(reactions, emoji);
      }
    }
    const reaction = {
      id: Number(found.get('sent_at')),
      author,
      emoji,
      action,
    };

    await conversationModel.sendReaction(messageId, reaction);

    window.log.info(  
      me,
      `${action === 0 ? 'added' : 'removed'} a`,
      emoji,
      'reaction at',
      found.get('sent_at')
    );
    return reaction;
  } else {
    window.log.warn(`Message ${messageId} not found in db`);
    return;
  }
};

/**
 * Handle reactions on the client by updating the state of the source message
 */
export const handleMessageReaction = async (reaction: SignalService.DataMessage.IReaction,sender: string,messageId?: string) => {
  window?.log?.warn(`reaction: DataMessage ID: ${messageId}.`);
  const originalMessageTimestamp = Number(reaction.id);
  const originalMessageAuthor = reaction.author;

  if (!reaction.emoji) {
    window?.log?.warn(`There is no emoji for the reaction ${originalMessageTimestamp}.`);
    return;
  }

  const collection = await getMessagesBySentAt(originalMessageTimestamp);
  const originalMessage = collection.find((item: MessageModel) => {
    const messageTimestamp = item.get('sent_at');
    const author = item.get('source');
    return Boolean(
      messageTimestamp &&
        messageTimestamp === originalMessageTimestamp &&
        author &&
        author === originalMessageAuthor
    );
  });

  if (!originalMessage) {
    window?.log?.warn(`We did not find reacted message ${originalMessageTimestamp}.`);
    return;
  }
console.log('originalMessage.get -->',originalMessage.get('reacts') )
  const reacts: ReactionList = originalMessage.get('reacts') ?? {};
  reacts[reaction.emoji] = reacts[reaction.emoji] || {};
  const details = reacts[reaction.emoji] ?? {};
  const senders = Object.keys(details);

  switch (reaction.action) {
    // Add reaction
    case SignalService.DataMessage.Reaction.Action.REACT:
      if (senders.includes(sender) && details[sender] !== '') {
        window?.log?.info('Received duplicate message reaction. Dropping it. id:', details[sender]);
        return;
      }
      details[sender] = messageId ?? '';
      break;
    // Remove reaction
    case SignalService.DataMessage.Reaction.Action.REMOVE:
    default:
      if (senders.length > 0) {
        if (senders.indexOf(sender) >= 0) {
          // tslint:disable-next-line: no-dynamic-delete
          delete details[sender];
        }
      }
      
  }

  if (Object.keys(details).length > 0) {
    reacts[reaction.emoji] = details;
  } else {
    // tslint:disable-next-line: no-dynamic-delete
    delete reacts[reaction.emoji];
  }
  console.log('reaction reacts', reacts);
  originalMessage.set({
    reacts: !isEmpty(reacts) ? reacts : undefined,
  });

  await originalMessage.commit();
  console.log('originalMessage -->',originalMessage)
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