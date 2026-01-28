// bchat/globals.tsx
import { createGlobalStyle } from 'styled-components';

export type BchatThemeGlobals = {
  '--font-default': string;
  '--font-accent': string;
  '--font-mono': string;
  '--font-size-xs': string;
  '--font-size-sm': string;
  '--font-size-md': string;
  '--font-size-h1': string;
  '--font-size-h2': string;
  '--font-size-h3': string;
  '--font-size-h4': string;
  '--default-duration': string;
};

export const BCHAT_THEME_GLOBALS: BchatThemeGlobals = {
  '--font-default': 'Poppins',
  '--font-accent': 'Loor',
  '--font-mono': 'SpaceMono',
  '--font-size-xs': '11px',
  '--font-size-sm': '13px',
  '--font-size-md': '15px',
  '--font-size-h1': '30px',
  '--font-size-h2': '24px',
  '--font-size-h3': '20px',
  '--font-size-h4': '16px',
  '--default-duration': '0.25s',
  
};

export function declareCSSVariables(variables: Record<string, string>) {
  let output = '';
  for (const [key, value] of Object.entries(variables)) {
    output += `${key}: ${value};\n`;
  }
  return output;
}

export const BchatGlobalStyles = createGlobalStyle`
  html {
    ${() => declareCSSVariables(BCHAT_THEME_GLOBALS)}
  }
`;
