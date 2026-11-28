// Puts the caret in a field as soon as it can take it: popups and screens often mount their field
// a little after they open (portals, animations, data still loading), and a single focus() at mount
// can come too early or be taken back by the click that opened them. Tries every 60ms, ~1s at most,
// and stops once the field has the focus. Returns a cancel function for effect cleanups.
export const focusSoon = (getTarget: () => HTMLElement | null | undefined, tries = 16) => {
  let left = tries;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const attempt = () => {
    const target = getTarget();
    if (target && document.activeElement !== target) {
      target.focus();
    }
    left -= 1;
    if (left > 0 && (!target || document.activeElement !== target)) {
      timer = setTimeout(attempt, 60);
    }
  };
  timer = setTimeout(attempt, 0);
  return () => {
    if (timer) {
      clearTimeout(timer);
    }
  };
};
