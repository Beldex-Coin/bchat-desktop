
const preferredRegion: Record<string, string> = {
  en: 'en-US',
  pt: 'pt-BR',
};

export const resolveSpellCheckerLanguages = (
  available: Array<string>,
  appLocale: string
): Array<string> => {
  const wanted = (appLocale || '').replace(/_/g, '-').toLowerCase();
  if (!wanted) {
    return [];
  }

  const base = wanted.split('-')[0];
  const findAvailable = (tag: string) => available.find(a => a.toLowerCase() === tag.toLowerCase());

  // Most specific first: the exact tag, then our preferred region, then the bare code.
  const match = [wanted, preferredRegion[base], base]
    .filter(Boolean)
    .map(candidate => findAvailable(candidate))
    .find(Boolean);
  if (match) {
    return [match];
  }

  // Last resort: any region of the right language beats no spellchecking at all.
  const regional = available.find(a => a.toLowerCase().startsWith(`${base}-`));

  return regional ? [regional] : [];
};
