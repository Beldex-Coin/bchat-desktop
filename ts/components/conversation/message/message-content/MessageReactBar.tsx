import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { BchatIconButton } from '../../../icon';

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

export const MessageReactBar = (props: Props): ReactElement => {
    const { action, additionalAction } = props;

  return (
    <StyledMessageReactBar>
      <span onClick={()=>action('😁')}>😁</span>
      <span onClick={()=>action('😂')}>😂</span>
      <span onClick={()=>action('🥰')}>🥰</span>
      <span onClick={()=>action('😁')}>😈</span>
      <span onClick={()=>action('😎')}>😎</span>
      <span onClick={()=>action('😜')}>😜</span>
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
