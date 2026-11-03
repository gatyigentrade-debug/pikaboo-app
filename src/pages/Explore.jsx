import { useSearchParams, useNavigate } from "react-router-dom";
import { Flame, Zap, SlidersHorizontal, Music, UtensilsCrossed, Trophy, Car, Ticket } from "lucide-react";
import { toast } from "sonner";
import ExploreCard from "@/components/explore/ExploreCard";
import ExploreCategorySheet from "@/components/explore/ExploreCategorySheet";
import ExploreFilterSheet from "@/components/explore/ExploreFilterSheet";
import PullToRefreshWrapper from "@/components/common/PullToRefreshWrapper";
import { useDiscoveryFilters } from "@/hooks/useDiscoveryFilters";

// Thematic category entry points. No invented counts — the category sheet
// shows the real number of discoverable profiles.
const CATEGORIES = [
  {
    id: "music-nightlife",
    label: "Music & Nightlife",
    description: "Amapiano nights, live sets and dancefloor energy.",
    icon: Music,
    tint: "rgba(42,10,59,0.55)",
    size: "full",
    image: "https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/c00dc0825_generated_image.png",
  },
  {
    id: "food-social",
    label: "Food & Social Vibes",
    description: "Braais, kota runs and lekker foodie dates.",
    icon: UtensilsCrossed,
    tint: "rgba(122,55,15,0.55)",
    size: "half",
    image: "https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/6ccf0f4d8_generated_image.png",
  },
  {
    id: "sports-activities",
    label: "Sports & Activities",
    description: "Diski fans, fitness crew and outdoorsy souls.",
    icon: Trophy,
    tint: "rgba(20,65,45,0.5)",
    size: "half",
    image: "https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/d4083c477_generated_image.png",
  },
  {
    id: "road-trips",
    label: "Road Trips & Adventures",
    description: "Padkruipers, mountain passes and sunrise stops.",
    icon: Car,
    tint: "rgba(20,40,60,0.5)",
    size: "full",
    image: "https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/3425c1967_generated_image.png",
  },
  {
    id: "events-near-you",
    label: "Events Near You",
    description: "What's happening around you right now.",
    icon: Ticket,
    tint: "rgba(80,20,90,0.55)",
    size: "full",
    image: "https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/751f11e7b_generated_image.png",
  },
];

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-3">
      <h2 className="text-base font-heading font-bold text-gradient-gold">{title}</h2>
      {subtitle && <p className="text-xs text-muted-foreground font-body mt-0.5">{subtitle}</p>}
    </div>
  );
}

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { filters, save } = useDiscoveryFilters();
  const handleRefresh = () => new Promise((resolve) => setTimeout(resolve, 1000));

  const showFilters = searchParams.get("filters") === "open";
  const categoryId = searchParams.get("category");
  const selectedCategory = categoryId ? CATEGORIES.find((c) => c.id === categoryId) : null;

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
    <PullToRefreshWrapper onRefresh={handleRefresh} className="px-4 pt-[calc(1.25rem+env(safe-area-inset-top))] pb-28 min-h-screen">
      <div className="space-y-7">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold text-gradient-gold">Explore</h1>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => toast.info("🔥 3-day streak!", { description: "Keep swiping daily to grow your streak." })}
              className="flex items-center gap-1 bg-[#29252E] border border-gold/25 rounded-full px-3 py-2 min-h-[44px] active:scale-95 transition-transform"
            >
              <Flame className="w-4 h-4 text-gold" />
              <span className="text-xs font-heading font-bold text-gold">3</span>
            </button>
            <button
              onClick={() => navigate("/subscriptions")}
              aria-label="Boost"
              className="w-11 h-11 rounded-full bg-[#29252E] border border-gold/20 flex items-center justify-center active:scale-95 transition-transform"
            >
              <Zap className="w-4 h-4 text-gold" />
            </button>
            <button
              onClick={() => openSheet("filters", "open")}
              aria-label="Filters"
              className="w-11 h-11 rounded-full bg-[#29252E] border border-gold/20 flex items-center justify-center"
            >
              <SlidersHorizontal className="w-4 h-4 text-gold" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <section>
          <SectionHeader title="Explore by Vibe" subtitle="Find your kind of lekker" />
          <div className="space-y-3">
            <div className="h-48">
              <ExploreCard card={CATEGORIES[0]} onClick={(card) => openSheet("category", card.id)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-40">
                <ExploreCard card={CATEGORIES[1]} onClick={(card) => openSheet("category", card.id)} />
              </div>
              <div className="h-40">
                <ExploreCard card={CATEGORIES[2]} onClick={(card) => openSheet("category", card.id)} />
              </div>
            </div>
            <div className="h-44">
              <ExploreCard card={CATEGORIES[3]} onClick={(card) => openSheet("category", card.id)} />
            </div>
            <div className="h-44">
              <ExploreCard card={CATEGORIES[4]} onClick={(card) => openSheet("category", card.id)} />
            </div>
          </div>
        </section>
      </div>

      {/* Filter Sheet */}
      <ExploreFilterSheet
        isOpen={showFilters}
        onClose={() => closeSheet("filters")}
        filters={filters}
        onApply={save}
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