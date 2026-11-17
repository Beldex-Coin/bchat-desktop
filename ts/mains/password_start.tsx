import { createRoot, Root } from "react-dom/client";
import { BchatPasswordPrompt } from "../components/BchatPasswordPrompt";
import { applyDocumentDirection } from '../util/applyDocumentDirection';

let root: Root | null = null;

const container = document.getElementById("root");

if (!container) {
  console.error("Root container not found");
} else {
  applyDocumentDirection((window.i18n as any).getLocale());
  // This window has no BchatTheme wrapper and can't read the settings (the database is still locked),
  // so it follows the theme the app last showed: the main window keeps it in localStorage
  // ('bchat-theme', see ts/theme/BchatTheme.tsx), the same value the splash screen reads.
  let savedTheme: string | null = null;
  try {
    savedTheme = window.localStorage.getItem('bchat-theme');
  } catch (e) {
    savedTheme = null;
  }
  const theme = savedTheme || (window as any).theme;
  document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
  applyDocumentDirection(window.i18n.getLocale());
  root = createRoot(container);
  root.render(<BchatPasswordPrompt />);
}
