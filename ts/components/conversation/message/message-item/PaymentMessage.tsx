import React from 'react';
import classNames from 'classnames';
// import { PropsForPayment } from '../../../../state/ducks/conversations';
// import { acceptOpenGroupInvitation } from '../../../../interactions/messageInteractions';
// import { BchatIconButton } from '../../../icon';
import { ReadableMessage } from './ReadableMessage';
import { BchatIcon } from '../../../icon';
import { shell } from 'electron/common';
import { MessageStatus } from '../message-content/MessageStatus';
import { useSelector } from 'react-redux';
import { getMessageContentSelectorProps } from '../../../../state/selectors/conversations';
import { Flex } from '../../../basic/Flex';
import moment from 'moment';

// export const PaymentMessage = (props: PropsForPayment) => {
export const PaymentMessage = (props: any) => {
  const { messageId, receivedAt, isUnread } = props;
  const classes = ['payment'];
  const currentValueFromSettings = window.getSettingValue('font-size-setting') || 'Small';
  const contentProps = useSelector(state =>
    getMessageContentSelectorProps(state as any, props.messageId)
  );
  const isIncoming = contentProps?.direction === 'incoming';

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
  function FontSizeChanger(fontSize: number) {
    let size;
    if (currentValueFromSettings === 'Small') {
      size = fontSize;
    } else if (currentValueFromSettings === 'Medium') {
      size = fontSize + 2;
    } else {
      size = fontSize + 4;
    }
    return size;
  }

  function HindTxt() {
    // console.log()
    const iconColor = 'var(--color-text)';

    if (props.messageId === '1234-567-7890') {
      return (
        <Flex container={true} alignItems="center">
          <span className="txn-status">Initiating transaction</span>
          <BchatIcon rotateDuration={2} iconColor={iconColor} iconType="loading" iconSize="tiny" />
        </Flex>
      );
    } else if (props.direction === 'outgoing') {
      return (
        <Flex container={true} alignItems="center">
          <span className="txn-status">Sent Successfully!</span>
          <BchatIcon iconColor={iconColor} iconType="circleWithTick" iconSize={16} />
        </Flex>
      );
    } else {
      return <div className="txn-status">Received successfully </div>;
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
        <div className={classNames(`payment-Wrapper-${contentProps?.direction}`)}>
          <MessageStatus
            dataTestId="msg-status-incoming"
            messageId={messageId}
            isCorrectSide={!isIncoming}
          />
          <div
            className={classNames(classes)}
            onClick={() => (props.txnId ? openToExplore(props.txnId) : '')}
            style={{ cursor: props.txnId ? 'pointer' : 'unset' }}
          >
            <div
              className={props.direction === 'outgoing' ? 'contents' : 'contents-incoming'}
              // onClick={() => { acceptOpenGroupInvitation(props.acceptUrl, props.serverName)}}
            >
              <div>
                <BchatIcon iconType={'borderWithBeldex'} iconSize={34} />
              </div>
              <div className="amount" style={{ fontSize: `${FontSizeChanger(24)}px` }}>
                {props.amount} BDX
              </div>

              {/* <span className="group-details">
              <span className="group-name">{props.amount}</span>
              <span className="group-type">welcome</span>
              <span className="group-address">{props.txnId}</span>
            </span> */}
            </div>
            <div
              className={props.direction === 'outgoing' ? 'hint-out' : 'hintTxt'}
              style={{ fontSize: `${FontSizeChanger(12)}px` }}
            >
              {/* {props.direction === 'outgoing'?"Sent Successfully!":"Received successfully"} */}
              <HindTxt />
            </div>
            <div className={classNames('timeStamp', `timeStamp-${contentProps?.direction}`)}>
              {moment(contentProps?.timestamp).format('hh:mm A')}
            </div>

          </div>
          
        </div>
      </div>
    </ReadableMessage>
  );
};
