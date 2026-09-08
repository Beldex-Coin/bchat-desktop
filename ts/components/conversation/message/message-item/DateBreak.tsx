import moment from 'moment';
// import React from 'react';
import styled from 'styled-components';

const DateBreakContainer = styled.div`
  display: flex;
  justify-content: center;

  // width: 90%;
  // height: 1px;
  // margin: 25px auto;
  // background: #2e333d;
`;

// NOIR: the day break is a mono chip on a hairline — system log, not decoration.
const DateBreakText = styled.div`
  margin-top: 0.6rem;
  margin-bottom: 1rem;
  color: var(--color-chat-timestamp);
  background-color: var(--color-inbox-background);
  border: 1px solid var(--color-borderBottomColor);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 18px;

  height: 28px;

  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.26em;
  text-transform: uppercase;
`;

export const MessageDateBreak = (props: { timestamp: number; messageId: string }) => {
  const { timestamp, messageId } = props;
  const calendarFormat = {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'DD/MM/YYYY',
  };
  const text = moment(timestamp).calendar(undefined, calendarFormat);

  return (
    <DateBreakContainer id={`date-break-${messageId}`}>
      <DateBreakText>{text}</DateBreakText> 
    </DateBreakContainer>
  );
};
