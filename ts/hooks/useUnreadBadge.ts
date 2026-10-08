import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getBadgeOverlayText } from '../node/unreadBadge';
import { getUnreadBadgeCount } from '../state/selectors/conversations';

// unread counts change in bursts while messages come in: only send the last one
const BADGE_UPDATE_DELAY_MS = 500;

/**
 * The Windows taskbar overlay icon: a red circle with the count. Drawn here, as the main process
 * has no canvas. Undefined when there's nothing to show.
 */
function drawBadgeOverlay(count: number): string | undefined {
  const text = getBadgeOverlayText(count);
  if (!text) {
    return undefined;
  }
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  if (!context) {
    return undefined;
  }
  context.fillStyle = '#E53935';
  context.beginPath();
  context.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
  context.fill();
  context.fillStyle = '#FFFFFF';
  context.font = `bold ${text.length > 1 ? 17 : 21}px sans-serif`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, size / 2, size / 2 + 1);

  return canvas.toDataURL('image/png');
}

/**
 * Keeps the unread badge on the app icon (dock, taskbar or launcher) in sync with the unread
 * messages. Use it once, in a component that's mounted while logged in.
 */
export function useUnreadBadge() {
  const count = useSelector(getUnreadBadgeCount);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const overlayDataUrl = window.platform === 'win32' ? drawBadgeOverlay(count) : undefined;
      window.setUnreadBadge?.(count, overlayDataUrl);
    }, BADGE_UPDATE_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [count]);
}
