import { createRoot, Root } from "react-dom/client";
import { BchatPasswordPrompt } from "../components/BchatPasswordPrompt";
import { BCHAT_CLASSIC_DARK_COLORS } from "../theme/classicDark";
import { BCHAT_CLASSIC_LIGHT_COLORS } from "../theme/classicLight";
import { BCHAT_THEME_GLOBALS } from "../theme/globals";
import { switchBchatTheme } from "../theme/switchTheme";

// NOIR: the password window has no redux/theme provider — paint the theme
// tokens onto the document root directly, based on the theme passed by main.
const themeColors =
  (window as any).theme === "light" ? BCHAT_CLASSIC_LIGHT_COLORS : BCHAT_CLASSIC_DARK_COLORS;
switchBchatTheme(themeColors);
switchBchatTheme(BCHAT_THEME_GLOBALS as any);

let root: Root | null = null;

const container = document.getElementById("root");

if (!container) {
  console.error("Root container not found");
} else {
  root = createRoot(container);
  root.render(<BchatPasswordPrompt />);
}
