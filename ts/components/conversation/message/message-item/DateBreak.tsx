import moment from 'moment';
import React from 'react';
import styled from 'styled-components';

const DateBreakContainer = styled.div`
  display: flex;
  justify-content: center;

  // width: 90%;
  // height: 1px;
  // margin: 25px auto;
  // background: #2e333d;
`;

const DateBreakText = styled.div`
  margin-top: 0.3rem;
  margin-bottom: 0.3rem;
  // letter-spacing: 0.6px;
  // font-size: 0.8rem;
  // font-weight: bold;
  // text-align: center;
  // color: var(--color-chat-timestamp);
  // background-color: var(--message-bubbles-received-background-color);
  border-radius: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 20px; 

  height: 40px;
  // margin-top: -20px;
  border-radius: 22px;
  background: #2e333d;

  font-size: 14px;
  font-weight: 400;
  color: #858598;
`;

export const MessageDateBreak = (props: { timestamp: number; messageId: string }) => {
  const { timestamp, messageId } = props;
  const text = moment(timestamp).calendar(undefined, {
    sameElse: 'llll',
  });

  return (
    <DateBreakContainer id={`date-break-${messageId}`}>
      <DateBreakText>{text}</DateBreakText> 
    </DateBreakContainer>
  );
};
