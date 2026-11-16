/**
 * The 2026 design's white theme: every colour of the dark design mapped to its white-design
 * counterpart. Generated from the same table as the SCSS map in stylesheets/_dark_overrides.scss
 * (paired Figma frames: the dark colour of a layer -> the colour of the same layer in the white
 * frame) - keep the two in step.
 *
 * kind: 'f' fills / backgrounds (default), 't' text and icons, 's' borders / hairlines / shadows.
 */
export type PaletteColourKind = 'f' | 't' | 's';

const WHITE: Record<string, string> = {
  '#000000': '#ffffff',
  '#0a0a0a': '#f0f0f0',
  '#0b0b0b': '#f0f0f0',
  '#0e0e0e': '#f4f4f4',
  '#111111': '#ffffff',
  '#121212': '#f6f6f6',
  '#141414': '#ffffff',
  '#161616': '#f4f4f4',
  '#1a1a1a': '#ffffff',
  '#1b1b1b': '#ffffff',
  '#1f1f1f': '#e6e6e6',
  '#202020': '#f0f0f0',
  '#222222': '#ebebeb',
  '#242424': '#ebebeb',
  '#262626': '#e8e8e8',
  '#272727': '#e6e6e6',
  '#282828': '#e4e4e4',
  '#2a2a2a': '#dddddd',
  '#2c2c2c': '#e1e1e1',
  '#303030': '#dddddd',
  '#323232': '#dddddd',
  '#333333': '#e1e1e1',
  '#444444': '#c4c4c4',
  '#555555': '#a8a8a8',
  '#565656': '#a0a0a0',
  '#666666': '#999999',
  '#696969': '#969696',
  '#737373': '#8d8d8d',
  '#757575': '#8d8d8d',
  '#8d8d8d': '#737373',
  '#8f8f8f': '#717171',
  '#acacac': '#555555',
  '#cccccc': '#222222',
  '#d0d0d0': '#333333',
  '#d6d6d6': '#333333',
  '#d9d9d9': '#0b0b0b',
  '#dcdcdc': '#2a2a2a',
  '#e9e9e9': '#222222',
  '#ebebeb': '#222222',
  '#f0f0f0': '#1a1a1a',
  '#f4f4f4': '#222222',
  '#ffffff': '#222222',
  '#00bc33': '#078720',
  '#1bb51e': '#078720',
  '#179a19': '#05701a',
  '#0b9e3c': '#078720',
  '#00d53a': '#078720',
  '#00a638': '#078720',
  '#00d239': '#078720',
  '#00bd40': '#078720',
  '#2ebc4f': '#078720',
  '#078720': '#078720',
  '#00862a': '#06701b',
  '#056520': '#c1e1c7',
  '#006c1d': '#c1e1c7',
  '#0b6b1d': '#c1e1c7',
  '#005417': '#078720',
  '#003200': '#77bd84',
  '#003a00': '#77bd84',
  '#011701': '#ffffff',
  '#012801': '#eef7f0',
  '#031203': '#d8ecdc',
  '#041504': '#e2ffe8',
  '#061306': '#ffffff',
  '#071407': '#ebffef',
  '#08110a': '#f4fff6',
  '#0a1f0c': '#e2ffe8',
  '#0b1f0b': '#e2ffe8',
  '#0b2e0b': '#d8ecdc',
  '#0c150c': '#e2ffe8',
  '#0a240a': '#ebffef',
  '#0c170c': '#f4fff6',
  '#ff3e3e': '#ff3e3e',
  '#290f0f': '#ffffff',
  '#2a0c0c': '#fff3f3',
  '#3a1010': '#ffe5e5',
  '#3a1212': '#ffe5e5',
  '#6b1b1b': '#ffcfcf',
  '#6b2020': '#ffcfcf',
  '#f0af13': '#f0af13',
  '#ff8a00': '#b87500',
  '#0f150f': '#f4fff6',
  '#131313': '#f4f4f4',
  '#f8f8f8': '#1a1a1a',
  '#e7b100': '#e7b100',
  '#646474': '#8d8d8d',
  '#39394a': '#dddddd',
  '#353543': '#e1e1e1',
  '#2879fb': '#2879fb',
  '#202329': '#f0f0f0',
  '#159b24': '#078720',
  '#13b71a': '#078720',
  '#108d32': '#078720',
  '#00a803': '#078720',
  '#006004': '#078720',
};
const WHITE_TEXT: Record<string, string> = {
  '#0b0b0b': '#ffffff',
  '#000000': '#ffffff',
  '#111111': '#ffffff',
  '#1a1a1a': '#ffffff',
  '#f4f4f4': '#222222',
};
const WHITE_LINE: Record<string, string> = {
  '#0b0b0b': '#f0f0f0',
  '#111111': '#ffffff',
  '#1a1a1a': '#ffffff',
  '#222222': '#e6e6e6',
  '#262626': '#e6e6e6',
  '#282828': '#e1e1e1',
  '#303030': '#dddddd',
  '#333333': '#dddddd',
  '#444444': '#d0d0d0',
  '#737373': '#8c8c8c',
  '#006c1d': '#078720',
  '#000000': '#000000',
};

const toHex6 = (hex: string) => {
  const h = hex.replace('#', '').toLowerCase();
  return `#${h.length === 3 ? h.split('').map(ch => ch + ch).join('') : h.slice(0, 6)}`;
};

/** a dark-design colour (#rgb / #rrggbb) in the white theme; unknown colours come back as they are */
export const toWhitePalette = (hex: string, kind: PaletteColourKind = 'f'): string => {
  const key = toHex6(hex);
  if (kind === 't' && WHITE_TEXT[key]) {
    return WHITE_TEXT[key];
  }
  if (kind === 's' && WHITE_LINE[key]) {
    return WHITE_LINE[key];
  }
  return WHITE[key] || hex;
};

const HEX = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;
const RGBA = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*[\d.]+\s*)?\)/g;
const hexOf = (r: string, g: string, b: string) =>
  `#${[r, g, b].map(v => Number(v).toString(16).padStart(2, '0')).join('')}`;

/** every colour inside a CSS value (gradients, borders, rgba...) mapped to the white theme */
export const mapCssValueToWhite = (value: string, kind: PaletteColourKind = 'f'): string =>
  value
    .replace(RGBA, (_m, r, g, b, a) => {
      const mapped = toWhitePalette(hexOf(r, g, b), kind).replace('#', '');
      const [mr, mg, mb] = [0, 2, 4].map(i => parseInt(mapped.slice(i, i + 2), 16));
      return a ? `rgba(${mr}, ${mg}, ${mb}${a})` : `rgb(${mr}, ${mg}, ${mb})`;
    })
    .replace(HEX, m => toWhitePalette(m, kind));

/** the palette colours as CSS variables (--pal-ebebeb ...), for inline colours in components */
export const PALETTE_COLOURS = Object.keys(WHITE);
