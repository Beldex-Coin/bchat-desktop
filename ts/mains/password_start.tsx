import { createRoot, Root } from "react-dom/client";
import { BchatPasswordPrompt } from "../components/BchatPasswordPrompt";

let root: Root | null = null;

const container = document.getElementById("root");

if (!container) {
  console.error("Root container not found");
} else {
  root = createRoot(container);
  root.render(<BchatPasswordPrompt />);
}
