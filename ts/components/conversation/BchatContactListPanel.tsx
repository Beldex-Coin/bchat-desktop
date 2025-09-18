import React, { useState } from 'react';
import { Flex } from '../basic/Flex';
import { SpacerSM, SpacerXS } from '../basic/Text';
import { BchatIcon, BchatIconButton } from '../icon';
import {
  getPrivateContactsPubkeys,
  getSelectedConversationKey,
} from '../../state/selectors/conversations';
import { useSelector } from 'react-redux';
import {
  useConversationBnsHolder,
  useConversationUsernameOrShorten,
} from '../../hooks/useParamSelector';
import classNames from 'classnames';
import { AvatarItem } from '../wallet/BchatWalletAddressBook';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import ContactEmptyIcon from '../icon/ContactEmptyIcon';
import styled from 'styled-components';
import CheckBoxTickIcon from '../icon/CheckBoxTickIcon';
import { getConversationController } from '../../bchat/conversations';
import { closeShareContact } from '../../state/ducks/conversations';

export const BchatContactListPanel = () => {
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');

  const privateContactsPubkeys = useSelector(getPrivateContactsPubkeys);

  const selectedConvoKey = useSelector(getSelectedConversationKey);
  const [filteredNames, setFilteredNames] = useState<Array<string>>(privateContactsPubkeys);
  const [selectedMemberIds, setSelectedMemberIds] = useState<Array<string>>([]);
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCurrentSearchTerm(value);
    setFilteredNames(
      value
        ? privateContactsPubkeys.filter((pubkey: any) => {
            const convo = getConversationController().get(pubkey);
            const memberName = convo?.getNickname() || convo?.getName() || convo?.getProfileName();
            return memberName?.toLowerCase().includes(value.toLowerCase());
          })
        : privateContactsPubkeys
    );
  };

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
  const sendContact =()=> {
  
    if (!selectedConvoKey || !selectedMemberIds?.length) return;

    const conversationController = getConversationController();
    const selectedConvo = conversationController.get(selectedConvoKey);
    const firstMemberId = selectedMemberIds[0];
    const memberConvo = conversationController.get(firstMemberId);

    if (!selectedConvo || !memberConvo) return;

    const memberName =
      memberConvo.getNickname() ||
      memberConvo.getName() ||
      memberConvo.getProfileName() ||
      firstMemberId;

    const sharedContact = { address: firstMemberId, name: memberName };
    
    selectedConvo.sendMessage({
      body: '',
      attachments: undefined,
      groupInvitation: undefined,
      preview: undefined,
      quote: undefined,
      txnDetails: undefined,
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
            console.log(e);
            handleSearch(e);
          }}
          placeholder={'Search People'}
          maxLength={26}
        />
      </div>
      <SpacerSM />
      <div className="contact-list-inner-wrapper">
        {filteredNames.length > 0 &&
          filteredNames.map(item => (
            <ContactList
              pubkey={item}
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
        padding="22px 0"
        width="100%"
        className="button-wrapper"
      >
        <BchatButton
          text={'Send selected Contacts'}
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
          <AvatarItem memberPubkey={pubkey} isBnsHolder={isBnsHolder} />
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
  return (
    <SearchEmptyWrapper>
      <Flex container={true} flexDirection="column" justifyContent="center" alignItems="center">
        <ContactEmptyIcon />
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
