import { getLocaleDirection } from './localeDirection';

export function applyDocumentDirection(locale: string | undefined): void {
  const dir = getLocaleDirection(locale);
  document.documentElement.dir = dir;
  document.documentElement.lang = (locale || 'en').replace('_', '-');
  document.body?.classList.toggle('rtl', dir === 'rtl');
}
