import { isEmpty, isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';
import { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  updateReactClearAllModal,
  updateReactListModal,
  updateUserDetailsModal,
} from '../../state/ducks/modalDialog';
import { StateType } from '../../state/reducer';
import { getMessageReactsProps } from '../../state/selectors/conversations';
import { ReactionList } from '../../types/Message';
import { Avatar, AvatarSize } from '../avatar/Avatar';
import { Flex } from '../basic/Flex';
import { ContactName } from '../conversation/ContactName';
import { MessageReactions } from '../conversation/message/message-content/MessageReactions';
import { BchatWrapperModal } from '../BchatWrapperModal';
import { getMessageById } from '../../data/data';
import { UserUtils } from '../../bchat/utils';
import { sendMessageReaction } from '../../util/reactions';
import { BchatIconButton } from '../icon';

import { nativeEmojiData } from '../../util/emoji';

interface Props {
  messageId: string;
  reaction: string;
}

const StyledReactListContainer = styled(Flex)`
  width: 376px;
`;

const StyledReactionsContainer = styled.div`
  background-color: var(--color-cell-background);
  border-bottom: 1px solid var(--color-session-border);
  width: 100%;
  overflow-x: auto;
  padding: 12px 8px 0;
`;

const StyledSendersContainer = styled(Flex)`
  width: 100%;
  min-height: 350px;
  height: 100%;
  max-height: 496px;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 16px 32px;
`;

const StyledReactionBar = styled(Flex)`
  width: 100%;
  margin: 12px 0 20px 4px;

  p {
    color: var(--color-text-subtle);
    margin: 0;
    span {
      color: var(--color-text-subtle);
    }
    span:nth-child(1) {
      margin: 0 8px;
      color: var(--color-text);
    }
    span:nth-child(2) {
      margin-right: 8px;
    }
  }
`;

const StyledReactionSender = styled(Flex)`
  width: 100%;
  margin-bottom: 12px;
  .module-avatar {
    margin-right: 12px;
  }
`;
const StyledClearButton = styled.button`
  font-size: var(--font-size-sm);
  color: var(--color-destructive);
  border: none;
`;
type ReactionSendersProps = {
  messageId: string;
  currentReact: string;
  senders: Array<string>;
  me: string;
  handleClose: () => void;
}

const ReactionSenders = (props: ReactionSendersProps) => {
  const { messageId, currentReact, senders, me, handleClose } = props;
  const dispatch = useDispatch();

  const handleAvatarClick = async (sender: string) => {
    const message = await getMessageById(messageId);
    if (message) {
      handleClose();
      const contact = message.findAndFormatContact(sender);
      dispatch(
        updateUserDetailsModal({
          conversationId: sender,
          userName: contact.name || contact.profileName || sender,
          authorAvatarPath: contact.avatarPath,
        })
      );
    }
  };

  const handleRemoveReaction = async () => {
    await sendMessageReaction(messageId, currentReact);
  };

  return (
    <>
      {senders.map((sender: string) => (
        <StyledReactionSender
          key={`${messageId}-${sender}`}
          container={true}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Flex container={true} alignItems={'center'}>
            <Avatar
              size={AvatarSize.XS}
              pubkey={sender}
              onAvatarClick={async () => {
                await handleAvatarClick(sender);
              }}
            />
            <ContactName
              pubkey={sender}
              module="module-conversation__user"
              shouldShowPubkey={false}
            />
          </Flex>
          {sender === me && (
            <BchatIconButton
              iconType="exit"
              iconSize="small"
              onClick={async () => {
                await handleRemoveReaction();
              }}
            />
          )}
        </StyledReactionSender>
      ))}
    </>
  );
};
// tslint:disable-next-line: max-func-body-length
export const ReactListModal = (props: Props): ReactElement => {
  const { reaction, messageId } = props;

  const dispatch = useDispatch();
  const me = UserUtils.getOurPubKeyStrFromCache();
  const msgProps = useSelector((state: StateType) => getMessageReactsProps(state, messageId));

  if (!msgProps) {
    return <></>;
  }

  const { isPublic, reacts, weAreAdmin } = msgProps;
  const [reactions, setReactions] = useState<ReactionList>({});
  const [currentReact, setCurrentReact] = useState('');
  const [senders, setSenders] = useState<Array<string>>([]);
  const [reactAriaLabel, setReactAriaLabel] = useState<string | undefined>();

  const handleSelectedReaction = (emoji: string): boolean => {
    return currentReact == emoji;
  };

  const handleReactionClick = (emoji: string) => {
    setReactAriaLabel(nativeEmojiData?.ariaLabels ? nativeEmojiData.ariaLabels[emoji] : undefined);
    setCurrentReact(emoji);
  };
  const handleClose = () => {
    dispatch(updateReactListModal(null));
  };


 
  const handleClearReactions = (event: any) => {
    event.preventDefault();
    handleClose();
    dispatch(updateReactClearAllModal({ reaction: currentReact, messageId }));
  };
 
  useEffect(() => {
    if (currentReact === '' && currentReact !== reaction) {
      setReactAriaLabel(
        nativeEmojiData?.ariaLabels ? nativeEmojiData.ariaLabels[reaction] : undefined
      );
      setCurrentReact(reaction);
    }
    if (reacts && !isEqual(reactions, reacts)) {
      setReactions(reacts);
    }

    if (Object.keys(reactions).length > 0 && (isEmpty(reacts) || reacts === undefined)) {
      setReactions({});
    }

    let _senders = reactions[currentReact] ? Object.keys(reactions[currentReact]) : null;

    if (_senders && !isEqual(senders, _senders)) {
      if (_senders.length > 1) {
        const meIndex = _senders.indexOf(me);
        if (meIndex >= 0) {
          _senders.splice(meIndex, 1);
          _senders = [me, ..._senders];
        }
      }
      setSenders(_senders);
    }

    if (senders.length > 0 && (!reactions[currentReact] || !_senders || _senders.length === 0)) {
      setSenders([]);
    }
  }, [currentReact, reaction, reacts, reactions, senders]);

  return (
    <BchatWrapperModal
      additionalClassName={'reaction-list-modal'}
      showHeader={false}
      onClose={handleClose}
    >
      <StyledReactListContainer container={true} flexDirection={'column'} alignItems={'flex-start'}>
        <StyledReactionsContainer>
          <MessageReactions
            messageId={messageId}
            hasReactLimit={false}
            inModal={true}
            onSelected={handleSelectedReaction}
            onClick={handleReactionClick}
          />
        </StyledReactionsContainer>
        {currentReact && (
          <StyledSendersContainer
            container={true}
            flexDirection={'column'}
            alignItems={'flex-start'}
          >
            <StyledReactionBar
              container={true}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <p>
                <span role={'img'} aria-label={reactAriaLabel}>
                  {currentReact}
                </span>
                <span>&#8226;</span>
                <span>{senders.length}</span>
              </p>
              {isPublic && weAreAdmin && (
                <StyledClearButton onClick={handleClearReactions}>
                  {window.i18n('clearAll')}
                </StyledClearButton>
              )}
            </StyledReactionBar>
            {senders && senders.length > 0 && (
              <ReactionSenders
                messageId={messageId}
                currentReact={currentReact}
                senders={senders}
                me={me}
                handleClose={handleClose}
              />
            )}
          </StyledSendersContainer>
        )}
      </StyledReactListContainer>
    </BchatWrapperModal>
  );
};
