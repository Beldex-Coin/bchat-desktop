
import { BchatVariableTypes } from './bchatVariableTypes';

export function switchBchatTheme(colors: BchatVariableTypes | Record<string, string>) {
  const root = document.documentElement;
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}
