
import { BchatVariableTypes } from './bchatVariableTypes';

export function switchBchatTheme(colors: BchatVariableTypes) {
  const root = document.documentElement;
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}
