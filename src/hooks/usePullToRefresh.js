import { useEffect, useRef, useState } from "react";

/**
 * usePullToRefresh
 * Attaches touch listeners to a scrollable container ref.
 * Calls onRefresh() when the user pulls down ≥ threshold px from the top.
 * Returns { containerRef, isPulling, pullDistance, isRefreshing }
 */
export default function usePullToRefresh({ onRefresh, threshold = 72 }) {
  const containerRef = useRef(null);
  const startYRef    = useRef(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let pulling = false;

    const onTouchStart = (e) => {
      if (el.scrollTop === 0) {
        startYRef.current = e.touches[0].clientY;
        pulling = true;
      }
    };

    const onTouchMove = (e) => {
      if (!pulling) return;
      const delta = e.touches[0].clientY - startYRef.current;
      if (delta > 0) {
        // Dampen the pull
        setPullDistance(Math.min(delta * 0.45, threshold * 1.2));
      }
    };

    const onTouchEnd = async () => {
      if (!pulling) return;
      pulling = false;
      if (pullDistance >= threshold) {
        setIsRefreshing(true);
        setPullDistance(0);
        await onRefresh();
        setIsRefreshing(false);
      } else {
        setPullDistance(0);
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove",  onTouchMove,  { passive: true });
    el.addEventListener("touchend",   onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove",  onTouchMove);
      el.removeEventListener("touchend",   onTouchEnd);
    };
  }, [onRefresh, threshold, pullDistance]);

  return { containerRef, pullDistance, isRefreshing };
}