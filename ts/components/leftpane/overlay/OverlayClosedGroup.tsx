import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BchatIdEditable } from '../../basic/BchatIdEditable';
import { BchatSpinner } from '../../basic/BchatSpinner';
import { MemberListItem } from '../../MemberListItem';
// tslint:disable: no-submodule-imports use-simple-attributes

import { setOverlayMode, showLeftPaneSection } from '../../../state/ducks/section';
import { getPrivateContactsPubkeys } from '../../../state/selectors/conversations';
import { SpacerLG, SpacerMD, SpacerXS } from '../../basic/Text';
import { MainViewController } from '../../MainViewController';
import useKey from 'react-use/lib/useKey';
import { BchatIcon } from '../../icon/BchatIcon';
import { getConversationController } from '../../../bchat/conversations';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../../basic/BchatButton';

export const OverlayClosedGroup = () => {
  const dispatch = useDispatch();
  const privateContactsPubkeys = useSelector(getPrivateContactsPubkeys);
  // const pathCon = useSelector(getIsOnline);
  // const isOnline = useNetworkStatus();
  // const heightValidation = (!pathCon && isOnline) || (!pathCon && !isOnline);
  // FIXME autofocus inputref on mount
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<Array<string>>([]);
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const [filteredNames, setFilteredNames] = useState<Array<string>>(privateContactsPubkeys);

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

  // function addContact() {
  //   dispatch(showLeftPaneSection(0));
  //   window.inboxStore?.dispatch(setOverlayMode('message'));
  // }
  return (
    <div className="module-left-pane-overlay">
      {/* <LeftPaneSectionHeader /> */}
      <div
        style={{
          height: `calc(100% - 115px)`,
          overflowY: 'auto',
          padding: '15px',
        }}
      >
        {/* <OverlayHeader title={title} subtitle={subtitle} hideExit={true}/> */}
        {/* <LeftPaneSectionHeader /> */}
        <SpacerLG />
        <div className="module-left-pane-overlay-closed--header">{title}</div>
        <SpacerLG />
        {!noContactsForClosedGroup && (
          <>
            <div className="module-left-pane-overlay-closed--subHeader">{subtitle}</div>
            <SpacerXS />
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
        <div>
          <label className="module-left-pane-overlay-closed--search-label"> Select Contacts</label>
          <SpacerXS />
          <div className="bchat-search-input">
            <div className="search">
              <BchatIcon iconSize={20} iconType="search" />
            </div>
            <input
              value={currentSearchTerm}
              onChange={e => {
                handleSearch(e);
              }}
              placeholder={'Search Contact'}
              maxLength={26}
            />
          </div>
        </div>
        <SpacerMD />
        {loading ? (
          <BchatSpinner loading={loading} />
        ) : (
          <div className="group-member-list__container">
            {noContactsForClosedGroup ? (
              <div className="group-member-list__no-contacts">
                <div className="group-member-list__addImg"></div>
              
                <h4 className="module-left-pane__empty_contact">{window.i18n('noContactsYet')}</h4>
                <SpacerMD/>
                {/* <div style={{ display: 'flex' }}>
                  <button
                    className="nextButton"
                    style={{ width: '90%' }}
                    onClick={() => addContact()}
                  >
                    Add Contacts +{' '}
                  </button>
                </div> */}
                {/* <BchatButton  text=' Add Contacts +' onClick={} /> */}
                {/* {window.i18n('noContactsForGroup')} */}
              </div>
            ) : (
              <div className="group-member-list__selection">
                {filteredNames.map((memberPubkey: string) => (
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
      </div>

      {!noContactsForClosedGroup && (
        <div className="buttonBox">
          <BchatButton
            buttonColor={BchatButtonColor.Primary}
            buttonType={BchatButtonType.Brand}
            text={'Create'}
            disabled={noContactsForClosedGroup}
            dataTestId="next-button"
            onClick={onEnterPressed}
          />
        </div>
      )}
    </div>
  );
};
