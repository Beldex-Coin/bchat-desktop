/**
 * The 2026 design (Figma Revamp_2026 for dark, Revamped_white_theme for white) is used by
 * both themes. Code that used to ask "is it the dark theme?" to choose the new layout over the
 * old light design asks this instead; the colours come from the theme (CSS variables and the
 * stylesheet's white pass), not from this check. The old light-design branches are no longer used.
 */
export const isNewDesign = (): boolean => true;
