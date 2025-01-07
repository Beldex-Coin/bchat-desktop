import React, { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import { getMessageById } from '../../../../data/data';
import { readableList } from '../../../../util/readableList';
import { PubKey } from '../../../../bchat/types/PubKey';

import { nativeEmojiData } from '../../../../util/emoji';

export const StyledPopupContainer = styled.div<{ tooltipPosition: TipPosition }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 216px;
  height: 72px;

  background-color: var(--color-compose-view-button-background);
  color: var(--color-pill-divider-text);
  font-size: 12px;
  font-weight: 600;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  overflow-wrap: break-word;

  &:after {
    content: '';
    position: absolute;
    top: calc(100% - 18px);
    left: ${props => {
      switch (props.tooltipPosition) {
        case 'left':
          return '24px';
        case 'right':
          return 'calc(100% - 48px)';
        case 'center':
        default:
          return 'calc(100% - 100px)';
      }
    }};
    width: 22px;
    height: 22px;
    background-color: var(--color-received-message-background);
    transform: rotate(45deg);
    border-radius: 3px;
    transform: scaleY(1.4) rotate(45deg);
    clip-path: polygon(100% 100%, 7.2px 100%, 100% 7.2px);
    box-shadow: 0px 0px 9px rgba(0, 0, 0, 0.51); /* theme relative color */
  }
`;

const StyledEmoji = styled.span`
  font-size: 36px;
  margin-left: 8px;
`;

type Props = {
  emoji: string;
  messageId: string;
  senders: Array<string>;
  onClick: (...args: Array<any>) => void;
  tooltipPosition?: TipPosition;
};
export type TipPosition = 'center' | 'left' | 'right';

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
        {names} & <span style={{ color: 'var(--color-accent' }}>{others}</span> {window.i18n('reactionTooltip')}
      </span>
    );
  }

  return <span>{contacts} {window.i18n('reactionTooltip')}</span>;
};


export const ReactionPopup = (props: Props): ReactElement => {
  const { messageId, emoji, senders, tooltipPosition = 'center', onClick } = props;

  const [contacts, setContacts] = useState('');

  


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
    <StyledPopupContainer
      tooltipPosition={tooltipPosition}
      onClick={() => {
        onClick();
      }}
    >
      {renderContacts(contacts)}
      <StyledEmoji
        role={'img'}
        aria-label={nativeEmojiData?.ariaLabels ? nativeEmojiData.ariaLabels[emoji] : undefined}
      >
        {emoji}
      </StyledEmoji>
    </StyledPopupContainer>
  );
};
