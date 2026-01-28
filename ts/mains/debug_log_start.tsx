import { createRoot } from "react-dom/client";
import { DebugLogView } from "../components/DebugLogView";

global.setTimeout(() => {
  const container = document.getElementById("root");

  if (!container) {
    console.error("Root container not found");
    return;
  }

  const root = createRoot(container);
  root.render(<DebugLogView />);
}, 1000);
