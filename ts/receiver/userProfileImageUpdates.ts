import Queue from 'queue-promise';
import ByteBuffer from 'bytebuffer';
import _ from 'lodash';

import { downloadAttachment } from './attachments';

import {  allowOnlyLatestProcess, allowOnlyOneAtATime, hasAlreadyOneAtaTimeMatching } from '../bchat/utils/Promise';
import { toHex } from '../bchat/utils/String';
import { processNewAttachment } from '../types/MessageAttachment';
import { MIME } from '../types';
import { autoScaleForIncomingAvatar } from '../util/attachmentsUtil';
import { decryptProfile } from '../util/crypto/profileEncrypter';
import { ConversationModel, ConversationTypeEnum } from '../models/conversation';
import { SignalService } from '../protobuf';
import { getConversationController } from '../bchat/conversations';
import { UserUtils } from '../bchat/utils';

const queue = new Queue({
  concurrent: 1,
  interval: 500,
});

queue.on('reject', error => {
  window.log.warn('[profile-update] task profile image update failed with', error);
});

export async function appendFetchAvatarAndProfileJob(
  conversation: ConversationModel,
  profile: SignalService.DataMessage.ILokiProfile,
  profileKey?: Uint8Array | null // was any
) {
  if (!conversation?.id) {
    window?.log?.warn('[profile-update] Cannot update profile with empty convoid');
    return;
  }
  const oneAtaTimeStr = `appendFetchAvatarAndProfileJob:${conversation.id}`;

  if (hasAlreadyOneAtaTimeMatching(oneAtaTimeStr)) {
    // window.log.debug(
    //   '[profile-update] not adding another task of "appendFetchAvatarAndProfileJob" as there is already one scheduled for the conversation: ',
    //   conversation.id
    // );
    return;
  }
  window.log.info(`[profile-update] queuing fetching avatar for ${conversation.id}`);
  const task = allowOnlyOneAtATime(oneAtaTimeStr, async () => {
    return createOrUpdateProfile(conversation, profile, profileKey);
  });

  queue.enqueue(async () => task);
}

/**
 * This function should be used only when we have to do a sync update to our conversation with a new profile/avatar image or display name
 * It tries to fetch the profile image, scale it, save it, and update the conversationModel
 */
export async function updateOurProfileSync(
  profile: SignalService.DataMessage.ILokiProfile,
  profileKey?: Uint8Array | null // was any
) {
  const ourConvo = getConversationController().get(UserUtils.getOurPubKeyStrFromCache());
  if (!ourConvo?.id) {
    window?.log?.warn('[profile-update] Cannot update our profile with empty convoid');
    return;
  }
   const oneAtaTimeStr = `appendFetchAvatarAndProfileJob:${ourConvo.id}`;
  return allowOnlyLatestProcess(oneAtaTimeStr, async (signal) => {
  return createOrUpdateProfile(
    ourConvo,
    profile,
    profileKey,
    signal
  );
 });

}

/**
 * Creates a new profile from the profile provided. Creates the profile if it doesn't exist.
 */
async function createOrUpdateProfile(
  conversation: ConversationModel,
  profile: SignalService.DataMessage.ILokiProfile,
  profileKey?: Uint8Array | null,
  signal?: AbortSignal
) {
  try {
    throwIfAborted(signal);

    const newProfile = conversation.get('profile') || {};
    let changes = false;

    if (newProfile.displayName !== profile.displayName) {
      changes = true;
    }
    newProfile.displayName = profile.displayName;

    if (profile.profilePicture && profileKey) {
      const prevPointer = conversation.get('avatarPointer');
      const needsUpdate =
        !prevPointer || !_.isEqual(prevPointer, profile.profilePicture);

      if (needsUpdate) {
        throwIfAborted(signal);

        window.log.debug(
          `[profile-update] starting downloading task for ${conversation.id}`
        );

        const downloaded = await downloadAttachment({
          url: profile.profilePicture,
          isRaw: true,
          signal,
        });

        throwIfAborted(signal);

        const profileKeyArrayBuffer = ByteBuffer
          .wrap(profileKey)
          .toArrayBuffer();

        throwIfAborted(signal);

        const decryptedData = await decryptProfile(
          downloaded.data,
          profileKeyArrayBuffer
        );

        throwIfAborted(signal);

        const scaledData = await autoScaleForIncomingAvatar(decryptedData);

        throwIfAborted(signal);

        const upgraded = await processNewAttachment({
          data: await scaledData.blob.arrayBuffer(),
          contentType: MIME.IMAGE_UNKNOWN,
        });

        throwIfAborted(signal);

        // Only update if successful
        conversation.set('avatarPointer', profile.profilePicture);
        conversation.set('profileKey', toHex(profileKey));
        newProfile.avatar = upgraded.path;
        changes = true;
      }
    }

    const conv = await getConversationController().getOrCreateAndWait(
      conversation.id,
      ConversationTypeEnum.PRIVATE
    );

    throwIfAborted(signal);

    await conv.setBchatProfile(newProfile);

    if (changes) {
      throwIfAborted(signal);
      await conv.commit();
    }

  } catch (e: any) {
    // Ignore abort errors silently
    if (e?.name === 'AbortError') {
      window?.log?.debug(
        `[profile-update] aborted for conversation ${conversation.id}`
      );
      return;
    }

    // Log real errors
    window?.log?.error(
      `[profile-update] failed for conversation ${conversation.id}: ${
        e?.message || e
      }`
    );

    throw e; // rethrow so caller can handle if needed
  }
}

export function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }
}
