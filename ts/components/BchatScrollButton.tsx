import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { getShowScrollButton } from '../state/selectors/conversations';

import { BchatIconButton } from './icon';

const BchatScrollButtonDiv = styled.div`
  position: fixed;
  z-index: 2;
  right: 26px;
  animation: fadein var(--default-duration);
  bottom: 72px;
`;

export const BchatScrollButton = (props: { onClickScrollBottom: () => void, unreadCount: number | undefined }) => {
  const show = useSelector(getShowScrollButton);

  return (
    <BchatScrollButtonDiv>
      <div className='downArrow'>
        <BchatIconButton
          iconType="arrow"
          iconSize={18}
          isHidden={!show}
          iconColor='var(--color-downArrow)'
          onClick={props.onClickScrollBottom}
          dataTestId="scroll-to-bottom-button"
        // iconRotation={3}
        />
        <div className='downArrow-unreadCountBox'>
          {props.unreadCount}

        </div>
      </div>

    </BchatScrollButtonDiv>
  );
};
