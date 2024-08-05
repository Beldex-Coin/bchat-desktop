import React from 'react';
import styled from 'styled-components';
import { BchatIcon, BchatIconType } from '../../../../icon';

const NotificationBubbleFlex = styled.div`
  display: flex;
  // background-color: var(--message-bubbles-received-background-color);
  // color: var(--color-text);
  // width: 90%;
  // max-width: 584px;
  margin: 10px auto;
  padding: 5px 10px;
  border-radius: 42px;
  word-break: break-word;
  text-align: center;
  align-items: center;
  justify-content: center;
  height: 40px;
  margin-top: -20px;
  border-radius: 22px;
  background: #2e333d;
`;

const NotificationBubbleText = styled.div`
  // color: var(--color-text);
  // margin-left: 45px;
  color: #a7a7ba;
  font-size: 14px;
  font-weight: 400;
`;

const NotificationBubbleIconContainer = styled.div`
  margin: auto 10px;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  width: 90%;
  height: 1px;
  margin: 25px auto;
  background: #2e333d;
`;

export const NotificationBubble = (props: {
  notificationText: string;
  iconType?: BchatIconType;
  iconColor?: string;
  bgColor?: string;
}) => {
  const { notificationText, iconType, iconColor, bgColor } = props;
  return (
    <FlexCenter>
      <NotificationBubbleFlex>
        {iconType && (
          <NotificationBubbleIconContainer style={{ backgroundColor: bgColor }}>
            <BchatIcon
              iconSize="medium"
              iconType={iconType}
              iconColor={iconColor}
              iconPadding="auto 10px"
            />
          </NotificationBubbleIconContainer>
        )}
        <NotificationBubbleText>{notificationText}</NotificationBubbleText>
      </NotificationBubbleFlex>
    </FlexCenter>
  );
};
