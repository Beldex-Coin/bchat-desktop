import { createRoot, Root } from "react-dom/client";
import { BchatPasswordPrompt } from "../components/BchatPasswordPrompt";
import { applyDocumentDirection } from '../util/applyDocumentDirection';

let root: Root | null = null;

const container = document.getElementById("root");

if (!container) {
  console.error("Root container not found");
} else {
  applyDocumentDirection((window.i18n as any).getLocale());
  // The dark-theme styles are scoped to data-theme="dark"; this window has no BchatTheme wrapper.
  document.documentElement.setAttribute(
    'data-theme',
    (window as any).theme === 'light' ? 'light' : 'dark'
  );
  root = createRoot(container);
  root.render(<BchatPasswordPrompt />);
}
