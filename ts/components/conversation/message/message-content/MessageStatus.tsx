// import React from 'react';
import { MessageDeliveryStatus, MessageRenderingProps } from '../../../../models/messageType';
import { OutgoingMessageStatus } from './OutgoingMessageStatus';
import { isNewDesign } from '../../../../theme/newDesign';

type Props = {
  isCorrectSide: boolean;
  messageId: string;
  dataTestId?: string;
  status?: MessageDeliveryStatus | null;
};

export type MessageStatusSelectorProps = Pick<MessageRenderingProps, 'direction' | 'status'>;

export const MessageStatus = (props: Props) => {
  const { isCorrectSide, dataTestId, status } = props;
  // Dark theme: the status sits with the time under the bubble (see MessageContent).
  const isDark = isNewDesign();
  const isIncoming = !isCorrectSide;
  if (isDark) {
    return null;
  }
  const margin = isIncoming ? { marginInlineStart: '10px' } : { marginInlineEnd: '10px' };
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
