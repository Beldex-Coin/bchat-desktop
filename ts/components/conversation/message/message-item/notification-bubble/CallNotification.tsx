import React from 'react';
import { useSelector } from 'react-redux';
// import { PubKey } from '../../../../../bchat/types';

import {
  CallNotificationType,
  PropsForCallNotification,
} from '../../../../../state/ducks/conversations';
import {
  getMessageContentSelectorProps,
  // getSelectedConversation,
} from '../../../../../state/selectors/conversations';
import { LocalizerKeys } from '../../../../../types/LocalizerKeys';
import { BchatIcon, BchatIconType } from '../../../../icon';
import { ReadableMessage } from '../ReadableMessage';
// import { NotificationBubble } from './NotificationBubble';
import classNames from 'classnames';
import { StyledMessageContentContainer } from '../../message-content/MessageContentWithStatus';
import { SpacerSM } from '../../../../basic/Text';
import moment from 'moment';
import { Flex } from '../../../../basic/Flex';
import { FontSizeChanger, VerticalLine } from '../GroupInvitation';
import IncomingMsgTailIcon from '../../../../icon/IncomingMsgTailIcon';
import { StyledSvgWrapper } from '../../message-content/MessageContent';
import OutgoingMsgTailIcon from '../../../../icon/OutgoingMsgTailIcon';
import styled from 'styled-components';

type StyleType = Record<
  CallNotificationType,
  {
    notificationTextKey: LocalizerKeys;
    iconType: BchatIconType;
    iconColor: string;
    bgColor: string;
  }
>;

const style: StyleType = {
  'missed-call': {
    notificationTextKey: 'callMissed',
    iconType: 'callMissed',
    iconColor: '#FF3E3E',
    bgColor: 'transparent',
  },
  'started-call': {
    notificationTextKey: 'startedACall',
    iconType: 'callOutgoing',
    iconColor: 'var(--color-text)',
    bgColor: 'transparent',
  },
  'answered-a-call': {
    notificationTextKey: 'answeredACall',
    iconType: 'callIncoming',
    iconColor: '#108D32',
    bgColor: 'transparent',
  },
};

const StyledDiv=styled.div`
 margin-top:5px;
`
export const CallNotification = (props: PropsForCallNotification) => {
  const { messageId, receivedAt, isUnread, notificationType } = props;
  const contentProps = useSelector(state =>
    getMessageContentSelectorProps(state as any, messageId)
  );
  const direction = contentProps?.direction;
  const timestamp = contentProps?.timestamp;
  // const selectedConvoProps = useSelector(getSelectedConversation);

  // const displayName =
  //   selectedConvoProps?.profileName ||
  //   selectedConvoProps?.name ||
  //   (selectedConvoProps?.id && PubKey.shorten(selectedConvoProps?.id));

  const styleItem = style[notificationType];
  const notificationText = window.i18n(styleItem.notificationTextKey);
  const isIncoming = direction === 'incoming';
  // const displayText =
  // notificationType == 'started-call'
  //   ? `to ${[displayName || 'Unknown']}`
  //   : `from ${[displayName || 'Unknown']}`;
  if (!window.i18n(styleItem.notificationTextKey)) {
    throw new Error(`invalid i18n key ${styleItem.notificationTextKey}`);
  }
  const iconType = styleItem.iconType;
  const iconColor = styleItem.iconColor;
  // const bgColor = styleItem.bgColor;

  return (
    <ReadableMessage
      messageId={messageId}
      receivedAt={receivedAt}
      isUnread={isUnread}
      key={`readable-message-${messageId}`}
    >
      {/* <NotificationBubble
        notificationText={notificationText}
        displayText={displayText}
        iconType={iconType}
        bgColor={bgColor}
        iconColor={iconColor}
        callNotification={true}
      /> */}
      <StyledDiv>
        <StyledMessageContentContainer direction={direction === 'incoming' ? 'left' : 'right'}>
          <div
            className={classNames('module-message', `module-message--${direction}`)}
            role="button"
            style={direction === 'incoming' ? { paddingLeft: '15px' } : { paddingRight: '15px' }}
          >
            <div style={{ position: 'relative' }}>
              {isIncoming && (
                <StyledSvgWrapper className='incomingTail'>
                  <IncomingMsgTailIcon />
                </StyledSvgWrapper>
              )}
              <div
                className={classNames(
                  'module-message__container',
                  `module-message__container--${direction}`,
                  `module-message__container--${direction}--opaque`
                )}
                style={{ padding: '10px' }}
              >
                <Flex
                  container={true}
                  className="call-notify-content-wrapper"
                  justifyContent="center"
                  alignItems="center"
                >
                  <VerticalLine direcrion={contentProps?.direction}></VerticalLine>
                  <Flex container={true} flexDirection="column" width="120px">
                    <span
                      className="group-name"
                      style={{ fontSize: `${FontSizeChanger(16)}px`, fontWeight: 600 }}
                    >
                      {notificationText}
                    </span>
                    <span
                      className="group-type"
                      style={{ fontSize: `${FontSizeChanger(14)}px` }}
                    ></span>
                  </Flex>
                  <div className="icon-wrapper">
                    <BchatIcon iconType={iconType} iconSize={24} iconColor={iconColor} />
                  </div>
                </Flex>
                <SpacerSM />
                <div className="timeStamp" style={{ marginTop: 0 }}>
                  {moment(timestamp).format('hh:mm A')}
                </div>
              </div>
              {!isIncoming && (
                <StyledSvgWrapper style={{ right: 0 }} className='outgoingTail'>
                  <OutgoingMsgTailIcon />
                </StyledSvgWrapper>
              )}
            </div>
          </div>
        </StyledMessageContentContainer>
    
      </StyledDiv>
    </ReadableMessage>
  );
};
