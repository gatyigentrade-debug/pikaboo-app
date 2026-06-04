import { motion } from "framer-motion";

const CATEGORIES = [
  {
    id: "all",
    label: "All",
    emoji: "🔥",
    gradient: "from-orange-600 via-red-500 to-pink-600",
    description: "See everything",
  },
  {
    id: "long_term",
    label: "Long-term",
    emoji: "💍",
    gradient: "from-purple-600 via-violet-500 to-indigo-600",
    description: "Something serious",
  },
  {
    id: "new_friends",
    label: "New Friends",
    emoji: "🤝",
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
    description: "Expand your circle",
  },
  {
    id: "short_term",
    label: "Short-term",
    emoji: "✨",
    gradient: "from-pink-500 via-rose-500 to-red-500",
    description: "Keep it casual",
  },
  {
    id: "sports_bar",
    label: "Sports Bars",
    emoji: "🍺",
    gradient: "from-amber-500 via-yellow-500 to-orange-500",
    description: "Watch the game",
  },
  {
    id: "shebeen",
    label: "Shebeens",
    emoji: "🎶",
    gradient: "from-fuchsia-600 via-purple-500 to-pink-500",
    description: "Local vibes",
  },
  {
    id: "braai_buddies",
    label: "Braai Buddies",
    emoji: "🥩",
    gradient: "from-red-600 via-orange-500 to-amber-500",
    description: "Fire it up",
  },
  {
    id: "game_night",
    label: "Game Night",
    emoji: "🎮",
    gradient: "from-blue-600 via-indigo-500 to-violet-600",
    description: "Play together",
  },
  {
    id: "outdoors",
    label: "Outdoors",
    emoji: "🏞️",
    gradient: "from-green-500 via-emerald-500 to-teal-600",
    description: "Adventure awaits",
  },
  {
    id: "one_night_only",
    label: "One Night Only",
    emoji: "🌙",
    gradient: "from-slate-800 via-indigo-900 to-purple-900",
    description: "No strings attached",
  },
];

export { CATEGORIES };

export default function MeetupsCategories({ activeCategory, onSelect }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider px-0.5">
        Browse by category
      </p>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
        {CATEGORIES.map((cat, i) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => onSelect(cat.id)}
            className={`flex-shrink-0 relative w-28 h-36 rounded-2xl overflow-hidden transition-all duration-200 ${
              activeCategory === cat.id
                ? "ring-2 ring-white ring-offset-2 ring-offset-background scale-105"
                : "opacity-80 hover:opacity-100"
            }`}
          >
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}`} />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-between p-3">
              <span className="text-3xl">{cat.emoji}</span>
              <div className="text-left">
                <p className="text-white font-heading font-bold text-sm leading-tight">
                  {cat.label}
                </p>
                <p className="text-white/70 font-body text-[10px] mt-0.5">
                  {cat.description}
                </p>
              </div>
            </div>

            {/* Active indicator */}
            {activeCategory === cat.id && (
              <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-white flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-black" />
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}