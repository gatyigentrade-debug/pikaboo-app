import { useState } from "react";
import { Users } from "lucide-react";
import { motion } from "framer-motion";
import ExploreCategorySheet from "@/components/explore/ExploreCategorySheet";

const GOAL_CATEGORIES = [
  {
    id: "short-fun",
    label: "Ke Yona Ting 🔥",
    subtitle: "Short-term fun",
    color: "#8B1A4A",
    tint: "rgba(139,26,74,0.65)",
    count: 63,
    size: "full",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop",
  },
  {
    id: "serious",
    label: "Serious Dater 💍",
    subtitle: null,
    color: "#8B2500",
    tint: "rgba(139,37,0,0.65)",
    count: 145,
    size: "half",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&h=300&fit=crop",
  },
  {
    id: "longterm",
    label: "Bae Material 🫶",
    subtitle: "Long-term partner",
    color: "#7A2000",
    tint: "rgba(122,32,0,0.65)",
    count: 318,
    size: "half",
    image: "https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=300&h=300&fit=crop",
  },
  {
    id: "free-tonight",
    label: "Free Tonight? 🌙",
    subtitle: null,
    color: "#4A1A7A",
    tint: "rgba(74,26,122,0.65)",
    count: 125,
    size: "half",
    image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&h=300&fit=crop",
  },
  {
    id: "new-friends",
    label: "New Anzis 👋",
    subtitle: "New friends",
    color: "#7A6200",
    tint: "rgba(122,98,0,0.65)",
    count: 48,
    size: "half",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=300&fit=crop",
  },
];

const INTEREST_CATEGORIES = [
  {
    id: "kasi-braai",
    label: "Kasi Braai 🥩",
    color: "#8B2500",
    tint: "rgba(139,37,0,0.65)",
    count: 89,
    size: "half",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=300&fit=crop",
  },
  {
    id: "binge-watchers",
    label: "Series Junkies 📺",
    color: "#1A6B2A",
    tint: "rgba(26,107,42,0.65)",
    count: 123,
    size: "half",
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=300&h=300&fit=crop",
  },
  {
    id: "sporty",
    label: "Sporty Ones 🏃",
    color: "#8B2500",
    tint: "rgba(139,37,0,0.65)",
    count: 77,
    size: "half",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
  },
  {
    id: "coffee",
    label: "Mugg & Bean Dates ☕",
    color: "#7A6200",
    tint: "rgba(122,98,0,0.65)",
    count: 91,
    size: "half",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=300&fit=crop",
  },
  {
    id: "date-night",
    label: "eKasi Date Night 🌆",
    color: "#5A1040",
    tint: "rgba(90,16,64,0.65)",
    count: 104,
    size: "half",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=300&fit=crop",
  },
  {
    id: "thrill",
    label: "Adrenaline Gang 🤙",
    color: "#7A6200",
    tint: "rgba(122,98,0,0.65)",
    count: 100,
    size: "half",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=300&h=300&fit=crop",
  },
  {
    id: "creatives",
    label: "Art & Vibes 🎨",
    color: "#1A4A7A",
    tint: "rgba(26,74,122,0.65)",
    count: 154,
    size: "half",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=300&h=300&fit=crop",
  },
  {
    id: "foodies",
    label: "Kota & Gatsby 🥪",
    color: "#5A1040",
    tint: "rgba(90,16,64,0.65)",
    count: 168,
    size: "half",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=300&fit=crop",
  },
  {
    id: "nature",
    label: "Magalies Hikers 🌿",
    color: "#1A6B2A",
    tint: "rgba(26,107,42,0.65)",
    count: 117,
    size: "half",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&h=300&fit=crop",
  },
  {
    id: "music",
    label: "Amapiano Heads 🎵",
    color: "#4A1A7A",
    tint: "rgba(74,26,122,0.65)",
    count: 111,
    size: "half",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
  },
  {
    id: "selfcare",
    label: "Self-Care Crew 🛁",
    color: "#1A6B2A",
    tint: "rgba(26,107,42,0.65)",
    count: 120,
    size: "half",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=300&h=300&fit=crop",
  },
  {
    id: "gamers",
    label: "Console Gang 🎮",
    color: "#1A6B2A",
    tint: "rgba(26,107,42,0.65)",
    count: 27,
    size: "half",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=300&fit=crop",
  },
];

const HANGOUT_CATEGORIES = [
  {
    id: "vilakazi",
    label: "Vilakazi Street 🏙️",
    color: "#8B2500",
    tint: "rgba(139,37,0,0.65)",
    count: 55,
    size: "half",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=300&h=300&fit=crop",
  },
  {
    id: "maboneng",
    label: "Maboneng Precinct 🎭",
    color: "#4A1A7A",
    tint: "rgba(74,26,122,0.65)",
    count: 82,
    size: "half",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=300&fit=crop",
  },
  {
    id: "waterfront",
    label: "V&A Waterfront 🌊",
    color: "#1A4A7A",
    tint: "rgba(26,74,122,0.65)",
    count: 144,
    size: "half",
    image: "https://images.unsplash.com/photo-1580824456624-4f72d0a71e82?w=300&h=300&fit=crop",
  },
  {
    id: "greenmarket",
    label: "Greenmarket Square 🛍️",
    color: "#1A6B2A",
    tint: "rgba(26,107,42,0.65)",
    count: 38,
    size: "half",
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=300&h=300&fit=crop",
  },
];

function CategoryTile({ cat, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(cat)}
      className="relative overflow-hidden rounded-2xl"
      style={{ backgroundColor: cat.color }}
    >
      <img
        src={cat.image}
        alt={cat.label}
        className="w-full h-full object-cover absolute inset-0"
        style={{ mixBlendMode: "luminosity", opacity: 0.5 }}
      />
      <div className="absolute inset-0" style={{ backgroundColor: cat.tint }} />

      {/* Count badge */}
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5">
        <Users className="w-2.5 h-2.5 text-white" />
        <span className="text-[10px] text-white font-bold">{cat.count}</span>
      </div>

      {/* Label */}
      <div className="relative z-10 p-3 pt-16 pb-3">
        <p className="text-white font-heading font-bold text-sm leading-tight drop-shadow-md">
          {cat.label}
        </p>
        {cat.subtitle && (
          <p className="text-white/70 text-[10px] font-body mt-0.5">{cat.subtitle}</p>
        )}
      </div>
    </motion.button>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-3">
      <h2 className="text-sm font-heading font-bold text-foreground">{title}</h2>
      {subtitle && <p className="text-xs text-muted-foreground font-body mt-0.5">{subtitle}</p>}
    </div>
  );
}

export default function Explore() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="px-4 pt-4 pb-28 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-heading font-bold text-foreground text-center">Explore</h1>

      {/* Goal-Driven Dating */}
      <section>
        <SectionHeader
          title="Goal-Driven Dating 🎯"
          subtitle="Find people with similar relationship goals"
        />
        <div className="space-y-3">
          {/* Full-width first card */}
          <div className="h-48">
            <CategoryTile cat={GOAL_CATEGORIES[0]} onClick={setSelectedCategory} />
          </div>
          {/* 2-col grid for rest */}
          <div className="grid grid-cols-2 gap-3">
            {GOAL_CATEGORIES.slice(1).map((cat) => (
              <div key={cat.id} className="h-40">
                <CategoryTile cat={cat} onClick={setSelectedCategory} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shared Interests */}
      <section>
        <SectionHeader
          title="Shared Interests & Hobbies 🎉"
          subtitle="Find people with similar interests"
        />
        <div className="grid grid-cols-2 gap-3">
          {INTEREST_CATEGORIES.map((cat) => (
            <div key={cat.id} className="h-40">
              <CategoryTile cat={cat} onClick={setSelectedCategory} />
            </div>
          ))}
        </div>
      </section>

      {/* Popular Hangout Spots */}
      <section>
        <SectionHeader
          title="Popular Hangout Spots 📍"
          subtitle="Meet people at your favourite local spots"
        />
        <div className="grid grid-cols-2 gap-3">
          {HANGOUT_CATEGORIES.map((cat) => (
            <div key={cat.id} className="h-40">
              <CategoryTile cat={cat} onClick={setSelectedCategory} />
            </div>
          ))}
        </div>
      </section>

      {/* Category Sheet */}
      {selectedCategory && (
        <ExploreCategorySheet
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </div>
  );
}