import { useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, SlidersHorizontal } from "lucide-react";
import SwipeCard from "@/components/swipe/SwipeCard";
import SwipeActions from "@/components/swipe/SwipeActions";
import MatchModal from "@/components/swipe/MatchModal";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState(null);
  const navigate = useNavigate();

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["profiles"],
    queryFn: () => base44.entities.DatingProfile.list(),
  });

  const currentProfile = profiles[currentIdx];
  const nextProfile = profiles[currentIdx + 1];

  const handleSwipe = useCallback((action) => {
    if (!currentProfile) return;

    if (action === "like" || action === "super_like") {
      // Simulate a match (30% chance)
      if (Math.random() < 0.3) {
        setMatchedProfile(currentProfile);
        setShowMatch(true);
      }
    }

    if (action === "rewind") {
      if (currentIdx > 0) setCurrentIdx((i) => i - 1);
      return;
    }

    setCurrentIdx((i) => Math.min(i + 1, profiles.length));
  }, [currentProfile, currentIdx, profiles.length]);

  const handleAction = useCallback((actionId) => {
    if (actionId === "boost") return; // Premium feature
    handleSwipe(actionId);
  }, [handleSwipe]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full"
        />
        <p className="text-muted-foreground font-body text-sm">Finding your vibes...</p>
      </div>
    );
  }

  const noMoreProfiles = currentIdx >= profiles.length;

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-4 pb-2 z-20">
        <div className="flex items-center gap-2">
           <img
             src="https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/8b5857139_PikaBoo_logo-removebg-preview.png"
             alt="PikaBoo"
             className="w-9 h-9 object-contain"
           />
          <h1 className="text-xl font-heading font-bold bg-gradient-to-r from-primary via-amber to-gold bg-clip-text text-transparent">
            PikaBoo
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <Flame className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Card stack */}
      <div className="flex-1 relative px-3 pb-2 overflow-hidden">
        {noMoreProfiles ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
              <span className="text-3xl">🦔</span>
            </div>
            <h3 className="text-xl font-heading font-bold text-foreground mb-2">
              No one new nearby
            </h3>
            <p className="text-muted-foreground font-body text-sm">
              Try expanding your distance to include Melkbos or Soweto.
            </p>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <AnimatePresence>
              {nextProfile && (
                <SwipeCard
                  key={nextProfile.id + "-bg"}
                  profile={nextProfile}
                  onSwipe={() => {}}
                  isTop={false}
                />
              )}
              {currentProfile && (
                <SwipeCard
                  key={currentProfile.id}
                  profile={currentProfile}
                  onSwipe={handleSwipe}
                  isTop={true}
                />
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!noMoreProfiles && (
        <div className="px-4 pb-20">
          <SwipeActions onAction={handleAction} />
        </div>
      )}

      {/* Match modal */}
      <MatchModal
        isOpen={showMatch}
        matchedProfile={matchedProfile}
        onClose={() => setShowMatch(false)}
        onChat={() => {
          setShowMatch(false);
          navigate("/matches");
        }}
      />
    </div>
  );
}