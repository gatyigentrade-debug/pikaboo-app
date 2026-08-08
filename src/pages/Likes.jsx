import { useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, Star, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import PullToRefreshWrapper from "@/components/common/PullToRefreshWrapper";

const FILTERS = ["Nearby", "Has a Bio", "Photo Verified"];

const likedCards = [
  { id: "l1", color: "#4A1A5A", active: true, starred: true },
  { id: "l2", color: "#5A3010", active: true, starred: false },
  { id: "l3", color: "#5A1030", active: true, starred: false },
  { id: "l4", color: "#1A4A2A", active: true, starred: false },
];

export default function Likes() {
  const [activeTab, setActiveTab] = useState("likes");
  const [filters, setFilters] = useState({});
  const handleRefresh = () => new Promise((resolve) => setTimeout(resolve, 1000));

  const toggleFilter = (f) => setFilters((p) => ({ ...p, [f]: !p[f] }));

  return (
    <PullToRefreshWrapper onRefresh={handleRefresh} className="px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-28">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Link to="/matches" className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </Link>
        <h1 className="text-2xl font-heading font-bold text-foreground">Likes</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border/40 mb-4">
        <button
          onClick={() => setActiveTab("likes")}
          className="pb-2 relative"
        >
          <span className={`text-sm font-heading font-bold ${activeTab === "likes" ? "text-foreground" : "text-muted-foreground"}`}>
            8 Likes
          </span>
          {activeTab === "likes" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />}
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className="pb-2 relative"
        >
          <span className={`text-sm font-heading font-bold ${activeTab === "sent" ? "text-foreground" : "text-muted-foreground"}`}>
            Likes Sent
          </span>
          {activeTab === "sent" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />}
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-hide">
        <button className="flex-shrink-0 w-9 h-9 rounded-full border border-border flex items-center justify-center">
          <SlidersHorizontal className="w-4 h-4 text-foreground" />
        </button>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => toggleFilter(f)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full border text-xs font-body transition-colors ${
              filters[f]
                ? "border-gold/40 bg-gold/10 text-gold"
                : "border-border text-muted-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Banner text */}
      <p className="text-center text-xs text-muted-foreground font-body my-4">
        Upgrade to Gold to see people who already liked you.
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        {likedCards.map((card) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border/40"
            style={{ backgroundColor: "#1C1C1C" }}
          >
            {/* Blurred color blob */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ filter: "blur(20px)" }}
            >
              <div className="w-24 h-24 rounded-full opacity-60" style={{ backgroundColor: card.color }} />
            </div>
            <div className="absolute inset-0 backdrop-blur-md bg-black/20" />

            {/* Recently Active badge */}
            {card.active && (
              <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-[9px] text-green-400 font-body font-semibold">Recently Active</span>
              </div>
            )}

            {/* Star */}
            {card.starred && (
              <div className="absolute top-2 right-2">
                <Star className="w-4 h-4 text-gold" fill="currentColor" />
              </div>
            )}

            {/* Bottom info */}
            <div className="absolute bottom-2 left-2 right-2">
              <p className="text-[10px] text-green-400 font-body font-semibold">8 · Recently Active</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-20 left-0 right-0 px-4 z-30">
        <button className="w-full max-w-lg mx-auto h-12 rounded-full bg-gold text-black font-heading font-bold flex items-center justify-center gap-2 glow-gold">
          See who Likes you 👀
        </button>
      </div>
    </PullToRefreshWrapper>
  );
}