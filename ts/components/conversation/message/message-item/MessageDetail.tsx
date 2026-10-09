// import React from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { updateMessageMoreInfoModal } from '../../../../state/ducks/modalDialog';
// import { getMessageTextProps } from '../../../../state/selectors/conversations';
import { SpacerSM, SpacerXS } from '../../../basic/Text';
import { getSortedMessagesTypesOfSelectedConversation } from '../../../../state/selectors/conversations';
import { BchatIcon } from '../../../icon';
import { getTheme } from '../../../../state/selectors/theme';
import { UserUtils } from '../../../../bchat/utils';

const AvatarItem = (props: { pubkey: string }) => {
  const { pubkey } = props;

  return <Avatar size={AvatarSize.L} pubkey={pubkey} />;
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

// A From / To card for a pubkey the message details don't carry (us, or the group); ContactName
// looks the display name up itself.
const toDetailContact = (pubkey: string): ContactPropsMessageDetail => ({
  pubkey,
  status: undefined,
  isOutgoingKeyError: false,
});

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
    contacts
  } = props;
  const contactlist=contacts.length?[contacts[0]]:contacts;
  const isDark = useSelector(getTheme) === 'dark';
  const ourPubkey = UserUtils.getOurPubKeyStrFromCache();
  const fromPubkey = direction === 'incoming' ? contacts[0]?.pubkey || props.convoId : ourPubkey;
  const toPubkey = contacts[0]?.pubkey || props.convoId;
  // const selectedMsg = useSelector(state => getMessageTextProps(state as any, messageId));
  // const messageDetailProps = useSelector(getMessageDetailsViewProps);
  // const isDeletable = useSelector(state =>
  //   getMessageIsDeletable(state as any, messageDetailProps?.messageId || '')
  // );
  const messagesProps = useSelector(getSortedMessagesTypesOfSelectedConversation);
  const sharedContactMessage:any = messagesProps.find(
    (item) => item.message.props.messageId === messageId
  );
  
  const isSharedContact =
    sharedContactMessage?.message.messageType === "shared-contact";
  
  const contactInfo = isSharedContact
    ? {
        name: sharedContactMessage!.message.props.name,
        address:sharedContactMessage!.message.props.address
      }
    : null;

  if (!props) {
    return null;
  }

  return (
    <div className="message-detail-wrapper">
      <BchatWrapperModal
        title={window.i18n('moreInformation')}
        additionalClassName="card-dialog message-info-dialog"
        onClose={() => { dispatch(updateMessageMoreInfoModal(null)) }}
        showExitIcon={false}
        showHeader={true}
        headerReverse={false}
        okButton={{
          text: window.i18n('close'),
          onClickOkHandler: () => { dispatch(updateMessageMoreInfoModal(null)) },

          disabled: false,
        }}
      >
        {/* dark theme: square close in the corner (Figma 1:50390); hidden in light */}
        <button
          className="close-square"
          onClick={() => dispatch(updateMessageMoreInfoModal(null))}
          aria-label={window.i18n('close')}
        >
          <BchatIcon iconType="x" iconSize={11} iconColor="#0B0B0B" fillRule="evenodd" clipRule="evenodd" />
        </button>
        <SpacerSM />
        <div className="module-message-detail">
          <div >
            {/* <h2>More Info</h2> */}
             <Message messageId={messageId} isDetailView={true} address={contactInfo?.address} name={contactInfo?.name}/>
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
                <td className="module-message-detail__label" style={{ paddingInlineStart: '10px' }}>
                  {moment(sentAt).format('LLLL')}
                </td>
              </tr>
              {receivedAt ? (
                <tr>
                  <td className="module-message-detail__label">{i18n('received')}</td>
                  <td className="module-message-detail__label" style={{ paddingInlineStart: '10px' }}>
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
          {isDark ? (
            // Figma 5296:24280 / 5296:23558: a received message shows who it is From; a sent one
            // shows From (us) and To (the contact, or the group itself when there is no per-member
            // recipient list).
            <>
              <div className="module-message-detail__direction_label">{i18n('from')}</div>
              <ContactsItem contacts={[toDetailContact(fromPubkey)]} />
              {direction !== 'incoming' && toPubkey ? (
                <>
                  <div className="module-message-detail__direction_label">{i18n('to')}</div>
                  <ContactsItem contacts={[toDetailContact(toPubkey)]} />
                </>
              ) : null}
            </>
          ) : (
            <>
              {props.contacts.length ? (
                <div className='module-message-detail__direction_label'> {direction === 'incoming' ? i18n('from') : i18n('to')}</div>
              ): null}
              <SpacerXS />
              <ContactsItem contacts={contactlist} />
            </>
          )}
        </div>
      </BchatWrapperModal>
    </div>
  );
};
