import  { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import { getMessageById } from '../../../../data/data';
import { readableList } from '../../../../util/readableList';
import { PubKey } from '../../../../bchat/types/PubKey';

import { nativeEmojiData } from '../../../../util/emoji';
import { useSelector } from 'react-redux';
import { getMessageTextProps } from '../../../../state/selectors/conversations';

export const StyledPopupContainer = styled.div<{ isIncoming?: boolean,isPrivate:boolean }>`
  display: flex;
  align-items: center;
  width: 216px;
  max-height: 72px;

 
  color: var(--color-text);
  font-size: 12px;
  font-weight: 400;
  padding: 16px;
  border-radius: 12px;
  cursor:${props => (props.isPrivate ? 'unset' : 'pointer')} ;
  overflow-wrap: break-word;
  background-color:var(--color-reaction-hover-bg);

  &:after {
    content: '';
    position: absolute;
    top: 60px;
    left: ${props => (props.isIncoming ? 0 : '189px')};
    width: 27px;
    height: 27px;
     background-color:var(--color-reaction-hover-bg);
    transform: rotate(45deg);
    border-radius: 3px;
    transform: scaleY(1) rotate(0deg);
    // clip-path: polygon(100% 100%, 7.2px 100%, 100% 7.2px);
    // box-shadow: 0px 0px 9px rgba(0, 0, 0, 0.51); /* theme relative color */
    clip-path:${props =>
      props.isIncoming ? 'polygon(71% 0, 0 100%, 1% 0)' : 'polygon(34% 0, 100% 100%, 100% 0)'}
`;
export const StyledPopupContainerWrapper = styled.div<{ isIncoming: boolean }>`
  position: absolute;
  width: 216px;
  height: 89px;
  // background-color: red;
  left: ${props => (props.isIncoming ? '22px' : '-187px')};
  top: -86px;
`;
const StyledEmoji = styled.span`
  font-size: 28px;
  margin-right: 8px;
`;

type Props = {
  emoji: string;
  messageId: string;
  senders: Array<string>;
  onClick: (...args: Array<any>) => void;
};

const generateContacts = async (messageId: string, senders: Array<string>) => {
  let results = null;
  const message = await getMessageById(messageId);
  if (message) {
    let meIndex = -1;
    results = senders.map((sender, index) => {
      const contact = message.findAndFormatContact(sender);
      if (contact.isMe) {
        meIndex = index;
      }
      return contact?.profileName || contact?.name || PubKey.shorten(sender);
    });
    if (meIndex >= 0) {
      results.splice(meIndex, 1);
      results = [window.i18n('you'), ...results];
    }
  }
  return results;
};

const renderContacts = (contacts: string) => {
  if (!contacts) {
    return <></>;
  }

  if (contacts.includes('&') && contacts.includes('other')) {
    const [names, others] = contacts.split('&');
    return (
      <span>
        {names} & <span style={{ color: 'var(--color-text)', fontSize: '12px' }}>{others}</span>{' '}
        {window.i18n('reactionTooltip')}
      </span>
    );
  }

  return (
    <span style={{ color: 'var(--color-text)', fontSize: '12px' }}>
      {contacts} {window.i18n('reactionTooltip')}
    </span>
  );
};

export const ReactionPopup = (props: Props): ReactElement => {
  const { messageId, emoji, senders, onClick } = props;
  const [contacts, setContacts] = useState('');
  const messageProps = useSelector(state => getMessageTextProps(state as any, props.messageId));
  const isIncoming = messageProps?.direction === 'incoming';
  const isPrivate=messageProps?.conversationType==='private';
  
  useEffect(() => {
    let isCancelled = false;
    generateContacts(messageId, senders)
      .then(async results => {
        if (isCancelled) {
          return;
        }
        if (results && results.length > 0) {
          setContacts(readableList(results));
        }
      })
      .catch(() => {
        if (isCancelled) {
          return;
        }
      });
    return () => {
      isCancelled = true;
    };
  }, [generateContacts]);
  return (
    <StyledPopupContainerWrapper className="popup-container-wrapper"  isIncoming={isIncoming}>
      <StyledPopupContainer
        isIncoming={isIncoming}
        isPrivate={isPrivate}
        onClick={() => {
          onClick();
        }}
      >
        <StyledEmoji
          role={'img'}
          aria-label={nativeEmojiData?.ariaLabels ? nativeEmojiData.ariaLabels[emoji] : undefined}
        >
          {emoji}
        </StyledEmoji>
        {renderContacts(contacts)}
      </StyledPopupContainer>
    </StyledPopupContainerWrapper>
  );
};
