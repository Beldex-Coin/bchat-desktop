import React from 'react';
// tslint:disable: no-submodule-imports use-simple-attributes

import { SpacerLG } from '../../basic/Text';
import { useDispatch, useSelector } from 'react-redux';
import {
  getConversationRequests,
  getSelectedConversation,
} from '../../../state/selectors/conversations';
import { MemoConversationListItemWithDetails } from '../conversation-list-item/ConversationListItem';
import styled from 'styled-components';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../../basic/BchatButton';
import { SectionType, setOverlayMode, showLeftPaneSection } from '../../../state/ducks/section';
import { getConversationController } from '../../../bchat/conversations';
import { forceSyncConfigurationNowIfNeeded } from '../../../bchat/utils/syncUtils';
import { BlockedNumberController } from '../../../util';
import useKey from 'react-use/lib/useKey';
import {
  ReduxConversationType,
  resetConversationExternal,
} from '../../../state/ducks/conversations';
import { updateConfirmModal } from '../../../state/ducks/modalDialog';
import { MemoMessageRequestListSetting } from '../../settings/MessageRequestInSettings';
import { BchatIconButton } from '../../icon/BchatIconButton';
import { Flex } from '../../basic/Flex';

export const OverlayMessageRequest = (props: any) => {
  useKey('Escape', closeOverlay);
  const dispatch = useDispatch();
  function closeOverlay() {
    dispatch(setOverlayMode(undefined));
  }

  const convoRequestCount = useSelector(getConversationRequests).length;
  const messageRequests = useSelector(getConversationRequests);
  const selectedConversation = useSelector(getSelectedConversation);
  const { leftPane } = props;

  const buttonText = window.i18n('clearAll');

  /**
   * Blocks all message request conversations and synchronizes across linked devices
   * @returns void
   */
  function handleClearAllRequestsClick(convoRequests: Array<ReduxConversationType>) {
    const { i18n } = window;
    const title = i18n('clearAllConfirmationTitle');
    const message = i18n('clearAllConfirmationBody');
    const onClose = dispatch(updateConfirmModal(null));

    dispatch(
      updateConfirmModal({
        title,
        message,
        onClose,
        okTheme: BchatButtonColor.Danger,
        onClickOk: async () => {
          window?.log?.info('Blocking all conversations');
          if (!convoRequests) {
            window?.log?.info('No conversation requests to block.');
            return;
          }

          let newConvosBlocked = [];
          const convoController = getConversationController();
          await Promise.all(
            (newConvosBlocked = convoRequests.filter(async convo => {
              const { id } = convo;
              const convoModel = convoController.get(id);
              if (!convoModel.isBlocked()) {
                await BlockedNumberController.block(id);
                await convoModel.commit();
              }
              await convoModel.setIsApproved(false);

              // if we're looking at the convo to decline, close the convo
              if (selectedConversation?.id === id) {
                dispatch(resetConversationExternal());
              }
              return true;
            }))
          );

          if (newConvosBlocked) {
            await forceSyncConfigurationNowIfNeeded();
          }

          // if no more requests, return to placeholder screen
          if (convoRequestCount === newConvosBlocked.length) {
            dispatch(setOverlayMode(undefined));
            dispatch(showLeftPaneSection(SectionType.Message));
            dispatch(resetConversationExternal());
          }
        },
      })
    );
  }
  const VerifyScreen = () => {
    if (props.settings) {
      return <MessageRequestListForSetting />;
    } else {
      return <MessageRequestList />;
    }
  };

  return (
    <div className="module-left-pane-overlay"
      style={{
        width:props?.settings?'100%':''  ,
        maxWidth:props?.settings?'100%':'',
        backgroundColor: 'unset'
      }}>
      {convoRequestCount ? (
        <>
          <VerifyScreen />
          <SpacerLG />
          <SpacerLG />
          <div className="messageRequestButton">
            <BchatButton
              style={{
                height: '55px',
                fontSize: '16px',
                fontWeight: '500',
              }}
              buttonColor={BchatButtonColor.Danger}
              buttonType={BchatButtonType.Brand}
              text={buttonText}
              onClick={() => {
                handleClearAllRequestsClick(messageRequests);
              }}
            />
          </div>
        </>
      ) : (
        <>
          <SpacerLG />
          {/* <MessageRequestListPlaceholder> */}
          <div className="bchat-noMsgRequest-box">
            <div className={leftPane ? 'bchat-noMsgRequest-leftPane' : 'bchat-noMsgRequest'}></div>
            <div className="content-txt">{window.i18n('noMessageRequestsPending')}</div>
          </div>

          {/* {window.i18n('noMessageRequestsPending')} */}
          {/* </MessageRequestListPlaceholder> */}
        </>
      )}
    </div>
  );
};

// const MessageRequestListPlaceholder = styled.div`
//   color:var(--color-disableText);
//   margin-bottom: auto;
//   text-align:center;
//   margin-bottom: 20px;
//   font-family: 'poppin-semibold';
// `;

const MessageRequestListContainer = styled.div`
  padding: 15px;
  max-height:75vh;
  overflow-y: auto;
  // margin-bottom: auto;
`;

/**
 * A request needs to be be unapproved and not blocked to be valid.
 * @returns List of message request items
 */
const MessageRequestList = () => {
  const conversationRequests = useSelector(getConversationRequests);
  const dispatch = useDispatch();
  return (
    <MessageRequestListContainer>
      <SpacerLG />

      <Flex
        container={true}
        flexDirection={'row'}
        alignItems='center'
        className="module-left-pane-overlay-closed--header"
      >
        {' '}
        <BchatIconButton
          onClick={() => {
            dispatch(setOverlayMode(undefined));
          }}
          iconType="chevron"
          iconRotation={90}
          iconSize="large"
          // margin="0 0 var(--margins-xs) var(--margins-xs)"
        />
        <span>{window.i18n('messageRequests')}</span>
      </Flex>
      <SpacerLG />
      {conversationRequests.map(conversation => {
        return (
          <MemoConversationListItemWithDetails
            key={conversation.id}
            isMessageRequest={true}
            {...conversation}
          />
        );
      })}
    </MessageRequestListContainer>
  );
};

const MessageRequestListForSetting = () => {
  const conversationRequests = useSelector(getConversationRequests);
  return (
    <MessageRequestListContainer>
      {conversationRequests.map(conversation => {
        return (
          <MemoMessageRequestListSetting
            key={conversation.id}
            isMessageRequest={true}
            {...conversation}
          />
        );
      })}
    </MessageRequestListContainer>
  );
};
