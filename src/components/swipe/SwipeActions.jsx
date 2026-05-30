import { motion } from "framer-motion";
import { X, Star, Heart, RotateCcw, Zap } from "lucide-react";

const actions = [
  {
    id: "rewind",
    icon: RotateCcw,
    color: "text-amber",
    bg: "bg-amber/10 hover:bg-amber/20 border-amber/30",
    glow: "",
    size: "w-11 h-11",
    iconSize: "w-5 h-5",
  },
  {
    id: "dislike",
    icon: X,
    color: "text-destructive",
    bg: "bg-destructive/10 hover:bg-destructive/20 border-destructive/30",
    glow: "",
    size: "w-14 h-14",
    iconSize: "w-7 h-7",
  },
  {
    id: "super_like",
    icon: Star,
    color: "text-violet",
    bg: "bg-violet/10 hover:bg-violet/20 border-violet/30",
    glow: "glow-violet",
    size: "w-11 h-11",
    iconSize: "w-5 h-5",
  },
  {
    id: "like",
    icon: Heart,
    color: "text-primary",
    bg: "bg-primary/10 hover:bg-primary/20 border-primary/30",
    glow: "glow-orange",
    size: "w-14 h-14",
    iconSize: "w-7 h-7",
  },
  {
    id: "boost",
    icon: Zap,
    color: "text-gold",
    bg: "bg-gold/10 hover:bg-gold/20 border-gold/30",
    glow: "glow-gold",
    size: "w-11 h-11",
    iconSize: "w-5 h-5",
  },
];

export default function SwipeActions({ onAction }) {
  return (
    <div className="flex items-center justify-center gap-3 py-4">
      {actions.map((action) => (
        <motion.button
          key={action.id}
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => onAction(action.id)}
          className={`${action.size} rounded-full border ${action.bg} ${action.glow} flex items-center justify-center transition-all`}
        >
          <action.icon className={`${action.iconSize} ${action.color}`} />
        </motion.button>
      ))}
    </div>
  );
}