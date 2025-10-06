import React, { useMemo, useState } from 'react';
import { SpacerLG, SpacerMD, SpacerXS } from '../../basic/Text';
import { BchatIcon, BchatIconButton } from '../../icon';
import classNames from 'classnames';
import {
  useConversationBnsHolder,
  useConversationUsernameOrShorten,
} from '../../../hooks/useParamSelector';
// import { AvatarItem } from '../../wallet/BchatWalletAddressBook';
import { Flex } from '../../basic/Flex';
import { useSelector } from 'react-redux';

import moment from 'moment';
import { getConversationController } from '../../../bchat/conversations';
// import { ConversationTypeEnum } from '../../../models/conversation';
import { openConversationWithMessages } from '../../../state/ducks/conversations';
import { getCallHistoryList } from '../../../state/selectors/callHistory';
import ContactEmptyIcon from '../../icon/ContactEmptyIcon';
import { getTheme } from '../../../state/selectors/theme';
import styled from 'styled-components';
import { getHasIncomingCall, getHasOngoingCall } from '../../../state/selectors/call';
import { callRecipient } from '../../../interactions/conversationInteractions';
import { Avatar, AvatarSize } from '../../avatar/Avatar';

const style: any = {
  'missed-call': {
    notificationText: 'Missed Call',
    iconType: 'callMissed',
    iconColor: '#FF3E3E',

  },
  'started-call': {
    notificationText: 'Outgoing',
    iconType: 'callOutgoing',
    iconColor: 'var(--color-text)',
  },
  'answered-a-call': {
    notificationText: 'Incoming',
    iconType: 'callIncoming',
    iconColor: 'var(--color-text)',
  },
};
export const OverlayCallHistory = () => {
  const callHistoryList = useSelector(getCallHistoryList);
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const hasIncomingCall = useSelector(getHasIncomingCall);
  const hasOngoingCall = useSelector(getHasOngoingCall);
  const canCall = !(hasIncomingCall || hasOngoingCall);

  const filteredList = useMemo(() => {
    if (!currentSearchTerm) return callHistoryList;

    return callHistoryList.filter((item: any) => {
      const convo = getConversationController().get(item.conversationId);
      const memberName = convo?.getNickname() || convo?.getName() || convo?.getProfileName();
      return memberName?.toLowerCase().includes(currentSearchTerm.toLowerCase());
    });
  }, [callHistoryList, currentSearchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSearchTerm(event.target.value);
  };
  const openConverstation = async (pubKey: string, messageId: string) => {
    await openConversationWithMessages({ conversationKey: pubKey, messageId: messageId });
    void callRecipient(pubKey, canCall);
  };
  return (
    <div className="module-left-pane-overlay" style={{ overflow: 'hidden' }}>
      <div className="module-left-pane-overlay-call-history">
        <SpacerLG />
        <div className="module-left-pane-overlay-call-history--header">
          <div className="module-left-pane-overlay-call-history--header-txt">Call History</div>
          <SpacerMD />
          <div className="bchat-search-input" style={{paddingRight:'5px'}}>
            <div className="search">
              <BchatIcon iconSize={20} iconType="search" />
            </div>
            <input
              value={currentSearchTerm}
              onChange={e => {
                handleSearch(e);
              }}
              placeholder={'Search People'}
              maxLength={26}
            />
            {!!currentSearchTerm.length && (
              <BchatIconButton
                iconSize={24}
                iconType="exit"
                onClick={() => {
                  setCurrentSearchTerm('');
                }}
              />
            )}
          </div>
        </div>
        <SpacerMD />
        <div className="content-box-wrapper ">
          {filteredList.length === 0 ? (
            <SearchEmptyScreen />
          ) : (
            filteredList.map((item, key) => (
              <ContactList key={key} openConverstation={openConverstation} {...item} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const ContactList = (props: any) => {
  const {
    conversationId,
    callNotificationType,
    call_details,
    received_at,
    openConverstation,
  } = props;
  const username = useConversationUsernameOrShorten(conversationId);
  const isBnsHolder = useConversationBnsHolder(conversationId);

  const styleItem = style[callNotificationType];
  const callCategoryText = styleItem.notificationText;
  const iconType = styleItem.iconType;
  const iconColor = styleItem.iconColor;

  const subtext = `${callCategoryText}${call_details.length > 1 ? ` (${call_details.length})` : ''
    }`;
  const lastCallMessageId = call_details[0].messageId;

  return (
    <>
      <div className={classNames(`content-box`)} >
        <Flex container={true} alignItems='center'>
          <div className="avatarBox">
            <Avatar size={AvatarSize.L} pubkey={conversationId} isBnsHolder={isBnsHolder} />
          </div>

          <Flex container={true} flexDirection="column" margin="0 15px">
            <div>
              <span className={classNames('username')}>{username}</span>
            </div>
            <SpacerXS />

            <div className={'address'} >
              <BchatIcon iconType={iconType} iconSize={14} iconColor={iconColor} />
              <span style={{ margin: '0 5px', color: iconColor }}>
                {subtext}
              </span>
              - {formatMessageTime(received_at)}
            </div>
          </Flex>
        </Flex>
        <BchatIconButton
          iconSize={24}
          iconType={'call'}
          onClick={() => openConverstation(conversationId, lastCallMessageId)}
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </div>
      <SpacerXS />
    </>
  );
};

const SearchEmptyScreen = () => {
  const isDark = useSelector(getTheme) === 'dark';
  return (
    <SearchEmptyWrapper>
      <Flex container={true} flexDirection="column" justifyContent="center" alignItems="center">
        <ContactEmptyIcon isDark={isDark} />
        <StyledSpan>No Contact Found!</StyledSpan>
      </Flex>
    </SearchEmptyWrapper>
  );
};
const SearchEmptyWrapper = styled.div`
  height: calc(100vh - 286px);
  width: 100%;
  display: flex;
  justify-content: center;
`;
const StyledSpan = styled.span`
  color: #a7a7ba;
  text-align: center;
  font-family: $bchat-font-open-sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;
const formatMessageTime = (timestamp: number) => {
  const m = moment(timestamp);
  const now = moment();

  if (m.isSame(now, 'day')) {
    return m.format('hh:mm A'); // Today → time
  } else if (m.isSame(now, 'year')) {
    return m.format('DD MMM'); // Same year → day + month
  } else {
    return m.format('DD MMM YY'); // Different year → day + month + year
  }
};
