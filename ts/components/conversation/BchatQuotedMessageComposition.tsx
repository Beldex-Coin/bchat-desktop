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
import { FontSizeChanger, Room } from './message/message-item/GroupInvitation';
import { BchatJoinableRoomAvatar } from '../leftpane/overlay/BchatJoinableDefaultRooms';
import { StateType } from '../../state/reducer';

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

  .group-details {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 0;
    width: 249px;
    .group-name {
      font-weight: 600;
    }
    .group-type {
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 300;
    }
  }
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
const StyledIconWrapper = styled.div`
  width: 50px;
  height: 50px;
  background-color: var(--color-hop-bg);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  border-radius: 10px;
`;
export const BchatQuotedMessageComposition = () => {
  const quotedMessageProps = useSelector(getQuotedMessage);
  const joinableRooms = useSelector((state: StateType) => state.defaultRooms);

  const dispatch = useDispatch();
  const { text: body, attachments,direction } = quotedMessageProps || {};
  let groupInvitation: { name: string; url: string }| undefined;
  let sharedContactList:{ address: string; name: string }| undefined;
  let paymentDetails:{amount:string,txnId:string,msgType:string}|undefined;
  

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
  if (body && body.startsWith(`{"kind"`)) {
    const parsed = JSON.parse(body);
    if (parsed.kind['@type'] === 'OpenGroupInvitation') {
      groupInvitation={
        name:parsed.kind.groupName,
        url:parsed.kind.groupUrl,
      }
    }
    if (parsed.kind['@type'] === 'Payment') {
      const types =direction === 'incoming' ? 'Received' : 'Sent';
      paymentDetails={
        amount:parsed.kind.amount,
        txnId:parsed.kind.txnId,
        msgType:types
      }
    }
    if (parsed.kind['@type'] === 'SharedContact') {
      sharedContactList={
        address:parsed.kind.address,
        name:parsed.kind.name
      }
    }
  }
  const namesArray = sharedContactList?.name && JSON.parse(sharedContactList.name);
  const socialGrp: Room[] = joinableRooms.rooms.filter(
    (item: Room) => groupInvitation?.name === item.name
  );
  const validatedBody=!body?.startsWith(`{"kind"`) && body
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
            {!isLink ? (
              <VerticalLine />
            ) : (
              <StyledIconWrapper>
                <BchatIcon
                  iconType="openLink"
                  iconSize={20}
                  iconColor="var(--color-modal-disable-txt)"
                />
              </StyledIconWrapper>
            )}
            <Subtle>{(hasAttachments && window.i18n('mediaMessage')) ||validatedBody }</Subtle>

            {groupInvitation && (
              <div className="group-details">
                <Flex container={true} flexDirection="column" cursor="pointer">
                  <span className="group-name" style={{ fontSize: `${FontSizeChanger(18)}px` }}>
                    {groupInvitation.name}
                  </span>
                  <span className="group-type" style={{ fontSize: `${FontSizeChanger(14)}px` }}>
                    {window.i18n('socialGroupInvitation')}
                  </span>
                </Flex>

                <BchatJoinableRoomAvatar
                  completeUrl={socialGrp[0]?.completeUrl}
                  name={socialGrp[0]?.name}
                  roomId={socialGrp[0]?.id}
                  base64Data={socialGrp[0]?.base64Data}
                  onClick={() => {}}
                />
              </div>
            )}

            {paymentDetails && (
              <div className="group-details">
                <Flex container={true} flexDirection="column" cursor="pointer">
                  <span className="group-name" style={{ fontSize: `${FontSizeChanger(18)}px` }}>
                    {window.i18n('paymentDetails', [
                    paymentDetails.msgType,
                    ])}
                  </span>
                  <span className="group-type" style={{ fontSize: `${FontSizeChanger(14)}px` }}>
                    {paymentDetails.amount} BDX
                  </span>
                </Flex>
              </div>
            )}
            {sharedContactList && (
              <div className="group-details">
                <Flex container={true} flexDirection="column" cursor="pointer">
                  <span className="group-name" style={{ fontSize: `${FontSizeChanger(18)}px` }}>
                    Shared contact
                  </span>
                  <span className="group-type" style={{ fontSize: `${FontSizeChanger(14)}px` }}>
                    {namesArray.length > 1
                      ? `${namesArray[0]} and ${namesArray.length - 1} other${
                          namesArray.length > 2 ? 's' : ''
                        }`
                      : namesArray[0] ?? ''}
                  </span>
                </Flex>
              </div>
            )}

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
