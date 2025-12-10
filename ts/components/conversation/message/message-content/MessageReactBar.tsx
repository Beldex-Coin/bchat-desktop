import  { ReactElement, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { BchatIconButton } from '../../../icon';
import { RecentReactions } from '../../../../types/Reaction';

import { getRecentReactions } from '../../../../util/storage';

import { nativeEmojiData } from '../../../../util/emoji';
import { isEqual } from 'lodash';

type Props = {
  action: (...args: Array<any>) => void;
  additionalAction: (...args: Array<any>) => void;
  isIncoming: boolean;
};
// Define the keyframes for the animation
const expand = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;
const rotateEmoji = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
const rotateEmojiAntiClock = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
`;
const StyledMessageReactBar = styled.div<{ isIncoming: boolean }>`
  box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.2), 0 0px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 6px 8px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  flex-direction: ${props => (props.isIncoming ? 'row' : 'row-reverse')};
  border-radius: 24px;
  background: var(--color-emoji-panel-bg);
  font-size: 20px;
  animation: ${expand} 0.3s ease-in-out forwards; /* Add animation here */
  overflow: hidden;
  float: ${props => (props.isIncoming ? 'left' : 'right')};
  span {
    cursor: pointer;
  }
  .bchat-icon-button {
    margin-right: 0;
    border-color: transparent !important;
    box-shadow: none !important;
  }
`;
const ReactButton = styled.div<{ isIncoming: boolean }>`
  margin: 0 4px;
  animation: ${props => (props.isIncoming ? rotateEmoji : rotateEmojiAntiClock)} 0.4s linear forwards;
  cursor: pointer;

`;

export const MessageReactBar = (props: Props): ReactElement => {
  const { action, additionalAction, isIncoming } = props;
  const [recentReactions, setRecentReactions] = useState<RecentReactions>();

  useEffect(() => {
    const reactions: any = new RecentReactions(getRecentReactions());
    if (reactions && !isEqual(reactions, recentReactions)) {
      setRecentReactions(reactions);
    }
  }, [recentReactions]);

  if (!recentReactions) {
    return <></>;
  }
  return (
    <StyledMessageReactBar isIncoming={isIncoming}>
      {recentReactions &&
        recentReactions.items.map(emoji => (
          <ReactButton
            isIncoming={isIncoming}
            key={emoji}
            role={'img'}
            aria-label={nativeEmojiData?.ariaLabels ? nativeEmojiData.ariaLabels[emoji] : undefined}
            onClick={() => {
              action(emoji);
            }}
            className="recentButton"
          >
            {emoji}
          </ReactButton>
        ))}
      <span>
        <BchatIconButton
          iconColor={'#858598'}
          iconSize={20}
          iconType="plusOuterFilled"
          onClick={e => additionalAction(e)}
        />
      </span>
    </StyledMessageReactBar>
  );
};
