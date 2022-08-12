import React, { useState } from 'react';
// tslint:disable: no-submodule-imports use-simple-attributes

import { BchatJoinableRooms } from './BchatJoinableDefaultRooms';

// import { BchatButton, BchatButtonColor, BchatButtonType } from '../../basic/BchatButton';
import { BchatIdEditable } from '../../basic/BchatIdEditable';
import { BchatSpinner } from '../../basic/BchatSpinner';
// import { OverlayHeader } from './OverlayHeader';
import { useDispatch } from 'react-redux';
import { setOverlayMode, showLeftPaneSection } from '../../../state/ducks/section';
import { joinOpenGroupV2WithUIEvents } from '../../../bchat/apis/open_group_api/opengroupV2/JoinOpenGroupV2';
import { openGroupV2CompleteURLRegex } from '../../../bchat/apis/open_group_api/utils/OpenGroupUtils';
import { ToastUtils } from '../../../bchat/utils';
import useKey from 'react-use/lib/useKey';
import { LeftPaneSectionHeader } from '../LeftPaneSectionHeader';

async function joinOpenGroup(serverUrl: string) {
  // guess if this is an open
  if (serverUrl.match(openGroupV2CompleteURLRegex)) {
    const groupCreated = await joinOpenGroupV2WithUIEvents(serverUrl, true, false);    
    return groupCreated;
  } else {
    ToastUtils.pushToastError('invalidOpenGroupUrl', window.i18n('invalidOpenGroupUrl'));
    window.log.warn('Invalid opengroupv2 url');
    return false;
  }
}

export const OverlayOpenGroup = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [groupUrl, setGroupUrl] = useState('');

  function closeOverlay() {
    dispatch(setOverlayMode(undefined));
    dispatch(showLeftPaneSection(0));
    
  }

  async function onEnterPressed() {
    try {
      if (loading) {
        return;
      }
      setLoading(true);
      const groupCreated = await joinOpenGroup(groupUrl);
      if (groupCreated) {
        closeOverlay();
        

      }
    } catch (e) {
      window.log.warn(e);
    } finally {
      setLoading(false);
    }
  }

  // FIXME autofocus inputref on mount
  useKey('Escape', closeOverlay);

  const title = window.i18n('joinOpenGroup');
  const buttonText = window.i18n('next');
  const subtitle = window.i18n('openGroupURL');
  const placeholder = window.i18n('enterAnOpenGroupURL');

  return (
    <div className="module-left-pane-overlay">
      <div className="module-left-pane-overlay">
      {/* <OverlayHeader title={title} subtitle={subtitle}  hideExit={true}/> */}
      <LeftPaneSectionHeader />

      <div className='module-left-pane-overlay-closed--header'>{title}</div>
      <div className='module-left-pane-overlay-closed--subHeader'>
      {subtitle}
      </div>
    
      <div className="create-group-name-input">
        <BchatIdEditable
          editable={true}
          placeholder={placeholder}
          value={groupUrl}
          isGroup={true}
          maxLength={300}
          onChange={setGroupUrl}
          onPressEnter={onEnterPressed}
        />
      </div>
      <div className='module-left-pane-overlay-openhint-message'>
      Social groups are similar to public groups. however, you need an invite link to join. Join a social group using the group's URL.
      </div>

      <BchatSpinner loading={loading} />
      <BchatJoinableRooms onRoomClicked={closeOverlay} />
      
      {/* <BchatButton
        buttonColor={BchatButtonColor.Green}
        buttonType={BchatButtonType.BrandOutline}
        text={buttonText}
        
      /> */}
    </div>
    <div className='buttonBox'>
    <button 
      className='nextButton'
      onClick={onEnterPressed}
      >{buttonText}</button>
    </div>

    </div>
  );
};
