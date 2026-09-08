import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { BchatIcon } from '../icon/BchatIcon';
import { Constants } from '../../bchat';
import { SpacerSM } from '../basic/Text';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { LocalizerKeys } from '../../types/LocalizerKeys';

const languageOptions: Array<{ labelKey: LocalizerKeys; code: string }> = [
  { labelKey: 'languageArabic', code: 'ar' },
  { labelKey: 'languageChineseSimplified', code: 'zh_CN' },
  { labelKey: 'languageEnglish', code: 'en' },
  { labelKey: 'languageGerman', code: 'de' },
  { labelKey: 'languageJapanese', code: 'ja' },
  { labelKey: 'languageKorean', code: 'ko' },
  { labelKey: 'languagePortugueseBrazil', code: 'pt_BR' },
  { labelKey: 'languageRussian', code: 'ru' },
  { labelKey: 'languageSpanish', code: 'es' },
  { labelKey: 'languageTurkish', code: 'tr' },
  { labelKey: 'languageVietnamese', code: 'vi' },
];

export const BchatLanguageScreen = () => {
  const currentLocale = (window as any)?.i18n?.getLocale?.() || 'en';
  const [select, setSelect] = useState<string>(currentLocale);
  const [, setLocaleRefresh] = useState(0);

  useEffect(() => {
    const handleLocaleChange = () => {
      setLocaleRefresh(prev => prev + 1);
    };

    window.addEventListener('app-locale-changed', handleLocaleChange);
    return () => {
      window.removeEventListener('app-locale-changed', handleLocaleChange);
    };
  }, []);

  const handleSave = () => {
    const locale = select || 'en';

    if ((window as any).setAppLocale) {
      (window as any).setAppLocale(locale);
    }
    if ((window as any).refreshAppLocale) {
      (window as any).refreshAppLocale();
    }

    window.dispatchEvent(new Event('app-locale-changed'));
  };

  return (
    <div className="bchat-language-screen">
      <div className="bchat-language-list">
        {languageOptions.map((item, i) => (
          <React.Fragment key={item.code || i}>
            <div
              className={classNames(
                'bchat-modal__centered-SettingMiniModalContent',
                select === item.code && 'isSelect'
              )}
              onClick={() => setSelect(item.code)}
            >
              <div
                className={classNames(
                  'bchat-modal__centered-SettingMiniModalContent-circle',
                  select === item.code && 'selected'
                )}
              >
                {select === item.code && (
                  <BchatIcon
                    iconType="circle"
                    iconSize={8}
                    iconColor={Constants?.UI?.COLORS?.GREEN || '#10b981'}
                  />
                )}
              </div>
              <span className="language-text">{window.i18n(item.labelKey)}</span>
            </div>
            <SpacerSM />
          </React.Fragment>
        ))}
      </div>
      
      <div className="bchat-language-footer">
        <BchatButton
                  buttonColor={BchatButtonColor.Primary}
                  buttonType={BchatButtonType.Brand}
                  onClick={handleSave}
                  text={window.i18n('save')}
                  dataTestId="accept-message-request"
                />
          
        
      </div>
    </div>
  );
};

export default BchatLanguageScreen;