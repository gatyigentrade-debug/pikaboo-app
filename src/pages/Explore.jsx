import { useState } from "react";
import { Flame, Zap, SlidersHorizontal } from "lucide-react";
import ExploreCard from "@/components/explore/ExploreCard";
import ExploreCategorySheet from "@/components/explore/ExploreCategorySheet";

const DISCOVER_CARDS = [
  {
    id: "diski-darlings",
    label: "Diski Darlings",
    subtitle: "Chiefs, Pirates & passion",
    count: 41,
    size: "full",
    image: "https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?w=600&h=400&fit=crop",
  },
  {
    id: "soft-life-kings",
    label: "Soft Life Kings",
    count: 29,
    size: "half",
    image: "https://images.unsplash.com/photo-1758272133795-3a21773ebc5e?w=300&h=300&fit=crop",
  },
  {
    id: "road-trip-romantics",
    label: "Road Trip Romantics",
    count: 47,
    size: "half",
    image: "https://images.unsplash.com/photo-1757383670321-d1c3bf0a05e8?w=300&h=300&fit=crop",
  },
];

const TONIGHTS_VIBE = [
  {
    id: "one-night-only",
    label: "One Night Only 🌙",
    subtitle: "No strings. Just vibes.",
    count: 83,
    size: "full",
    image: "https://images.unsplash.com/photo-1775117419764-177be61d070c?w=600&h=400&fit=crop",
  },
];

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-3">
      <h2 className="text-base font-heading font-bold text-white">{title}</h2>
      {subtitle && <p className="text-xs text-gray-500 font-body mt-0.5">{subtitle}</p>}
    </div>
  );
}

export default function Explore() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="px-4 pt-5 pb-28 space-y-6 bg-black min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold text-white">Explore</h1>
        <div className="flex items-center gap-3">
          {/* Streak / flame badge */}
          <div className="flex items-center gap-1 bg-[#FF4500] rounded-full px-2 py-1">
            <Flame className="w-4 h-4 text-white" />
            <span className="text-xs font-heading font-bold text-white">3</span>
          </div>
          {/* Lightning */}
          <button>
            <Zap className="w-5 h-5 text-[#FFD700]" />
          </button>
          {/* Filter */}
          <button>
            <SlidersHorizontal className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Discover cards */}
      <section>
        <div className="space-y-3">
          <div className="h-44">
            <ExploreCard card={DISCOVER_CARDS[0]} onClick={setSelectedCategory} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {DISCOVER_CARDS.slice(1).map((card) => (
              <div key={card.id} className="h-36">
                <ExploreCard card={card} onClick={setSelectedCategory} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tonight's Vibe */}
      <section>
        <SectionHeader title="Tonight's Vibe 🌙" subtitle="Short notice. Real connection. No drama." />
        <div className="h-44">
          <ExploreCard card={TONIGHTS_VIBE[0]} onClick={setSelectedCategory} />
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