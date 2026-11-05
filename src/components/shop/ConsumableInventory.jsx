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
    { key: "super", icon: Heart, label: "Super Likes", value: String(superLikes), count: superLikes },
    { key: "unblur", icon: Eye, label: "Instant Unblurs", value: String(unblurs), count: unblurs },
    {
      key: "boost",
      icon: Zap,
      label: "Boost",
      value: boostActive ? formatCountdown(boostRemaining) : "Inactive",
      count: 0,
      active: boostActive,
    },
    {
      key: "spotlight",
      icon: Sparkles,
      label: "Sunday Spotlight",
      value: spotlightActive ? formatCountdown(spotlightRemaining) : "Inactive",
      count: 0,
      active: spotlightActive,
    },
  ];

  return (
    <div className="mb-4 space-y-2">
      <p className="text-xs font-heading font-bold text-gold uppercase tracking-wider">
        Your Power-Ups
      </p>
      {items.map((it) => {
        const Icon = it.icon;
        const owned = it.count > 0;
        const statusPill = it.active
          ? "bg-gold/15 border border-gold/40 text-gold"
          : owned
            ? "bg-foreground/10 border border-white/10 text-foreground"
            : "bg-secondary border border-white/5 text-muted-foreground";
        return (
          <div
            key={it.key}
            className="flex items-center gap-3 rounded-2xl bg-secondary/40 border border-white/5 px-3 py-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-heading font-bold text-foreground">{it.label}</p>
              <p className="text-xs text-muted-foreground font-body mt-0.5">
                {it.active ? "Active now" : owned ? "Ready to use" : "Not owned yet"}
              </p>
            </div>
            <span
              className={`flex-shrink-0 min-h-[34px] px-3 py-1.5 rounded-full text-sm font-heading font-bold flex items-center justify-center ${statusPill}`}
            >
              {it.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}