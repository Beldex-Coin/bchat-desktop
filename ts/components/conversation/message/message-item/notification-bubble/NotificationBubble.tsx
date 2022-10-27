import React from 'react';
import styled from 'styled-components';
import { BchatIcon, BchatIconType } from '../../../../icon';

const NotificationBubbleFlex = styled.div`
  display: flex;
  background-color: #34323f75;
  color: var(--color-text);
  width: 90%;
  max-width: 350px;
  margin: 10px auto;
  padding: 5px 10px;
  border-radius: 12px;
  word-break: break-word;
  text-align: center;
  align-items: center;
`;

const NotificationBubbleText = styled.div`
  color: #ffffffc4;
  margin-left: 45px;
`;

const NotificationBubbleIconContainer = styled.div`
  margin: auto 10px;
  width: 30px;
  height: 30px;
`;

export const NotificationBubble = (props: {
  notificationText: string;
  iconType?: BchatIconType;
  iconColor?: string;
  bgColor?:string;
}) => {
  const { notificationText, iconType, iconColor,bgColor } = props;
  return (
    <NotificationBubbleFlex>
      {iconType && (
        <NotificationBubbleIconContainer style={{backgroundColor:bgColor}}>
          <BchatIcon
            iconSize="medium"
            iconType={iconType}
            iconColor={iconColor}
            iconPadding="auto 10px"
          />
        </NotificationBubbleIconContainer>
      )}
      <NotificationBubbleText>{notificationText}</NotificationBubbleText>
      {/* {iconType && <NotificationBubbleIconContainer />} */}
    </NotificationBubbleFlex>
  );
};
