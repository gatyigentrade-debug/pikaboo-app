import { useState, useCallback, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, SlidersHorizontal, Crown } from "lucide-react";
import SwipeCard from "@/components/swipe/SwipeCard";
import SwipeActions from "@/components/swipe/SwipeActions";
import MatchModal from "@/components/swipe/MatchModal";
import GoldUpgradeModal from "@/components/gold/GoldUpgradeModal";
import WhoLikedYou from "@/components/gold/WhoLikedYou";
import { useGold } from "@/hooks/useGold";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";

const FREE_SWIPE_LIMIT = 20;

export default function Home() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState(null);
  const [showGold, setShowGold] = useState(false);
  const [showWhoLiked, setShowWhoLiked] = useState(false);
  const [swipeCount, setSwipeCount] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isGold, activateGold } = useGold();
  const topCardRef = useRef(null);

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["profiles"],
    queryFn: () => base44.entities.DatingProfile.list(),
  });

  const currentProfile = profiles[currentIdx];
  const nextProfile = profiles[currentIdx + 1];
  const swipesLeft = FREE_SWIPE_LIMIT - swipeCount;
  const outOfSwipes = !isGold && swipeCount >= FREE_SWIPE_LIMIT;

  const handleSwipe = useCallback((action) => {
    if (!currentProfile) return;

    if (outOfSwipes) {
      setShowGold(true);
      return;
    }

    if (action === "like" || action === "super_like") {
      if (Math.random() < 0.3) {
        // Persist the match so the notification system can alert the user
        base44.entities.Match.create({
          user_profile_id: user?.id || "me",
          matched_profile_id: currentProfile.id,
          matched_name: currentProfile.name,
          matched_photo: currentProfile.photos?.[0] || "",
          status: "matched",
        }).catch(() => {});
        // Ask for notification permission on this user-initiated gesture
        if (typeof Notification !== "undefined" && Notification.permission === "default") {
          Notification.requestPermission();
        }
        setMatchedProfile(currentProfile);
        setShowMatch(true);
      }
    }

    if (action === "rewind") {
      if (currentIdx > 0) setCurrentIdx((i) => i - 1);
      return;
    }

    setSwipeCount((c) => c + 1);
    setCurrentIdx((i) => Math.min(i + 1, profiles.length));
  }, [currentProfile, currentIdx, profiles.length, outOfSwipes, user]);

  const handleAction = useCallback((actionId) => {
    if (actionId === "boost") { setShowGold(true); return; }
    if ((actionId === "like" || actionId === "dislike" || actionId === "super_like") && topCardRef.current) {
      topCardRef.current.flyOff(actionId === "dislike" ? "dislike" : "like", actionId);
    } else {
      handleSwipe(actionId);
    }
  }, [handleSwipe]);

  const handleUpgrade = async (plan) => {
    await activateGold();
    setShowGold(false);
    toast.success("Welcome to PikaBoo Gold! ✨", { description: `${plan.label} plan activated.` });
  };

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
      <header className="flex items-center justify-between px-5 pt-[calc(1rem+env(safe-area-inset-top))] pb-2 z-20">
        <div className="flex items-center gap-2">
          <img
            src="https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/8b5857139_PikaBoo_logo-removebg-preview.png"
            alt="PikaBoo"
            className="w-9 h-9 object-contain"
            style={{ filter: "drop-shadow(0 0 6px rgba(251, 191, 36, 0.8)) brightness(1.2) hue-rotate(25deg)" }}
          />
          <h1 className="text-xl font-heading font-bold bg-gradient-to-r from-primary via-amber to-gold bg-clip-text text-transparent">
            PikaBoo
          </h1>
          {isGold && (
            <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-[10px] font-heading font-black">
              <Crown className="w-2.5 h-2.5" /> GOLD
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Who Liked You button */}
          <button
            onClick={() => setShowWhoLiked((v) => !v)}
            className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              showWhoLiked ? "bg-yellow-400 text-black" : "bg-secondary text-yellow-400"
            }`}
          >
            <Crown className="w-4 h-4" />
            {!isGold && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-yellow-400 border-2 border-background" />
            )}
          </button>
          <button
            onClick={() => navigate("/explore?filters=open")}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowGold(true)}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Flame className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Who Liked You panel */}
      <AnimatePresence>
        {showWhoLiked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden px-4 pb-2"
          >
            <div className="bg-card border border-yellow-400/20 rounded-2xl p-4">
              <WhoLikedYou
                isGold={isGold}
                myProfileId={null}
                onUpgrade={() => { setShowWhoLiked(false); setShowGold(true); }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe limit warning for free users */}
      {!isGold && swipesLeft <= 5 && swipesLeft > 0 && (
        <div className="mx-4 mb-1 px-3 py-2 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-between">
          <p className="text-yellow-400 text-xs font-heading font-semibold">
            {swipesLeft} swipe{swipesLeft !== 1 ? "s" : ""} left today
          </p>
          <button onClick={() => setShowGold(true)} className="text-xs font-heading font-black text-yellow-400 underline underline-offset-2">
            Get Gold
          </button>
        </div>
      )}

      {/* Card stack */}
      <div className="flex-1 relative px-3 pb-2 overflow-hidden">
        {outOfSwipes ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8 gap-4">
            <div className="w-20 h-20 rounded-full bg-yellow-400/10 flex items-center justify-center">
              <Crown className="w-10 h-10 text-yellow-400" />
            </div>
            <h3 className="text-xl font-heading font-bold text-foreground">Out of free swipes</h3>
            <p className="text-muted-foreground font-body text-sm">
              You've used your {FREE_SWIPE_LIMIT} free swipes for today.
            </p>
            <button
              onClick={() => setShowGold(true)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-heading font-black shadow-lg shadow-yellow-400/20"
            >
              ✨ Get Unlimited Swipes
            </button>
          </div>
        ) : noMoreProfiles ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
              <span className="text-3xl">🦔</span>
            </div>
            <h3 className="text-xl font-heading font-bold text-foreground mb-2">No one new nearby</h3>
            <p className="text-muted-foreground font-body text-sm">
              Try expanding your distance to include Melkbos or Soweto.
            </p>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <AnimatePresence>
              {nextProfile && (
                <SwipeCard key={nextProfile.id + "-bg"} profile={nextProfile} onSwipe={() => {}} isTop={false} />
              )}
              {currentProfile && (
                <SwipeCard key={currentProfile.id} ref={topCardRef} profile={currentProfile} onSwipe={handleSwipe} isTop={true} />
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!noMoreProfiles && !outOfSwipes && (
        <div className="px-4 pb-20">
          <SwipeActions onAction={handleAction} />
        </div>
      )}

      {/* Match modal */}
      <MatchModal
        isOpen={showMatch}
        matchedProfile={matchedProfile}
        onClose={() => setShowMatch(false)}
        onChat={() => { setShowMatch(false); navigate("/matches"); }}
      />

      {/* Gold upgrade modal */}
      <GoldUpgradeModal
        isOpen={showGold}
        onClose={() => setShowGold(false)}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
}