const RTL_LANGUAGES = ['ar', 'fa', 'he'];

export function isRtlLocale(locale: string | undefined): boolean {
  if (!locale) {
    return false;
  }
  const language = locale.toLowerCase().split(/[-_]/)[0];
  return RTL_LANGUAGES.includes(language);
}

export function getLocaleDirection(locale: string | undefined): 'rtl' | 'ltr' {
  return isRtlLocale(locale) ? 'rtl' : 'ltr';
}
