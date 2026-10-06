import { assert } from 'chai';

import { resolveSpellCheckerLanguages } from '../../node/spell_check_languages';

// A representative slice of what Chromium reports on Linux/Windows.
const AVAILABLE = [
  'af',
  'de',
  'en-AU',
  'en-CA',
  'en-GB',
  'en-US',
  'es',
  'ko',
  'pt-BR',
  'pt-PT',
  'ru',
  'tr',
  'vi',
];

describe('resolveSpellCheckerLanguages', () => {
  it('matches a plain app locale directly', () => {
    assert.deepEqual(resolveSpellCheckerLanguages(AVAILABLE, 'de'), ['de']);
    assert.deepEqual(resolveSpellCheckerLanguages(AVAILABLE, 'ru'), ['ru']);
    assert.deepEqual(resolveSpellCheckerLanguages(AVAILABLE, 'vi'), ['vi']);
  });

  it('converts our underscore locale names to BCP-47', () => {
    assert.deepEqual(resolveSpellCheckerLanguages(AVAILABLE, 'pt_BR'), ['pt-BR']);
  });

  it('prefers a sensible region when only regional dictionaries exist', () => {
    // 'en-AU' comes first alphabetically, but 'en-US' is the one we want.
    assert.deepEqual(resolveSpellCheckerLanguages(AVAILABLE, 'en'), ['en-US']);
  });

  it('falls back to any region of the same language', () => {
    assert.deepEqual(resolveSpellCheckerLanguages(['pt-PT'], 'pt_BR'), ['pt-PT']);
  });

  it('returns nothing for languages Chromium ships no dictionary for', () => {
    assert.deepEqual(resolveSpellCheckerLanguages(AVAILABLE, 'ja'), []);
    assert.deepEqual(resolveSpellCheckerLanguages(AVAILABLE, 'zh_CN'), []);
    assert.deepEqual(resolveSpellCheckerLanguages(AVAILABLE, 'ar'), []);
  });

  it('returns nothing when the spellchecker reports no languages at all', () => {
    assert.deepEqual(resolveSpellCheckerLanguages([], 'de'), []);
  });

  it('handles a missing or empty locale', () => {
    assert.deepEqual(resolveSpellCheckerLanguages(AVAILABLE, ''), []);
    assert.deepEqual(resolveSpellCheckerLanguages(AVAILABLE, undefined as any), []);
  });
});
