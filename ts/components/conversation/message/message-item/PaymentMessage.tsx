import React from 'react';
import classNames from 'classnames';
import { PropsForPayment } from '../../../../state/ducks/conversations';
// import { acceptOpenGroupInvitation } from '../../../../interactions/messageInteractions';
// import { BchatIconButton } from '../../../icon';
import { ReadableMessage } from './ReadableMessage';
import { BchatIcon } from '../../../icon';
import { shell } from 'electron/common';

export const PaymentMessage = (props: PropsForPayment) => {
  const { messageId, receivedAt, isUnread } = props;
  const classes = ['payment'];

  if (props.direction === 'outgoing') {
    classes.push('invitation-outgoing');
  }
//   const socialGroupInvitation = window.i18n('socialGroupInvitation');
function openToExplore(traxId: string) {
  if (window.networkType === 'mainnet') {
    void shell.openExternal(`http://explorer.beldex.io/tx/${traxId}`);
  } else {
    void shell.openExternal(`http://154.26.139.105/tx/${traxId}`);
  }
}
  return (
    <ReadableMessage
      messageId={messageId}
      receivedAt={receivedAt}
      isUnread={isUnread}
      key={`readable-message-${messageId}`}
    >
      <div className="group-invitation-container" id={`msg-${props.messageId}`}>
            
        <div className={classNames(classes)} onClick={()=>openToExplore(props.txnId)}>
          <div className={props.direction === 'outgoing'?"contents":"contents-incoming"}
            // onClick={() => { acceptOpenGroupInvitation(props.acceptUrl, props.serverName)}}
            >
            
            <div><BchatIcon iconType={'borderWithBeldex'} iconSize={"huge"} /></div>
            <div className='amount'>
            {props.amount} BDX
            </div>
            
            {/* <span className="group-details">
              <span className="group-name">{props.amount}</span>
              <span className="group-type">welcome</span>
              <span className="group-address">{props.txnId}</span>
            </span> */}
          </div>
          <div className={props.direction === 'outgoing'?'hint-out':'hintTxt'}>
            {props.direction === 'outgoing'?"Sent Successfully!":"Received successfully"}
            </div>
        </div>
      </div>
    </ReadableMessage>
  );
};
