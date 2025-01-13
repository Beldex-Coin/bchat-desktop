// import { isEmpty, isEqual, isNil, isUndefined } from 'lodash';
import { isEqual } from 'lodash';

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
import { SortedReactionList } from '../../types/Reaction';
import { Avatar, AvatarSize } from '../avatar/Avatar';
import { Flex } from '../basic/Flex';
import { ContactName } from '../conversation/ContactName';
import { MessageReactions } from '../conversation/message/message-content/MessageReactions';

import { getMessageById } from '../../data/data';
import { UserUtils } from '../../bchat/utils';
import {
  // isUsAnySogsFromCache,
  sendMessageReaction,
} from '../../util/reactions';
import { BchatIconButton } from '../icon';

// import { nativeEmojiData } from '../../util/emoji';
import { getConversationController } from '../../bchat/conversations';
import { BchatButton, BchatButtonType } from '../basic/BchatButton';

interface Props {
  messageId: string;
  reaction: string;
}

const StyledReactListContainer = styled(Flex)`
  // width: 376px;
`;

const StyledReactionsContainer = styled(Flex)`
  border-bottom: 1px solid #4B4B64;
  width: 100%;
  overflow-x: auto;
  padding: 12px 8px 8px;
`;

const StyledSendersContainer = styled(Flex)`
  width: 100%;
  // min-height: 3px;
  height: 100%;
  max-height: 300px;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 14px 16px 32px;
`;

const StyledReactionBar = styled(Flex)`
  width: 100%;
  // margin: 12px 0 20px 4px;

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
const StyledAllButton = styled.button`
  border-radius: 17px;
  border: 0.5px solid #858598;
  background: #202329;
  color: #f0f0f0;
  
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  span {
    color: #a7a7ba;
    font-family: Poppins;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`;
type ReactionSendersProps = {
  messageId: string;
  currentReact: string;
  // senders: Array<string>;
  me: string;
  handleClose: () => void;
  reactedDetailList: Array<reactionListDetailsProps>;
};
export type reactionListDetailsProps = {
  sender: string;
  emoji: any;
};
const ReactionSenders = (props: ReactionSendersProps) => {
  const { messageId, currentReact, me, handleClose, reactedDetailList } = props;
  const FilteredList = currentReact
    ? reactedDetailList.filter(({ emoji }) => emoji === currentReact)
    : reactedDetailList;
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
  console.log('reacted 2-->', reactedDetailList);

  return (
    <>
      {FilteredList.map(reactedList => (
        <StyledReactionSender
          key={`${messageId}-${reactedList.sender}`}
          container={true}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Flex container={true} alignItems={'center'}>
            <Avatar
              size={AvatarSize.S}
              pubkey={reactedList.sender}
              onAvatarClick={async () => {
                await handleAvatarClick(reactedList.sender);
              }}
            />
            <ContactName
              pubkey={reactedList.sender}
              module="module-conversation__user"
              shouldShowPubkey={false}
            />
            <span role={'img'}> {reactedList.emoji}</span>
          </Flex>
          <Flex container={true} alignItems={'center'}>
            {reactedList.sender === me && (
              <BchatButton buttonType={BchatButtonType.BrandOutline} text='Remove'  iconType='delete' onClick={handleRemoveReaction}/>
             
              
            )}
          </Flex>
        </StyledReactionSender>
      ))}
    </>
  );
};
// const handleSenders = (senders: Array<string>, me: string) => {
//   let updatedSenders = senders;
//   const blindedMe = updatedSenders.filter(
//     sender => sender.startsWith('bd') && isUsAnySogsFromCache(sender)
//   );

//   let meIndex = -1;
//   if (blindedMe && blindedMe[0]) {
//     meIndex = updatedSenders.indexOf(blindedMe[0]);
//   } else {
//     meIndex = updatedSenders.indexOf(me);
//   }
//   if (meIndex >= 0) {
//     updatedSenders.splice(meIndex, 1);
//     updatedSenders = [me, ...updatedSenders];
//   }

//   return updatedSenders;
// };

// tslint:disable-next-line: max-func-body-length
export const ReactListModal = (props: Props): ReactElement => {
  const [reactions, setReactions] = useState<SortedReactionList>([]);
  // const reactionsMap = (reactions && Object.fromEntries(reactions)) || {};
  const [currentReact, setCurrentReact] = useState('');
  // const [senders, setSenders] = useState<Array<string>>([]);

  // const [reactedDetailList, setReactedDetailList] = useState<Array<reactionListDetailsProps>>([]);
  // const [reactAriaLabel, setReactAriaLabel] = useState<string | undefined>();
  const dispatch = useDispatch();
  const {
    // reaction,
    messageId,
  } = props;
  const me = UserUtils.getOurPubKeyStrFromCache();

  const msgProps = useSelector((state: StateType) => getMessageReactsProps(state, messageId));

  if (!msgProps) {
    return <></>;
  }

  const { convoId, sortedReacts: reacts, isPublic } = msgProps;
  const convo = getConversationController().get(convoId);
  const weAreModerator = convo.getConversationModelProps().weAreModerator;
  const reactedDetailList = sortedSenderAndEmoji();

  const handleSelectedReaction = (emoji: string): boolean => {
    return currentReact == emoji;
  };

  const handleReactionClick = (emoji: string) => {
    // setReactAriaLabel(nativeEmojiData?.ariaLabels ? nativeEmojiData.ariaLabels[emoji] : undefined);
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

  function sortedSenderAndEmoji() {
    const reactedCustomData: Array<reactionListDetailsProps> = [];
    reacts?.forEach(([emoji, { senders }]) => {
      Object.keys(senders).forEach(sender => {
        reactedCustomData.push({ sender, emoji });
      });
    });

    console.log('pushedData -->', reactedCustomData);
    // const FilteredReact = reactedCustomData.filter(({ emoji }) => emoji === currentReact);
    // const finalData = FilteredReact.length > 0 ? FilteredReact : reactedCustomData;
    // console.log('finalData -->', finalData,reactAriaLabel);
    // setReactedDetailList(reactedCustomData);

    return reactedCustomData;
  }

  useEffect(
    () => {
      // if (currentReact === '' && currentReact !== reaction) {
      //   setReactAriaLabel(
      //     nativeEmojiData?.ariaLabels ? nativeEmojiData.ariaLabels[reaction] : undefined
      //   );
      //   setCurrentReact(reaction);
      // }
      if (reacts && !isEqual(reactions, reacts)) {
        setReactions(reacts);
      }
      // sortedSenderAndEmoji();
      // if (!isEmpty(reactions) && (isEmpty(reacts) || isUndefined(reacts))) {
      //   setReactions([]);
      // }
      // let _senders =
      //   reactionsMap && reactionsMap[currentReact] && reactionsMap[currentReact].senders
      //     ? Object.keys(reactionsMap[currentReact].senders)
      //     : null;
      // console.log('_senders 0 -->', _senders);
      // if (_senders && !isEqual(senders, _senders)) {
      //   if (_senders.length > 0) {
      //     _senders = handleSenders(_senders, me);
      //   }
      //   console.log('_senders 1 -->', _senders);
      //   setSenders(_senders);
      //   sortedSenderAndEmoji();
      // }
      // if (
      //   !isEmpty(senders) &&
      //   (isEmpty(reactionsMap[currentReact]?.senders) || isNil(_senders) || isEmpty(_senders))
      // ) {
      //   setSenders([]);
      // }
    },

    // [currentReact, me, reaction, reacts, reactions, reactionsMap, senders]);
    [reacts, me]
  );

  return (
    <div className="reaction-list-modal">
      <div className='reaction-list-innreModal show-modal'> 
        <StyledReactListContainer
          container={true}
          flexDirection={'column'}
          alignItems={'flex-start'}
        >
          <StyledReactionsContainer
            container={true}
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent="space-between"
          >
            <Flex container={true} flexDirection={'row'} alignItems={'center'}>
              <StyledAllButton onClick={() => setCurrentReact('')}>
                All <span>{reactedDetailList.length}</span>
              </StyledAllButton>
              <MessageReactions
                messageId={messageId}
                hasReactLimit={false}
                inModal={true}
                onSelected={handleSelectedReaction}
                onClick={handleReactionClick}
              />
            </Flex>
            <BchatIconButton iconType="xWithCircle" iconSize={'large'}  onClick={handleClose}/>
          </StyledReactionsContainer>
          {/* {reactionsMap && ( */}
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
              {/* <p> */}
              {/* <span role={'img'} aria-label={reactAriaLabel}>
                  {currentReact}
                </span> */}
              {/* {reactionsMap[currentReact].count && (
                  <>
                    <span>&#8226;</span>
                    <span>{reactionsMap[currentReact].count}</span>
                  </>
                )} */}
              {/* </p> */}
              {isPublic && weAreModerator && (
                <StyledClearButton onClick={handleClearReactions}>
                  {window.i18n('clearAll')}
                </StyledClearButton>
              )}
            </StyledReactionBar>

           
            {reactedDetailList && reactedDetailList.length > 0 && (
              <ReactionSenders
                messageId={messageId}
                currentReact={currentReact}
                reactedDetailList={reactedDetailList}
                me={me}
                handleClose={handleClose}
              />
            )}
          </StyledSendersContainer>
          {/* )} */}
        </StyledReactListContainer>
      </div>
    </div>
  );
};
