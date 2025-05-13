import React from 'react';
import { MessageDeliveryStatus, MessageRenderingProps } from '../../../../models/messageType';
import { OutgoingMessageStatus } from './OutgoingMessageStatus';

type Props = {
  isCorrectSide: boolean;
  messageId: string;
  dataTestId?: string;
  status?: MessageDeliveryStatus | null;
};

export type MessageStatusSelectorProps = Pick<MessageRenderingProps, 'direction' | 'status'>;

export const MessageStatus = (props: Props) => {
  const { isCorrectSide, dataTestId, status } = props;
  const isIncoming = !isCorrectSide;
  const margin = isIncoming ? { marginLeft: '10px' } : { marginRight: '10px' };
  const showStatus = !isIncoming && Boolean(status);
  if (!showStatus) {
    return null;
  }
  return (
    <span style={margin}>
      <OutgoingMessageStatus dataTestId={dataTestId} status={status} />
    </span>
  );
};
