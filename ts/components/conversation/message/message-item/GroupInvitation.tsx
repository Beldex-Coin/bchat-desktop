import React from 'react';
import classNames from 'classnames';
import { PropsForGroupInvitation } from '../../../../state/ducks/conversations';
import { acceptOpenGroupInvitation } from '../../../../interactions/messageInteractions';
import { BchatIconButton } from '../../../icon';
import { ReadableMessage } from './ReadableMessage';

export const GroupInvitation = (props: PropsForGroupInvitation) => {
  const { messageId, receivedAt, isUnread } = props;
  console.log('props.GroupInvitation ::',props)
  const classes = ['group-invitation'];

  if (props.direction === 'outgoing') {
    classes.push('invitation-outgoing');
  }
  const socialGroupInvitation = window.i18n('socialGroupInvitation');

  return (
    <ReadableMessage
      messageId={messageId}
      receivedAt={receivedAt}
      isUnread={isUnread}
      key={`readable-message-${messageId}`}
    >
      <div className="group-invitation-container" id={`msg-${props.messageId}`}>
        <div className={classNames(classes)}>
          <div className="contents"
            onClick={() => { acceptOpenGroupInvitation(props.acceptUrl, props.serverName)}}>
            <BchatIconButton
              iconType="plus"
              iconColor={'var(--color-accent)'}
              iconSize={'large'}
            />
            <span className="group-details">
              <span className="group-name">{props.serverName}</span>
              <span className="group-type">{socialGroupInvitation}</span>
              <span className="group-address">{props.url}</span>
            </span>
          </div>
        </div>
      </div>
    </ReadableMessage>
  );
};
