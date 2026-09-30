import _ from 'lodash';
import { getConversationController } from '../bchat/conversations';
import { ToastUtils } from '../bchat/utils';
import { getMessageById } from '../data/data';
import { loadAttachmentData, processNewAttachment } from '../types/MessageAttachment';
import { StagedAttachmentImportedType } from '../util/attachmentsUtil';

/**
 * Makes a new local copy of an attachment we already have on disk, so the forwarded message owns
 * its own file (deleting the original message later won't break the copy). Attachments that were
 * never downloaded (no path yet) can't be copied and are skipped.
 */
async function copyAttachmentForForward(attachment: any): Promise<StagedAttachmentImportedType | null> {
  if (!attachment?.path || attachment.pending) {
    return null;
  }
  try {
    const withData = await loadAttachmentData(attachment);
    if (!withData?.data) {
      return null;
    }
    const saved: any = await processNewAttachment({
      data: withData.data,
      contentType: attachment.contentType,
      fileName: attachment.fileName,
    });
    return {
      caption: attachment.caption,
      contentType: attachment.contentType,
      fileName: saved.fileName,
      path: saved.path,
      width: saved.width,
      height: saved.height,
      screenshot: saved.screenshot,
      thumbnail: saved.thumbnail,
      size: saved.size,
      flags: attachment.flags || undefined,
    } as StagedAttachmentImportedType;
  } catch (e) {
    window?.log?.warn('forward: could not copy attachment', e);
    return null;
  }
}

/**
 * Sends a copy of each message (text, attachments and shared contacts; no "forwarded" label, no
 * quote) to every selected conversation, oldest message first. Payment messages are not forwarded.
 */
export async function forwardMessagesToConversations(
  messageIds: Array<string>,
  conversationIds: Array<string>
) {
  const found = _.compact(await Promise.all(messageIds.map(id => getMessageById(id))));
  const messages = _.sortBy(found, m => m.get('sent_at') || m.get('received_at') || 0);

  let sent = 0;
  let skipped = 0;
  for (const conversationId of conversationIds) {
    const conversation = getConversationController().get(conversationId);
    if (!conversation || conversation.isBlocked()) {
      skipped++;
      continue;
    }
    for (const message of messages) {
      if (message.get('payment') || message.get('isDeleted') || message.get('callNotificationType')) {
        skipped++;
        continue;
      }
      const originals = message.get('attachments') || [];
      const attachments = _.compact(await Promise.all(originals.map(copyAttachmentForForward)));
      if (attachments.length < originals.length) {
        skipped++;
      }
      const body = message.get('body') || '';
      const sharedContact = message.get('sharedContact');
      if (!body && !attachments.length && !sharedContact) {
        continue;
      }
      await conversation.sendMessage({
        body,
        attachments,
        quote: undefined,
        preview: undefined,
        groupInvitation: undefined,
        sharedContact: sharedContact || undefined,
      });
      sent++;
    }
  }

  if (sent && !skipped) {
    ToastUtils.pushToastSuccess('forwardMessages', window.i18n('messageForwarded'));
  } else if (sent) {
    ToastUtils.pushToastInfo('forwardMessages', window.i18n('messageForwardedPartly'));
  } else {
    ToastUtils.pushToastError('forwardMessages', window.i18n('forwardFailed'));
  }
}
