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
  console.log('linkBns ', !!ourBnsName);
  await setIsBnsHolder(true);
}
const failureBnsLinkHandler = async () => {
  window.setLocalValue('ourBnsName', '');
  await setIsBnsHolder(false);
  ToastUtils.pushToastError('invalid', 'your bns name and id not matched,try another one');
  return false;
};
export async function isLinkedBchatIDWithBnsForDeamon(bnsName?: string) {
  try {
    const ourBnsName = bnsName || window.getLocalValue('ourBnsName');
    console.log(' ourBnsName -------->', ourBnsName);
    if (!ourBnsName) {
      return false;
    }
    if (!window.navigator.onLine) {
      !!bnsName && ToastUtils.pushToastError('invalid', 'please check your internet');
      return false;
    }
    const resolvedBchatID = await SNodeAPI.getBchatIDForOnsName(ourBnsName);
    const ourNumber = UserUtils.getOurPubKeyStrFromCache();
    window.inboxStore?.dispatch(setIsVerifyBnsCalled(true));
    if (ourNumber === resolvedBchatID) {
      !!bnsName && ToastUtils.pushToastSuccess('success', 'your bns name is verified');
      return true;
    } else {
      return failureBnsLinkHandler();
    }
  } catch (error) {
    console.log(error);
    return failureBnsLinkHandler();
  }
}
