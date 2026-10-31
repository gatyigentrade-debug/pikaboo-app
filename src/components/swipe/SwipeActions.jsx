import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Heart, RotateCcw, Zap } from "lucide-react";

const actions = [
  {
    id: "rewind",
    icon: RotateCcw,
    color: "text-amber",
    bg: "bg-amber/10 hover:bg-amber/20 border-amber/30",
    ring: "border-amber/40",
    size: "w-12 h-12",
    iconSize: "w-5 h-5",
  },
  {
    id: "dislike",
    icon: X,
    color: "text-rose-400",
    bg: "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30",
    ring: "border-rose-500/40",
    size: "w-16 h-16",
    iconSize: "w-7 h-7",
  },
  {
    id: "super_like",
    icon: Star,
    color: "text-sky-400",
    bg: "bg-sky-500/10 hover:bg-sky-500/20 border-sky-500/30",
    ring: "border-sky-500/40",
    glow: "0 0 18px rgba(56,189,248,0.3)",
    size: "w-12 h-12",
    iconSize: "w-5 h-5",
  },
  {
    id: "like",
    icon: Heart,
    color: "text-black",
    bg: "bg-gradient-to-br from-[#F3E5AB] to-[#D4AF37] hover:opacity-90 border-gold",
    ring: "border-gold/50",
    glow: "0 0 22px rgba(212,175,55,0.45)",
    fill: true,
    size: "w-16 h-16",
    iconSize: "w-7 h-7",
  },
  {
    id: "boost",
    icon: Zap,
    color: "text-violet",
    bg: "bg-violet/10 hover:bg-violet/20 border-violet/30",
    ring: "border-violet/40",
    size: "w-12 h-12",
    iconSize: "w-5 h-5",
  },
];

export default function SwipeActions({ onAction }) {
  const [pulseId, setPulseId] = useState(null);

  const handleClick = (action) => {
    setPulseId(action.id + Date.now());
    onAction(action.id);
  };

  return (
    <div className="flex items-center justify-center gap-3 py-4">
      {actions.map((action) => (
        <motion.button
          key={action.id}
          whileTap={{ scale: 0.82 }}
          whileHover={{ scale: 1.08 }}
          onClick={() => handleClick(action)}
          aria-label={action.id}
          className={`relative ${action.size} rounded-full border ${action.bg} flex items-center justify-center transition-all`}
          style={action.glow ? { boxShadow: action.glow } : undefined}
        >
          <AnimatePresence>
            {pulseId && pulseId.startsWith(action.id) && (
              <motion.span
                key={pulseId}
                initial={{ opacity: 0.6, scale: 1 }}
                animate={{ opacity: 0, scale: 1.9 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`absolute inset-0 rounded-full border-2 ${action.ring}`}
                onAnimationComplete={() => setPulseId(null)}
              />
            )}
          </AnimatePresence>
          <action.icon className={`${action.iconSize} ${action.color}`} {...(action.fill ? { fill: "currentColor" } : {})} />
        </motion.button>
      ))}
    </div>
  );
}