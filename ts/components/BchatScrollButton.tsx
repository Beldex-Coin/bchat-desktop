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

export const BchatScrollButton = (props: { onClickScrollBottom: () => void }) => {
  const show = useSelector(getShowScrollButton);

  return (
    <BchatScrollButtonDiv>
      <BchatIconButton
        iconType="chevron"
        iconSize={'huge'}
        isHidden={!show}
        onClick={props.onClickScrollBottom}
        dataTestId="scroll-to-bottom-button"
      />
    </BchatScrollButtonDiv>
  );
};
