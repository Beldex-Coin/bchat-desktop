import React, { useLayoutEffect } from 'react';
import { BchatGlobalStyles } from './globals';
import { switchBchatTheme } from './switchTheme';
import { DARK_THEME_VARS, WHITE_THEME_VARS } from './themeVariables';

type Props = {
  children: React.ReactNode | React.ReactNode[];
  mode: 'light' | 'dark';
};

export const BchatTheme: React.FC<Props> = ({ children, mode = 'dark' }) => {
  const darkMode = mode === 'dark';
  // layout effect: applied before the browser paints, so a theme switch never shows a mixed frame
  useLayoutEffect(() => {
    // the 2026 design in both themes: the white theme's variables are the dark ones mapped to the
    // white design (ts/theme/themeVariables.ts); fonts, shapes and per-screen rules live in
    // stylesheets/_theme_rules.scss, compiled once per theme and keyed off data-theme
    switchBchatTheme(darkMode ? DARK_THEME_VARS : WHITE_THEME_VARS);
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    // read by the splash screen (background.html) before the app has loaded its settings
    try {
      window.localStorage.setItem('bchat-theme', darkMode ? 'dark' : 'light');
    } catch (e) {
      // the splash falls back to the black animation
    }
  }, [darkMode]);

  return (
    <>
      <BchatGlobalStyles />
      {children}
    </>
  );
};
