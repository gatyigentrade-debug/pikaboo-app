import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";
import SwipeCard from "@/components/swipe/SwipeCard";
import SwipeActions from "@/components/swipe/SwipeActions";
import MatchModal from "@/components/swipe/MatchModal";

const normalize = (p) => ({
  ...p,
  photos: p.photos || (p.photo ? [p.photo] : []),
  city: p.city || "Nearby",
});

export default function ProfileDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profiles: raw = [], startName, category } = location.state || {};

  // Build the deck: start at the tapped profile, then the rest. Fall back to a single passed profile.
  const ordered = (() => {
    const list = raw.length ? raw : location.state?.profile ? [location.state.profile] : [];
    if (!startName) return list;
    const idx = list.findIndex((p) => p.name === startName);
    if (idx <= 0) return list;
    return [list[idx], ...list.slice(0, idx), ...list.slice(idx + 1)];
  })();

  const [deck, setDeck] = useState(ordered.map(normalize));
  const [matchProfile, setMatchProfile] = useState(null);
  const topCardRef = useRef(null);

  const top = deck[0];

  const handleSwipe = (direction) => {
    const swiped = deck[0];
    setDeck((d) => d.slice(1));
    if (direction === "like" || direction === "super_like") {
      setMatchProfile(swiped);
    }
  };

  const handleAction = (id) => {
    if (!top) return;
    if (id === "like" || id === "super_like") topCardRef.current?.flyOff("like");
    else if (id === "dislike") topCardRef.current?.flyOff("dislike");
    // rewind / boost are visual-only for now
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}
      >
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-heading font-bold text-foreground truncate">
            {category?.label || "Discover"}
          </h1>
          {category?.count && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-body">
              <Users className="w-3 h-3" /> {category.count} people here
            </div>
          )}
        </div>
      </div>

      {/* Deck */}
      <div className="flex-1 flex flex-col px-4 pb-6">
        {top ? (
          <>
            <div className="relative w-full flex-1 min-h-[60vh]">
              {deck.slice(0, 3).reverse().map((p, i, arr) => {
                const isTop = i === arr.length - 1;
                return (
                  <SwipeCard
                    key={p.name}
                    ref={isTop ? topCardRef : null}
                    profile={p}
                    isTop={isTop}
                    onSwipe={handleSwipe}
                  />
                );
              })}
            </div>
            <SwipeActions onAction={handleAction} />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-base font-heading font-bold text-foreground">That's everyone in this vibe</p>
            <p className="text-sm text-muted-foreground font-body mt-1 mb-5 max-w-[240px]">
              You've seen all the Boos here. Come back later for fresh faces.
            </p>
            <button
              onClick={() => navigate("/explore")}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-gold text-black font-heading font-bold text-sm shadow-lg active:scale-95 transition-transform"
            >
              Back to Explore
            </button>
          </div>
        )}
      </div>

      <MatchModal
        isOpen={!!matchProfile}
        matchedProfile={matchProfile}
        onClose={() => setMatchProfile(null)}
        onChat={() => setMatchProfile(null)}
      />
    </div>
  );
}