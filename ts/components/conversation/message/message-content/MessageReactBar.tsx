import React, { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import { BchatIconButton } from '../../../icon';
import { RecentReactions } from '../../../../types/Util';


import { getRecentReactions } from '../../../../util/storage';

import { nativeEmojiData } from '../../../../util/emoji';
import { isEqual } from 'lodash';

type Props = {
  action: (...args: Array<any>) => void;
  additionalAction: (...args: Array<any>) => void;
};

const StyledMessageReactBar = styled.div`
  background-color: var(--color-received-message-background);
  border-radius: 25px;
  box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.2), 0 0px 20px 0 rgba(0, 0, 0, 0.19);
  position: absolute;
  top: -64px;
  padding: 4px 8px;
  white-space: nowrap;
  width: 280px;
  display: flex;
  align-items: center;
  span {
    font-size: 28px;
    margin: 0 4px;
    cursor: pointer;
  }
  .bchat-icon-button {
    margin-right: 0;
     border-color: transparent !important;
    box-shadow: none !important;
  }
`;
const ReactButton=styled.div`
baakground:red;
`

const loadRecentReactions = async () => {
  const reactions = new RecentReactions(await getRecentReactions());
  return reactions;
}

export const MessageReactBar = (props: Props): ReactElement => {
    const { action, additionalAction } = props;
    const [recentReactions, setRecentReactions] = useState<RecentReactions>();

  
    useEffect(() => {
      let isCancelled = false;
      loadRecentReactions()
        .then(async reactions => {
          if (isCancelled) {
            return;
          }
          if (reactions && !isEqual(reactions, recentReactions)) {
            setRecentReactions(reactions);
          }
        })
        .catch(() => {
          if (isCancelled) {
            return;
          }
        });
  
      return () => {
        isCancelled = true;
      };
    }, [recentReactions,loadRecentReactions]);
  
    if (!recentReactions) {
      return <></>;
    }
  return (
    <StyledMessageReactBar>
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
          iconColor={'var(--color-text)'}
          iconPadding={'10px'}
          iconSize={'huge2'}
          iconType="plusThin"
          backgroundColor={'var(--color-compose-view-button-background)'}
          borderRadius="300px"
          onClick={additionalAction}
        />
      </span>
    </StyledMessageReactBar>
  );
};
