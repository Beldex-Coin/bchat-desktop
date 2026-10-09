import _ from 'lodash';

const NAME_MARK = '';

// A quoted phrase. Neither mark may touch a Latin letter on its outer side, so the apostrophe in
// "l'autorizzazione" or "Ayarları'nda" is not taken for a quote; CJK text (no spaces) still matches.
const QUOTED = /()(?<![A-Za-z\u00C0-\u024F])(['"‘“„«「])([^'"‘’“”„«»「」]+)(['"’”»」])(?![A-Za-z\u00C0-\u024F])/g;

/**
 * "Call missed from 'name' because you need to enable the 'Voice and video calls' permission in
 * the Privacy Settings." as HTML for the Call Missed popup (Figma 5296:13196): the caller's name
 * marked `missed-call__name`, the quoted permission name and "Privacy Settings" marked
 * `missed-call__em`. Only the dark theme styles these classes. Every piece of text is escaped,
 * the display name included.
 */
export function missedCallPermissionHtml(displayName: string): string {
  const raw = window.i18n('callMissedCausePermission', [NAME_MARK]);
  const name = `<span class="missed-call__name">${_.escape(displayName)}</span>`;
  const em = (text: string) => `<span class="missed-call__em">${_.escape(text)}</span>`;
  const plain = (text: string) =>
    _.escape(text)
      .replace(NAME_MARK, name)
      .replace(/Privacy Settings/i, m => em(m));

  let html = '';
  let last = 0;
  raw.replace(QUOTED, (match, lead: string, open: string, inner: string, close: string, at: number) => {
    html += plain(raw.slice(last, at) + lead);
    html += _.escape(open);
    html += inner === NAME_MARK ? name : em(inner);
    html += _.escape(close);
    last = at + match.length;
    return match;
  });
  html += plain(raw.slice(last));
  return html;
}
