import React from 'react';
import { useSelector } from 'react-redux';
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
import { Avatar, AvatarSize, CrownIcon } from '../avatar/Avatar';
import { useConversationUsernameOrShorten } from '../../hooks/useParamSelector';
import classNames from 'classnames';
import { BchatIcon } from '../icon';
import { getBlockedContactMarkAS } from '../../state/selectors/userConfig';

export const BlockedUserSettings = () => {
  const blockedNumbers = useSelector(getBlockedPubkeys);
  const forceUpdate = useUpdate();
  const blockedContactMarkAS = useSelector(getBlockedContactMarkAS);


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
      <div className='noBlockedContacts'>
        <div className='noBlockedContacts-img'>

        </div>
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

  return <div >
    <div style={blockedContactMarkAS ? { height: 'calc( 100vh - 137px)' } : {}} >
      <BlockedEntries
        blockedNumbers={blockedNumbers}
        selectedIds={selectedIds}
        addToSelected={addToSelected}
        removeFromSelected={removeFromSelected}
        blockedContactMarkAS={blockedContactMarkAS}
      />
    </div>
    {blockedContactMarkAS &&
      <UnBlockedBox  >
        <BchatButton
          buttonColor={BchatButtonColor.Danger}
          text={window.i18n('unblockUserSelect')}
          onClick={unBlockThoseUsers}
          dataTestId="unblock-button-settings-screen"
        />
      </UnBlockedBox>
    }
  </div>

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
  background: var(--color-chatHeader);
  height: 56px;
  align-items: center;
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
  blockedContactMarkAS: boolean
}) => {
  const { addToSelected, blockedNumbers, removeFromSelected, selectedIds, blockedContactMarkAS } = props;
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
              blockedContactMarkAS={blockedContactMarkAS}
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

const AvatarItem = (props: { memberPubkey: string; isAdmin: boolean }) => {
  const { memberPubkey, isAdmin } = props;
  return (
    <AvatarContainer>
      <Avatar size={AvatarSize.S} pubkey={memberPubkey} />
      {isAdmin && <CrownIcon />}
    </AvatarContainer>
  );
};

export const BlockedMemberList = (props: {
  pubkey: string;
  isSelected: boolean;
  setting?: boolean;
  blockedContactMarkAS: boolean;
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
    blockedContactMarkAS
  } = props;

  const memberName = useConversationUsernameOrShorten(pubkey);
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
        blockedContactMarkAS && isSelected ? onUnselect?.(pubkey) : onSelect?.(pubkey);
      }}
      style={
        !disableBg
          ? {
          }
          : {}
      }
      role="button"
      data-testid={dataTestId}
    >
      <div className="bchat-member-item__info" style={{ width: "100%" }}>
        <span className="bchat-member-item__avatar">
          <AvatarItem memberPubkey={pubkey} isAdmin={isAdmin || false} />
        </span>
        <span className="bchat-blockedMember-item__name">{memberName}</span>
      </div>
      <div className='bchat-blockedMember-item-selectionBox'>

        {!blockedContactMarkAS ?
          <div className='bchat-blockedMember-item-btnBox'>
            <BchatButton
              buttonColor={BchatButtonColor.Danger}
              text={window.i18n('unblockUser')}
              onClick={() => unblockConvoById(pubkey)}
              dataTestId="unblock-button-settings-screen"
            />
          </div> :
          <div className={classNames('bchat-member-item__checkmarkbox', isSelected && 'selected')}>

            {isSelected && <BchatIcon iconType="checkBox" iconSize={23} iconColor={'white'} />}

          </div>
        }
      </div>

    </div>
  );
};

