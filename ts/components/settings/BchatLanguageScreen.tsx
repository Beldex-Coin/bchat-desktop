import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { BchatIcon } from '../icon/BchatIcon';
import { Constants } from '../../bchat';
import { SpacerSM } from '../basic/Text';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';

const languageOptions = [
  { label: 'Arabic', code: 'ar' },
  { label: 'Chinese (Simplified)', code: 'zh_CN' },
  { label: 'English', code: 'en' },
  { label: 'German', code: 'de' },
  { label: 'Japanese', code: 'ja' },
  { label: 'Korean', code: 'ko' },
  { label: 'Portuguese (Brazil)', code: 'pt_BR' },
  { label: 'Russian', code: 'ru' },
  { label: 'Spanish', code: 'es' },
  { label: 'Turkish', code: 'tr' },
  { label: 'Vietnamese', code: 'vi' },
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
              <span className="language-text">{item.label}</span>
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