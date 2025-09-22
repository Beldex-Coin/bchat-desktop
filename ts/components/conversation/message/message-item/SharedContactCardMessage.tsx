import React, { useContext, useLayoutEffect, useState } from 'react';
import classNames from 'classnames';
import {
  PropsForSharedContact,
  updateViewContactPanel,
} from '../../../../state/ducks/conversations';

// import { BchatIconButton } from '../../../icon';
import { ReadableMessage } from './ReadableMessage';
import { Flex } from '../../../basic/Flex';

import { SpacerMD } from '../../../basic/Text';

import { useDispatch, useSelector } from 'react-redux';

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
import { FontSizeChanger, VerticalLine } from './GroupInvitation';
import { Avatar, AvatarSize } from '../../../avatar/Avatar';
import styled from 'styled-components';
import { BchatIcon } from '../../../icon';

export const SharedContactCardMessage = (props: PropsForSharedContact) => {
  const { messageId, receivedAt, isUnread, address, name, onRecentEmojiBtnVisible } = props;
  const dispatch = useDispatch();
  const [flashGreen, setFlashGreen] = useState(false);
  const [didScroll, setDidScroll] = useState(false);
  const scrollToLoadedMessage = useContext(ScrollToLoadedMessageContext);
  const contentProps = useSelector(state =>
    getMessageContentSelectorProps(state as any, props.messageId)
  );

  const quotedMessageToAnimate = useSelector(getQuotedMessageToAnimate);
  const shouldHighlightMessage = useSelector(getShouldHighlightMessage);

  const isQuotedMessageToAnimate = quotedMessageToAnimate === props.messageId;

  const namesArray: string[] = JSON.parse(name || '[]');
  const addressesArray: string[] = JSON.parse(address || '[]');

  const userName =
    namesArray.length > 1
      ? `${namesArray[0]} and ${namesArray.length - 1} other${namesArray.length > 2 ? 's' : ''}`
      : namesArray[0] ?? '';

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

  const isIncoming = contentProps?.direction === 'incoming';
  const classes = [`group-invitation ${flashGreen && 'flash-green-once'}`];
  if (contentProps?.direction === 'outgoing') {
    classes.push('invitation-outgoing');
  }
  const selected = useSelector(state => getMessageStatusProps(state as any, props.messageId));
  if (!address) {
    return null;
  }
  if (!selected) {
    return null;
  }
  function formatAddress(address: string) {
    if (!address || address.length <= 16) return address;
    return `${address.slice(0, 10)}.......${address.slice(-8)}`;
  }
  const shortAddress = formatAddress(addressesArray[0]);
  const recentEmojiBtnVisible = () => onRecentEmojiBtnVisible && onRecentEmojiBtnVisible();
  const updatePanel = () => {
    dispatch(updateViewContactPanel({isIncoming:isIncoming,names: namesArray,addresses: addressesArray }));
  };

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

          <div className={classNames(`inviteWrapper-${contentProps?.direction}`)}>
            <div className={classNames(classes)} onClick={updatePanel}>
              <div className="group-details">
                <Flex container={true}>
                  <VerticalLine direcrion={contentProps?.direction}></VerticalLine>
                  <Flex
                    container={true}
                    flexDirection="column"
                    cursor="pointer"
                    justifyContent="center"
                  >
                    <span className="group-name" style={{ fontSize: `${FontSizeChanger(18)}px` }}>
                   { namesArray.length > 1 && <BchatIcon iconType={'avatarOutline'} iconSize={13} />}  {userName}
                    </span>
                    <span className="group-type" style={{ fontSize: `${FontSizeChanger(14)}px` }}>
                      {shortAddress}
                    </span>
                  </Flex>
                </Flex>
                <CustomizedAvatar address={addressesArray} />
              </div>
              <SpacerMD />

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

type CustomizedAvatarProps = {
  address: string[];
};

const CustomizedAvatar: React.FC<CustomizedAvatarProps> = ({ address }) => {
  if (!address?.length) return null;

  return (
    <Wrapper className="grouped-avatar">
      {address.length === 1 ? (
        <Avatar pubkey={address[0]} size={AvatarSize.L} />
      ) : (
        <div className="inner-wrapper">
          <Avatar pubkey={address[0]} size={AvatarSize.S} />
          <Avatar pubkey={address[1]} size={AvatarSize.S} />
        </div>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;

  .inner-wrapper {
    display: flex;
    position: relative;

    .module-avatar:first-child {
      z-index: 1;
      box-shadow: 1px 1px 2px 0px var(--color-chatHeader);
      position: absolute;
      right: 9px;
      bottom: 10px;
      border-radius: 14px;
    }
  }
`;
