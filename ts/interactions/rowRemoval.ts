// Dark theme: the chat list plays a short "removed" animation on a row (red bin, row slides out)
// before the conversation itself is deleted, like the mobile app (images/animations/Delete_Bin.json).

export const ROW_REMOVING_EVENT = 'bchat-row-removing';
const ROW_REMOVING_MS = 950;

const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

/**
 * Runs `remove` after the row's animation has played (dark theme), or straight away otherwise.
 */
export async function removeWithRowAnimation(conversationId: string, remove: () => Promise<void>) {
  if (isDark() && document.querySelector('.module-conversation-list-item')) {
    window.dispatchEvent(new CustomEvent(ROW_REMOVING_EVENT, { detail: conversationId }));
    await new Promise(resolve => setTimeout(resolve, ROW_REMOVING_MS));
  }
  await remove();
}
