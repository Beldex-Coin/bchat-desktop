import { assert } from 'chai';

import { applyDocumentDirection } from '../../util/applyDocumentDirection';
import { getLocaleDirection, isRtlLocale } from '../../util/localeDirection';

describe('localeDirection', () => {
  it('treats Arabic, Persian and Hebrew as RTL', () => {
    assert.isTrue(isRtlLocale('ar'));
    assert.isTrue(isRtlLocale('fa'));
    assert.isTrue(isRtlLocale('he'));
  });

  it('handles region suffixes and hyphen/underscore forms', () => {
    assert.isTrue(isRtlLocale('ar_EG'));
    assert.isTrue(isRtlLocale('ar-SA'));
    assert.isTrue(isRtlLocale('AR'));
  });

  it('treats every picker language except Arabic as LTR', () => {
    ['en', 'zh_CN', 'de', 'ja', 'ko', 'pt_BR', 'ru', 'es', 'tr', 'vi'].forEach(loc => {
      assert.isFalse(isRtlLocale(loc), loc);
    });
  });

  it('falls back to LTR for empty or missing input', () => {
    assert.equal(getLocaleDirection(undefined), 'ltr');
    assert.equal(getLocaleDirection(''), 'ltr');
    assert.equal(getLocaleDirection('ar'), 'rtl');
  });
});

describe('applyDocumentDirection', () => {
  afterEach(() => applyDocumentDirection('en'));

  it('sets rtl on html and body for Arabic', () => {
    applyDocumentDirection('ar');
    assert.equal(document.documentElement.dir, 'rtl');
    assert.equal(document.documentElement.lang, 'ar');
    assert.isTrue(document.body.classList.contains('rtl'));
  });

  it('resets to ltr and removes body.rtl for English', () => {
    applyDocumentDirection('ar');
    applyDocumentDirection('en');
    assert.equal(document.documentElement.dir, 'ltr');
    assert.isFalse(document.body.classList.contains('rtl'));
  });

  it('writes a BCP-47 lang for underscore locales', () => {
    applyDocumentDirection('pt_BR');
    assert.equal(document.documentElement.lang, 'pt-BR');
  });
});
