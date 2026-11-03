import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function ExploreCard({ card, onClick }) {
  const Icon = card.icon;
  const isFull = card.size === "full";

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(card)}
      className="relative w-full h-full overflow-hidden rounded-2xl text-left bg-[#171717] border border-gold/15 hover:border-gold/40 transition-colors group"
    >
      {/* Background image */}
      <img
        src={card.image}
        alt={card.label}
        className={`absolute inset-0 w-full h-full object-cover ${card.grayscale ? "grayscale" : ""}`}
      />
      {/* Color tint overlay */}
      {card.tint && <div className="absolute inset-0" style={{ backgroundColor: card.tint }} />}
      {/* Bottom gradient for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-black/30 to-transparent" />

      {/* Icon badge */}
      {Icon && (
        <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-gold/40 flex items-center justify-center z-10">
          <Icon className="w-4 h-4 text-gold" />
        </div>
      )}

      {/* Text content */}
      <div className="relative z-10 p-4 flex flex-col justify-end h-full">
        <p className={`text-white font-heading font-bold leading-tight drop-shadow-md ${isFull ? "text-lg" : "text-sm"}`}>
          {card.label}
        </p>
        {card.description && (
          <p className="text-white/75 text-xs font-body mt-0.5 line-clamp-2">{card.description}</p>
        )}
        <div className="flex items-center gap-1 mt-2 text-gold text-xs font-heading font-semibold">
          Explore <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </motion.button>
  );
}