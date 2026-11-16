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
      <BchatIcon iconColor={'var(--pal-t-108d32)'} iconType="circleCheck" iconSize="medium" />
    </MessageStatusSendingContainer>
  );
};

const MessageStatusRead = ({ dataTestId }: { dataTestId?: string }) => {
  

  return (
    <MessageStatusSendingContainer data-testid={dataTestId} data-testtype="read">
      <BchatIcon iconColor={'var(--pal-t-108d32)'} iconType="doubleCheckCircleFilled" iconSize="medium" />
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
      <BchatIcon iconColor={'var(--pal-t-ff3e3e)'} iconType="error" iconSize="medium" />
    </MessageStatusSendingContainer>
  );
};

/**
 * Dark theme: small status glyph shown next to the time under the bubble (Figma 1:54541).
 */
const CompactMessageStatus = (props: { status: MessageDeliveryStatus; dataTestId?: string }) => {
  const { status, dataTestId } = props;
  if (status === 'error') {
    return (
      <span
        className="msg-status msg-status--error"
        data-testid={dataTestId}
        data-testtype="failed"
        role="button"
        title={window.i18n('sendFailed')}
        onClick={() => ipcRenderer.send('show-debug-log')}
      >
        <BchatIcon iconType="error" iconSize={12} iconColor="var(--pal-t-ff3e3e)" />
      </span>
    );
  }
  const icon =
    status === 'sending' ? (
      <BchatIcon iconType="sending" iconSize={18} iconColor="var(--pal-t-acacac)" />
    ) : (
      <BchatIcon
        iconType="doubleTick"
        iconSize={18}
        iconColor={status === 'read' ? 'var(--pal-t-1bb51e)' : 'var(--pal-t-737373)'}
      />
    );
  return (
    <span className="msg-status" data-testid={dataTestId} data-testtype={status}>
      {icon}
    </span>
  );
};

export const OutgoingMessageStatus = (props: {
  status?: MessageDeliveryStatus | null;
  dataTestId?: string;
  underBubble?: boolean;
}) => {
  const { status, dataTestId, underBubble } = props;
  if (underBubble) {
    return status ? <CompactMessageStatus status={status} dataTestId={dataTestId} /> : null;
  }
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
