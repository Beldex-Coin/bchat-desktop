import React from 'react';
import { useSelector } from 'react-redux';
// import { unblockConvoById } from '../../interactions/conversationInteractions';
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
import { MemberListItem } from '../MemberListItem';
import { BchatButton, BchatButtonColor } from '../basic/BchatButton';

export const BlockedUserSettings = () => {
  const blockedNumbers = useSelector(getBlockedPubkeys);
  const forceUpdate = useUpdate();

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
      <BchatButton
        buttonColor={BchatButtonColor.Danger}
        text={window.i18n('unblockUser')}
        onClick={unBlockThoseUsers}
        dataTestId="unblock-button-settings-screen"
      />
      <BlockedEntries
        blockedNumbers={blockedNumbers}
        selectedIds={selectedIds}
        addToSelected={addToSelected}
        removeFromSelected={removeFromSelected}
      />
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

const BlockedEntriesRoundedContainer = styled.div`
  overflow: hidden;
  background: var(--background-secondary-color);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: var(--margins-lg);
  margin: 0 var(--margins-lg);
`;






const BlockedEntries = (props: {
  blockedNumbers: Array<string>;
  selectedIds: Array<string>;
  addToSelected: (id: string) => void;
  removeFromSelected: (id: string) => void;
}) => {
  const { addToSelected, blockedNumbers, removeFromSelected, selectedIds } = props;
  return (
    <BlockedEntriesRoundedContainer>
      <BlockedEntriesContainer>
        {blockedNumbers.map(blockedEntry => {
          return (
            <MemberListItem
              pubkey={blockedEntry}
              isSelected={selectedIds.includes(blockedEntry)}
              key={blockedEntry}
              onSelect={addToSelected}
              onUnselect={removeFromSelected}
              disableBg={true}
            />
          );
        })}
      </BlockedEntriesContainer>
    </BlockedEntriesRoundedContainer>
  );
};

