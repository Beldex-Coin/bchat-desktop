// The languages offered on the language settings screen. Other folders in _locales are only
// partially translated, so they are never picked automatically.
export const appLanguages: Array<{ englishName: string; code: string; nativeName: string }> = [
  { englishName: 'Arabic', code: 'ar', nativeName: 'العربية' },
  { englishName: 'Chinese (Simplified)', code: 'zh_CN', nativeName: '简体中文' },
  { englishName: 'English', code: 'en', nativeName: 'English' },
  { englishName: 'German', code: 'de', nativeName: 'Deutsch' },
  { englishName: 'Japanese', code: 'ja', nativeName: '日本語' },
  { englishName: 'Korean', code: 'ko', nativeName: '한국어' },
  { englishName: 'Portuguese (Brazil)', code: 'pt_BR', nativeName: 'Português (Brasil)' },
  { englishName: 'Russian', code: 'ru', nativeName: 'Русский' },
  { englishName: 'Spanish', code: 'es', nativeName: 'Español' },
  { englishName: 'Turkish', code: 'tr', nativeName: 'Türkçe' },
  { englishName: 'Vietnamese', code: 'vi', nativeName: 'Tiếng Việt' },
];

// Maps an OS locale such as 'ja-JP' or 'pt-BR' to one of our language codes, or English.
export const resolveAppLocale = (osLocale: string): string => {
  const wanted = (osLocale || '').replace(/-/g, '_').toLowerCase();
  const findLanguage = (tag: string) =>
    appLanguages.find(language => language.code.toLowerCase() === tag);

  // Exact tag first ('zh_CN', 'pt_BR'), then the bare language ('ar_SA' -> 'ar').
  // Regional codes never match on language alone, so 'zh-TW' and 'pt-PT' stay English
  // rather than getting Simplified Chinese or Brazilian Portuguese.
  const match = findLanguage(wanted) || findLanguage(wanted.split('_')[0]);

  return match ? match.code : 'en';
};
