import React from 'react';
import styled from 'styled-components';
import { getLastMessagesByConversation, getMessageById } from '../../../../data/data';
import { getConversationController } from '../../../../bchat/conversations';
import { AttachmentDownloads } from '../../../../bchat/utils';
import { updateConfirmModal } from '../../../../state/ducks/modalDialog';
import { BchatButtonColor } from '../../../basic/BchatButton';
import { BchatIcon } from '../../../icon';
import { Flex } from '../../../basic/Flex';

const StyledTrustSenderUI = styled.div`
  padding-inline: var(--margins-sm);
  display: flex;
  align-items: center;
  margin: 15px 15px 5px;
  padding: 15px;
  border-radius: 16px;
  background: var(--color-untrust-media-bg);
`;

const ClickToDownload = styled.div`
  cursor: pointer;
  // padding: var(--margins-xs) var(--margins-md);
  white-space: nowrap;
  overflow: hidden;
  // color: #f0f0f0;
  text-overflow: ellipsis;
  font-size: 16px;
  font-weight: 300;
`;

const VerticalLine = styled.div`
  width: 5px;
  background-color: var(--color-untrusted-vertical-bar);
  height: 60px;
  border-radius: 10px;
  margin-right: 10px;
`;
const ImageTxt = styled.span`
  margin-left: 5px;
  // color: #f0f0f0;
  font-family: Poppins;
  font-size: 16px;
  font-weight: 600;
`;

export const ClickToTrustSender = (props: { messageId: string }) => {
  const openConfirmationModal = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    const found = await getMessageById(props.messageId);
    if (!found) {
      window.log.warn('message not found ClickToTrustSender');
      return;
    }
    const sender = found.getSource();
    const convo = getConversationController().get(sender);
    window.inboxStore?.dispatch(
      updateConfirmModal({
        title: window.i18n('trustThisContactDialogTitle', [
          convo.getContactProfileNameOrShortenedPubKey(),
        ]),
        message: window.i18n('trustThisContactDialogDescription', [
          convo.getContactProfileNameOrShortenedPubKey(),
        ]),
        okTheme: BchatButtonColor.Green,
        onClickOk: async () => {
          convo.set({ isTrustedForAttachmentDownload: true });
          await convo.commit();
          const messagesInConvo = await getLastMessagesByConversation(convo.id, 100, false);

          await Promise.all(
            messagesInConvo.map(async message => {
              const msgAttachments = message.get('attachments');
              const messagePreviews = message.get('preview');
              if (message.get('direction') !== 'incoming') {
                return;
              }
              if (
                (!msgAttachments || msgAttachments.length === 0) &&
                (!messagePreviews || messagePreviews.length === 0)
              ) {
                return;
              }

              const downloadedAttachments = await Promise.all(
                msgAttachments.map(async (attachment: any, index: any) => {
                  if (attachment.path) {
                    return { ...attachment, pending: false };
                  }
                  return AttachmentDownloads.addJob(attachment, {
                    messageId: message.id,
                    type: 'attachment',
                    index,
                    isOpenGroupV2: false,
                    openGroupV2Details: undefined,
                  });
                })
              );

              const preview = await Promise.all(
                (messagePreviews || []).map(async (item: any, index: any) => {
                  if (!item.image) {
                    return item;
                  }

                  const image = message.isTrustedForAttachmentDownload()
                    ? await AttachmentDownloads.addJob(item.image, {
                        messageId: message.id,
                        type: 'preview',
                        index,
                        isOpenGroupV2: false,
                        openGroupV2Details: undefined,
                      })
                    : null;

                  return { ...item, image };
                })
              );

              message.set({ preview });

              message.set({ attachments: downloadedAttachments });
              await message.commit();
            })
          );
        },
      })
    );
  };

  return (
    <StyledTrustSenderUI onClick={openConfirmationModal}>
      <VerticalLine></VerticalLine>
      <Flex container={true} flexDirection="column">
        <Flex container={true} flexDirection="row" alignItems="center">
          <BchatIcon iconSize="small" iconType="gallery" />
          <ImageTxt>Image</ImageTxt>
        </Flex>
        <ClickToDownload>{window.i18n('clickToTrustContact')}</ClickToDownload>
      </Flex>
    </StyledTrustSenderUI>
  );
};
