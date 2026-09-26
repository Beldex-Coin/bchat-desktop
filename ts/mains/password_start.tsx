import { createRoot, Root } from "react-dom/client";
import { BchatPasswordPrompt } from "../components/BchatPasswordPrompt";
import { applyDocumentDirection } from '../util/applyDocumentDirection';

let root: Root | null = null;

const container = document.getElementById("root");

if (!container) {
  console.error("Root container not found");
} else {
  applyDocumentDirection(window.i18n.getLocale());
  root = createRoot(container);
  root.render(<BchatPasswordPrompt />);
}
