import React, { useLayoutEffect } from 'react';
import { BchatGlobalStyles } from './globals';
import { switchBchatTheme } from './switchTheme';
import { DARK_THEME_VARS, WHITE_THEME_VARS } from './themeVariables';

type Props = {
  children: React.ReactNode | React.ReactNode[];
  mode: 'light' | 'dark';
  /** false for a screen that forces a theme (registration is always dark): it mustn't overwrite
   * the user's theme that the splash and password screens read */
  remember?: boolean;
};

export const BchatTheme: React.FC<Props> = ({ children, mode = 'dark', remember = true }) => {
  const darkMode = mode === 'dark';
  // layout effect: applied before the browser paints, so a theme switch never shows a mixed frame
  useLayoutEffect(() => {
    // the 2026 design in both themes: the white theme's variables are the dark ones mapped to the
    // white design (ts/theme/themeVariables.ts); fonts, shapes and per-screen rules live in
    // stylesheets/_theme_rules.scss, compiled once per theme and keyed off data-theme
    switchBchatTheme(darkMode ? DARK_THEME_VARS : WHITE_THEME_VARS);
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    // read by the splash screen (background.html) and the password screen (password_start.tsx)
    // before the app has loaded its settings
    if (remember) {
      try {
        window.localStorage.setItem('bchat-theme', darkMode ? 'dark' : 'light');
      } catch (e) {
        // the splash falls back to the black animation
      }
    }
  }, [darkMode, remember]);

  return (
    <>
      <BchatGlobalStyles />
      {children}
    </>
  );
};
