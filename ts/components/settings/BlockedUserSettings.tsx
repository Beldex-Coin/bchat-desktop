import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unblockConvoById } from '../../interactions/conversationInteractions';
// import { getConversationController } from '../../bchat/conversations';
import { getBlockedPubkeys } from '../../state/selectors/conversations';
// import { BchatButtonColor } from '../basic/BchatButton';

// import { BchatSettingButtonItem,
// BchatSettingsItemWrapper
// } from './BchatSettingListItem';
import { useSet } from '../../hooks/useSet';
import { BlockedNumberController } from '../../util';
import { ToastUtils } from '../../bchat/utils';
import useUpdate from 'react-use/lib/useUpdate';
import styled from 'styled-components';
// import { MemberListItem } from '../MemberListItem';
import { BchatButton, BchatButtonColor } from '../basic/BchatButton';
import { Avatar, AvatarSize, BNSWrapper, CrownIcon } from '../avatar/Avatar';
import {
  useConversationBnsHolder,
  useConversationUsernameOrShorten,
} from '../../hooks/useParamSelector';
import classNames from 'classnames';
import { BchatIconButton } from '../icon';
import { getMultipleSelection } from '../../state/selectors/userConfig';
import { hideMultipleSelection } from '../../state/ducks/userConfig';
import { SpacerLG } from '../basic/Text';

export const BlockedUserSettings = () => {
  const blockedNumbers = useSelector(getBlockedPubkeys);
  const forceUpdate = useUpdate();
  const multipleSelection = useSelector(getMultipleSelection);
  const dispatch = useDispatch();

  const {
    uniqueValues: selectedIds,
    addTo: addToSelected,
    removeFrom: removeFromSelected,
    empty: emptySelected,
  } = useSet<string>([]);

  async function unBlockThoseUsers() {
    if (selectedIds.length) {
      await BlockedNumberController.unblockAll(selectedIds);
      emptySelected();
      ToastUtils.pushToastSuccess('unblocked', window.i18n('unblocked'));
      forceUpdate();
      dispatch(hideMultipleSelection());
    }
  }

  if (!blockedNumbers || blockedNumbers.length === 0) {
    return (
      // <BchatSettingsItemWrapper
      //   inline={true}
      //   description={window.i18n('noBlockedContacts')}
      //   title={''}
      // >
      //   {' '}
      // </BchatSettingsItemWrapper>
      <div className="noBlockedContacts">
        <div className="noBlockedContacts-img"></div>
        {window.i18n('noBlockedContacts')}
      </div>
    );
  }
  // const blockedEntries = () => {
  // const blockedEntries = blockedNumbers.map(blockedEntry => {
  // const currentModel = getConversationController().get(blockedEntry);
  // let title: string;
  // if (currentModel) {
  //   title = currentModel.getProfileName() || currentModel.getName() || window.i18n('anonymous');
  // } else {
  //   title = window.i18n('anonymous');
  // }

  return (
    <div>
      <div style={multipleSelection ? { height: 'calc( 100vh - 137px)' } : {}}>
        <BlockedEntries
          blockedNumbers={blockedNumbers}
          selectedIds={selectedIds}
          addToSelected={addToSelected}
          removeFromSelected={removeFromSelected}
          multipleSelection={multipleSelection}
        />
        <SpacerLG />
        <SpacerLG />
        {multipleSelection && (
          <UnBlockedBox>
            <BchatButton
              buttonColor={BchatButtonColor.Danger}
              style={{
                height: '55px', fontSize: '16px',
                fontWeight: '500'
              }}
              text={window.i18n('unblockUserSelect')}
              onClick={unBlockThoseUsers}
              dataTestId="unblock-button-settings-screen"
            />
          </UnBlockedBox>
        )}
      </div>

    </div>
  );

  // <BchatSettingButtonItem
  //   key={blockedEntry}
  //   buttonColor={BchatButtonColor.Danger}
  //   buttonText={window.i18n('unblockUser')}
  //   bchatId={blockedEntry}
  //   title={title}
  //   onClick={async () => {
  //     await unblockConvoById(blockedEntry);
  //   }}
  // />

  // });

  // }
  // return <>{blockedEntries}</>;
};

const BlockedEntriesContainer = styled.div`
  flex-shrink: 1;
  overflow: auto;
  min-height: 40px;
  max-height: 100%;
`;

const UnBlockedBox = styled.div`
  display: flex;
  justify-content: center;
 `;
const BlockedEntriesRoundedContainer = styled.div`
  overflow: hidden;
  background: var(--background-secondary-color);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  // padding: var(--margins-lg);
  // margin: 0 var(--margins-lg);
`;

const BlockedEntries = (props: {
  blockedNumbers: Array<string>;
  selectedIds: Array<string>;
  addToSelected: (id: string) => void;
  removeFromSelected: (id: string) => void;
  multipleSelection: boolean;
}) => {
  const {
    addToSelected,
    blockedNumbers,
    removeFromSelected,
    selectedIds,
    multipleSelection,
  } = props;
  return (
    <BlockedEntriesRoundedContainer>
      <BlockedEntriesContainer>
        {blockedNumbers.map(blockedEntry => {
          return (
            <BlockedMemberList
              pubkey={blockedEntry}
              isSelected={selectedIds.includes(blockedEntry)}
              key={blockedEntry}
              onSelect={addToSelected}
              onUnselect={removeFromSelected}
              disableBg={false}
              multipleSelection={multipleSelection}
            // setting={true}
            />
          );
        })}
      </BlockedEntriesContainer>
    </BlockedEntriesRoundedContainer>
  );
};

const AvatarContainer = styled.div`
  position: relative;
`;

const AvatarItem = (props: { memberPubkey: string; isAdmin: boolean; isBnsHolder: any }) => {
  const { memberPubkey, isAdmin, isBnsHolder } = props;
  return (
    <AvatarContainer>
      <BNSWrapper
        // size={40}
        position={{ left: '23px', top: '23px' }}
        isBnsHolder={isBnsHolder}
        size={{ width: '20', height: '20' }}
      >
        <Avatar size={AvatarSize.M} pubkey={memberPubkey} />
        {isAdmin && <CrownIcon />}
      </BNSWrapper>
    </AvatarContainer>
  );
};

export const BlockedMemberList = (props: {
  pubkey: string;
  isSelected: boolean;
  setting?: boolean;
  multipleSelection: boolean;
  // this bool is used to make a zombie appear with less opacity than a normal member
  isZombie?: boolean;
  disableBg?: boolean;
  isAdmin?: boolean; // if true,  we add a small crown on top of their avatar
  onSelect?: (pubkey: string) => void;
  onUnselect?: (pubkey: string) => void;
  dataTestId?: string;
}) => {
  const {
    isSelected,
    pubkey,
    isZombie,
    isAdmin,
    onSelect,
    onUnselect,
    disableBg,
    dataTestId,
    multipleSelection,
  } = props;

  const memberName = useConversationUsernameOrShorten(pubkey);
  const isBnsHolder = useConversationBnsHolder(pubkey);
  return (
    // tslint:disable-next-line: use-simple-attributes
    <div
      className={classNames(
        'bchat-blockedMember-item',
        isSelected && 'selected',
        isZombie && 'zombie',
        disableBg && 'compact'
      )}
      onClick={() => {
        multipleSelection && isSelected ? onUnselect?.(pubkey) : onSelect?.(pubkey);
      }}
      style={!disableBg ? {} : {}}
      role="button"
      data-testid={dataTestId}
    >
      <div className="bchat-member-item__info" style={{ width: '100%' }}>
        <span className="bchat-member-item__avatar">
          <AvatarItem memberPubkey={pubkey} isAdmin={isAdmin || false} isBnsHolder={isBnsHolder} />
        </span>
        <span className="bchat-blockedMember-item__name">{memberName}</span>
      </div>
      <div className="bchat-blockedMember-item-selectionBox">
        {!multipleSelection ? (
          <div className="bchat-blockedMember-item-btnBox">
            <BchatButton
              style={{ minWidth: '45px', height: '45px', fontWeight: '400', fontSize: '16px', fontFamily: 'Poppins' }}
              buttonColor={BchatButtonColor.Danger}
              text={window.i18n('unblockUser')}
              onClick={() => unblockConvoById(pubkey)}
              dataTestId="unblock-button-settings-screen"
            />
          </div>
        ) : (
          <div>
          {/* <div className={classNames('bchat-member-item__checkmarkbox')}> */}
             <BchatIconButton iconType={isSelected?"checkBoxTick":'checkBox'} iconSize={23} />
          </div>
        )}
      </div>
    </div>
  );
};
