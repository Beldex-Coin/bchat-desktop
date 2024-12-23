import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { MessageRenderingProps } from '../../../../models/messageType';
import { StateType } from '../../../../state/reducer';
import { getMessageReactsProps } from '../../../../state/selectors/conversations';
import { isEmpty, isEqual } from 'lodash';
import _ from 'lodash';
import { ReactionList } from '../../../../types/Message';

import { sendMessageReaction } from '../../../../interactions/messageInteractions';
import { UserUtils } from '../../../../bchat/utils';

type Props = {
  messageId: string;
};

export type MessageReactsSelectorProps = Pick<MessageRenderingProps, 'reacts'>;

const StyledMessageReactionsContainer = styled.div`
  position: relative;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const StyledMessageReactions = styled.div<{}>`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: center;
  max-width: 320px;
`;

const StyledReaction = styled.button<{ includesMe: boolean }>`
  background-color: var(--color-compose-view-button-background);
  border-width: 1px;
  border-style: solid;
  border-color: ${props => (props.includesMe ? 'var(--color-accent)' : 'transparent')};
  border-radius: 11px;
  padding: 1px 8px;
  margin: 0 4px var(--margins-sm);

  display: flex;
  justify-content: flex-start;
  align-items: center;

  span:last-child {
    font-size: var(--font-size-xs);
    margin-left: 8px;
  }
`;

const StyledReactionOverflow = styled.button`
  border: none;
  margin-right: 4px;
  margin-bottom: var(--margins-sm);

  display: flex;
  justify-content: flex-start;
  align-items: center;

  span {
    background-color: var(--color-compose-view-button-background);
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
  const { messageId } = props;
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

  const reactLimit = 6;
  const handleReactionClick = async (emoji: string) => {
    await sendMessageReaction(messageId, emoji);
  };

  const renderReaction = (emoji: string) => (
    <StyledReaction
      key={emoji}
      includesMe={reactions[emoji].senders.includes(me)}
      onClick={async () => {
        await handleReactionClick(emoji);
      }}
    >
      <span>{emoji}</span>
      {reactions[emoji].senders && <span>{reactions[emoji].senders.length}</span>}
    </StyledReaction>
  );

  const renderReactionList = () => (
    <StyledMessageReactions>
      {Object.keys(reactions).map(emoji => {
        return renderReaction(emoji);
      })}
    </StyledMessageReactions>
  );

  const renderCompressedReactions = () => (
    <StyledMessageReactions>
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
        <svg
          width="14"
          height="9"
          viewBox="0 0 14 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.61507 7.80039L6.65036 1.97547L11.7975 7.92524C11.8584 7.99924 11.9355 8.06189 12.0245 8.10951C12.1136 8.15712 12.2126 8.18875 12.3158 8.20252C12.419 8.21629 12.5244 8.2119 12.6257 8.18966C12.7269 8.16742 12.8221 8.12777 12.9055 8.073C12.9889 8.01824 13.0589 7.94948 13.1114 7.87078C13.1639 7.79209 13.1978 7.70503 13.2111 7.61475C13.2245 7.52446 13.2169 7.43276 13.189 7.34505C13.1611 7.25733 13.1133 7.17538 13.0485 7.10399L7.4202 0.59631C7.3586 0.526844 7.28271 0.467968 7.19641 0.42269C7.16257 0.390959 7.12589 0.361593 7.08674 0.334893C6.92083 0.226037 6.71212 0.179063 6.50649 0.204303C6.30086 0.229544 6.11515 0.324945 5.99018 0.469506L0.361836 6.97718C0.299597 7.04858 0.254157 7.12999 0.228114 7.21674C0.20207 7.30349 0.195944 7.39386 0.210084 7.48268C0.224224 7.5715 0.258347 7.657 0.310506 7.73429C0.362664 7.81158 0.431822 7.87913 0.514012 7.93305C0.596278 7.98741 0.690036 8.0271 0.789912 8.04986C0.889788 8.07261 0.993823 8.07799 1.09608 8.06567C1.19834 8.05335 1.29681 8.02358 1.38586 7.97806C1.47491 7.93254 1.55281 7.87217 1.61507 7.80039Z"
            fill="currentColor"
          />
        </svg>
        Show Less
      </StyledReadLess>
    </>
  );

  const render = () => {
    if (Object.keys(reactions).length <= reactLimit) {
      return renderReactionList();
    } else {
      if (isExpanded) {
        return renderExpandedReactions();
      } else {
        return renderCompressedReactions();
      }
    }
  };

  useEffect(() => {
    if (reacts && !isEqual(reactions, reacts)) {
      setReactions(reacts);
    }
  }, [reacts, reactions]);

  return (
    <StyledMessageReactionsContainer>
      {!isEmpty(reactions) ? render() : <></>}
    </StyledMessageReactionsContainer>
  );
};
