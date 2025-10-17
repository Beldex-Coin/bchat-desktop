import React, { useState } from 'react';
import { Flex } from '../basic/Flex';
import { SpacerSM, SpacerXS } from '../basic/Text';
import { BchatIcon, BchatIconButton } from '../icon';
import {
  getPrivateAndBlockedContactsPubkeys,
  getQuotedMessage,
  getSelectedConversationKey,
} from '../../state/selectors/conversations';
import { useSelector } from 'react-redux';
import {
  useConversationBnsHolder,
  useConversationUsernameOrShorten,
} from '../../hooks/useParamSelector';
import classNames from 'classnames';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import ContactEmptyIcon from '../icon/ContactEmptyIcon';
import styled from 'styled-components';
import CheckBoxTickIcon from '../icon/CheckBoxTickIcon';
import { getConversationController } from '../../bchat/conversations';
import { closeShareContact } from '../../state/ducks/conversations';
import { getTheme } from '../../state/selectors/theme';
import { Avatar, AvatarSize } from '../avatar/Avatar';


export const BchatContactListPanel = (props: { sendMessage: any }) => {
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');

  const privateAndBlockedContactsPubkeys = useSelector(getPrivateAndBlockedContactsPubkeys);
  const quotedMessageProps = useSelector(getQuotedMessage);
  const selectedConvoKey = useSelector(getSelectedConversationKey);
  const [filteredNames, setFilteredNames] = useState<Array<string>>(privateAndBlockedContactsPubkeys);
  const [selectedMemberIds, setSelectedMemberIds] = useState<Array<string>>([]);
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    filterContacts(event.target.value);
  };

  const filterContacts = (searchTxt:string) =>{
    setCurrentSearchTerm(searchTxt);
    setFilteredNames(
      searchTxt
        ? privateAndBlockedContactsPubkeys.filter((pubkey: any) => {
            const convo = getConversationController().get(pubkey);
            const memberName = convo?.getNickname() || convo?.getName() || convo?.getProfileName();
            return memberName?.toLowerCase().includes(searchTxt.toLowerCase());
          })
        : privateAndBlockedContactsPubkeys
    );
  }

  function handleSelectMember(memberId: string) {
    if (selectedMemberIds.includes(memberId)) {
      return;
    }

    setSelectedMemberIds([...selectedMemberIds, memberId]);
  }

  function handleUnselectMember(unselectId: string) {
    setSelectedMemberIds(
      selectedMemberIds.filter(id => {
        return id !== unselectId;
      })
    );
  }
  const sendContact = () => {
    if (!selectedConvoKey || !selectedMemberIds?.length) return;

    const conversationController = getConversationController();
    const selectedConvo = conversationController.get(selectedConvoKey);
    let selectedMemberNames = [];
    for (let index = 0; index < selectedMemberIds.length; index++) {
      const firstMemberId = selectedMemberIds[index];
      const memberConvo = conversationController.get(firstMemberId);
      if (!selectedConvo || !memberConvo) return;

      const memberName =
        memberConvo.getNickname() ||
        memberConvo.getName() ||
        memberConvo.getProfileName() ||
        firstMemberId
      selectedMemberNames.push(memberName);
    }

    const sharedContact = {
      address: JSON.stringify(selectedMemberIds),
      name: JSON.stringify(selectedMemberNames),
    };
    props.sendMessage({
      body: '',
      attachments: undefined,
      groupInvitation: undefined,
      preview: undefined,
      quote: quotedMessageProps,
      payment: undefined,
      sharedContact,
    });
    window.inboxStore?.dispatch(closeShareContact());
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
          <span className="contact-list-header-titleTxt">Share Contacts</span>
          <span
            onClick={() => {
              window.inboxStore?.dispatch(closeShareContact());
            }}
            className="contact-list-header-closeBox"
          >
            <BchatIconButton iconType={'xWithCircle'} iconSize={26} iconColor="var(--color-text)" />
          </span>
        </Flex>
      </div>
      <SpacerSM />
      <div className="bchat-search-input">
        <div className="search">
          <BchatIcon iconSize={20} iconType="search" />
        </div>
        <input
          value={currentSearchTerm}
          onChange={e => {
            handleSearch(e);
          }}
          placeholder={'Search People'}
          maxLength={26}
        />
         {!!currentSearchTerm.length && (
                <BchatIconButton
                  iconSize={24}
                  iconType="exit"
                  onClick={() => {
                    filterContacts('');
                  }}
                />
            )}
      </div>
      <SpacerSM />
      <div className="contact-list-inner-wrapper">
        {filteredNames.length > 0 &&
          filteredNames.map(item => (
            <ContactList
              pubkey={item}
              key={item}
              isSelected={selectedMemberIds.some(m => m === item)}
              onSelect={selectedMember => {
                handleSelectMember(selectedMember);
              }}
              onUnselect={unselectedMember => {
                handleUnselectMember(unselectedMember);
              }}
            />
          ))}
        {filteredNames.length === 0 && <SearchEmptyScreen />}
      </div>
      <Flex
        container={true}
        justifyContent="center"
        alignItems="center"
        padding="13px 0"
        width="100%"
        className="button-wrapper"
      >
        <BchatButton
          text={window.i18n('send')}
          buttonType={BchatButtonType.Brand}
          buttonColor={BchatButtonColor.Primary}
          disabled={selectedMemberIds.length === 0}
          onClick={sendContact}
        />
      </Flex>
    </div>
  );
};

const ContactList = (props: {
  pubkey: string;
  isSelected: boolean;
  onSelect?: (pubkey: string) => void;
  onUnselect?: (pubkey: string) => void;
}) => {
  const { isSelected, pubkey, onSelect, onUnselect } = props;
  const username = useConversationUsernameOrShorten(pubkey);
  const isBnsHolder = useConversationBnsHolder(pubkey);
  const selectionValidation = isSelected;

  return (
    <>
      <div
        className={classNames(`address-content-box ${selectionValidation && 'selected'}`)}
        style={{ cursor: 'pointer' }}
        onClick={() => {
          isSelected ? onUnselect?.(pubkey) : onSelect?.(pubkey);
        }}
      >
        <div className="avatarBox">
          <Avatar size={AvatarSize.M} pubkey={pubkey} isBnsHolder={isBnsHolder}/>
        </div>

        <Flex container={true} flexDirection="column" margin="0 15px">
          <div>
            <span className={classNames('username')}>{username}</span>
          </div>
          <SpacerXS />

          <div className={'address'} style={{ cursor: 'pointer' }}>
            {pubkey}
          </div>
        </Flex>
        {/* <BchatIconButton iconType={isSelected?"checkBoxTick":'checkBox'} iconSize={23} /> */}
        <span
          className={classNames('bchat-member-item__checkmark', selectionValidation && 'selected')}
        >
          {selectionValidation ? (
            <CheckBoxTickIcon iconSize={26} />
          ) : (
            <BchatIcon iconType={'checkBox'} clipRule="evenodd" fillRule="evenodd" iconSize={26} />
          )}
        </span>
      </div>
      <SpacerXS />
    </>
  );
};

const SearchEmptyScreen = () => {
  const isDark = useSelector(getTheme) === 'dark';
  return (
    <SearchEmptyWrapper>
      <Flex container={true} flexDirection="column" justifyContent="center" alignItems="center">
        <ContactEmptyIcon isDark={isDark} />
        <StyledSpan>No Contact Found!</StyledSpan>
      </Flex>
    </SearchEmptyWrapper>
  );
};
const SearchEmptyWrapper = styled.div`
  height: calc(100vh - 286px);
  width: 100%;
  display: flex;
`;
const StyledSpan = styled.span`
  color: #a7a7ba;
  text-align: center;
  font-family: $bchat-font-open-sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;
