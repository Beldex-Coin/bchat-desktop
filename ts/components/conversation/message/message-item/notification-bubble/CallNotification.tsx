import React from 'react';
import { useSelector } from 'react-redux';
import { PubKey } from '../../../../../bchat/types';

import {
  CallNotificationType,
  PropsForCallNotification,
} from '../../../../../state/ducks/conversations';
import { getSelectedConversation } from '../../../../../state/selectors/conversations';
import { LocalizerKeys } from '../../../../../types/LocalizerKeys';
import { BchatIconType } from '../../../../icon';
import { ReadableMessage } from '../ReadableMessage';
import { NotificationBubble } from './NotificationBubble';

type StyleType = Record<
  CallNotificationType,
  { notificationTextKey: LocalizerKeys; iconType: BchatIconType; iconColor: string }
>;

const style: StyleType = {
  'missed-call': {
    notificationTextKey: 'callMissed',
    iconType: 'callMissed',
    iconColor: 'var(--color-destructive)',
  },
  'started-call': {
    notificationTextKey: 'startedACall',
    iconType: 'callOutgoing',
    iconColor: 'inherit',
  },
  'answered-a-call': {
    notificationTextKey: 'answeredACall',
    iconType: 'callIncoming',
    iconColor: 'inherit',
  },
};

export const CallNotification = (props: PropsForCallNotification) => {
  const { messageId, receivedAt, isUnread, notificationType } = props;

  const selectedConvoProps = useSelector(getSelectedConversation);

  const displayName =
    selectedConvoProps?.profileName ||
    selectedConvoProps?.name ||
    (selectedConvoProps?.id && PubKey.shorten(selectedConvoProps?.id));

  const styleItem = style[notificationType];
  const notificationText = window.i18n(styleItem.notificationTextKey, [displayName || 'Unknown']);
  if (!window.i18n(styleItem.notificationTextKey)) {
    throw new Error(`invalid i18n key ${styleItem.notificationTextKey}`);
  }
  const iconType = styleItem.iconType;
  const iconColor = styleItem.iconColor;

  return (
    <ReadableMessage
      messageId={messageId}
      receivedAt={receivedAt}
      isUnread={isUnread}
      key={`readable-message-${messageId}`}
    >
      <NotificationBubble
        notificationText={notificationText}
        iconType={iconType}
        iconColor={iconColor}
      />
    </ReadableMessage>
  );
};
