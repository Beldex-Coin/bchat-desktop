import  { useState } from 'react';
// tslint:disable: no-submodule-imports use-simple-attributes

import { BchatJoinableRooms } from './BchatJoinableDefaultRooms';
import { BchatIdEditable } from '../../basic/BchatIdEditable';
import { BchatSpinner } from '../../basic/BchatSpinner';
import { useDispatch, useSelector } from 'react-redux';
import { getTheme } from '../../../state/selectors/theme';
import { BchatIcon } from '../../icon';
import { setOverlayMode, showLeftPaneSection } from '../../../state/ducks/section';
import { joinOpenGroupV2WithUIEvents } from '../../../bchat/apis/open_group_api/opengroupV2/JoinOpenGroupV2';
import { openGroupV2CompleteURLRegex } from '../../../bchat/apis/open_group_api/utils/OpenGroupUtils';
import { ToastUtils } from '../../../bchat/utils';
import useKey from 'react-use/lib/useKey';
import styled from 'styled-components';
import { SpacerLG, SpacerSM, SpacerXS } from '../../basic/Text';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../../basic/BchatButton';

async function joinSocialGroup(serverUrl: string) {
  // guess if this is an open
  if (serverUrl.match(openGroupV2CompleteURLRegex)) {
    const groupCreated = await joinOpenGroupV2WithUIEvents(serverUrl, true, false);
    return groupCreated;
  } else {
    ToastUtils.pushToastError('invalidSocialGroupUrl', window.i18n('invalidSocialGroupUrl'));
    window.log.warn('Invalid opengroupv2 url');
    return false;
  }
}
const SocialGrpWrapper = styled.div`
  height: calc(100% - 115px);
  padding: 15px;
  overflow-y: auto;
`;
export const OverlayOpenGroup = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [groupUrl, setGroupUrl] = useState('');
  const isDark = useSelector(getTheme) === 'dark';

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
      const groupCreated = await joinSocialGroup(groupUrl);
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

  const title = window.i18n('joinSocialGroup');
  const buttonText = window.i18n('next');
  const subtitle = window.i18n('openSocialURL');
  const placeholder = window.i18n('enterAnSocialGroupURL');

  // dark theme (Figma 4:839 / 1:57355): back arrow + "Social Group" title, "Social Group URL" label,
  // one 404x80 "JOIN BY URL" field, grey hint, "or Join here" room tiles, NEXT pinned to the bottom.
  // Joining logic is the same as below.
  if (isDark) {
    return (
      <div className="module-left-pane-overlay social-group-overlay">
        <div className="social-group-overlay__header">
          <button
            type="button"
            className="social-group-overlay__back"
            aria-label={window.i18n('close')}
            onClick={closeOverlay}
          >
            <BchatIcon iconType="KeyboardBackspaceArrow" iconSize={28} iconColor="#ACACAC" flipInRtl={true} />
          </button>
          <span className="social-group-overlay__title">{window.i18n('socialGroup')}</span>
        </div>
        <div className="social-group-overlay__body">
          <div className="social-group-overlay__label">{subtitle}</div>
          <div className="create-group-name-input">
            <BchatIdEditable
              editable={true}
              placeholder={window.i18n('joinByUrl')}
              value={groupUrl}
              isGroup={true}
              maxLength={300}
              onChange={setGroupUrl}
              onPressEnter={onEnterPressed}
            />
          </div>
          <div className="social-group-overlay__hint">{window.i18n('socialGroupDescription')}</div>
          <BchatSpinner loading={loading} />
          <BchatJoinableRooms onRoomClicked={closeOverlay} />
        </div>
        <div className="buttonBox">
          <BchatButton
            buttonColor={BchatButtonColor.Primary}
            buttonType={BchatButtonType.Brand}
            text={buttonText}
            dataTestId="next-button"
            onClick={onEnterPressed}
            disabled={!groupUrl.startsWith('http://social.beldex.io/')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="module-left-pane-overlay">
      <SocialGrpWrapper>
        <SpacerLG />
        <div className="module-left-pane-overlay-closed--header">{title}</div>
        <SpacerLG />
        <div className="module-left-pane-overlay-closed--subHeader">{subtitle}</div>
        <SpacerXS />

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
        <SpacerSM />
        <div className="module-left-pane-overlay-openhint-message">
          {window.i18n('socialGroupDescription')}
        </div>

        <BchatSpinner loading={loading} />
        <BchatJoinableRooms onRoomClicked={closeOverlay} />
      </SocialGrpWrapper>
      <div className="buttonBox">
          <BchatButton
            buttonColor={BchatButtonColor.Primary}
            buttonType={BchatButtonType.Brand}
            text={buttonText}
            dataTestId="next-button"
            onClick={onEnterPressed}
            disabled={!groupUrl.startsWith('http://social.beldex.io/')}
          />
        </div>
    </div>
  );
};
