import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

// import { BchatButton, BchatButtonColor, BchatButtonType } from '../../basic/BchatButton';
import { BchatIdEditable } from '../../basic/BchatIdEditable';
import { BchatSpinner } from '../../basic/BchatSpinner';
import { MemberListItem } from '../../MemberListItem';
// import { OverlayHeader } from './OverlayHeader';
// tslint:disable: no-submodule-imports use-simple-attributes

import { setOverlayMode, showLeftPaneSection } from '../../../state/ducks/section';
import {
  // getDirectContacts,
  getPrivateContactsPubkeys,
} from '../../../state/selectors/conversations';
import { SpacerLG } from '../../basic/Text';
import { MainViewController } from '../../MainViewController';
import useKey from 'react-use/lib/useKey';
import { LeftPaneSectionHeader } from '../LeftPaneSectionHeader';
import { getIsOnline } from '../../../state/selectors/onions';
import useNetworkStatus from '../../../hooks/useNetworkStatus';
//  import { getConversationById } from '../../../data/data';
// import { UserUtils } from '../../../bchat/utils';
// import { UserUtils } from '../../../bchat/utils';

export const OverlayClosedGroup = () => {
  const dispatch = useDispatch();
  const privateContactsPubkeys = useSelector(getPrivateContactsPubkeys);
  const pathCon = useSelector(getIsOnline);
  const isOnline = useNetworkStatus();
  const heightValidation=  !pathCon && isOnline || !pathCon && !isOnline 
  // FIXME autofocus inputref on mount
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<Array<string>>([]);

  function closeOverlay() {
    dispatch(setOverlayMode(undefined));
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

  async function onEnterPressed() {
    if (loading) {
      window?.log?.warn('Closed group creation already in progress');
      return;
    }
    setLoading(true);
    const groupCreated = await MainViewController.createClosedGroup(groupName, selectedMemberIds);

    if (groupCreated) {
      closeOverlay();
      dispatch(showLeftPaneSection(0));
      dispatch(setOverlayMode(undefined));
      return;
    }
    setLoading(false);
  }

  useKey('Escape', closeOverlay);

  const title = window.i18n('newSecretGroup');
  // const buttonText = window.i18n('done');
  const subtitle = window.i18n('createSecretGroupNamePrompt');
  const placeholder = window.i18n('createSecretGroupPlaceholder');

  const noContactsForClosedGroup = privateContactsPubkeys.length === 0;

  // const ClosedGrpHeader = () => {
  //   if (!noContactsForClosedGroup) {
  //     return (<>

  //       <div className='module-left-pane-overlay-closed--subHeader'>
  //         {subtitle}
  //       </div>
  //       <div className="create-group-name-input">
  //         <BchatIdEditable
  //           editable={!noContactsForClosedGroup}
  //           placeholder={placeholder}
  //           value={groupName}
  //           isGroup={true}
  //           maxLength={100}
  //           onChange={setGroupName}
  //           onPressEnter={onEnterPressed}
  //           dataTestId="new-closed-group-name"
  //         />
  //       </div></>)
  //   }
  //   else {
  //     return <></>
  //   }

  // }
  function addContact() {
    dispatch(showLeftPaneSection(0));
    window.inboxStore?.dispatch(setOverlayMode('message'));
  }
  return (
    <div className="module-left-pane-overlay">
      <LeftPaneSectionHeader />
      <div style={{ height: `calc(100% - ${heightValidation?293 :222 }px)`, overflowY: 'auto' }}>
        {/* <OverlayHeader title={title} subtitle={subtitle} hideExit={true}/> */}
        {/* <LeftPaneSectionHeader /> */}
        <div className="module-left-pane-overlay-closed--header">{title}</div>
        {/* <ClosedGrpHeader /> */}
        {!noContactsForClosedGroup && (
          <>
            <div className="module-left-pane-overlay-closed--subHeader">{subtitle}</div>
            <div className="create-group-name-input">
              <BchatIdEditable
                editable={!noContactsForClosedGroup}
                placeholder={placeholder}
                value={groupName}
                isGroup={true}
                maxLength={32}
                onChange={setGroupName}
                onPressEnter={onEnterPressed}
                dataTestId="new-closed-group-name"
              />
            </div>
          </>
        )}
        <SpacerLG />
        {loading ? (
          <BchatSpinner loading={loading} />
        ) : (
          <div className="group-member-list__container">
            {noContactsForClosedGroup ? (
              <div className="group-member-list__no-contacts">
                <div className="group-member-list__addImg"></div>
                <h4 className="module-left-pane__empty_contact">{window.i18n('noContactsYet')}</h4>
                <div style={{ display: 'flex' }}>
                  {/* <button onClick={()=>getconverstation()}>getconverstation</button> */}

                  <button
                    className="nextButton"
                    style={{ width: '90%' }}
                    onClick={() => addContact()}
                  >
                    Add Contacts +{' '}
                  </button>
                </div>
                {/* {window.i18n('noContactsForGroup')} */}
              </div>
            ) : (
              <div className="group-member-list__selection">
                {privateContactsPubkeys.map((memberPubkey: string) => (
                  <MemberListItem
                    pubkey={memberPubkey}
                    isSelected={selectedMemberIds.some(m => m === memberPubkey)}
                    key={memberPubkey}
                    onSelect={selectedMember => {
                      handleSelectMember(selectedMember);
                    }}
                    onUnselect={unselectedMember => {
                      handleUnselectMember(unselectedMember);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <SpacerLG />

        {/* <BchatButton
        buttonColor={BchatButtonColor.Green}
        buttonType={BchatButtonType.BrandOutline}
        text={buttonText}
        disabled={noContactsForClosedGroup}
       
        dataTestId="next-button"
      /> */}
      </div>

      {!noContactsForClosedGroup && (
        <div className="buttonBox">
          <button className="nextButton" onClick={onEnterPressed}>
            Create
          </button>
        </div>
      )}
    </div>
  );
};
