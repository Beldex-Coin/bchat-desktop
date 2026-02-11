// import React from 'react';

import _ from 'lodash';
import uuid from 'uuid';
import { useSelector } from 'react-redux';
import { getGenericReadableMessageSelectorProps } from '../../../../state/selectors/conversations';
import { GenericReadableMessage } from './GenericReadableMessage';
import { MessageModelType } from '../../../../models/messageType';


// Same as MIN_WIDTH in ImageGrid.tsx
export const MINIMUM_LINK_PREVIEW_IMAGE_WIDTH = 200;

interface BaseProps {
  messageId: string;
  isDetailView?: boolean;
}
interface GroupInvitationExtraProps {
  serverName?: string;
  url?: string;
  acceptUrl?: string;
  isUnread?: boolean;
}

interface PaymentExtraProps{
  amount?: string;
  txnId?: string;
  direction?: MessageModelType;
}
interface SharedContactExtraProps{
  address?: string;
  name?: string;
 
}
type Props = BaseProps & GroupInvitationExtraProps & PaymentExtraProps & SharedContactExtraProps;

export const Message = (props: Props) => {
  const msgProps = useSelector((state) =>
    getGenericReadableMessageSelectorProps(state as any, props.messageId)
  );

  const ctxMenuID = `ctx-menu-message-${uuid()}`;

  if (msgProps?.isDeleted && msgProps.direction === "outgoing") {
    return null;
  }

  return (
    <GenericReadableMessage
      ctxMenuID={ctxMenuID}
      messageId={props.messageId}
      isDetailView={props.isDetailView}
      serverName={props.serverName}
      url={props.url}
      acceptUrl={props.acceptUrl}
      isUnread={props.isUnread}
      amount={props.amount}
      txnId={props.txnId}
      address={props.address}
      name={props.name}


    />
  );
};
