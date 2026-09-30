import React, { useLayoutEffect } from 'react';
import { BchatGlobalStyles } from './globals';
import { switchBchatTheme } from './switchTheme';
import { BCHAT_CLASSIC_DARK_COLORS } from './classicDark';
import { BCHAT_CLASSIC_LIGHT_COLORS } from './classicLight';

type Props = {
  children: React.ReactNode | React.ReactNode[];
  mode: 'light' | 'dark';
};

export const BchatTheme: React.FC<Props> = ({ children, mode = 'dark' }) => {
  const darkMode = mode === 'dark';
  // layout effect: applied before the browser paints, so a theme switch never shows a mixed frame
  useLayoutEffect(() => {
    if (darkMode) {
      switchBchatTheme(BCHAT_CLASSIC_DARK_COLORS);
    } else {
      switchBchatTheme(BCHAT_CLASSIC_LIGHT_COLORS);
    }
    // Colours come through the CSS variables above, but the 2026 dark design also changes fonts and
    // shapes (square corners, new typefaces) for the dark theme only - those rules live in
    // stylesheets/_dark_overrides.scss and key off this attribute, so light theme is untouched.
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <>
      <BchatGlobalStyles />
      {children}
    </>
  );
};
