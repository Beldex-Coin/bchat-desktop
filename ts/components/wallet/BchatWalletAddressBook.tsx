import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { updateSendAddress } from '../../state/ducks/walletConfig';
import { dashboard } from '../../state/ducks/walletSection';
import { getPrivateContactsPubkeys } from '../../state/selectors/conversations';
import { Flex } from '../basic/Flex';
import { SpacerLG, SpacerMD, SpacerSM, SpacerXS } from '../basic/Text';
import { copyBchatID } from '../dialog/EditProfileDialog';
import { BchatIcon, BchatIconButton } from '../icon';
import {
  useConversationBnsHolder,
  useConversationBeldexAddress,
  useConversationUsernameOrShorten,
} from '../../hooks/useParamSelector';
// import { LeftPaneSectionHeader } from '../leftpane/LeftPaneSectionHeader';
import { Avatar, AvatarSize, BNSWrapper } from '../avatar/Avatar';
import { getBchatWalletPasswordModal } from '../../state/selectors/modal';
import styled from 'styled-components';
import { getConversationController } from '../../bchat/conversations';
// import { BchatSearchInput } from '../BchatSearchInput';

const AvatarContainer = styled.div`
  position: relative;
`;

export const AvatarItem = (props: { memberPubkey: string; isBnsHolder: any }) => {
  const { memberPubkey, isBnsHolder } = props;
  return (
    <AvatarContainer>
      <BNSWrapper
        // size={52}
        position={{ left: '34px', top: '34px' }}
        isBnsHolder={isBnsHolder}
        size={{ width: '20', height: '20' }}
      >
        <Avatar size={AvatarSize.M} pubkey={memberPubkey} />
      </BNSWrapper>
    </AvatarContainer>
  );
};

export const AddressBook = (props: { isContact?: boolean }) => {
  const { isContact } = props;
  const dispatch = useDispatch();
  const privateContactsPubkeys = useSelector(getPrivateContactsPubkeys);
  const BchatWalletPasswordModal = useSelector(getBchatWalletPasswordModal);
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const [filteredNames, setFilteredNames] = useState<Array<string>>(privateContactsPubkeys);

  async function send(address: any) {
    // dispatch(dashboard());
    // dispatch(walletSendPage());
    dispatch(updateSendAddress(address));
  }
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

  return (
    <div className="addressBook">
      {isContact && (
        <>
          {/* <LeftPaneSectionHeader /> */}
          <SpacerLG />
          {/* {conversations?.length !== 0 && */}
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
              placeholder={'Search Contact'}
              maxLength={26}
            />
          </div>
          <SpacerLG />
          <div className="addressBook-header-txt">{window.i18n('contact')}</div>
        </>
      )}

      {!isContact && (
        <div style={{ cursor: 'pointer' }}>
          <Flex container={true} alignItems="center">
            <BchatIconButton
              iconType="KeyboardBackspaceArrow"
              iconSize={'huge'}
              iconColor={'#A9AEBA'}
              onClick={() => dispatch(dashboard())}
            />

            <SpacerMD />
            <div className="addressBook-header-txt">{window.i18n('addressBook')}</div>
          </Flex>
        </div>
      )}

      {/* <SpacerSM /> */}
      <div
        className={classNames('addressBook-wholeBox ', BchatWalletPasswordModal && 'blurBg')}
        style={{ height: !isContact ? 'calc( 100vh - 548px )' : 'calc( 100vh - 153px )' }}
      >
        {filteredNames.length > 0 &&
          filteredNames.map(item => (
            <AddressContent pubkey={item} isContact={isContact} send={(e: any) => send(e)} />
          ))}
        {filteredNames.length === 0 ? (
          <>
            <Flex
              container={true}
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              height={isContact ? '80%' : '100%'}
            >
              <div
                className="addressBook-emptyAddressBook"
                style={{ height: isContact ? '186px' : '170px' }}
              ></div>
              <SpacerSM />
              <div className="addressBook-emptyAddressBook-content">
                {isContact ? (
                  <div className="address-hint-txt"> {window.i18n('emptyContact')} </div>
                ) : (
                  <>
                    <div className="address-txt">No Addresses!</div>
                    <div className="address-hint-txt">Save address to show!</div>
                  </>
                )}
              </div>
            </Flex>
          </>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

const AddressContent = (props: { isContact?: boolean; pubkey: string; send: any }) => {
  const dispatch = useDispatch();
  const username = useConversationUsernameOrShorten(props.pubkey);
  const belAddress = useConversationBeldexAddress(props.pubkey);
  const isBnsHolder = useConversationBnsHolder(props.pubkey);
  async function copyBtn(address: string) {
    copyBchatID(address);
  }
  return belAddress ? (
    <>
      <div
        className={classNames(`addressBook-wholeBox-contentBox`)}
        style={props.isContact ? { cursor: 'pointer' } : {}}
        onClick={() =>
          props.isContact &&  dispatch(updateSendAddress(belAddress))
        }
      >
        <div className="avatarBox">
          {/* <Avatar
            size={AvatarSize.M}
            pubkey={props.pubkey}
          // onAvatarClick={isPrivate ? onPrivateAvatarClick : undefined}
          /> */}
          <AvatarItem memberPubkey={props.pubkey} isBnsHolder={isBnsHolder} />
        </div>

        <Flex container={true} flexDirection="column">
          <div>
            <span className={classNames('contact')}>{username}</span>
          </div>
          <SpacerXS />

          <div
            className={'addressBook-wholeBox-contentBox-addresstxt'}
            style={props.isContact ? { cursor: 'pointer' } : {}}
            onClick={() => {
              props.isContact &&
              dispatch(updateSendAddress(belAddress));
            }}
          >
            {props.isContact ? belAddress.slice(0, 50) + '...' : belAddress}
          </div>
        </Flex>

        {!props.isContact && (
          <Flex container={true} flexDirection="row" alignItems="center" margin="0 0 0 15px">
            <BchatIconButton
              iconType="copy"
              iconSize={20}
              btnBgColor="var(--color-clickable-hovered)"
              padding="15px"
              btnRadius="16px"
              clipRule="evenodd"
              fillRule="evenodd"
              onClick={() => copyBtn(belAddress)}
            />
            <SpacerSM />
            <BchatIconButton
              iconType="send"
              iconSize={20}
              iconColor='#FFF'
              btnBgColor="#108D32"
              padding="15px"
              btnRadius="16px"
              onClick={() => props.send(belAddress)}
            />
          </Flex>
        )}
      </div>
      <SpacerXS />
    </>
  ) : (
    <></>
  );
};
