import { useState } from "react";
import { Flame, Zap, SlidersHorizontal } from "lucide-react";
import ExploreCard from "@/components/explore/ExploreCard";
import ExploreCategorySheet from "@/components/explore/ExploreCategorySheet";

const VIBES_CULTURE = [
  {
    id: "amapiano-bae",
    label: "Amapiano Bae",
    subtitle: "Log drums & late nights",
    color: "#3B1A5A",
    tint: "rgba(75,20,90,0.5)",
    count: 64,
    size: "full",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=400&fit=crop",
  },
  {
    id: "shisanyama-flames",
    label: "Shisanyama Flames",
    color: "#7A3810",
    tint: "rgba(122,55,15,0.55)",
    count: 38,
    size: "half",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=300&fit=crop",
  },
  {
    id: "foodie-darling",
    label: "Foodie Darling",
    color: "#5A1030",
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
    color: "#1A4A2A",
    tint: "rgba(20,65,45,0.5)",
    count: 41,
    size: "full",
    image: "https://images.unsplash.com/photo-1551958219-acbc608dda6c?w=600&h=400&fit=crop",
  },
  {
    id: "soft-life-kings",
    label: "Soft Life Kings",
    color: "#7A5A10",
    tint: "rgba(130,85,20,0.5)",
    count: 29,
    size: "half",
    image: "https://images.unsplash.com/photo-1543002588-bfa85caba47a?w=300&h=300&fit=crop",
  },
  {
    id: "road-trip-romantics",
    label: "Road Trip Romantics",
    color: "#1A3848",
    tint: "rgba(25,55,70,0.55)",
    count: 47,
    size: "half",
    image: "https://images.unsplash.com/photo-1469854523086-cc02d5f3f0cd?w=300&h=300&fit=crop",
  },
];

const TONIGHTS_VIBE = [
  {
    id: "one-night-only",
    label: "One Night Only 🌙",
    subtitle: "No strings. Just vibes.",
    color: "#4A1A5A",
    tint: "rgba(80,20,90,0.55)",
    count: 83,
    size: "full",
    image: "https://images.unsplash.com/photo-1517197768983-9919a0657c4e?w=600&h=400&fit=crop",
  },
];

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-3">
      <h2 className="text-base font-heading font-bold text-foreground">{title}</h2>
      {subtitle && <p className="text-xs text-muted-foreground font-body mt-0.5">{subtitle}</p>}
    </div>
  );
}

export default function Explore() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="px-4 pt-5 pb-28 space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold text-foreground">Explore</h1>
        <div className="flex items-center gap-2">
          {/* Streak / flame pill */}
          <div className="flex items-center gap-1 border border-orange-500/60 rounded-full pl-2 pr-2.5 py-1">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-heading font-bold text-white">3</span>
          </div>
          {/* Lightning */}
          <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <Zap className="w-4 h-4 text-amber" />
          </button>
          {/* Filter */}
          <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Vibes & Culture */}
      <section>
        <SectionHeader title="Vibes & Culture" subtitle="Find your people in the culture" />
        <div className="space-y-3">
          <div className="h-44">
            <ExploreCard card={VIBES_CULTURE[0]} onClick={setSelectedCategory} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {VIBES_CULTURE.slice(1).map((card) => (
              <div key={card.id} className="h-36">
                <ExploreCard card={card} onClick={setSelectedCategory} />
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
            <ExploreCard card={SPORT_LIFESTYLE[0]} onClick={setSelectedCategory} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {SPORT_LIFESTYLE.slice(1).map((card) => (
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