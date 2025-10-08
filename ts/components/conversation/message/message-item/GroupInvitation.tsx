import React, { useContext, useLayoutEffect, useState } from 'react';
import classNames from 'classnames';
import { PropsForGroupInvitation } from '../../../../state/ducks/conversations';
import { acceptOpenGroupInvitation } from '../../../../interactions/messageInteractions';
// import { BchatIconButton } from '../../../icon';
import { ReadableMessage } from './ReadableMessage';
import { Flex } from '../../../basic/Flex';
import styled from 'styled-components';
import { SpacerSM } from '../../../basic/Text';

import { useSelector } from 'react-redux';
import { StateType } from '../../../../state/reducer';
import { BchatJoinableRoomAvatar } from '../../../leftpane/overlay/BchatJoinableDefaultRooms';
import {
  getMessageContentSelectorProps,
  getMessageStatusProps,
  getQuotedMessageToAnimate,
  getShouldHighlightMessage,

} from '../../../../state/selectors/conversations';
import moment from 'moment';
import { StyledSvgWrapper } from '../message-content/MessageContent';
import IncomingMsgTailIcon from '../../../icon/IncomingMsgTailIcon';
import OutgoingMsgTailIcon from '../../../icon/OutgoingMsgTailIcon';
import { ScrollToLoadedMessageContext } from '../../BchatMessagesListContainer';


export interface Room {
  completeUrl: string;
  name: string;
  id: string;
  base64Data?: string;
}

export const GroupInvitation = (props: PropsForGroupInvitation) => {
  const { messageId, receivedAt, isUnread,serverName,acceptUrl } = props;
  const [flashGreen, setFlashGreen] = useState(false);
  const [didScroll, setDidScroll] = useState(false);
  const scrollToLoadedMessage = useContext(ScrollToLoadedMessageContext);
  const joinableRooms = useSelector((state: StateType) => state.defaultRooms);
  const contentProps = useSelector(state =>
    getMessageContentSelectorProps(state as any, props.messageId)
  );

  const quotedMessageToAnimate = useSelector(getQuotedMessageToAnimate);
  const shouldHighlightMessage = useSelector(getShouldHighlightMessage);
  const isQuotedMessageToAnimate = quotedMessageToAnimate === props.messageId;

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
 
  if(!serverName)
  {
    return null
  }
  const socialGrp: Room[] = joinableRooms.rooms.filter(
    (item: Room) => props.serverName === item.name
  );
  const isIncoming = contentProps?.direction === 'incoming';
  const classes = [`group-invitation ${flashGreen && 'flash-green-once'}`];
  if (contentProps?.direction === 'outgoing') {
    classes.push('invitation-outgoing');
  }

  const socialGroupInvitation = window.i18n('socialGroupInvitation');

  const selected = useSelector(state => getMessageStatusProps(state as any, props.messageId));

  if (!selected) {
    return null;
  }
  const recentEmojiBtnVisible = () =>
    props.onRecentEmojiBtnVisible && props.onRecentEmojiBtnVisible();
  return (
    <ReadableMessage
      messageId={messageId}
      receivedAt={receivedAt}
      isUnread={isUnread}
      key={`readable-message-${messageId}`}
    >
      <div
        className={classNames(
          `group-invitation-container group-invitation-container-${
            contentProps?.direction
          }`
        )}
        id={`msg-${props.messageId}`}
        onMouseEnter={() => {
          recentEmojiBtnVisible();
        }}
      >
        <div style={{ position: 'relative' }}>
          { contentProps?.lastMessageOfSeries &&isIncoming && (
            <StyledSvgWrapper>
              <IncomingMsgTailIcon />
            </StyledSvgWrapper>
          )}

          <div className={classNames(`inviteWrapper-${contentProps?.direction}`)}>
            <div
              className={classNames(classes)}
              onClick={() => {
                acceptOpenGroupInvitation(acceptUrl,serverName);
              }}
            >
              <div className="group-details">
                <Flex container={true}>
                  <VerticalLine direcrion={contentProps?.direction}></VerticalLine>
                  <Flex container={true} flexDirection="column" cursor="pointer">
                    <span className="group-name" style={{ fontSize: `${FontSizeChanger(18)}px` }}>
                      {serverName}
                    </span>
                    <span className="group-type" style={{ fontSize: `${FontSizeChanger(14)}px` }}>
                      {socialGroupInvitation}
                    </span>
                  </Flex>
                </Flex>
                <BchatJoinableRoomAvatar
                  completeUrl={socialGrp[0]?.completeUrl}
                  name={socialGrp[0]?.name}
                  roomId={socialGrp[0]?.id}
                  base64Data={socialGrp[0]?.base64Data}
                  onClick={() => {
                    acceptOpenGroupInvitation(acceptUrl, props.serverName);
                  }}
                  direction={contentProps?.direction}
                />
              </div>
              <SpacerSM />
              <span className="group-address" style={{ fontSize: `${FontSizeChanger(14)}px` }}>
                {props.url}
              </span>
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
interface VerticalLineProps {
  direcrion?: string;
}
export const VerticalLine = styled.div<VerticalLineProps>`
  width: 5px;
  background-color: ${props =>
    props.direcrion === 'incoming' ? 'var(--color-untrusted-vertical-bar)' : ' #f0f0f0'};
  height: 60px;
  border-radius: 10px;
  margin-right: 10px;
`;
export const FontSizeChanger = (fontSize: number) => {
  const currentValueFromSettings = window.getSettingValue('font-size-setting') || 'Small';
  let size;
  if (currentValueFromSettings === 'Small') {
    size = fontSize;
  } else if (currentValueFromSettings === 'Medium') {
    size = fontSize + 2;
  } else {
    size = fontSize + 4;
  }
  return size;
};
