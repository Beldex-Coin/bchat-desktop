import React, { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import { BchatIconButton } from '../../../icon';
import { RecentReactions } from '../../../../types/Reaction';

import { getRecentReactions } from '../../../../util/storage';

import { nativeEmojiData } from '../../../../util/emoji';
import { isEqual } from 'lodash';

type Props = {
  action: (...args: Array<any>) => void;
  additionalAction: (...args: Array<any>) => void;
};

const StyledMessageReactBar = styled.div`
  box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.2), 0 0px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 4px 8px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  border-radius: 24px;
  background: var(--color-emoji-panel-bg);
  font-size: 18px;
  span {
    
    margin: 0 4px;
    cursor: pointer;
  }
  .bchat-icon-button {
    margin-right: 0;
    border-color: transparent !important;
    box-shadow: none !important;
  }
`;
const ReactButton = styled.div`
  baakground: red;
`;

export const MessageReactBar = (props: Props): ReactElement => {
  const { action, additionalAction } = props;
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
    <StyledMessageReactBar >
      {recentReactions &&
        recentReactions.items.map(emoji => (
          <ReactButton
            key={emoji}
            role={'img'}
            aria-label={nativeEmojiData?.ariaLabels ? nativeEmojiData.ariaLabels[emoji] : undefined}
            onClick={() => {
              action(emoji);
            }}
          >
            {emoji}
          </ReactButton>
        ))}
      <span>
        <BchatIconButton
          iconColor={'#858598'}
          iconSize={20}
          iconType="plusOuterFilled"
          onClick={(e)=>additionalAction(e)}
        />
      </span>
    </StyledMessageReactBar>
  );
};
