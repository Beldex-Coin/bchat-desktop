// import React from 'react';
import { Flex } from '../basic/Flex';
import { SpacerSM, SpacerXS } from '../basic/Text';
import { BchatIconButton } from '../icon';

import classNames from 'classnames';

import {
  openConversationWithMessages,
  showViewContactPanelTypes,
  updateViewContactPanel,
} from '../../state/ducks/conversations';
import ContactBubbleChatIcon from '../icon/ContactBubbleChatIcon';
import { Avatar, AvatarSize } from '../avatar/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { getTheme } from '../../state/selectors/theme';
import { updateConfirmModal } from '../../state/ducks/modalDialog';
import { BchatButtonColor } from '../basic/BchatButton';
import { getConversationController } from '../../bchat/conversations';
import { ConversationTypeEnum } from '../../models/conversation';
import { useConversationBnsHolder } from '../../hooks/useParamSelector';

type ContactListProps = {
  pubkey: any;
  userName: String;
  iconColor: string;
  openConfirmModal: (pubkey: string) => void | Promise<void>;
};

export const BchatViewContactPanel = (props: showViewContactPanelTypes) => {
  const {isIncoming, names, addresses } = props;
  const iconColor = useSelector(getTheme) === 'dark' ? 'white' : '#C5C5C5';
  const dispatch = useDispatch();

  const openConverstation=async(pubKey:string)=>{
    await getConversationController().getOrCreateAndWait(
      pubKey,
      ConversationTypeEnum.PRIVATE
    );
    await openConversationWithMessages({ conversationKey: pubKey, messageId: null });

  }
  const openConfirmModal = (pubKey: string) => {
    if(!isIncoming)
    {
       openConverstation(pubKey);
       return;
    }
    dispatch(
      updateConfirmModal({
        bchatIcon: 'avatar',
        iconSize: 31,
        iconShow: true,
        title: 'Start chat now?',
        message: 'Do you want to chat with this contact now?',
        onClickClose: () => dispatch(updateConfirmModal(null)),
        onClickOk: () => openConverstation(pubKey),
        okText: 'Start Chatting',
        okTheme: BchatButtonColor.Primary,
      })
    );
  };
  return (
    <div className="contact-list">
      <div className="contact-list-header">
        <Flex
          container={true}
          justifyContent={'space-between'}
          alignItems="center"
          height="70px"
          padding="25px"
          className="contact-list-header-title-wrapper"
        >
          <span className="contact-list-header-titleTxt">View Contacts</span>
          <span
            onClick={() => {
              window.inboxStore?.dispatch(updateViewContactPanel(null));
            }}
            className="contact-list-header-closeBox"
          >
            <BchatIconButton iconType={'xWithCircle'} iconSize={26} iconColor="var(--color-text)" />
          </span>
        </Flex>
      </div>
      <SpacerSM />
      <div className='contact-list-inner-wrapper' style={{padding:'0px'}}>
        {(addresses ?? []).map((pubkey, index) => (
        <ContactList
          key={index}
          pubkey={pubkey}
          userName={names?.[index] ?? ''}
          iconColor={iconColor}
          openConfirmModal={openConfirmModal}
        />
      ))}
      </div>
    </div>
  );
};

const ContactList = (props:ContactListProps) => {
  const { pubkey, userName, iconColor,openConfirmModal } = props;
  const isBnsHolder=useConversationBnsHolder(pubkey);
  const validUserName =
    userName.length >= 65 ? userName.slice(0, 8) + '.....' + userName.slice(-8) : userName;
  return (
    <>
      <div
        className={classNames(`address-content-box `)}
        style={{ paddingLeft: '10px', paddingRight: '10px',marginLeft:'10px',marginRight:'10px' }}
      >
        <div className="avatarBox">
          <Avatar pubkey={pubkey} size={AvatarSize.M} isBnsHolder={isBnsHolder}/>
        </div>

        <Flex container={true} flexDirection="column" margin="0 15px">
          <div>
            <span className={classNames('username')}>{validUserName}</span>
          </div>
          <SpacerXS />

          <div className={'address'}>{pubkey}</div>
        </Flex>

         <div style={{ cursor: 'pointer' }} onClick={()=>openConfirmModal(pubkey)}>
          <ContactBubbleChatIcon color={iconColor} />
        </div>
      </div>
      <SpacerXS />
    </>
  );
};
