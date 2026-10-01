import React, { useState } from 'react';
import classNames from 'classnames';
import { BchatIcon } from '../icon/BchatIcon';
import { Constants } from '../../bchat';
import { SpacerSM } from '../basic/Text';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { updateConfirmModal } from '../../state/ducks/modalDialog';
import { appLanguages } from '../../node/app_languages';

export const BchatLanguageScreen = () => {
  const currentLocale = window.i18n.getLocale() || 'en';
  const [select, setSelect] = useState<string>(currentLocale);

  const handleSave = () => {
    const locale = select || 'en';
    window.inboxStore?.dispatch(
      updateConfirmModal({
        title: window.i18n('languagesSettingsTitle'),
        message: window.i18n('spellCheckDirty'),
        okText: window.i18n('autoUpdateRestartButtonLabel'),
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
    <div className="bchat-language-screen-wrapper">
      <div className="bchat-language-screen">
        <div className="bchat-language-list">
          {appLanguages.map((item, i) => (
            <React.Fragment key={item.code || i}>
              <div
                className={classNames('bchat-language-row', select === item.code && 'isSelect')}
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
                <div>
                  <div className="language-text">{item.nativeName}</div>
                  <div className="language-subtext">{item.englishName}</div>
                </div>
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
            disabled={select === currentLocale}
            text={window.i18n('save')}
            dataTestId="accept-message-request"
          />
        </div>
      </div>
    </div>
  );
};

export default BchatLanguageScreen;
