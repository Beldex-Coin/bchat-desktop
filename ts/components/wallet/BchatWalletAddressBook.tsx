import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classNames';
import { updateSendAddress } from '../../state/ducks/walletConfig';
import { walletSendPage } from '../../state/ducks/walletInnerSection';
import { dashboard } from '../../state/ducks/walletSection';
import { getPrivateContactsPubkeys } from '../../state/selectors/conversations';
import { Flex } from '../basic/Flex';
import { SpacerLG, SpacerSM } from '../basic/Text';
import { copyBchatID } from '../dialog/EditProfileDialog';
import { BchatIcon } from '../icon';
import {
  useConversationBeldexAddress,
  useConversationUsernameOrShorten,
} from '../../hooks/useParamSelector';
import { LeftPaneSectionHeader } from '../leftpane/LeftPaneSectionHeader';

export const AddressBook = (props: any) => {
  const dispatch = useDispatch();
  const privateContactsPubkeys = useSelector(getPrivateContactsPubkeys);
  async function copyBtn(address: string) {
    copyBchatID(address);
  }
  async function send(address: any) {
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
          className={classNames(`addressBook-wholeBox-contentBox`)}
          style={window.i18n('addressBook') !== props.title ? { cursor: 'pointer' } : {}}
          onClick={() => window.i18n('addressBook') !== props.title && send(belAddress)}
        >
          <Flex container={true} flexDirection="column">
            <div>
              <span className="addressBook-wholeBox-contentBox-nameBtn">{username}</span>
            </div>
            <SpacerSM />
            <div className={classNames("addressBook-wholeBox-contentBox-addresstxt",props.title==="leftpane"&&"ellipse")}>
              {belAddress}
            </div>
          </Flex>

          {window.i18n('addressBook') === props.title && (
            <Flex container={true} flexDirection="row" alignItems="center">
              <div
                className="addressBook-wholeBox-contentBox-sendBtn"
                onClick={() => send(belAddress)}
              >
                <BchatIcon iconType="send" iconSize={'small'} iconRotation={309} />
                <span>{window.i18n('send')}</span>
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
        <SpacerSM />
      </>
    ) : (
      <></>
    );
  };

  return (
    <div className="addressBook">
      {
        props.from === "leftpane" && <>
          <LeftPaneSectionHeader />
          <div className="addressBook-header-txt">
            {window.i18n('contact')}
          </div>
        </>
      }

      {props.from !== "leftpane" &&
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

      <SpacerLG />
      <div className="addressBook-wholeBox">
        {privateContactsPubkeys.length > 0 &&
          privateContactsPubkeys.map(item => <AddressContent pubkey={item} title={props.from} />)}
        {privateContactsPubkeys.length == 0 ? (
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
