import { assert } from 'chai';
import { flushSync } from 'react-dom';
import { createRoot, Root } from 'react-dom/client';
import { Item, Menu, Submenu } from 'react-contexify';

import { showContextMenu } from '../../util/showContextMenu';

// jsdom has no layout: give menus a fixed width and a known window size.
const MENU_WIDTH = 200;
const WINDOW_WIDTH = 1000;

describe('showContextMenu', () => {
  let container: HTMLDivElement;
  let root: Root;
  let offsetWidth: PropertyDescriptor | undefined;
  let innerWidth: PropertyDescriptor | undefined;
  let getRect: typeof Element.prototype.getBoundingClientRect;

  beforeEach(() => {
    offsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
    innerWidth = Object.getOwnPropertyDescriptor(window, 'innerWidth');
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get() {
        return (this as HTMLElement).classList.contains('contexify') ? MENU_WIDTH : 0;
      },
    });
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: WINDOW_WIDTH });
    // a menu item spans its menu, which sits at its inline `left`
    getRect = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = function() {
      const left = parseInt((this.closest('.contexify') as HTMLElement | null)?.style.left || '0', 10);
      return { left, right: left + MENU_WIDTH, top: 0, bottom: 0, width: MENU_WIDTH, height: 0 } as DOMRect;
    };

    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    flushSync(() => {
      root.render(
        <Menu id="test-menu" animation="fade">
          <Submenu label="more">
            <Item>inner</Item>
          </Submenu>
          <Item>item</Item>
        </Menu>
      );
    });
  });

  afterEach(() => {
    flushSync(() => root.unmount());
    container.remove();
    document.documentElement.removeAttribute('dir');
    Element.prototype.getBoundingClientRect = getRect;
    if (offsetWidth) {
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', offsetWidth);
    }
    if (innerWidth) {
      Object.defineProperty(window, 'innerWidth', innerWidth);
    } else {
      delete (window as any).innerWidth;
    }
  });

  const show = (clientX: number) =>
    showContextMenu({
      id: 'test-menu',
      event: { clientX, clientY: 100, preventDefault: () => undefined, stopPropagation: () => undefined } as any,
    });
  const menu = () => container.querySelector<HTMLElement>('.contexify:not(.contexify_submenu)')!;
  const submenu = () => container.querySelector<HTMLElement>('.contexify_submenu')!;

  it('keeps the menu left edge on the cursor in LTR', () => {
    show(600);
    assert.equal(menu().style.left, '600px');
  });

  it('puts the menu right edge on the cursor in RTL', () => {
    document.documentElement.dir = 'rtl';
    show(600);
    assert.equal(menu().style.left, `${600 - MENU_WIDTH}px`);
    assert.equal(menu().style.top, '100px');
  });

  it('keeps the menu on screen when the cursor is near the left edge in RTL', () => {
    document.documentElement.dir = 'rtl';
    show(50);
    assert.equal(menu().style.left, '0px');
  });

  it('opens submenus to the right in RTL only when there is no room on the left', () => {
    document.documentElement.dir = 'rtl';
    show(600);
    assert.isFalse(submenu().classList.contains('contexify_submenu-inline-end'));

    show(50);
    assert.isTrue(submenu().classList.contains('contexify_submenu-inline-end'));
  });
});
