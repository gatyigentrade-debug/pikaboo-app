import { useEffect, useState } from "react";

// Ignore small visual-viewport changes (browser toolbars collapsing) — a real
// on-screen keyboard always covers far more than this.
const KEYBOARD_THRESHOLD = 120;

/**
 * Height in px of the on-screen keyboard currently covering the page, or 0 when
 * it is closed. Feed it into bottom padding so focused inputs and submit
 * buttons can always be scrolled clear of the keyboard.
 */
export default function useKeyboardInset() {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const vv = typeof window !== "undefined" ? window.visualViewport : null;
    if (!vv) return undefined;

    const update = () => {
      const overlap = window.innerHeight - vv.height - vv.offsetTop;
      setInset(overlap > KEYBOARD_THRESHOLD ? Math.round(overlap) : 0);
    };

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  return inset;
}