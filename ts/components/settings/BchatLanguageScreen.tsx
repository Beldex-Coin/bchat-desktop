import React, { useState } from 'react';
import classNames from 'classnames';
import { BchatIcon } from '../icon/BchatIcon';
import { Constants } from '../../bchat';
import { SpacerSM } from '../basic/Text';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { LocalizerKeys } from '../../types/LocalizerKeys';
import { updateConfirmModal } from '../../state/ducks/modalDialog';

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
  const currentLocale = window.i18n.getLocale() || 'en';
  const [select, setSelect] = useState<string>(currentLocale);

  const handleSave = () => {
    const locale = select || 'en';

    if (locale === currentLocale) {
      return;
    }
    window.inboxStore?.dispatch(
      updateConfirmModal({
        title: window.i18n('languagesSettingsTitle'),
        message: window.i18n('spellCheckDirty'),
        okText: window.i18n('continue'),
        okTheme: BchatButtonColor.Primary,
        cancelText: window.i18n('cancel'),
        onClickOk: () => {
          window.setAppLocale(locale);
          window.restart();
        },
      })
    );
  };

  return (
    <div className="bchat-language-screen">
      <div className="bchat-language-list">
        {languageOptions.map((item, i) => (
          <React.Fragment key={item.code || i}>
            <div
              className={classNames(
                'bchat-language-row',
                select === item.code && 'isSelect'
              )}
              onClick={() => setSelect(item.code)}
            >
              <div
                className={classNames(
                  'bchat-language-row__circle',
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