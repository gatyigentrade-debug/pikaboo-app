import { RefreshCw } from "lucide-react";
import usePullToRefresh from "@/hooks/usePullToRefresh";

/**
 * Wrap any scrollable page with this component to get pull-to-refresh.
 * <PullToRefreshWrapper onRefresh={asyncFn} className="...">
 *   {children}
 * </PullToRefreshWrapper>
 */
export default function PullToRefreshWrapper({ onRefresh, children, className = "" }) {
  const { containerRef, pullDistance, isRefreshing } = usePullToRefresh({ onRefresh });

  return (
    <div ref={containerRef} className={`overflow-y-auto h-full ${className}`} style={{ WebkitOverflowScrolling: "touch" }}>
      {/* Pull indicator */}
      <div
        className="flex items-center justify-center overflow-hidden transition-all duration-200"
        style={{ height: isRefreshing ? 48 : pullDistance > 0 ? pullDistance : 0 }}
      >
        <RefreshCw
          className={`w-5 h-5 text-primary transition-transform ${isRefreshing ? "animate-spin" : ""}`}
          style={{ transform: `rotate(${(pullDistance / 72) * 180}deg)` }}
        />
      </div>
      {children}
    </div>
  );
}