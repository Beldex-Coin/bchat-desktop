/**
 * The number drawn on the Windows taskbar overlay icon: the count up to 9, then "9+".
 * Empty when there is nothing unread.
 */
export function getBadgeOverlayText(count: number): string {
  if (count <= 0) {
    return '';
  }
  return count > 9 ? '9+' : String(count);
}

type BadgeApp = {
  setBadgeCount: (count: number) => unknown;
  dock?: { setBadge: (text: string) => void };
};

type BadgeWindow = {
  setOverlayIcon: (overlay: any, description: string) => void;
};

/**
 * Shows `count` unread messages on the app icon, and clears it at 0:
 *  - macOS: the dock badge.
 *  - Windows: an overlay on the taskbar icon, drawn by the renderer (overlayDataUrl), as Windows
 *    has no badge with a number of its own.
 *  - Linux: the launcher badge, which only shows on desktops supporting it (Unity API).
 */
export function applyUnreadBadge({
  platform,
  count,
  overlayDataUrl,
  app,
  mainWindow,
  createImage,
}: {
  platform: string;
  count: number;
  overlayDataUrl?: string;
  app: BadgeApp;
  mainWindow: BadgeWindow | null;
  createImage: (dataUrl: string) => any;
}) {
  const safeCount = Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;

  if (platform === 'darwin') {
    app.dock?.setBadge(safeCount ? String(safeCount) : '');
    return;
  }
  if (platform === 'win32') {
    if (!mainWindow) {
      return;
    }
    if (safeCount && overlayDataUrl) {
      mainWindow.setOverlayIcon(createImage(overlayDataUrl), String(safeCount));
    } else {
      mainWindow.setOverlayIcon(null, '');
    }
    return;
  }
  app.setBadgeCount(safeCount);
}
