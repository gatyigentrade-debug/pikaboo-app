import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Flame, Zap, SlidersHorizontal } from "lucide-react";
import ExploreCard from "@/components/explore/ExploreCard";
import ExploreCategorySheet from "@/components/explore/ExploreCategorySheet";
import ExploreFilterSheet from "@/components/explore/ExploreFilterSheet";
import PullToRefreshWrapper from "@/components/common/PullToRefreshWrapper";

const VIBES_CULTURE = [
  {
    id: "amapiano-bae",
    label: "Amapiano Bae",
    subtitle: "Log drums & late nights",
    tint: "rgba(75,20,90,0.5)",
    count: 64,
    size: "full",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
  },
  {
    id: "shisanyama-flames",
    label: "Shisanyama Flames",
    tint: "rgba(122,55,15,0.55)",
    count: 38,
    size: "half",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=300&fit=crop",
  },
  {
    id: "foodie-darling",
    label: "Foodie Darling",
    tint: "rgba(90,15,40,0.55)",
    count: 55,
    size: "half",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=300&fit=crop",
  },
];

const SPORT_LIFESTYLE = [
  {
    id: "diski-darlings",
    label: "Diski Darlings",
    subtitle: "Chiefs, Pirates & passion",
    tint: "rgba(20,65,45,0.5)",
    count: 41,
    size: "full",
    image: "https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?w=600&h=400&fit=crop",
  },
  {
    id: "soft-life-kings",
    label: "Soft Life Kings",
    tint: "rgba(130,85,20,0.4)",
    count: 29,
    size: "half",
    image: "https://images.unsplash.com/photo-1758272133795-3a21773ebc5e?w=300&h=300&fit=crop",
  },
  {
    id: "road-trip-romantics",
    label: "Road Trip Romantics",
    grayscale: true,
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
    tint: "rgba(80,20,90,0.55)",
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

const ALL_CARDS = [...VIBES_CULTURE, ...SPORT_LIFESTYLE, ...TONIGHTS_VIBE];

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ distance: 50, ageMin: 18, ageMax: 45, interests: [] });
  const handleRefresh = () => new Promise((resolve) => setTimeout(resolve, 1000));

  const showFilters = searchParams.get("filters") === "open";
  const categoryId = searchParams.get("category");
  const selectedCategory = categoryId ? ALL_CARDS.find((c) => c.id === categoryId) : null;

  const openSheet = (key, value) => {
    const next = new URLSearchParams(searchParams);
    next.set(key, value);
    setSearchParams(next);
  };
  const closeSheet = (key) => {
    const next = new URLSearchParams(searchParams);
    next.delete(key);
    setSearchParams(next);
  };

  return (
    <PullToRefreshWrapper onRefresh={handleRefresh} className="px-4 pt-[calc(1.25rem+env(safe-area-inset-top))] pb-28 bg-black min-h-screen">
      <div className="space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold text-white">Explore</h1>
        <div className="flex items-center gap-2.5">
          {/* Streak / flame badge */}
          <div className="flex items-center gap-1 bg-[#FF4500] rounded-full px-2 py-1">
            <Flame className="w-4 h-4 text-white" />
            <span className="text-xs font-heading font-bold text-white">3</span>
          </div>
          {/* Lightning */}
          <button
            onClick={() => navigate("/subscriptions")}
            className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center active:scale-95 transition-transform"
          >
            <Zap className="w-4 h-4 text-[#FFD700]" />
          </button>
          {/* Filter */}
          <button onClick={() => openSheet("filters", "open")} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Vibes & Culture */}
      <section>
        <SectionHeader title="Vibes & Culture" subtitle="Find your people in the culture" />
        <div className="space-y-3">
          <div className="h-44">
            <ExploreCard card={VIBES_CULTURE[0]} onClick={(card) => openSheet("category", card.id)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {VIBES_CULTURE.slice(1).map((card) => (
              <div key={card.id} className="h-36">
                <ExploreCard card={card} onClick={(card) => openSheet("category", card.id)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sport & Lifestyle */}
      <section>
        <SectionHeader title="Sport & Lifestyle" subtitle="Lekker dates with like minds" />
        <div className="space-y-3">
          <div className="h-44">
            <ExploreCard card={SPORT_LIFESTYLE[0]} onClick={(card) => openSheet("category", card.id)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {SPORT_LIFESTYLE.slice(1).map((card) => (
              <div key={card.id} className="h-36">
                <ExploreCard card={card} onClick={(card) => openSheet("category", card.id)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tonight's Vibe */}
      <section>
        <SectionHeader title="Tonight's Vibe 🌙" subtitle="Short notice. Real connection. No drama." />
        <div className="h-44">
          <ExploreCard card={TONIGHTS_VIBE[0]} onClick={(card) => openSheet("category", card.id)} />
        </div>
      </section>
      </div>

      {/* Filter Sheet */}
      <ExploreFilterSheet
        isOpen={showFilters}
        onClose={() => closeSheet("filters")}
        filters={filters}
        onApply={setFilters}
      />

      {/* Category Sheet */}
      {selectedCategory && (
        <ExploreCategorySheet
          category={selectedCategory}
          onClose={() => closeSheet("category")}
        />
      )}
    </PullToRefreshWrapper>
  );
}