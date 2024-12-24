import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { MessageRenderingProps } from '../../../../models/messageType';
import { StateType } from '../../../../state/reducer';
import { getMessageReactsProps } from '../../../../state/selectors/conversations';
import { isEmpty } from 'lodash';
import _ from 'lodash';
import { ReactionList } from '../../../../types/Message';

import { UserUtils } from '../../../../bchat/utils';

import { MessageReactionPopup, StyledPopupContainer, TipPosition } from './MessageReactionPopup';
import { useMouse } from 'react-use';
import { Flex } from '../../../basic/Flex';

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
const UpArrowSVG = (): ReactElement => (
  <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="https://www.w3.org/2000/svg">
    <path
      d="M1.61507 7.80039L6.65036 1.97547L11.7975 7.92524C11.8584 7.99924 11.9355 8.06189 12.0245 8.10951C12.1136 8.15712 12.2126 8.18875 12.3158 8.20252C12.419 8.21629 12.5244 8.2119 12.6257 8.18966C12.7269 8.16742 12.8221 8.12777 12.9055 8.073C12.9889 8.01824 13.0589 7.94948 13.1114 7.87078C13.1639 7.79209 13.1978 7.70503 13.2111 7.61475C13.2245 7.52446 13.2169 7.43276 13.189 7.34505C13.1611 7.25733 13.1133 7.17538 13.0485 7.10399L7.4202 0.59631C7.3586 0.526844 7.28271 0.467968 7.19641 0.42269C7.16257 0.390959 7.12589 0.361593 7.08674 0.334893C6.92083 0.226037 6.71212 0.179063 6.50649 0.204303C6.30086 0.229544 6.11515 0.324945 5.99018 0.469506L0.361836 6.97718C0.299597 7.04858 0.254157 7.12999 0.228114 7.21674C0.20207 7.30349 0.195944 7.39386 0.210084 7.48268C0.224224 7.5715 0.258347 7.657 0.310506 7.73429C0.362664 7.81158 0.431822 7.87913 0.514012 7.93305C0.596278 7.98741 0.690036 8.0271 0.789912 8.04986C0.889788 8.07261 0.993823 8.07799 1.09608 8.06567C1.19834 8.05335 1.29681 8.02358 1.38586 7.97806C1.47491 7.93254 1.55281 7.87217 1.61507 7.80039Z"
      fill="currentColor"
    />
  </svg>
);
export type MessageReactsSelectorProps = Pick<MessageRenderingProps, 'reacts'>;

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

const StyledReaction = styled.button<{ selected: boolean; inModal: boolean }>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: var(--color-compose-view-button-background);
  border-width: 1px;
  border-style: solid;
  border-color: ${props => (props.selected ? 'var(--color-accent)' : 'transparent')};
  border-radius: 11px;
  padding: ${props => (props.inModal ? '3px 7px' : '0px 7px')};
  margin: 0 4px var(--margins-sm);

  display: flex;
  justify-content: flex-start;
  align-items: center;

  span:last-child {
    font-size: var(--font-size-xs);
    margin-left: 8px;
  }
`;

const StyledReactionContainer = styled.div`
  position: relative;
`;
const StyledReactionOverflow = styled.button`
  border: none;
  margin-right: 4px;
  margin-bottom: var(--margins-sm);

  display: flex;
  justify-content: flex-start;
  align-items: center;

  span {
    background-color: var(--color-received-message-background);
    border: 1px solid var(--color-inbox-background);
    border-radius: 50%;
    overflow: hidden;
    margin-right: -9px;
    padding: 1px 4.5px;
  }

  span:nth-child(1) {
    z-index: 3;
  }

  span:nth-child(2) {
    z-index: 2;
  }

  span:nth-child(3) {
    z-index: 1;
  }
`;

const StyledReadLess = styled.span`
  font-size: var(--font-size-xs);
  margin-top: 8px;
  svg {
    margin-right: 5px;
  }
`;

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
  const me = UserUtils.getOurPubKeyStrFromCache();
  const msgProps = useSelector((state: StateType) => getMessageReactsProps(state, messageId));

  if (!msgProps) {
    return <></>;
  }

  const { reacts } = msgProps;
  const [reactions, setReactions] = useState<ReactionList>({});

  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const reactionRef = useRef(null);
  const { docX } = useMouse(reactionRef);
  const popupXDefault = -101;
  const popupYDefault = -90;
  const [popupX, setPopupX] = useState(popupXDefault);
  const [popupY, setPopupY] = useState(popupYDefault);
  const gutterWidth = 380;
  const tooltipMidPoint = 108; // width is 216px;
  const [tooltipPosition, setTooltipPosition] = useState<TipPosition>('center');
  const reactLimit = 6;
  const handleReactionClick = async (emoji: string) => {
    onClick(emoji);
  };
  const selected = (emoji: string) => {
    if (onSelected) {
      return onSelected(emoji);
    }
    return (
      reactions[emoji].senders &&
      reactions[emoji].senders.length > 0 &&
      reactions[emoji].senders.includes(me)
    );
  };

  const renderReaction = (emoji: string) => (
    <StyledReactionContainer ref={reactionRef}>
      {popupReaction && popupReaction === emoji && (
        <MessageReactionPopup
          messageId={messageId}
          emoji={popupReaction}
          senders={reactions[popupReaction].senders}
          tooltipPosition={tooltipPosition}
          onClick={() => {
            if (setPopupReaction) {
              setPopupReaction('');
            }
            setPopupX(popupXDefault);
            setPopupY(popupYDefault);
            setTooltipPosition('center');
            if (onPopupClick) {
              onPopupClick();
            }
          }}
        />
      )}
      <StyledReaction
        key={emoji}
        selected={selected(emoji)}
        inModal={inModal}
        onClick={async () => {
          await handleReactionClick(emoji);
        }}
        onMouseEnter={() => {
          const { innerWidth: windowWidth } = window;

          // overflow on far right means we shift left
          if (setPopupReaction) {
            // overflow on far right means we shift left
            if (docX + tooltipMidPoint > windowWidth) {
              setPopupX(Math.abs(popupXDefault) * 1.5 * -1);
              setTooltipPosition('right');
              // overflow onto conversations means we lock to the right
            } else if (docX <= gutterWidth + tooltipMidPoint) {
              const offset = -12.5;
              setPopupX(offset);
              setTooltipPosition('left');
            } else {
              setPopupX(popupXDefault);
              setTooltipPosition('center');
            }

            setPopupReaction(emoji);
          }
          console.log('opening popup at');
        }}
      >
        <span>{emoji}</span>
        {reactions[emoji].senders && <span>{reactions[emoji].senders.length}</span>}
      </StyledReaction>
    </StyledReactionContainer>
  );

  const renderReactionList = () => (
    <StyledMessageReactions
      container={true}
      flexWrap={inModal ? 'nowrap' : 'wrap'}
      alignItems={'center'}
      inModal={inModal}
    >
      {Object.keys(reactions).map(emoji => {
        return renderReaction(emoji);
      })}
    </StyledMessageReactions>
  );

  const renderCompressedReactions = () => (
    <StyledMessageReactions
      container={true}
      flexWrap={inModal ? 'nowrap' : 'wrap'}
      alignItems={'center'}
      inModal={inModal}
    >
      {Object.keys(reactions)
        .slice(0, 4)
        .map(emoji => {
          return renderReaction(emoji);
        })}
      <StyledReactionOverflow onClick={handleExpand}>
        {Object.keys(reactions)
          .slice(4, 7)
          .map(emoji => (
            <span key={emoji}>{emoji}</span>
          ))}
      </StyledReactionOverflow>
    </StyledMessageReactions>
  );

  const renderExpandedReactions = () => (
    <>
      {renderReactionList()}
      <StyledReadLess onClick={handleExpand}>
        <UpArrowSVG />
        Show Less
      </StyledReadLess>
    </>
  );

  const render = () => {
    if (!hasReactLimit || Object.keys(reactions).length <= reactLimit) {
      return renderReactionList();
    } else {
      return isExpanded ? renderExpandedReactions() : renderCompressedReactions();
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
