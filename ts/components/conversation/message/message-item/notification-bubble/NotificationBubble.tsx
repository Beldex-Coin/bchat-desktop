import React from 'react';
import styled from 'styled-components';
import { BchatIcon, BchatIconType } from '../../../../icon';

const NotificationBubbleFlex = styled.div `
  display: flex;

  // color: var(--color-text);
  // width: 90%;
  // max-width: 584px;
  // margin: 10px auto;
  padding: 5px 20px;
  border-radius: 42px;
  word-break: break-word;
  text-align: center;
  align-items: center;
  justify-content: center;
  // height: 40px;
  // margin-top: -20px;
  border-radius: 40px;
  background-color: var(--message-bubbles-received-background-color);
  z-index:2;
  
`;

const NotificationBubbleText = styled.div`
  // color: var(--color-text);
  // margin-left: 45px;
  color: var(--color-chat-timestamp);
  font-size: 14px;
  font-weight: 400;
`;

const NotificationBubbleIconContainer = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
`;

const FlexCenter = styled.div`
  display: flex;
  // flex-direction: column;

  justify-content: center;
  width: 90%;
  // height: 1px;
  min-height: 40px;
  margin: 0 auto;
  
`;

const HorizontalLine=styled.div`
position:absolute;
width:90%;
height:1px;
margin-top:25px;
background-color: var(--message-bubbles-received-background-color);


`
export const NotificationBubble = (props: {
  notificationText: string;
  iconType?: BchatIconType;
  iconColor?: string;
  bgColor?: string;
  callNotification?: Boolean;
  displayText?: string;
}) => {
  const { notificationText, iconType, iconColor, bgColor, callNotification, displayText } = props;
  
  return (
    <FlexCenter>
     {callNotification  && <HorizontalLine />} 
      <NotificationBubbleFlex style={{margin:'0.3rem 0rem'}} >
        {iconType && (
          <NotificationBubbleIconContainer style={{ backgroundColor: bgColor }}>
            <BchatIcon
              iconSize={20}
              iconType={iconType}
              iconColor={iconColor}
              iconPadding="auto 10px"
            />
          </NotificationBubbleIconContainer>
        )}
        {callNotification ? (
          <NotificationBubbleText style={{ color: 'var(--color-text)' }}>
            {notificationText}
            <span style={{ color: 'var(--color-chat-timestamp)' }}> {displayText}</span>
          </NotificationBubbleText>
        ) : (
          <NotificationBubbleText>{notificationText}</NotificationBubbleText>
        )}
      </NotificationBubbleFlex>
    </FlexCenter>
  );
};
