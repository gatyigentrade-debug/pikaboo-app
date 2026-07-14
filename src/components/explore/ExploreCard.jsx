import { motion } from "framer-motion";
import { Users } from "lucide-react";

export default function ExploreCard({ card, onClick }) {
  const isFull = card.size === "full";

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(card)}
      className="relative w-full overflow-hidden rounded-2xl text-left"
      style={{ backgroundColor: card.color }}
    >
      {/* Background image */}
      <img
        src={card.image}
        alt={card.label}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Color tint overlay */}
      <div className="absolute inset-0" style={{ backgroundColor: card.tint }} />
      {/* Bottom gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* Member count badge */}
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5 z-10">
        <Users className="w-3 h-3 text-white" />
        <span className="text-[10px] text-white font-bold">{card.count}</span>
      </div>

      {/* Text content */}
      <div className={`relative z-10 p-4 ${isFull ? "pt-32 pb-4" : "pt-20 pb-3"}`}>
        <p className={`text-white font-heading font-bold leading-tight drop-shadow-md ${isFull ? "text-lg" : "text-sm"}`}>
          {card.label}
        </p>
        {card.subtitle && (
          <p className="text-white/70 text-xs font-body mt-0.5">{card.subtitle}</p>
        )}
      </div>
    </motion.button>
  );
}