import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * Auto-hide the bottom nav Facebook-style on scrollable screens.
 * - Hides on scroll DOWN, reveals on scroll UP or after ~300ms idle.
 * - Never hides on the Swipe tab ("/").
 * - Chat threads are handled separately in AppLayout (full hide).
 * Uses a single passive capture-phase scroll listener on window so it works
 * for any inner scroll container inside an Android WebView without layout jumps.
 */
export function useScrollHideNav() {
  const location = useLocation();
  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef(0);
  const timer = useRef(null);

  useEffect(() => {
    const path = location.pathname;
    // Swipe tab keeps the nav fixed.
    if (path === "/") {
      lastScroll.current = 0;
      setHidden(false);
      return;
    }
    // Chat threads hide fully via AppLayout route logic; no scroll listener.
    if (/^\/chat\/[^/]+$/.test(path)) {
      lastScroll.current = 0;
      setHidden(false);
      return;
    }

    const onScroll = (e) => {
      const el = e.target;
      if (!el || !(el instanceof HTMLElement)) return;
      const top = el.scrollTop;
      const delta = top - lastScroll.current;
      lastScroll.current = top;

      if (top <= 0) {
        setHidden(false);
        return;
      }
      if (Math.abs(delta) < 8) return;

      clearTimeout(timer.current);
      if (delta > 0) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      timer.current = setTimeout(() => setHidden(false), 300);
    };

    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true });
      clearTimeout(timer.current);
    };
  }, [location.pathname]);

  return hidden;
}