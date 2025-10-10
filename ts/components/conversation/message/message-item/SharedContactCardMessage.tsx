import React, { useContext, useLayoutEffect, useState } from 'react';
import classNames from 'classnames';
import {
  openConversationWithMessages,
  PropsForSharedContact,
  updateViewContactPanel,
} from '../../../../state/ducks/conversations';

// import { BchatIconButton } from '../../../icon';
import { ReadableMessage } from './ReadableMessage';
import { Flex } from '../../../basic/Flex';


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
import { MessageQuote } from '../message-content/MessageQuote';
import { getConversationController } from '../../../../bchat/conversations';
import { ConversationTypeEnum } from '../../../../models/conversation';
import { updateConfirmModal } from '../../../../state/ducks/modalDialog';
import { BchatButtonColor } from '../../../basic/BchatButton';
import { useConversationBnsHolder } from '../../../../hooks/useParamSelector';
import { SpacerSM } from '../../../basic/Text';

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
  const validUserName=namesArray[0].length===66?namesArray[0].slice(0,17)+"...":namesArray[0]
  const userName =
    namesArray.length > 1
      ? `${validUserName} and ${namesArray.length - 1} other${namesArray.length > 2 ? 's' : ''}`
      : validUserName ?? '';

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

  const openConverstation = async (pubKey: string) => {
    await getConversationController().getOrCreateAndWait(
      pubKey,
      ConversationTypeEnum.PRIVATE
    );
    await openConversationWithMessages({ conversationKey: pubKey, messageId: null });
  }

  const shortAddress = formatAddress(addressesArray[0]);
  const recentEmojiBtnVisible = () => onRecentEmojiBtnVisible && onRecentEmojiBtnVisible();
  const updatePanel = async () => {
    if (namesArray.length > 1) {
      dispatch(updateViewContactPanel({ isIncoming: isIncoming, names: namesArray, addresses: addressesArray }));
    } else {
      if (contentProps?.direction == "outgoing") {
        return openConverstation(addressesArray[0])
      }
      return dispatch(
        updateConfirmModal({
          bchatIcon: 'avatar',
          iconSize: 31,
          iconShow: true,
          title: 'Start chat now?',
          message: 'Do you want to chat with this contact now?',
          onClickOk: () => openConverstation(addressesArray[0]),
          okText: 'Start Chatting',
          okTheme: BchatButtonColor.Primary,
        })
      );
    }

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
              <MessageQuote messageId={props.messageId} />
              <div className="group-details" >
                <Flex container={true} >
                  <VerticalLine direcrion={contentProps?.direction}></VerticalLine>
                  <Flex
                    container={true}
                    flexDirection="column"
                    cursor="pointer"
                    justifyContent="center"
                   
                  >
                     <Flex container={true}  className="group-name" style={{ fontSize: `${FontSizeChanger(18)}px`,gap:'6px' }}>
                      <div><BchatIcon iconType={'avatarOutline'} iconSize={13} strokeColor={'#F0F0F0'} strokeWidth={'1px'} /></div>
                     <div>{userName}</div> 
                    </Flex>
                    <span className="group-type" style={{ fontSize: `${FontSizeChanger(14)}px` }}>
                      {shortAddress}
                    </span>
                  </Flex>
                </Flex>
                <CustomizedAvatar address={addressesArray} />
              </div>
              <SpacerSM />

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

const CustomizedAvatar: React.FC<CustomizedAvatarProps> = ({ address = [] }) => {
  if (address.length === 0) return null;

  const isBnsHolder = address.map((addr) => useConversationBnsHolder(addr));

  const [first, second] = address;

  return (
    <Wrapper className="grouped-avatar">
      {address.length === 1 ? (
        <Avatar
          pubkey={first}
          size={AvatarSize.L}
          isBnsHolder={isBnsHolder[0]}
        />
      ) : (
        <div className="inner-wrapper">
          <Avatar
            pubkey={first}
            size={AvatarSize.S}
            isBnsHolder={isBnsHolder[0]}
          />
          <Avatar
            pubkey={second}
            size={AvatarSize.S}
            isBnsHolder={isBnsHolder[1]}
          />
        </div>
      )}
    </Wrapper>
  );
};


const Wrapper = styled.div`
  position: relative;
  margin-left: 10px;

  .inner-wrapper {
    display: flex;
    position: relative;

    .bns-verify-wrapper:first-child {
      z-index: 1;
      box-shadow: 1px 1px 2px 0px var(--color-chatHeader);
      position: absolute;
      right: 9px;
      bottom: 10px;
      border-radius: 14px;
    }
  }
`;
