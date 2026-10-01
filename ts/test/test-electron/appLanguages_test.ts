import { assert } from 'chai';

import { resolveAppLocale } from '../../node/app_languages';

describe('resolveAppLocale', () => {
  it('matches a plain OS locale directly', () => {
    assert.equal(resolveAppLocale('ja'), 'ja');
    assert.equal(resolveAppLocale('ar'), 'ar');
  });

  it('matches our regional codes from BCP-47 tags', () => {
    assert.equal(resolveAppLocale('zh-CN'), 'zh_CN');
    assert.equal(resolveAppLocale('pt-BR'), 'pt_BR');
  });

  it('falls back to the bare language for other regions', () => {
    assert.equal(resolveAppLocale('ar-SA'), 'ar');
    assert.equal(resolveAppLocale('es-419'), 'es');
    assert.equal(resolveAppLocale('en-GB'), 'en');
  });

  it('does not swap in a different regional variant', () => {
    assert.equal(resolveAppLocale('zh-TW'), 'en');
    assert.equal(resolveAppLocale('pt-PT'), 'en');
  });

  it('uses English for unsupported or empty locales', () => {
    assert.equal(resolveAppLocale('fr-FR'), 'en');
    assert.equal(resolveAppLocale(''), 'en');
  });
});
