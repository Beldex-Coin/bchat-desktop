import React from 'react';
import classNames from 'classnames';
import { PropsForGroupInvitation } from '../../../../state/ducks/conversations';
import { acceptOpenGroupInvitation } from '../../../../interactions/messageInteractions';
import { BchatIconButton } from '../../../icon';
import { ReadableMessage } from './ReadableMessage';

export const GroupInvitation = (props: PropsForGroupInvitation) => {
  const { messageId, receivedAt, isUnread } = props;
  const classes = ['group-invitation'];

  if (props.direction === 'outgoing') {
    classes.push('invitation-outgoing');
  }
  const socialGroupInvitation = window.i18n('socialGroupInvitation');
  const currentValueFromSettings = window.getSettingValue('font-size-setting') || "Small";

  function FontSizeChanger(fontSize:number)
  {
    let size;
   if(currentValueFromSettings==="Small")
   {
    size= fontSize
   }
   else if(currentValueFromSettings==="Medium")
   {
    size=fontSize+2
   }
   else{
    size=fontSize+4
   }
   return size;
  }
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
              <span className="group-name" style={{fontSize:`${FontSizeChanger(18)}px`}}>{props.serverName}</span>
              <span className="group-type" style={{fontSize:`${FontSizeChanger(14)}px`}}>{socialGroupInvitation}</span>
              <span className="group-address" style={{fontSize:`${FontSizeChanger(14)}px`}}>{props.url}</span>
            </span>
          </div>
        </div>
      </div>
    </ReadableMessage>
  );
};
