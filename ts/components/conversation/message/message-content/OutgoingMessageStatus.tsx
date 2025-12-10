import { ipcRenderer } from 'electron';
// import React from 'react';
import styled from 'styled-components';
import { MessageDeliveryStatus } from '../../../../models/messageType';
import { BchatIcon } from '../../../icon';


const MessageStatusSendingContainer = styled.div`
  display: inline-block;
  // align-self: flex-end;
  margin-bottom: 2px;
  margin-inline-start: 5px;
  cursor: pointer;
`;

const MessageStatusSending = ({ dataTestId }: { dataTestId?: string }) => {

  const imgsrc='images/bchat/messageLoading.gif'
  
  return (
    <MessageStatusSendingContainer data-testid={dataTestId} data-testtype="sending">
      {/* <BchatIcon rotateDuration={2} iconColor={'#A7A7BA'} iconType="sending" iconSize="medium" /> */}
      <div>
      <img src={imgsrc}  style={{width:'18px',height:'18px',display:'flex',}}/>
      </div>
    </MessageStatusSendingContainer>
  );
};

const MessageStatusSent = ({ dataTestId }: { dataTestId?: string }) => {
 
  return (
    <MessageStatusSendingContainer data-testid={dataTestId} data-testtype="sent">
      <BchatIcon iconColor={'#108D32'} iconType="circleCheck" iconSize="medium" />
    </MessageStatusSendingContainer>
  );
};

const MessageStatusRead = ({ dataTestId }: { dataTestId?: string }) => {
  

  return (
    <MessageStatusSendingContainer data-testid={dataTestId} data-testtype="read">
      <BchatIcon iconColor={'#108D32'} iconType="doubleCheckCircleFilled" iconSize="medium" />
    </MessageStatusSendingContainer>
  );
};

const MessageStatusError = ({ dataTestId }: { dataTestId?: string }) => {
  const showDebugLog = () => {
    ipcRenderer.send('show-debug-log');
  };

  return (
    <MessageStatusSendingContainer
      data-testid={dataTestId}
      data-testtype="failed"
      onClick={showDebugLog}
      title={window.i18n('sendFailed')}
    >
      <BchatIcon iconColor={'#FF3E3E'} iconType="error" iconSize="medium" />
    </MessageStatusSendingContainer>
  );
};

export const OutgoingMessageStatus = (props: {
  status?: MessageDeliveryStatus | null;
  dataTestId?: string;
}) => {
  const { status, dataTestId } = props;
  switch (status) {
    case 'sending':
      return <MessageStatusSending dataTestId={dataTestId} />;
    case 'sent':
      return <MessageStatusSent dataTestId={dataTestId} />;
    case 'read':
      return <MessageStatusRead dataTestId={dataTestId} />;
    case 'error':
      return <MessageStatusError dataTestId={dataTestId} />;
    default:
      return null;
  }
};
