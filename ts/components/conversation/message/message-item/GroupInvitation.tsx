import React from 'react';
import classNames from 'classnames';
import { PropsForGroupInvitation } from '../../../../state/ducks/conversations';
import { acceptOpenGroupInvitation } from '../../../../interactions/messageInteractions';
// import { BchatIconButton } from '../../../icon';
import { ReadableMessage } from './ReadableMessage';
import { Flex } from '../../../basic/Flex';
import styled from 'styled-components';
import { SpacerMD } from '../../../basic/Text';

import { useSelector } from 'react-redux';
import { StateType } from '../../../../state/reducer';
import { BchatJoinableRoomAvatar } from '../../../leftpane/overlay/BchatJoinableDefaultRooms';
import { getMessageContentSelectorProps, getMessageStatusProps } from '../../../../state/selectors/conversations';
import moment from 'moment';
import { MessageStatus } from '../message-content/MessageStatus';

interface Room {
  completeUrl: string;
  name: string;
  id: string;
  base64Data?: string;
}

export const GroupInvitation = (props: PropsForGroupInvitation) => {
  const { messageId, receivedAt, isUnread } = props;
  const joinableRooms = useSelector((state: StateType) => state.defaultRooms);
  const contentProps = useSelector(state =>
    getMessageContentSelectorProps(state as any, props.messageId)
  );

  const socialGrp: Room[] = joinableRooms.rooms.filter(
    (item: Room) => props.serverName === item.name
  );
  const isIncoming = contentProps?.direction === 'incoming';
  const classes = ['group-invitation'];
  if (props.direction === 'outgoing') {
    classes.push('invitation-outgoing');
  }
  const socialGroupInvitation = window.i18n('socialGroupInvitation');
  const currentValueFromSettings = window.getSettingValue('font-size-setting') || 'Small';

  const selected = useSelector(state => getMessageStatusProps(state as any, props.messageId));
  if (!selected) {
    return null;
  }

  console.log('selected selected',selected, "isIncoming",isIncoming)

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
  return (
    <ReadableMessage
      messageId={messageId}
      receivedAt={receivedAt}
      isUnread={isUnread}
      key={`readable-message-${messageId}`}
    >
       <MessageStatus
            dataTestId="msg-status-incoming"
            messageId={messageId}
            isCorrectSide={isIncoming}
          />
      <div className="group-invitation-container" id={`msg-${props.messageId}`}>
        <div className={classNames(`inviteWrapper-${contentProps?.direction}`)}>
         
          <div
            className={classNames(classes)}
            onClick={() => {
              acceptOpenGroupInvitation(props.acceptUrl, props.serverName);
            }}
          >
            <div className="group-details">
              <Flex container={true}>
                <VerticalLine direcrion={contentProps?.direction}></VerticalLine>
                <Flex container={true} flexDirection="column">
                  <span className="group-name" style={{ fontSize: `${FontSizeChanger(18)}px` }}>
                    {props.serverName}
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
                  acceptOpenGroupInvitation(props.acceptUrl, props.serverName);
                }}
              />
            </div>
            <SpacerMD />
            <span className="group-address" style={{ fontSize: `${FontSizeChanger(14)}px` }}>
              {props.url}
            </span>
            <div className={classNames('timeStamp', `timeStamp-${contentProps?.direction}`)}>
              {moment(contentProps?.timestamp).format('hh:mm A')}
            </div>
            {/* <div
            className="contents"
            onClick={() => {
              acceptOpenGroupInvitation(props.acceptUrl, props.serverName);
            }}
          >
            <BchatIconButton iconType="plus" iconColor={'var(--color-accent)'} iconSize={'large'} />
            <span className="group-details">
             
             
            </span>
          </div> */}
          </div>
        </div>
      </div>
    </ReadableMessage>
  );
};
interface VerticalLineProps {
  direcrion?: string;
}
const VerticalLine = styled.div<VerticalLineProps>`
  width: 5px;
  background-color: ${props =>
    props.direcrion === 'incoming' ? 'var(--color-untrusted-vertical-bar)' : ' #f0f0f0'};
  height: 60px;
  border-radius: 10px;
  margin-right: 10px;
`;
