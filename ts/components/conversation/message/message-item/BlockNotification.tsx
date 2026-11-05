import { useIsBlocked } from '../../../../hooks/useParamSelector';
import { unblockConvoWithConfirm } from '../../../../interactions/conversationInteractions';
import { PropsForBlockNotification } from '../../../../models/messageType';
import { NotificationBubble } from './notification-bubble/NotificationBubble';
import { ReadableMessage } from './ReadableMessage';

/**
 * Local notice in a 1:1 chat when we block / unblock the contact (Figma 5296:28093): the same
 * chamfered chip as the disappearing-timer notices. "You Blocked <name>! Click here to Unblock."
 * unblocks (after the confirm popup) while the contact is still blocked.
 */
export const BlockNotification = (props: PropsForBlockNotification) => {
  const { messageId, receivedAt, isUnread, type, name, conversationId } = props;
  const isBlocked = useIsBlocked(conversationId);
  const canUnblock = type === 'blocked' && !!isBlocked;

  const text =
    type === 'blocked'
      ? window.i18n('blockedContactNotice', [name])
      : window.i18n('unblockedContactNotice');

  return (
    <ReadableMessage
      messageId={messageId}
      receivedAt={receivedAt}
      isUnread={isUnread}
      key={`readable-message-${messageId}`}
    >
      <div
        id={`msg-${messageId}`}
        className={canUnblock ? 'block-notification block-notification--action' : 'block-notification'}
        role={canUnblock ? 'button' : undefined}
        onClick={canUnblock ? () => unblockConvoWithConfirm(conversationId) : undefined}
      >
        <NotificationBubble
          className="notification-bubble--timer notification-bubble--block"
          notificationText={text}
        />
      </div>
    </ReadableMessage>
  );
};
