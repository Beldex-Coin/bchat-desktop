import { contextMenu } from 'react-contexify';

type ShowParams = Parameters<typeof contextMenu.show>[0];

// Added to a submenu that has no room on its inline-start side (see _rtl.scss).
const SUBMENU_INLINE_END = 'contexify_submenu-inline-end';

/**
 * react-contexify always puts a menu's left edge on the anchor (the cursor, or `position`)
 * and only corrects overflow on the right. In RTL the menu must grow to the left instead:
 * its right edge sits on the anchor and it is kept inside the window on the left.
 *
 * contexify mounts the menu with flushSync, so it can be measured and moved right after
 * `show` returns, before anything is painted.
 */
export function showContextMenu(params: ShowParams): void {
  contextMenu.show(params);
  if (document.documentElement.dir !== 'rtl') {
    return;
  }

  const menu = getOpenedMenu();
  if (!menu) {
    return;
  }
  const anchor = params.position || getEventPoint(params.event);
  contextMenu.show({
    ...params,
    position: { x: Math.max(anchor.x - menu.offsetWidth, 0), y: anchor.y },
  });

  // Submenus open to the left in RTL; flip the ones that would leave the window.
  menu.querySelectorAll<HTMLElement>('.contexify_submenu').forEach(submenu => {
    const item = submenu.parentElement;
    const noRoom = !!item && item.getBoundingClientRect().left - submenu.offsetWidth < 0;
    submenu.classList.toggle(SUBMENU_INLINE_END, noRoom);
  });
}

// `show` hides every other menu first; a closing menu keeps a willLeave class until its
// exit animation ends, so the one just opened is the only top-level menu without it.
function getOpenedMenu(): HTMLElement | undefined {
  const opened = Array.from(
    document.querySelectorAll<HTMLElement>('.contexify:not(.contexify_submenu)')
  ).filter(el => !el.className.includes('contexify_willLeave-'));
  return opened.length === 1 ? opened[0] : undefined;
}

// Same point contexify reads from the trigger event.
function getEventPoint(event: ShowParams['event']): { x: number; y: number } {
  const e: any = (event as any).nativeEvent || event;
  const touch = e.changedTouches?.[0];
  return {
    x: Math.max((touch || e).clientX || 0, 0),
    y: Math.max((touch || e).clientY || 0, 0),
  };
}
