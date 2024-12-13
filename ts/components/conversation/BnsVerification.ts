import { SNodeAPI } from '../../bchat/apis/snode_api';
import { getConversationController } from '../../bchat/conversations/ConversationController';
import { ToastUtils, UserUtils } from '../../bchat/utils';
import { setIsVerifyBnsCalled } from '../../state/ducks/bnsConfig';

export async function setIsBnsHolder(value: Boolean) {
  const conversation = getConversationController().get(UserUtils.getOurPubKeyStrFromCache());
  await conversation.setIsBnsHolder(value);
}
export async function linkBns(ourBnsName: string) {
  window.setLocalValue('ourBnsName', ourBnsName);
  await setIsBnsHolder(true);
}
const failureBnsLinkHandler = async () => {
  const i18n = window.i18n;
  window.setLocalValue('ourBnsName', '');
  await setIsBnsHolder(false);
  ToastUtils.pushToastError('invalid',i18n( 'bnsNameAndIDNotMatch'));
  return false;
};
export function bnsVerificationConvo(
  senderConversationModel: any,
  isPrivateConversationMessage: boolean,
  envelope: { isBnsHolder: boolean }
) {
  const ourPubkey: string = UserUtils.getOurPubKeyStrFromCache();
  if (
    senderConversationModel?.attributes?.id === ourPubkey &&
    !window.getLocalValue('ourBnsName') &&
    isPrivateConversationMessage
  ) {
    senderConversationModel.setIsBnsHolder(false);
  } else {
    isPrivateConversationMessage && senderConversationModel.setIsBnsHolder(envelope.isBnsHolder);
  }
}
export async function isLinkedBchatIDWithBnsForDeamon(bnsName?: string) {
  try {
    const i18n = window.i18n;
    const ourBnsName = bnsName || window.getLocalValue('ourBnsName');
    if (!ourBnsName) {
      return false;
    }
    if (!window.navigator.onLine) {
      !!bnsName && ToastUtils.pushToastError('invalid', 'Please check your internet connection');
      return false;
    }
    const resolvedBchatID = await SNodeAPI.getBchatIDForOnsName(ourBnsName);
    const ourNumber = UserUtils.getOurPubKeyStrFromCache();
    window.inboxStore?.dispatch(setIsVerifyBnsCalled(true));
    if (ourNumber === resolvedBchatID) {
      !!bnsName && ToastUtils.pushToastSuccess('success', i18n('bnsNameverified'));
      return true;
    } else {
      return failureBnsLinkHandler();
    }
  } catch (error) {
    console.log(error);
    return failureBnsLinkHandler();
  }
}
