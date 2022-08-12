import React from 'react';
import { toast } from 'react-toastify';
import { BchatToast, BchatToastType } from '../../components/basic/BchatToast';
import { BchatIconType } from '../../components/icon';
import { BchatSettingCategory } from '../../components/settings/BchatSettings';
import { SectionType, showLeftPaneSection, showSettingsSection } from '../../state/ducks/section';

// if you push a toast manually with toast...() be sure to set the type attribute of the BchatToast component
export function pushToastError(id: string, title: string, description?: string) {
  console.log("TOAST:ERROR",id,title,description)
  toast.error(
    <BchatToast title={title} description={description} type={BchatToastType.Error} />,
    { toastId: id, updateId: id }
  );
}

export function pushToastWarning(id: string, title: string, description?: string) {
  console.log("TOAST:WARN",id,title,description)
  toast.warning(
    <BchatToast title={title} description={description} type={BchatToastType.Warning} />,
    { toastId: id, updateId: id }
  );
}

export function pushToastInfo(
  id: string,
  title: string,
  description?: string,
  onToastClick?: () => void,
  delay?: number
) {
  toast.info(
    <BchatToast
      title={title}
      description={description}
      type={BchatToastType.Info}
      onToastClick={onToastClick}
    />,
    { toastId: id, updateId: id, delay }
  );
}

export function pushToastSuccess(
  id: string,
  title: string,
  description?: string,
  icon?: BchatIconType
) {
  toast.success(
    <BchatToast
      title={title}
      description={description}
      type={BchatToastType.Success}
      icon={icon}
    />,
    { toastId: id, updateId: id }
  );
}

export function pushLoadAttachmentFailure(message?: string) {
  if (message) {
    pushToastError('unableToLoadAttachment', `${window.i18n('unableToLoadAttachment')} ${message}`);
  } else {
    pushToastError('unableToLoadAttachment', window.i18n('unableToLoadAttachment'));
  }
}

export function pushFileSizeError(limit: number, units: string) {
  pushToastError('fileSizeWarning', window.i18n('fileSizeWarning'), `Max size: ${limit} ${units}`);
}

export function pushFileSizeErrorAsByte(bytesCount: number) {
  const units = ['kB', 'MB', 'GB'];
  let u = -1;
  let limit = bytesCount;
  do {
    limit /= 1000;
    u += 1;
  } while (limit >= 1000 && u < units.length - 1);
  pushFileSizeError(limit, units[u]);
}

export function pushMultipleNonImageError() {
  pushToastError(
    'cannotMixImageAndNonImageAttachments',
    window.i18n('cannotMixImageAndNonImageAttachments')
  );
}

export function pushCannotMixError() {
  pushToastError('oneNonImageAtATimeToast', window.i18n('oneNonImageAtATimeToast'));
}

export function pushMaximumAttachmentsError() {
  pushToastError('maximumAttachments', window.i18n('maximumAttachments'));
}

export function pushMessageBodyMissing() {
  pushToastError('messageBodyMissing', window.i18n('messageBodyMissing'));
}

export function pushCopiedToClipBoard() {
  pushToastInfo('copiedToClipboard', window.i18n('copiedToClipboard'));
}

export function pushRestartNeeded() {
  pushToastInfo('restartNeeded', window.i18n('spellCheckDirty'));
}

export function pushAlreadyMemberOpenGroup() {
  pushToastInfo('publicChatExists', window.i18n('publicChatExists'));
}



export function pushUserBanSuccess() {
  pushToastSuccess('userBanned', window.i18n('userBanned'));
}

export function pushUserBanFailure() {
  pushToastError('userBanFailed', window.i18n('userBanFailed'));
}

export function pushUserUnbanSuccess() {
  pushToastSuccess('userUnbanned', window.i18n('userUnbanned'));
}

export function  pushUserCopySuccess()
{
  pushToastSuccess('copied', "Successfully,copied!");
}

export function pushUserUnbanFailure() {
  pushToastError('userUnbanFailed', window.i18n('userUnbanFailed'));
}

export function pushMessageDeleteForbidden() {
  pushToastError('messageDeletionForbidden', window.i18n('messageDeletionForbidden'));
}

export function pushUnableToCall() {
  pushToastError('unableToCall', window.i18n('unableToCallTitle'), window.i18n('unableToCall'));
}

export function pushedMissedCall(conversationName: string) {
  pushToastInfo(
    'missedCall',
    window.i18n('callMissedTitle'),
    window.i18n('callMissed', [conversationName])
  );
}

const openPrivacySettings = () => {
  window.inboxStore?.dispatch(showLeftPaneSection(SectionType.Settings));
  window.inboxStore?.dispatch(showSettingsSection(BchatSettingCategory.Privacy));
};

export function pushedMissedCallCauseOfPermission(conversationName: string) {
  const id = 'missedCallPermission';
  toast.info(
    <BchatToast
      title={window.i18n('callMissedTitle')}
      description={window.i18n('callMissedCausePermission', [conversationName])}
      type={BchatToastType.Info}
      onToastClick={openPrivacySettings}
    />,
    { toastId: id, updateId: id, autoClose: 10000 }
  );
}

export function pushedMissedCallNotApproved(displayName: string) {
  pushToastInfo(
    'missedCall',
    window.i18n('callMissedTitle'),
    window.i18n('callMissedNotApproved', [displayName])
  );
}

export function pushVideoCallPermissionNeeded() {
  pushToastInfo(
    'videoCallPermissionNeeded',
    window.i18n('cameraPermissionNeededTitle'),
    window.i18n('cameraPermissionNeeded'),
    openPrivacySettings
  );
}

export function pushAudioPermissionNeeded() {
  pushToastInfo(
    'audioPermissionNeeded',
    window.i18n('audioPermissionNeededTitle'),
    window.i18n('audioPermissionNeeded'),
    () => {
      window.inboxStore?.dispatch(showLeftPaneSection(SectionType.Settings));
      window.inboxStore?.dispatch(showSettingsSection(BchatSettingCategory.Privacy));
    }
  );
}

export function pushOriginalNotFound() {
  pushToastError('originalMessageNotFound', window.i18n('originalMessageNotFound'));
}

export function pushTooManyMembers() {
  pushToastError('tooManyMembers', window.i18n('closedGroupMaxSize'));
}

export function pushMessageRequestPending() {
  pushToastInfo('messageRequestPending', window.i18n('messageRequestPending'));
}

export function pushUnblockToSend() {
  pushToastInfo('unblockToSend', window.i18n('unblockToSend'));
}

export function pushUnblockToSendGroup() {
  pushToastInfo('unblockGroupToSend', window.i18n('unblockGroupToSend'));
}

export function pushYouLeftTheGroup() {
  pushToastError('youLeftTheGroup', window.i18n('youLeftTheGroup'));
}

export function someDeletionsFailed() {
  pushToastWarning('deletionError', 'Deletion error');
}

export function pushDeleted(messageCount: number) {
  pushToastSuccess(
    'deleted',
    window.i18n('deleted', [messageCount.toString()]),
    undefined,
    'check'
  );
}

export function pushCannotRemoveCreatorFromGroup() {
  pushToastWarning(
    'cannotRemoveCreatorFromGroup',
    window.i18n('cannotRemoveCreatorFromGroup'),
    window.i18n('cannotRemoveCreatorFromGroupDesc')
  );
}

export function pushOnlyAdminCanRemove() {
  pushToastInfo(
    'onlyAdminCanRemoveMembers',
    window.i18n('onlyAdminCanRemoveMembers'),
    window.i18n('onlyAdminCanRemoveMembersDesc')
  );
}

export function pushFailedToAddAsModerator() {
  pushToastWarning('failedToAddAsModerator', window.i18n('failedToAddAsModerator'));
}

export function pushFailedToRemoveFromModerator() {
  pushToastWarning('failedToRemoveFromModerator', window.i18n('failedToRemoveFromModerator'));
}

export function pushUserAddedToModerators() {
  pushToastSuccess('userAddedToModerators', window.i18n('userAddedToModerators'));
}

export function pushUserRemovedFromModerators() {
  pushToastSuccess('userRemovedFromModerators', window.i18n('userRemovedFromModerators'));
}

export function pushInvalidPubKey() {
  pushToastSuccess('invalidPubKey', window.i18n('invalidPubkeyFormat'));
}

export function pushNoCameraFound() {
  pushToastWarning('noCameraFound', window.i18n('noCameraFound'));
}

export function pushNoAudioInputFound() {
  pushToastWarning('noAudioInputFound', window.i18n('noAudioInputFound'));
}

export function pushNoAudioOutputFound() {
  pushToastWarning('noAudioInputFound', window.i18n('noAudioOutputFound'));
}

export function pushNoMediaUntilApproved() {
  pushToastError('noMediaUntilApproved', window.i18n('noMediaUntilApproved'));
}

export function pushMustBeApproved() {
  pushToastError('mustBeApproved', window.i18n('mustBeApproved'));
}
