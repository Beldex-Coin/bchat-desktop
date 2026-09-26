import { createRoot } from "react-dom/client";
import { DebugLogView } from "../components/DebugLogView";
import { applyDocumentDirection } from '../util/applyDocumentDirection';

global.setTimeout(() => {
  const container = document.getElementById("root");

  if (!container) {
    console.error("Root container not found");
    return;
  }

  applyDocumentDirection(window.i18n.getLocale());
  const root = createRoot(container);
  root.render(<DebugLogView />);
}, 1000);
