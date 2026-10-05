import { RefObject, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { OverlayMode, SectionType, setOverlayMode, showLeftPaneSection } from '../../state/ducks/section';
import { closeRightPanel } from '../../state/ducks/conversations';
import { BchatIcon } from '../icon';
import NewChatIcon from '../icon/NewChatIcon';
import SecretGrpIcon from '../icon/SecretGrpIcon';
import SocialGrpIcon from '../icon/SocialGrpIcon';

/**
 * Dark theme: New Chat / Secret Group / Social Group menu (Figma 234:248).
 * Used by the Chats button in the left rail; the "+" in the Chats header opens New Chat directly.
 */

/** Close an open popup on an outside mouse-down or Escape. */
export function useDismissOnOutside(
  open: boolean,
  setOpen: (open: boolean) => void,
  ref: RefObject<HTMLElement>
) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, setOpen, ref]);
}

/** The three entries; each opens its overlay in the left pane. */
export const NewChatMenuList = (props: { onPicked: () => void; className?: string }) => {
  const dispatch = useDispatch();

  const openOverlay = (section: SectionType, mode: OverlayMode) => {
    props.onPicked();
    dispatch(closeRightPanel());
    dispatch(showLeftPaneSection(section));
    dispatch(setOverlayMode(mode));
  };

  return (
    <div className={classNames('new-chat-launcher__menu', props.className)} role="menu">
      <button
        type="button"
        role="menuitem"
        className="new-chat-launcher__item"
        onClick={() => openOverlay(SectionType.NewChat, 'message')}
      >
        <NewChatIcon />
        {window.i18n('newChat')}
      </button>
      <button
        type="button"
        role="menuitem"
        className="new-chat-launcher__item"
        onClick={() => openOverlay(SectionType.Closedgroup, 'closed-group')}
      >
        <SecretGrpIcon />
        {window.i18n('secretGroup')}
      </button>
      <button
        type="button"
        role="menuitem"
        className="new-chat-launcher__item"
        onClick={() => openOverlay(SectionType.Opengroup, 'open-group')}
      >
        <SocialGrpIcon />
        {window.i18n('socialGroup')}
      </button>
    </div>
  );
};

/** "+" button in the Chats header: opens the New Chat page directly (no menu). */
export const NewChatMenu = () => {
  const dispatch = useDispatch();

  const openNewChat = () => {
    dispatch(closeRightPanel());
    dispatch(showLeftPaneSection(SectionType.NewChat));
    dispatch(setOverlayMode('message'));
  };

  return (
    <div className="new-chat-launcher">
      <button
        type="button"
        className="new-chat-launcher__button"
        aria-label={window.i18n('newChat')}
        title={window.i18n('newChat')}
        onClick={openNewChat}
      >
        <BchatIcon iconType="newChat" iconSize={22} iconColor="#EBEBEB" />
      </button>
    </div>
  );
};
