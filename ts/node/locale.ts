import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import { getAppRootPath } from './getRootPath';

function getLocaleMessagesPath(locale: string) {
  const onDiskLocale = locale.replace('-', '_');
  return path.join(getAppRootPath(), '_locales', onDiskLocale, 'messages.json');
}

function normalizeLocaleName(locale: string) {
  if (/^en-/.test(locale)) {
    return 'en';
  }

const baseLocale = locale.split(/[-_]/)[0];
  if (
    !fs.existsSync(getLocaleMessagesPath(locale)) &&
    fs.existsSync(getLocaleMessagesPath(baseLocale))
  ) {
    return baseLocale;
  }

  return locale;
}

function getLocaleMessages(locale: string): LocaleMessagesType {
  return JSON.parse(fs.readFileSync(getLocaleMessagesPath(locale), 'utf-8'));
}
export type LocaleMessagesType = Record<string, string>;
export type LocaleMessagesWithNameType = { messages: LocaleMessagesType; name: string };

export function load({
  appLocale,
  logger,
}: { appLocale?: string; logger?: any } = {}): LocaleMessagesWithNameType {
  if (!appLocale) {
    throw new TypeError('`appLocale` is required');
  }

  if (!logger || !logger.error) {
    throw new TypeError('`logger.error` is required');
  }

  const english = getLocaleMessages('en');

  // Load locale - if we can't load messages for the current locale, we
  // default to 'en'
  //
  // possible locales:
  // https://github.com/electron/electron/blob/master/docs/api/locales.md
  let localeName = normalizeLocaleName(appLocale);
  let messages;

  try {
    messages = getLocaleMessages(localeName);

    // We start with english, then overwrite that with anything present in locale
    messages = _.merge(english, messages);
  } catch (e) {
    logger.error(`Problem loading messages for locale ${localeName} ${e.stack}`);
    logger.error('Falling back to en locale');

    localeName = 'en';
    messages = english;
  }

  return {
    name: localeName,
    messages,
  };
}
