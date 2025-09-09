import React, { useContext, useLayoutEffect, useState } from 'react';
import classNames from 'classnames';
import { PropsForPayment } from '../../../../state/ducks/conversations';
// import { acceptOpenGroupInvitation } from '../../../../interactions/messageInteractions';
// import { BchatIconButton } from '../../../icon';
import { ReadableMessage } from './ReadableMessage';
import { BchatIcon } from '../../../icon';
import { shell } from 'electron/common';
import { MessageStatus } from '../message-content/MessageStatus';
import { useSelector } from 'react-redux';
import { getMessageContentSelectorProps, getQuotedMessageToAnimate, getShouldHighlightMessage } from '../../../../state/selectors/conversations';
import { Flex } from '../../../basic/Flex';
import moment from 'moment';
import { StyledSvgWrapper } from '../message-content/MessageContent';
import IncomingMsgTailIcon from '../../../icon/IncomingMsgTailIcon';
import OutgoingMsgTailIcon from '../../../icon/OutgoingMsgTailIcon';
import { ScrollToLoadedMessageContext } from '../../BchatMessagesListContainer';

export const PaymentMessage = (props: PropsForPayment) => {

  const { messageId, receivedAt, isUnread } = props;
  const [flashGreen, setFlashGreen] = useState(false);
  const [didScroll, setDidScroll] = useState(false);
  const scrollToLoadedMessage = useContext(ScrollToLoadedMessageContext);
  const quotedMessageToAnimate = useSelector(getQuotedMessageToAnimate);
  const shouldHighlightMessage = useSelector(getShouldHighlightMessage);
  const isQuotedMessageToAnimate = quotedMessageToAnimate === props.messageId;

  const classes = [`payment ${flashGreen && 'flash-green-once'}`];
  const currentValueFromSettings = window.getSettingValue('font-size-setting') || 'Small';
  const contentProps = useSelector(state =>
    getMessageContentSelectorProps(state as any, props.messageId)
  );
  const isIncoming = contentProps?.direction === 'incoming';

 

  useLayoutEffect(() => {
    if (isQuotedMessageToAnimate) {
      if (!flashGreen && !didScroll) {
        //scroll to me and flash me
        scrollToLoadedMessage(props.messageId, 'quote-or-search-result');
        setDidScroll(true);
        if (shouldHighlightMessage) {
          setFlashGreen(true);
        }
      }
      return;
    }
    if (flashGreen) {
      setFlashGreen(false);
    }

    if (didScroll) {
      setDidScroll(false);
    }
    return;
  });
  
  if (props.direction === 'outgoing') {
    classes.push('invitation-outgoing');
  }
  const recentEmojiBtnVisible = () =>
    props.onRecentEmojiBtnVisible && props.onRecentEmojiBtnVisible();

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
          <BchatIcon iconColor={'#f0f0f0'} iconType="circleWithTick" iconSize={16} />
        </Flex>
      );
    } else {
      return (
        <Flex container={true} alignItems="center" color="#108D32">
          <span className="txn-status" style={{ color: '#108D32' }}>
            Received Successfully!
          </span>
          <BchatIcon iconColor={'#108D32'} iconType="circleWithTick" iconSize={16} />
        </Flex>
      );
    }
  }
  return (
    <ReadableMessage
      messageId={messageId}
      receivedAt={receivedAt}
      isUnread={isUnread}
      key={`readable-message-${messageId}`}
    >
      <div
        className={classNames(
          `group-invitation-container group-invitation-container-${contentProps?.direction}`
        )}
        id={`msg-${props.messageId}`}
        onMouseEnter={() => {
          recentEmojiBtnVisible();
        }}
      >
        <div style={{ position: 'relative' }}>
          {contentProps?.lastMessageOfSeries && isIncoming && (
            <StyledSvgWrapper>
              <IncomingMsgTailIcon />
            </StyledSvgWrapper>
          )}
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
              <div className={props.direction === 'outgoing' ? 'contents' : 'contents-incoming'}>
                <div>
                  <BchatIcon iconType={'borderWithBeldex'} iconSize={34} />
                </div>
                <div className="amount" style={{ fontSize: `${FontSizeChanger(24)}px` }}>
                  {props.amount} BDX
                </div>

              </div>
              <div
                className={props.direction === 'outgoing' ? 'hint-out' : 'hintTxt'}
                style={{ fontSize: `${FontSizeChanger(12)}px` }}
              >
                <HindTxt />
              </div>
              <div className={classNames('timeStamp', `timeStamp-${contentProps?.direction}`)}>
                {moment(contentProps?.timestamp).format('hh:mm A')}
              </div>
            </div>
          </div>
          {contentProps?.lastMessageOfSeries && !isIncoming && (
            <StyledSvgWrapper style={{ right: 0 }}>
              <OutgoingMsgTailIcon />
            </StyledSvgWrapper>
          )}
        </div>
      </div>
    </ReadableMessage>
  );
};
