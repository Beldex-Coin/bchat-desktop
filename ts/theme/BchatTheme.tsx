import React, { useEffect } from 'react';
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
  useEffect(() => {
    if (darkMode) {
      switchBchatTheme(BCHAT_CLASSIC_DARK_COLORS);
    } else {
      switchBchatTheme(BCHAT_CLASSIC_LIGHT_COLORS);
    }
  }, [darkMode]);

  return (
    <>
      <BchatGlobalStyles />
      {children}
    </>
  );
};
