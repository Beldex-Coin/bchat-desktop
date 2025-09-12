import React, { useState } from 'react';
import { Flex } from '../basic/Flex';
import { SpacerSM, SpacerXS } from '../basic/Text';
import { BchatIcon, BchatIconButton } from '../icon';
import { getPrivateContactsPubkeys } from '../../state/selectors/conversations';
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

export const BchatContactListPanel = () => {
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');

  const privateContactsPubkeys = useSelector(getPrivateContactsPubkeys);
  const [filteredNames, setFilteredNames] = useState<Array<string>>(privateContactsPubkeys);
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCurrentSearchTerm(value);
    setFilteredNames(
      value
        ? privateContactsPubkeys.filter((pubkey: any) => {
            const memberName = useConversationUsernameOrShorten(pubkey);
            return memberName?.toLowerCase().includes(value.toLowerCase());
          })
        : privateContactsPubkeys
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
          <span className="contact-list-header-titleTxt">Share Contacts</span>
          <span onClick={() => {}} className="contact-list-header-closeBox">
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
        {
          filteredNames.length > 0 &&
          filteredNames.map(item => <ContactList pubkey={item} />)}
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
        />
      </Flex>
    </div>
  );
};

const ContactList = (props: { pubkey: string }) => {
  const username = useConversationUsernameOrShorten(props.pubkey);
  const isBnsHolder = useConversationBnsHolder(props.pubkey);

  return (
    <>
      <div className={classNames(`address-content-box`)} style={{ cursor: 'pointer' }}>
        <div className="avatarBox">
          <AvatarItem memberPubkey={props.pubkey} isBnsHolder={isBnsHolder} />
        </div>

        <Flex container={true} flexDirection="column" margin="0 15px">
          <div>
            <span className={classNames('username')}>{username}</span>
          </div>
          <SpacerXS />

          <div className={'address'} style={{ cursor: 'pointer' }}>
            {props.pubkey}
          </div>
        </Flex>
        {/* <BchatIconButton iconType={isSelected?"checkBoxTick":'checkBox'} iconSize={23} /> */}
        <BchatIconButton iconType={'checkBox'} iconSize={23} />
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
