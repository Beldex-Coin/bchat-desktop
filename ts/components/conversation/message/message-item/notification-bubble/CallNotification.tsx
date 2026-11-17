import { useSelector } from 'react-redux';
import moment from 'moment';
import classNames from 'classnames';

import {
  CallNotificationType,
  PropsForCallNotification,
} from '../../../../../state/ducks/conversations';
import {
  getMessageContentSelectorProps,
  getSelectedConversationKey,
} from '../../../../../state/selectors/conversations';
import { useConversationUsernameOrShorten } from '../../../../../hooks/useParamSelector';
import { LocalizerKeys } from '../../../../../types/LocalizerKeys';
import { BchatIcon, BchatIconType } from '../../../../icon';
import { ReadableMessage } from '../ReadableMessage';

type StyleType = Record<
  CallNotificationType,
  {
    notificationTextKey: LocalizerKeys;
    personTextKey: LocalizerKeys;
    iconType: BchatIconType;
    iconColor: string;
    iconSize: number;
  }
>;

// Figma 5296:40987 (dark) / 5808:39383 (white): "Incoming call from <name>", "Outgoing call to
// <name>", "Missed call from <name>" as a small chamfered chip centred in the conversation
const style: StyleType = {
  'missed-call': {
    notificationTextKey: 'callMissed',
    personTextKey: 'callFromName',
    iconType: 'callMissed',
    iconColor: 'var(--pal-t-ff3e3e)',
    iconSize: 17,
  },
  'started-call': {
    notificationTextKey: 'startedACall',
    personTextKey: 'callToName',
    iconType: 'callOutgoing',
    iconColor: 'var(--pal-t-ebebeb)',
    iconSize: 17,
  },
  'answered-a-call': {
    notificationTextKey: 'answeredACall',
    personTextKey: 'callFromName',
    iconType: 'callIncoming',
    iconColor: 'var(--pal-t-00bc33)',
    iconSize: 18,
  },
};

export const CallNotification = (props: PropsForCallNotification) => {
  const { messageId, receivedAt, isUnread, notificationType } = props;
  const contentProps = useSelector(state =>
    getMessageContentSelectorProps(state as any, messageId)
  );
  const convoId = useSelector(getSelectedConversationKey);
  const name = useConversationUsernameOrShorten(convoId) || window.i18n('unknown');

  const styleItem = style[notificationType];
  if (!styleItem) {
    throw new Error(`invalid call notification type ${notificationType}`);
  }
  const timestamp = contentProps?.timestamp;

  return (
    <ReadableMessage
      messageId={messageId}
      receivedAt={receivedAt}
      isUnread={isUnread}
      key={`readable-message-${messageId}`}
    >
      <div className="call-notification">
        <div
          className={classNames('call-notification__chip', `call-notification__chip--${notificationType}`)}
          title={timestamp ? moment(timestamp).format('hh:mm A') : undefined}
        >
          <span className="call-notification__icon">
            <BchatIcon
              iconType={styleItem.iconType}
              iconSize={styleItem.iconSize}
              iconColor={styleItem.iconColor}
            />
          </span>
          <span className="call-notification__text">
            <span className="call-notification__label">
              {window.i18n(styleItem.notificationTextKey)}
            </span>{' '}
            <bdi className="call-notification__person">
              {window.i18n(styleItem.personTextKey, [name])}
            </bdi>
          </span>
        </div>
      </div>
    </ReadableMessage>
  );
};
