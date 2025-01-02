import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { MessageRenderingProps } from '../../../../models/messageType';
import { StateType } from '../../../../state/reducer';
import { getMessageReactsProps } from '../../../../state/selectors/conversations';
import { isEmpty } from 'lodash';
import _ from 'lodash';
import { ReactionList } from '../../../../types/Message';

import { Flex } from '../../../basic/Flex';


import { nativeEmojiData } from '../../../../util/emoji';
import { StyledPopupContainer } from '../reactions/ReactionPopup';

import { Reaction, ReactionProps } from '../reactions/Reaction';

export const popupXDefault = -101;
export const popupYDefault = -90;

type Props = {
  messageId: string;
  hasReactLimit?: boolean;
  onClick: (...args: Array<any>) => void;
  popupReaction?: string;
  setPopupReaction?: (...args: Array<any>) => void;
  onPopupClick?: (...args: Array<any>) => void;
  inModal?: boolean;
  onSelected?: (...args: Array<any>) => boolean;
};

export type MessageReactsSelectorProps = Pick<MessageRenderingProps, 'conversationType' | 'isPublic'| 'reacts'| 'weAreAdmin'>;

const StyledMessageReactionsContainer = styled(Flex)<{ x: number; y: number }>`
  position: relative;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${StyledPopupContainer} {
    position: absolute;
    top: ${props => `${props.y}px;`};
    left: ${props => `${props.x}px;`};
  }
`;

export const StyledMessageReactions = styled(Flex)<{ inModal: boolean }>`
  ${props => (props.inModal ? '' : 'max-width: 320px;')}
`;


const StyledReactionOverflow = styled.button`
  border: none;
  margin-right: 4px;
  margin-bottom: var(--margins-sm);

  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row-reverse;

  span {
    background-color: var(--color-received-message-background);
    border: 1px solid var(--color-inbox-background);
    border-radius: 50%;
    overflow: hidden;
    margin-right: -9px;
    padding: 1px 4.5px;
  }

  
`;

const StyledReadLess = styled.span`
  font-size: var(--font-size-xs);
  margin-top: 8px;
  svg {
    margin-right: 5px;
  }
`;

type ReactionsProps = Omit<ReactionProps, 'emoji'>;

const Reactions = (props: ReactionsProps): ReactElement => {
  const { messageId, reactions, inModal } = props;
  return (
    <StyledMessageReactions
      container={true}
      flexWrap={inModal ? 'nowrap' : 'wrap'}
      alignItems={'center'}
      inModal={inModal}
    >
      {Object.keys(reactions).map(emoji => (
        <Reaction key={`${messageId}-${emoji}`} emoji={emoji} {...props} />
      ))}
    </StyledMessageReactions>
  );
};
interface ExpandReactionsProps extends ReactionsProps {
  handleExpand: (...args: Array<any>) => void;
}

const CompressedReactions = (props: ExpandReactionsProps): ReactElement => {
  const { messageId, reactions, inModal, handleExpand } = props;
  return (
    <StyledMessageReactions
      container={true}
      flexWrap={inModal ? 'nowrap' : 'wrap'}
      alignItems={'center'}
      inModal={inModal}
    >
      {Object.keys(reactions)
        .slice(0, 4)
        .map(emoji => (
          <Reaction key={`${messageId}-${emoji}`} emoji={emoji} {...props} />
        ))}
      <StyledReactionOverflow onClick={handleExpand}>
        {Object.keys(reactions)
          .slice(4, 7)
          .reverse()
          .map(emoji => {
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
        </StyledReactionOverflow>
      </StyledMessageReactions>
    );
  };
  const ExpandedReactions = (props: ExpandReactionsProps): ReactElement => {
    const { handleExpand } = props;
    return (
      <>
        <Reactions {...props} />
        <StyledReadLess onClick={handleExpand}>
          <svg
            width="14"
            height="9"
            viewBox="0 0 14 9"
            fill="none"
            xmlns="https://www.w3.org/2000/svg"
          >
            <path
              d="M1.61507 7.80039L6.65036 1.97547L11.7975 7.92524C11.8584 7.99924 11.9355 8.06189 12.0245 8.10951C12.1136 8.15712 12.2126 8.18875 12.3158 8.20252C12.419 8.21629 12.5244 8.2119 12.6257 8.18966C12.7269 8.16742 12.8221 8.12777 12.9055 8.073C12.9889 8.01824 13.0589 7.94948 13.1114 7.87078C13.1639 7.79209 13.1978 7.70503 13.2111 7.61475C13.2245 7.52446 13.2169 7.43276 13.189 7.34505C13.1611 7.25733 13.1133 7.17538 13.0485 7.10399L7.4202 0.59631C7.3586 0.526844 7.28271 0.467968 7.19641 0.42269C7.16257 0.390959 7.12589 0.361593 7.08674 0.334893C6.92083 0.226037 6.71212 0.179063 6.50649 0.204303C6.30086 0.229544 6.11515 0.324945 5.99018 0.469506L0.361836 6.97718C0.299597 7.04858 0.254157 7.12999 0.228114 7.21674C0.20207 7.30349 0.195944 7.39386 0.210084 7.48268C0.224224 7.5715 0.258347 7.657 0.310506 7.73429C0.362664 7.81158 0.431822 7.87913 0.514012 7.93305C0.596278 7.98741 0.690036 8.0271 0.789912 8.04986C0.889788 8.07261 0.993823 8.07799 1.09608 8.06567C1.19834 8.05335 1.29681 8.02358 1.38586 7.97806C1.47491 7.93254 1.55281 7.87217 1.61507 7.80039Z"
              fill="currentColor"
            />
          </svg>
          {window.i18n('expandedReactionsText')}
      </StyledReadLess>
    </>
  );
};

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
  } = props;

  const msgProps = useSelector((state: StateType) => getMessageReactsProps(state, messageId));

  if (!msgProps) {
    return <></>;
  }

  const { conversationType, reacts } = msgProps;
  const inGroup = conversationType === 'group';
  const [reactions, setReactions] = useState<ReactionList>({});

  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

 
  const [popupX, setPopupX] = useState(popupXDefault);
  const [popupY, setPopupY] = useState(popupYDefault);
 
  const reactLimit = 6;
  
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
  }

  const render = () => {
    if (!hasReactLimit || Object.keys(reactions).length <= reactLimit) {
      return Reactions({ ...reactionsProps });
    } else {
      return isExpanded
        ? ExpandedReactions({ handleExpand, ...reactionsProps })
        : CompressedReactions({ handleExpand, ...reactionsProps });
    }
  };

  useEffect(() => {
    if (isEmpty(reacts) && !isEmpty(reactions)) {
      setReactions({});
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
    >
      {!isEmpty(reactions) ? render() : <></>}
    </StyledMessageReactionsContainer>
  );
};
