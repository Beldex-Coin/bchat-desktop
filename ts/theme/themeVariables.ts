import { BCHAT_CLASSIC_DARK_COLORS } from './classicDark';
import { mapCssValueToWhite, PaletteColourKind } from './whitePalette';

// which part of the white map a variable takes: lines for borders / dividers / shadows, text for
// text and icon colours, fills for everything else
const kindFor = (name: string): PaletteColourKind => {
  if (/border|divider|shadow|outline/i.test(name)) {
    return 's';
  }
  if (/text|icon|caret|placeholder|hint|title|label|font/i.test(name)) {
    return 't';
  }
  return 'f';
};

/** the dark theme's CSS variables (the palette variables --pal-* come from the stylesheet) */
export const DARK_THEME_VARS: Record<string, string> = {
  ...(BCHAT_CLASSIC_DARK_COLORS as unknown as Record<string, string>),
};

/**
 * The white theme's CSS variables: the dark theme's, every colour mapped to the white design
 * (images keep their own swaps).
 */
export const WHITE_THEME_VARS: Record<string, string> = (() => {
  const vars: Record<string, string> = {};
  Object.entries(BCHAT_CLASSIC_DARK_COLORS as unknown as Record<string, string>).forEach(
    ([name, value]) => {
      vars[name] =
        typeof value === 'string' && !value.includes('url(')
          ? mapCssValueToWhite(value, kindFor(name))
          : value;
    }
  );
  return vars;
})();
