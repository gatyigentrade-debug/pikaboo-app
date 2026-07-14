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
    tint: "rgba(59,26,90,0.7)",
    count: 142,
    size: "full",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
  },
  {
    id: "shisanyama-flames",
    label: "Shisanyama Flames",
    color: "#7A2010",
    tint: "rgba(122,32,16,0.7)",
    count: 89,
    size: "half",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=300&fit=crop",
  },
  {
    id: "foodie-darling",
    label: "Foodie Darling",
    color: "#5A1030",
    tint: "rgba(90,16,48,0.7)",
    count: 67,
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
    tint: "rgba(26,74,42,0.7)",
    count: 134,
    size: "full",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
  },
  {
    id: "soft-life-kings",
    label: "Soft Life Kings",
    color: "#7A5A10",
    tint: "rgba(122,90,16,0.7)",
    count: 78,
    size: "half",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&h=300&fit=crop",
  },
  {
    id: "road-trip-romantics",
    label: "Road Trip Romantics",
    color: "#2A3A4A",
    tint: "rgba(42,58,74,0.7)",
    count: 92,
    size: "half",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e472?w=300&h=300&fit=crop",
  },
];

const TONIGHTS_VIBE = [
  {
    id: "one-night-only",
    label: "One Night Only 🌙",
    subtitle: "No strings. Just vibes.",
    color: "#4A1A5A",
    tint: "rgba(74,26,90,0.75)",
    count: 156,
    size: "full",
    image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&h=400&fit=crop",
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
          {/* Streak / fire counter */}
          <div className="flex items-center gap-1 bg-primary/20 rounded-full pl-2 pr-2.5 py-1">
            <Flame className="w-4 h-4 text-primary" />
            <span className="text-xs font-heading font-bold text-primary">3</span>
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