import { useState, useEffect } from "react";
import { Heart, Eye, Zap, Sparkles } from "lucide-react";
import { useConsumables } from "@/hooks/useConsumables";

function formatCountdown(ms) {
  if (ms <= 0) return "0:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Compact inventory bar showing current consumable counts and live
 * Boost / Spotlight timers. Re-renders every second while a timer is active.
 */
export default function ConsumableInventory() {
  const {
    superLikes,
    unblurs,
    boostActive,
    boostActiveUntil,
    spotlightActive,
    spotlightActiveUntil,
  } = useConsumables();

  const hasActiveTimer = boostActive || spotlightActive;
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!hasActiveTimer) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [hasActiveTimer]);

  const now = Date.now();
  const boostRemaining = boostActive ? new Date(boostActiveUntil).getTime() - now : 0;
  const spotlightRemaining = spotlightActive ? new Date(spotlightActiveUntil).getTime() - now : 0;

  const items = [
    { key: "super", icon: Heart, label: "Super Likes", value: String(superLikes), count: superLikes, color: "text-pink-400", bg: "bg-pink-500/10" },
    { key: "unblur", icon: Eye, label: "Instant Unblurs", value: String(unblurs), count: unblurs, color: "text-teal-400", bg: "bg-teal-500/10" },
    {
      key: "boost",
      icon: Zap,
      label: "Friday Night Boost",
      value: boostActive ? formatCountdown(boostRemaining) : "Inactive",
      count: 0,
      color: "text-gold",
      bg: "bg-gold/15",
      active: boostActive,
    },
    {
      key: "spotlight",
      icon: Sparkles,
      label: "Sunday Spotlight",
      value: spotlightActive ? formatCountdown(spotlightRemaining) : "Inactive",
      count: 0,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      active: spotlightActive,
    },
  ];

  return (
    <div className="mb-4 space-y-2">
      <p className="text-[11px] font-heading font-bold text-gold uppercase tracking-wider">
        Your Power-Ups
      </p>
      {items.map((it) => {
        const Icon = it.icon;
        const owned = it.count > 0;
        const statusPill = it.active
          ? "bg-gold/15 border border-gold/40 text-gold"
          : owned
            ? "bg-foreground/10 border border-border/60 text-foreground"
            : "bg-secondary border border-border/40 text-muted-foreground";
        return (
          <div
            key={it.key}
            className="flex items-center gap-3 rounded-2xl bg-secondary/30 border border-border/40 p-3"
          >
            <div className={`w-11 h-11 rounded-full ${it.bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${it.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-heading font-bold text-foreground">{it.label}</p>
              <p className="text-xs text-muted-foreground font-body mt-0.5">
                {it.active ? "Active now" : owned ? "Ready to use" : "Not owned yet"}
              </p>
            </div>
            <span
              className={`flex-shrink-0 min-h-[36px] px-3 py-1.5 rounded-full text-xs font-heading font-bold flex items-center justify-center ${statusPill}`}
            >
              {it.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}