import { useEffect, useRef } from 'react';

// Enter does a screen's / popup's main action (Save, OK) like a click on its main button.
// - not while typing in a text box (it has its own Enter) or with Shift / Alt held, nor on key repeat
// - `skipWhenPopupOpen`: for a screen (not a popup) - Enter belongs to a popup open over it
export const useEnterKey = (
  handler: () => void,
  { enabled = true, skipWhenPopupOpen = false }: { enabled?: boolean; skipWhenPopupOpen?: boolean } = {}
) => {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || e.repeat || e.isComposing || e.shiftKey || e.altKey || e.defaultPrevented) {
        return;
      }
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
      ) {
        return;
      }
      if (skipWhenPopupOpen && document.querySelector('.bchat-dialog.modal')) {
        return;
      }
      e.preventDefault();
      handlerRef.current();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [enabled, skipWhenPopupOpen]);
};
