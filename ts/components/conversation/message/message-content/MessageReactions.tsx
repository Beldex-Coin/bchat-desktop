import React, { ReactElement, useEffect, useState } from 'react';

import styled from 'styled-components';
import { MessageRenderingProps } from '../../../../models/messageType';

import { isEmpty, isEqual } from 'lodash';
import _ from 'lodash';
import { SortedReactionList } from '../../../../types/Reaction';

import { Flex } from '../../../basic/Flex';

// import { nativeEmojiData } from '../../../../util/emoji';
import { StyledPopupContainer } from '../reactions/ReactionPopup';

import { Reaction, ReactionProps } from '../reactions/Reaction';
import {  BchatIconButton } from '../../../icon';
import { useMessageReactsPropsById } from '../../../../hooks/useParamSelector';

export const popupXDefault = -101;
export const popupYDefault = -90;

type Props = {
  messageId: string;
  hasReactLimit?: boolean;
  onClick: (emoji: string) => void;
  popupReaction?: string;
  setPopupReaction?: (emoji: string) => void;
  onPopupClick?: () => void;
  inModal?: boolean;
  onSelected?: (emoji: string) => boolean;
  isIncoming?:boolean;
  iscurrentReact?:string;
};

export type MessageReactsSelectorProps = Pick<
  MessageRenderingProps,
  'convoId' | 'conversationType' | 'isPublic' | 'serverId' | 'reacts' | 'sortedReacts'
>;

const StyledMessageReactionsContainer = styled(Flex)<{ x: number; y: number,isIncoming?:boolean,inModal?:boolean }>`
  position: relative;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom:${props=>props.inModal?'unset':'10px'} ;
  ${StyledPopupContainer} {
    position: absolute;
    top: ${props => `${props.y}px;`};
    // left: ${props => `${props.x}px;`};
    left:${props => `${props.isIncoming?18:-187}px;`}
    z-index: 2;
  
  }
`;

export const StyledMessageReactions = styled(Flex)<{ inModal: boolean }>`
  ${props =>
    props.inModal
      ? ''
      : `max-width: 375px;; 
     `
    }
`;

// const StyledReactionOverflow = styled.button`
 
//   margin-right: 4px;
//   margin-bottom: var(--margins-sm);
//   display: flex;
//   justify-content: flex-start;
//   align-items: center;
//   flex-direction: row-reverse;

//   span {
//     background-color: var(--color-received-message-background);
//     border: 1px solid var(--color-inbox-background);
//     border-radius: 50%;
//     overflow: hidden;
//     margin-right: -9px;
//     padding: 1px 4.5px;
//   }
// `;

// const StyledReadLess = styled.span`
//   font-size: var(--font-size-h2);
//   margin-top: 8px;
//   svg {
//     margin-right: 5px;
//   }
// `;

type ReactionsProps = Omit<ReactionProps, 'emoji'>;

const Reactions = (props: ReactionsProps): ReactElement => {
  const { messageId, reactions, inModal ,isIncoming} = props;

  return (
    <StyledMessageReactions
      container={true}
      flexWrap={inModal ? 'nowrap' : 'wrap'}
      alignItems={'center'}
      inModal={inModal}
      flexDirection={isIncoming?"row":'row-reverse'}
    >
      {reactions.map(([emoji, _]) => (
        <Reaction key={`${messageId}-${emoji}`} emoji={emoji} {...props} />
      ))}
    </StyledMessageReactions>
  );
};
const CompressedReactions = (props: ReactionsProps): ReactElement => {
  const { messageId, reactions, inModal,handlePopupClick,isIncoming } = props;
  return (
    <StyledMessageReactions
      container={true}
      flexWrap={inModal ? 'nowrap' : 'wrap'}
      alignItems={'center'}
      inModal={inModal}
      flexDirection={isIncoming?"row":'row-reverse'}
    >
      {reactions.slice(0, 5).map(([emoji, _]) => (
        <Reaction key={`${messageId}-${emoji}`} emoji={emoji} {...props} />
      ))}
      <BchatIconButton
          iconType={'chevron'}
          iconSize={20}
          iconColor="#A7A7BA"
          btnRadius="40px"
          btnBgColor="var(--color-emoji-panel-bg)"
          iconRotation={isIncoming?270:90}
          onClick={handlePopupClick}
          margin="0 3px"
        />
      {/* <StyledReactionOverflow onClick={handleExpand}>
        {reactions
          .slice(4, 7)
          .reverse()
          .map(([emoji, _]) => {
            return (
              <span
                key={`${messageId}-${emoji}`}
                role={'img'}
                aria-label={
                  nativeEmojiData?.ariaLabels ? nativeEmojiData.ariaLabels[emoji] : undefined
                }
              >
                {emoji}
              </span>
            );
          })}
      </StyledReactionOverflow> */}
    </StyledMessageReactions>
  );
};
// const ExpandedReactions = (props: ExpandReactionsProps): ReactElement => {
//   const { handleExpand } = props;
//   return (
//     <>
//       <Reactions {...props} />
//       <StyledReadLess onClick={handleExpand}>
//         <BchatIcon iconType="chevron" iconSize="medium" iconRotation={180} />
//         {window.i18n('expandedReactionsText')}
//       </StyledReadLess>
//     </>
//   );
// };

export const MessageReactions = (props: Props): ReactElement => {
  const {
    messageId,
    hasReactLimit = true,
    onClick,
    popupReaction,
    setPopupReaction,
    onPopupClick,
    inModal = false,
    onSelected,
    isIncoming,
    iscurrentReact
  } = props;

  const [reactions, setReactions] = useState<SortedReactionList>([]);

  // const [isExpanded, setIsExpanded] = useState(false);
  // const handleExpand = () => {
  //   setIsExpanded(!isExpanded);
  // };

  const [popupX, setPopupX] = useState(popupXDefault);
  const [popupY, setPopupY] = useState(popupYDefault);
  const msgProps = useMessageReactsPropsById(messageId);

  if (!msgProps) {
    return <></>;
  }

  const { conversationType, sortedReacts: reacts } = msgProps;
  const inGroup = conversationType === 'group';

  const reactLimit = 5;

  const reactionsProps = {
    messageId,
    reactions,
    inModal,
    inGroup,
    handlePopupX: setPopupX,
    handlePopupY: setPopupY,
    onClick,
    popupReaction,
    onSelected,
    handlePopupReaction: setPopupReaction,
    handlePopupClick: onPopupClick,
    isIncoming,
    iscurrentReact
  };

  useEffect(() => {
    if (reacts && !isEqual(reactions, reacts)) {
      setReactions(reacts);
    }
    if (!isEmpty(reactions) && isEmpty(reacts)) {
      setReactions([]);
    }
  }, [reacts, reactions]);

  return (
    <StyledMessageReactionsContainer
      container={true}
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={inModal ? 'flex-start' : 'center'}
      x={popupX}
      y={popupY}
      isIncoming={isIncoming}
      inModal={inModal}
    >
      {reacts &&
        !_.isEmpty(reacts) &&
        (!hasReactLimit || reacts.length <= reactLimit ? (
          <Reactions {...reactionsProps} />
        ) 
        // : isExpanded ? (
        //   <ExpandedReactions handleExpand={handleExpand} {...reactionsProps} />
        // ) 
        : (
          <CompressedReactions {...reactionsProps} />
        ))}
    </StyledMessageReactionsContainer>
  );
};
