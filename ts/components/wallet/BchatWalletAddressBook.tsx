import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { updateSendAddress } from '../../state/ducks/walletConfig';
import { walletSendPage } from '../../state/ducks/walletInnerSection';
import { dashboard } from '../../state/ducks/walletSection';
import { getPrivateContactsPubkeys } from '../../state/selectors/conversations';
import { Flex } from '../basic/Flex';
import { SpacerLG, SpacerXS } from '../basic/Text';
import { copyBchatID } from '../dialog/EditProfileDialog';
import { BchatIcon } from '../icon';
import {
  useConversationBnsHolder,
  useConversationBeldexAddress,
  useConversationUsernameOrShorten,
} from '../../hooks/useParamSelector';
// import { LeftPaneSectionHeader } from '../leftpane/LeftPaneSectionHeader';
import { Avatar, AvatarSize,BNSWrapper } from '../avatar/Avatar';
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
        size={{width:'20',height:'20'}}
      >
        <Avatar size={AvatarSize.M} pubkey={memberPubkey} />
      </BNSWrapper>
    </AvatarContainer>
  );
};

export const AddressBook = (props: any) => {
  const dispatch = useDispatch();
  const privateContactsPubkeys = useSelector(getPrivateContactsPubkeys);
  const BchatWalletPasswordModal = useSelector(getBchatWalletPasswordModal);
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const [filteredNames, setFilteredNames] = useState<Array<string>>(privateContactsPubkeys);
 

  async function copyBtn(address: string) {
    copyBchatID(address);
  }
  async function send(address: any) {
    dispatch(dashboard());
    dispatch(walletSendPage());
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
  const AddressContent = (props: any) => {
    const username = useConversationUsernameOrShorten(props.pubkey);
    const belAddress = useConversationBeldexAddress(props.pubkey);
    const isBnsHolder = useConversationBnsHolder(props.pubkey);

    return belAddress ? (
      <>

        <div
          className={classNames(`addressBook-wholeBox-contentBox`)}
          style={window.i18n('addressBook') !== props.title ? { cursor: 'pointer' } : {}}
          onClick={() => window.i18n('addressBook') !== props.title ? send(belAddress): dispatch(updateSendAddress(belAddress))}
        > 
          {props.title === window.i18n('contact') &&
            <div className='avatarBox'>
               {/* <Avatar
              size={AvatarSize.M}
              pubkey={props.pubkey}
            // onAvatarClick={isPrivate ? onPrivateAvatarClick : undefined}
            /> */}
            <AvatarItem memberPubkey={props.pubkey} isBnsHolder={isBnsHolder} />
            </div>
          }
          <Flex container={true} flexDirection="column">
            <div>
              <span className={classNames("addressBook-wholeBox-contentBox-nameBtn",props.title === window.i18n('contact') && 'contact')}>{username}</span>
            </div>
            <SpacerXS />
   
            <div className={"addressBook-wholeBox-contentBox-addresstxt"} style={{cursor:'pointer'}}
            onClick={()=> {dispatch(updateSendAddress(belAddress));dispatch(walletSendPage());}}
            >
              {props.title ===window.i18n('contact')? belAddress.slice(0, 50)+'...':belAddress}
            </div>
          </Flex>

          {window.i18n('addressBook') === props.title && (
            <Flex container={true} flexDirection="row" alignItems="center">
              <div
                className="addressBook-wholeBox-contentBox-sendBtn"
                onClick={() => send(belAddress)}
              >
                <BchatIcon iconType="send" iconSize={'small'}  />
                <span style={{marginLeft:"3px"}}>{window.i18n('send')}</span>
              </div>
              <div
                className="addressBook-wholeBox-contentBox-copyBtn"
                onClick={() => copyBtn(belAddress)}
              >
                <BchatIcon iconType="copy" iconSize={'small'} />
                <span style={{ marginLeft: '3px' }}>{window.i18n('editMenuCopy')}</span>
              </div>
            </Flex>
          )}
        </div>
        <SpacerXS />
      </>
    ) : (
      <></>
    );
  };

  return (
    <div className="addressBook">
      {
        props.from === window.i18n('contact') && <>
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
                console.log(e)
                handleSearch(e);
              }}
              placeholder={'Search Contact'}
              maxLength={26}
            />
          </div>
        <SpacerLG />
          <div className="addressBook-header-txt">
            {window.i18n('contact')}
          </div>
        </>
      }

      {props.from !== window.i18n('contact') &&
        <div style={{ cursor: 'pointer' }}>

          <Flex container={true} alignItems="center">
            <div onClick={() => dispatch(dashboard())}>
              <BchatIcon iconType="walletBackArrow" iconSize={'huge'} iconColor={'#9393af'} />
            </div>
            <div className="addressBook-header-txt">
              {props.from}
            </div>
          </Flex>
        </div>
      }

      {/* <SpacerSM /> */}
      <div className={classNames("addressBook-wholeBox ",BchatWalletPasswordModal  && 'blurBg')}>
        {filteredNames.length > 0 &&
          filteredNames.map(item => <AddressContent pubkey={item} title={props.from} />)}
        {filteredNames.length == 0 ? (
          <>
            <div className="addressBook-emptyAddressBook"></div>
            <h4 className="addressBook-emptyAddressBook-content">
              {window.i18n('addressBook') !== props.from
                ? window.i18n('emptyContact')
                : window.i18n('emptyAddressBook')}
              <span style={{ marginLeft: '7px' }}>
                <BchatIcon iconType={'sadEmoji'} iconSize={'small'} iconColor={'#646474'} />
              </span>
            </h4>
          </>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};
