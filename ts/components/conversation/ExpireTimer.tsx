import React, { useCallback, useState } from 'react';

import { getTimerBucketIcon } from '../../util/timer';

// tslint:disable-next-line: no-submodule-imports
import useInterval from 'react-use/lib/useInterval';
import styled from 'styled-components';
import { BchatIcon } from '../icon/BchatIcon';
import { useSelector } from 'react-redux';
import { getTheme } from '../../state/selectors/theme';

type Props = {
  expirationLength: number;
  expirationTimestamp: number | null;
  isCorrectSide: boolean;
};

const ExpireTimerCount = styled.div<{
  color: string;
  isdark: boolean;
}>`
  margin-inline-end: 10px;
  margin-inline-start: 10px;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  user-select: none;
  color: ${props => props.color};
  border-radius: 40px;
  background: ${props => (props.isdark ? '#202329' : '#F8F8F8')};
  padding: 3px 10px;
`;

const ExpireTimerBucket = styled.div`
  margin-inline-end: 10px;
  margin-inline-start: 10px;
  font-size: 11px;
  line-height: 16px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  user-select: none;
  color: var(--color-text);
`;

export const ExpireTimer = (props: Props) => {
  const { expirationLength, expirationTimestamp, isCorrectSide } = props;

  const initialTimeLeft = Math.max(Math.round(((expirationTimestamp || 0) - Date.now()) / 1000), 0);
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
  const darkMode = useSelector(getTheme) === 'dark';
  const update = useCallback(() => {
    if (expirationTimestamp) {
      const newTimeLeft = Math.max(Math.round((expirationTimestamp - Date.now()) / 1000), 0);
      if (newTimeLeft !== timeLeft) {
        setTimeLeft(newTimeLeft);
      }
    }
  }, [expirationTimestamp, timeLeft, setTimeLeft]);

  const updateFrequency = 500;
  useInterval(update, updateFrequency);

  if (!(isCorrectSide && expirationLength && expirationTimestamp)) {
    return null;
  }

  const expireTimerColor = darkMode ? '#A7A7BA' : '#858598';

  if (timeLeft <= 60) {
    return (
      <ExpireTimerCount color={expireTimerColor} isdark={darkMode}>
        {timeLeft}
      </ExpireTimerCount>
    );
  }

  const bucket = getTimerBucketIcon(expirationTimestamp, expirationLength);

  return (
    <ExpireTimerBucket>
      <BchatIcon iconType={bucket} iconSize="medium" iconColor={expireTimerColor} />
    </ExpireTimerBucket>
  );
};
