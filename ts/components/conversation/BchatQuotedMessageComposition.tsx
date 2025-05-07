import React, { useCallback } from 'react';
import { BchatIcon, BchatIconButton } from '../icon';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { quoteMessage } from '../../state/ducks/conversations';
import { getQuotedMessage } from '../../state/selectors/conversations';
import { getAlt, isAudio } from '../../types/Attachment';
import { AUDIO_MP3 } from '../../types/MIME';
import { Flex } from '../basic/Flex';
import { Image } from './Image';

import { GoogleChrome } from '../../util';
import classNames from 'classnames';

const QuotedMessageComposition = styled.div`
  width: 100%;
  margin-top: 15px;
  // padding-inline-end: var(--margins-md);
  // padding-inline-start: var(--margins-md);
`;

const QuotedMessageCompositionReply = styled.div`
  // background: var(--color-quote-bottom-bar-background);
  // border-radius: var(--margins-sm);
  padding: var(--margins-xs);
  box-shadow: var(--color-bchat-shadow);
  // margin: var(--margins-xs);
  background: var(--color-untrust-media-bg);
  border-radius: 16px;
  min-height: 70px;
  width: 100%;
  margin-right: 10px;
`;

const Subtle = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  color: var(--color-text);
  margin-right: 9px;
`;
const VerticalLine = styled.div`
  width: 5px;
  background-color: var(--color-untrusted-vertical-bar);
  height: 60px;
  border-radius: 10px;
  margin-right: 10px;
`;
// const ReplyingTo = styled.div`
//   color: var(--color-text);
// `;
const StyledIconWrapper=styled.div `
width:50px;
height:50px;
background-color:var(--color-hop-bg);
display:flex;
justify-content:center;
align-items: center;
margin-right: 15px;
border-radius: 10px;
`
export const BchatQuotedMessageComposition = () => {
  const quotedMessageProps = useSelector(getQuotedMessage);

  const dispatch = useDispatch();

  const { text: body, attachments } = quotedMessageProps || {};
  const hasAttachments = attachments && attachments.length > 0;
  const SUPPORTED_PROTOCOLS = /^(http|https):/i;
  const isLink = SUPPORTED_PROTOCOLS.test(body || '');
  let hasImageAttachment = false;

  let firstImageAttachment;
  // we have to handle the case we are trying to reply to an audio message

  if (attachments?.length && attachments[0].contentType !== AUDIO_MP3 && attachments[0].thumbnail) {
    firstImageAttachment = attachments[0];
    hasImageAttachment = true;
  }

  const hasAudioAttachment =
    hasAttachments && attachments && attachments.length > 0 && isAudio(attachments);

  const hasImageAttachmentNotTrusted =
    hasAttachments &&
    GoogleChrome.isImageTypeSupported(attachments[0].contentType) &&
    !attachments[0].thumbnail;
  const hasPdfAttachmentNotTrusted =
    hasAttachments && attachments[0]?.contentType === 'application/pdf';
  const hasVideoAttachment =
    hasAttachments && GoogleChrome.isVideoTypeSupported(attachments[0]?.contentType);
  const getIconType = () => {
    if (hasImageAttachmentNotTrusted) return 'image';
    if (hasPdfAttachmentNotTrusted) return 'file';
    if (!hasImageAttachment && hasVideoAttachment) return 'movie';
    return null;
  };

  const iconType = getIconType();

  const removeQuotedMessage = useCallback(() => {
    dispatch(quoteMessage(undefined));
  }, []);

  if (!quotedMessageProps?.id) {
    return null;
  }

  return (
    <QuotedMessageComposition>
      <Flex
        container={true}
        justifyContent="space-between"
        flexGrow={1}
        margin={'var(--margins-xs)'}
        alignItems="center"
      >
        {/* <ReplyingTo>{window.i18n('replyingToMessage')}</ReplyingTo> */}

        <QuotedMessageCompositionReply>
          <Flex
            container={true}
            justifyContent="flex-start"
            margin={'var(--margins-xs)'}
            alignItems="center"
          >
            {!isLink ? <VerticalLine /> :<StyledIconWrapper><BchatIcon iconType="openLink" iconSize={20} iconColor='var(--color-modal-disable-txt)'  /></StyledIconWrapper>  }
            <Subtle>{(hasAttachments && window.i18n('mediaMessage')) || body}</Subtle>

            {hasImageAttachment && (
              <Image
                alt={getAlt(firstImageAttachment)}
                attachment={firstImageAttachment}
                height={100}
                width={100}
                url={firstImageAttachment.thumbnail.objectUrl}
              />
            )}
            {iconType && (
              <div
                className={classNames(
                  'module-quote__icon-container__icon',
                  `module-quote__icon-container__icon--${iconType}`
                )}
              />
            )}

            {hasAudioAttachment && <BchatIcon iconType="microphone" iconSize="huge" />}
          </Flex>
        </QuotedMessageCompositionReply>
        <BchatIconButton iconType="exit" iconSize={24} onClick={removeQuotedMessage} />
      </Flex>
    </QuotedMessageComposition>
  );
};
