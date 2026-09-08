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
    { key: "super", icon: Heart, label: "Super Likes", value: String(superLikes), color: "text-pink-400", bg: "bg-pink-500/10" },
    { key: "unblur", icon: Eye, label: "Unblurs", value: String(unblurs), color: "text-teal-400", bg: "bg-teal-500/10" },
    {
      key: "boost",
      icon: Zap,
      label: "Boost",
      value: boostActive ? formatCountdown(boostRemaining) : "—",
      color: "text-gold",
      bg: "bg-gold/10",
      active: boostActive,
    },
    {
      key: "spotlight",
      icon: Sparkles,
      label: "Spotlight",
      value: spotlightActive ? formatCountdown(spotlightRemaining) : "—",
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      active: spotlightActive,
    },
  ];

  return (
    <div className="mb-4 rounded-2xl border border-gold/30 bg-secondary/60 p-3">
      <p className="text-[11px] font-heading font-bold text-gold uppercase tracking-wider mb-2">
        Your Power-Ups
      </p>
      <div className="grid grid-cols-4 gap-2">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div
              key={it.key}
              className="rounded-xl bg-background/60 border border-border/60 p-2 flex flex-col items-center justify-center text-center min-h-[68px]"
            >
              <div className={`w-8 h-8 rounded-full ${it.bg} flex items-center justify-center mb-1`}>
                <Icon className={`w-4 h-4 ${it.color}`} />
              </div>
              <span className="text-[10px] font-body text-muted-foreground leading-none mb-0.5">
                {it.label}
              </span>
              <span
                className={`text-sm font-heading font-bold leading-tight ${
                  it.active ? it.color : "text-foreground"
                }`}
              >
                {it.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}