import React from 'react';
import { useSelector } from 'react-redux';
import { MessageRenderingProps } from '../../../../models/messageType';
import { getMessageStatusProps } from '../../../../state/selectors/conversations';
import { OutgoingMessageStatus } from './OutgoingMessageStatus';

type Props = {
  isCorrectSide: boolean;
  messageId: string;
  dataTestId?: string;
};

export type MessageStatusSelectorProps = Pick<MessageRenderingProps, 'direction' | 'status'>;

export const MessageStatus = (props: Props) => {
  const { isCorrectSide, dataTestId } = props;
  console.log('test 1')

  const selected = useSelector(state => getMessageStatusProps(state as any, props.messageId));
  console.log('test 2')
  if (!selected) {
    
    return null;
  }
  console.log('test 3')
  const { status, direction } = selected;
  console.log('test 4',!isCorrectSide)
  if (!isCorrectSide) {
    return null;
  }
  console.log('test 5',!isCorrectSide)
  const isIncoming = direction === 'incoming';

  const margin=isIncoming?{marginLeft:'10px'}:{marginRight:'10px'}

  const showStatus = !isIncoming && Boolean(status);
  console.log('test 6',showStatus,'status',status)
  if (!showStatus) {
    return null;
  }
  console.log('test 7',status)
  return <span style={margin}><OutgoingMessageStatus dataTestId={dataTestId} status={status} /></span>;
};
