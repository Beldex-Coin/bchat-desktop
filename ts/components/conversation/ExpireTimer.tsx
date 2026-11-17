import  { useCallback, useState } from 'react';

import { getTimerBucketIcon } from '../../util/timer';

// tslint:disable-next-line: no-submodule-imports
import useInterval from 'react-use/lib/useInterval';
import styled from 'styled-components';
import { BchatIcon } from '../icon/BchatIcon';
import CountdownIcon from '../icon/CountdownIcon';
import { isNewDesign } from '../../theme/newDesign';

type Props = {
  expirationLength: number;
  expirationTimestamp: number | null;
  isCorrectSide: boolean;
};

const ExpireTimerCount = styled.div<{
  color: string;
  isdark: boolean;
}>`
  width: 60px;
  text-align: center;
  word-break: keep-all;
  margin-inline-end: 10px;
  margin-inline-start: 10px;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  user-select: none;
  color: ${props => props.color};
  border-radius: 40px;
  background: ${props => (props.isdark ? 'var(--pal-202329)' : 'var(--pal-t-f8f8f8)')};
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
  const darkMode = isNewDesign();
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

  // dark (Figma 1:7726): time left in a #1a1a1a box (seconds under a minute, then m / h / d) with
  // the countdown icon beside it
  if (darkMode) {
    const shortLeft =
      timeLeft <= 60
        ? `${timeLeft}`
        : timeLeft < 3600
        ? `${Math.ceil(timeLeft / 60)}m`
        : timeLeft < 86400
        ? `${Math.ceil(timeLeft / 3600)}h`
        : `${Math.ceil(timeLeft / 86400)}d`;
    return (
      <span className="expire-timer">
        <span className="expire-timer__count">{shortLeft}</span>
        {/* while the last seconds count down (5, 4, 3, ...) the stopwatch's hand turns */}
        <CountdownIcon
          iconSize={22}
          color="var(--pal-t-ebebeb)"
          spinning={timeLeft > 0 && timeLeft <= 60}
        />
      </span>
    );
  }

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
