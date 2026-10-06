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
import { closeForwardPanel, closeShareContact } from '../../state/ducks/conversations';
import { forwardMessagesToConversations } from '../../interactions/forwardMessages';
import { getTheme } from '../../state/selectors/theme';
import { Avatar, AvatarSize } from '../avatar/Avatar';


/**
 * Contact picker panel on the right of the conversation. `share` (default) sends the picked contacts
 * as a shared-contact message; `forward` (Figma 71:13217) sends copies of `forwardMessageIds` to
 * each picked contact.
 */
export const BchatContactListPanel = (props: {
  sendMessage: any;
  mode?: 'share' | 'forward';
  forwardMessageIds?: Array<string>;
}) => {
  const isForward = props.mode === 'forward';
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const [isForwarding, setIsForwarding] = useState(false);

  const allContactsPubkeys = useSelector(getPrivateAndBlockedContactsPubkeys);
  // blocked contacts can't receive a forwarded message
  const privateAndBlockedContactsPubkeys = isForward
    ? allContactsPubkeys.filter(
        (pubkey: string) => !getConversationController().get(pubkey)?.isBlocked()
      )
    : allContactsPubkeys;
  const closePanel = () => {
    window.inboxStore?.dispatch(isForward ? closeForwardPanel() : closeShareContact());
  };
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
  const forwardToSelected = async () => {
    if (!props.forwardMessageIds?.length || !selectedMemberIds.length || isForwarding) {
      return;
    }
    setIsForwarding(true);
    try {
      await forwardMessagesToConversations(props.forwardMessageIds, selectedMemberIds);
    } finally {
      setIsForwarding(false);
      closePanel();
    }
  };
  const sendContact = () => {
    if (isForward) {
      void forwardToSelected();
      return;
    }
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
    <div className={classNames('contact-list', isForward && 'contact-list--forward')}>
      <div className="contact-list-header">
        <Flex
          container={true}
          justifyContent={'space-between'}
          alignItems="center"
          height="70px"
          padding="25px"
          className="contact-list-header-title-wrapper"
        >
          <span className="contact-list-header-titleTxt">
            {window.i18n(isForward ? 'forward' : 'shareContacts')}
          </span>
          <span
            onClick={closePanel}
            className="contact-list-header-closeBox"
          >
            <span className="light-only-inline">
              <BchatIconButton iconType={'xWithCircle'} iconSize={26} iconColor="var(--color-text)" />
            </span>
            {/* dark theme: Figma 71:13217 light-grey X in a #222 square */}
            <span className="dark-only-inline">
              <BchatIcon iconType="x" iconSize={12} iconColor="#ACACAC" />
            </span>
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
          placeholder={window.i18n('searchPeople')}
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
        {filteredNames.length === 0 && <SearchEmptyScreen isSearching={!!currentSearchTerm.trim()} />}
      </div>
      {/* nothing to pick on the empty screen (no contacts / no search match) - no send button */}
      {filteredNames.length > 0 && (
        <Flex
          container={true}
          justifyContent="center"
          alignItems="center"
          padding="13px 0"
          width="100%"
          className="button-wrapper"
        >
          <BchatButton
            text={
              isForward
                ? window.i18n('forwardToSelected')
                : `${window.i18n('sendSelectedContacts')}${
                    selectedMemberIds.length ? `(${selectedMemberIds.length})` : ''
                  }`
            }
            buttonType={BchatButtonType.Brand}
            buttonColor={BchatButtonColor.Primary}
            disabled={selectedMemberIds.length === 0 || isForwarding}
            onClick={sendContact}
          />
        </Flex>
      )}
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
  const isDark = useSelector(getTheme) === 'dark';

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
          {isDark ? (
            // dark theme (Figma 71:13217): green square with a dark tick, outlined when not picked
            <span
              className={classNames(
                'select-box',
                'select-box--green',
                selectionValidation && 'select-box--checked'
              )}
            >
              {selectionValidation && (
                <BchatIcon iconType="check" iconSize={14} strokeColor="#0A0A0A" strokeWidth="2" />
              )}
            </span>
          ) : selectionValidation ? (
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

// Shown when the list is empty: "No contacts yet!", or "No Contact Found!" when a search matches nobody
const SearchEmptyScreen = (props: { isSearching?: boolean }) => {
  const isDark = useSelector(getTheme) === 'dark';
  return (
    <SearchEmptyWrapper className="contact-list-empty">
      <Flex container={true} flexDirection="column" justifyContent="center" alignItems="center">
        <ContactEmptyIcon isDark={isDark} />
        <StyledSpan className="contact-list-empty__text">
          {window.i18n(props.isSearching ? 'noContactFound' : 'noContactsYet')}
        </StyledSpan>
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
