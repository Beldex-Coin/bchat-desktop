import React from 'react';
import classNames from 'classnames';
import moment from 'moment';

import { Message } from './Message';
// import { useSelector } from 'react-redux';
import { Avatar, AvatarSize } from '../../../avatar/Avatar';
// import { deleteMessagesById } from '../../../../interactions/conversations/unsendingInteractions';
import { ContactPropsMessageDetail, MessagePropsDetails } from '../../../../state/ducks/conversations';
// import {
//   getMessageDetailsViewProps,
//   // getMessageIsDeletable,
// } from '../../../../state/selectors/conversations';
import { ContactName } from '../../ContactName';
import { BchatWrapperModal } from '../../../BchatWrapperModal';
import { useDispatch } from 'react-redux';
import { updateMessageMoreInfoModal } from '../../../../state/ducks/modalDialog';
// import { getMessageTextProps } from '../../../../state/selectors/conversations';
import { SpacerSM, SpacerXS } from '../../../basic/Text';

const AvatarItem = (props: { pubkey: string }) => {
  const { pubkey } = props;

  return <Avatar size={AvatarSize.S} pubkey={pubkey} />;
};

// const DeleteButtonItem = (props: { messageId: string; convoId: string; isDeletable: boolean }) => {
//   const { i18n } = window;

//   return props.isDeletable ? (
//     <div className="module-message-detail__delete-button-container">
//       <button
//         onClick={async () => {
//           await deleteMessagesById([props.messageId], props.convoId);
//         }}
//         className="module-message-detail__delete-button"
//       >
//         {i18n('delete')}
//       </button>
//     </div>
//   ) : null;
// };

const ContactsItem = (props: { contacts: Array<ContactPropsMessageDetail> }) => {
  const { contacts } = props;

  if (!contacts || !contacts.length) {
    return null;
  }

  return (
    <div className="module-message-detail__contact-container">
      {contacts.map(contact => (
        <ContactItem key={contact.pubkey} contact={contact} />
      ))}
    </div>
  );
};

const ContactItem = (props: { contact: ContactPropsMessageDetail }) => {
  const { contact } = props;
  const errors = contact.errors || [];

  const statusComponent = !contact.isOutgoingKeyError ? (
    <div
      className={classNames(
        'module-message-detail__contact__status-icon',
        `module-message-detail__contact__status-icon--${contact.status}`
      )}
    />
  ) : null;

  return (
    <div key={contact.pubkey} className="module-message-detail__contact">
      <AvatarItem pubkey={contact.pubkey} />
      <div className="module-message-detail__contact__text">
        <div className="module-message-detail__contact__name">
          <ContactName
            pubkey={contact.pubkey}
            name={contact.name}
            profileName={contact.profileName}
            shouldShowPubkey={true}
          />
        </div>
        {errors.map((error, index) => (
          <div key={index} className="module-message-detail__contact__error">
            {error.message}
          </div>
        ))}
      </div>
      {statusComponent}
    </div>
  );
};

export const MessageMoreInfoModal = (props: MessagePropsDetails) => {
  const { i18n } = window;
  const dispatch = useDispatch();
  const {
    errors,
    receivedAt,
    sentAt,
    //  convoId,
    direction,
    messageId,
  } = props;
  // const selectedMsg = useSelector(state => getMessageTextProps(state as any, messageId));
  // const messageDetailProps = useSelector(getMessageDetailsViewProps);
  // const isDeletable = useSelector(state =>
  //   getMessageIsDeletable(state as any, messageDetailProps?.messageId || '')
  // );
  if (!props) {
    return null;
  }

  return (
    <div className="message-detail-wrapper">
      <BchatWrapperModal
        title={'More Info'}
        onClose={() => { dispatch(updateMessageMoreInfoModal(null)) }}
        showExitIcon={false}
        showHeader={true}
        headerReverse={false}
        okButton={{
          text: 'Close',
          onClickOkHandler: () => { dispatch(updateMessageMoreInfoModal(null)) },

          disabled: false,
        }}
      >
        <SpacerSM />
        <div className="module-message-detail">
          <div >
            {/* <h2>More Info</h2> */}
            <Message messageId={messageId} isDetailView={false} />
            {/* {selectedMsg?.text} */}
          </div>
          <SpacerSM />
          <table className="module-message-detail__info">
            <tbody>
              {(errors || []).map((error, index) => (
                <tr key={index}>
                  <td className="module-message-detail__label">{i18n('error')}</td>
                  <td>
                    {' '}
                    <span className="error-message">{error.message}</span>{' '}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="module-message-detail__label">{i18n('send')}</td>
                <td className="module-message-detail__label" style={{ paddingLeft: '10px' }}>
                  {moment(sentAt).format('LLLL')}
                </td>
              </tr>
              {receivedAt ? (
                <tr>
                  <td className="module-message-detail__label">{i18n('received')}</td>
                  <td className="module-message-detail__label" style={{ paddingLeft: '10px' }}>
                    {moment(receivedAt).format('LLLL')}
                  </td>
                </tr>
              ) : null}
              {/* <tr>
                <td className="module-message-detail__label">
                  {direction === 'incoming' ? i18n('from') : i18n('to')}
                </td>
              </tr> */}
            </tbody>
          </table>
          <SpacerSM />
          {props.contacts.length ? (
            <div className='module-message-detail__direction_label'> {direction === 'incoming' ? i18n('from') : i18n('to')}</div>
          ): null}
          <SpacerXS />
          <ContactsItem contacts={props.contacts} />
        </div>
      </BchatWrapperModal>
    </div>
  );
};
