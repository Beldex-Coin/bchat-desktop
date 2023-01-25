import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classNames';
import { updateSendAddress } from '../../state/ducks/walletConfig';
import { walletSendPage } from '../../state/ducks/walletInnerSection';
import { dashboard } from '../../state/ducks/walletSection';
import { getPrivateContactsPubkeys } from '../../state/selectors/conversations';
// import { getWalletSendAddress } from "../../state/selectors/walletConfig"
import { Flex } from '../basic/Flex';
import { SpacerLG, SpacerSM } from '../basic/Text';
import { copyBchatID } from '../dialog/EditProfileDialog';
import { BchatIcon } from '../icon';
import {
  useConversationBeldexAddress,
  useConversationUsernameOrShorten,
} from '../../hooks/useParamSelector';
// import { sqlNode } from "../../node/sql"
//  import {  getRecipientAddress } from "../../data/data"

export const AddressBook = (props: any) => {
  const dispatch = useDispatch();
  const privateContactsPubkeys = useSelector(getPrivateContactsPubkeys);
  // const directContact = useSelector(getDirectContacts);
  // console.log('directContact ::',directContact);
  // function getAcceptedContact()
  // {
  //   let data=directContact.length

  // }

  // async function showdata()
  // {
  //   console.log('recipientAddress showdata ::');
  // //  let data= await sqlNode.getRecipientAddress()
  // let tx_hash='af8ca296a9feb5655c4053704507978e9d637860dbf15bc642f7ce8638cbfc4b'
  //  let data=await getRecipientAddress(tx_hash)
  //  console.log('showdata ::',data);

  //   // await getRecipientAddress()
  //   // await getAllUnprocessed();

  // }

  // console.log("directContact :: ", directContact, directContact.length);

  async function copyBtn(address: string) {

    // let address= useConversationBeldexAddress(pubkey)
    copyBchatID(address);
  }
  // console.log("sendAddress :: ",sendAddress);
  async function send(address: any) {

    // let address=await useConversationBeldexAddress(pubkey)
    dispatch(dashboard());
    dispatch(walletSendPage());
    dispatch(updateSendAddress(address));
  }
  const AddressContent = (props: any) => {
    const username = useConversationUsernameOrShorten(props.pubkey);
    const belAddress = useConversationBeldexAddress(props.pubkey);
    return belAddress ? (
      <>
        <div
          className={classNames(`wallet-addressBook-wholeBox-contentBox`)}
          style={window.i18n('addressBook') !== props.title ? { cursor: 'pointer' } : {}}
          onClick={() => window.i18n('addressBook') !== props.title && send(belAddress)}
        >
          <Flex container={true} flexDirection="column">
            <div>
              <span className="wallet-addressBook-wholeBox-contentBox-nameBtn">{username}</span>
            </div>
            <SpacerSM />
            <div className="wallet-addressBook-wholeBox-contentBox-addresstxt">
              {belAddress}
              {/* bxcALKJHSakhdsadhaskdhHHHDJADHUAWjhjhsjdhjshaskjhdas9dapsidasasjhas8dauas */}
            </div>
          </Flex>

          {window.i18n('addressBook') === props.title && (
            <Flex container={true} flexDirection="row" alignItems="center">
              <div
                className="wallet-addressBook-wholeBox-contentBox-sendBtn"
                onClick={() => send(belAddress)}
              >
                <BchatIcon iconType="send" iconSize={'small'} iconRotation={309} />
                <span>{window.i18n('send')}</span>
              </div>
              <div
                className="wallet-addressBook-wholeBox-contentBox-copyBtn"
                onClick={() => copyBtn(belAddress)}
              >
                <BchatIcon iconType="copy" iconSize={'small'} />
                <span style={{ marginLeft: '3px' }}>{window.i18n('editMenuCopy')}</span>
              </div>
            </Flex>
          )}
        </div>
        <SpacerSM />
      </>
    ) : (
      <></>
    );
  };

  return (
    <div className="wallet-addressBook">
      {/* <button onClick={()=>showdata()}>test 12345</button> */}
      <div style={{ cursor: 'pointer' }}>
        <Flex container={true} alignItems="center">
          <div onClick={() => dispatch(dashboard())}>
            <BchatIcon iconType="walletBackArrow" iconSize={'huge'} iconColor={'#9393af'} />
          </div>
          <div className="wallet-addressBook-header-txt">
            {/* {window.i18n('addressBook')} */}
            {props.name}
          </div>
        </Flex>
      </div>
      <SpacerLG />
      <div className="wallet-addressBook-wholeBox">
        {privateContactsPubkeys.length > 0 &&
          privateContactsPubkeys.map(item => <AddressContent pubkey={item} title={props.name} />)}
        {privateContactsPubkeys.length == 0 ? (
          <>
            <div className="wallet-addressBook-emptyAddressBook"></div>
            <h4 className="wallet-addressBook-emptyAddressBook-content">
              {window.i18n('addressBook') !== props.name
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
