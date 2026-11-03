import { motion } from "framer-motion";
import { Heart, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import PullToRefreshWrapper from "@/components/common/PullToRefreshWrapper";
import ProfilePhoto from "@/components/common/ProfilePhoto";
import { dedupeMatches } from "@/utils/dedupeProfiles";
import { firstName } from "@/utils/profile";
import useDiscoverableProfiles from "@/hooks/useDiscoverableProfiles";

export default function Matches() {
  const navigate = useNavigate();
  const { eligibleIds, isLoading: profilesLoading } = useDiscoverableProfiles();

  const { data: rawMatches = [], refetch, isLoading: matchesLoading } = useQuery({
    queryKey: ["matches"],
    queryFn: () => base44.entities.Match.filter({ status: "matched" }, '-updated_date'),
  });

  // One row per person, only complete profiles, first names only
  const matches = dedupeMatches(rawMatches)
    .filter((m) => eligibleIds.has(m.matched_profile_id))
    .map((m) => ({ ...m, matched_name: firstName(m.matched_name) }));
  const loading = matchesLoading || profilesLoading;

  const handleRefresh = async () => { await refetch(); };

  return (
    <PullToRefreshWrapper onRefresh={handleRefresh} className="px-4 pt-[calc(1rem+env(safe-area-inset-top))]">
      <div className="space-y-6 pb-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gradient-gold">Matches</h1>
            <p className="text-xs text-muted-foreground font-body mt-0.5">
              {matches.length} {matches.length === 1 ? "match" : "matches"} so far
            </p>
          </div>
          <Link to="/likes" className="relative">
            <div className="w-11 h-11 rounded-full bg-[#29252E] flex items-center justify-center border border-gold/20">
              <Heart className="w-5 h-5 text-gold" fill="currentColor" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-gold border-2 border-background animate-pulse" />
          </Link>
        </div>

        {/* Gold promo (honest, no fake counts) */}
        <button
          onClick={() => navigate("/subscriptions")}
          className="w-full rounded-2xl border border-gold/25 bg-gradient-to-br from-[#2A0A3B]/40 to-[#171717] p-4 flex items-center gap-3 active:scale-[0.98] transition-transform text-left"
        >
          <div className="flex -space-x-3 flex-shrink-0">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-[#29252E] flex items-center justify-center overflow-hidden">
                <Heart className="w-4 h-4 text-gold/40 blur-[1px]" />
              </div>
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-heading font-bold text-foreground">See who's into you</p>
            <p className="text-xs text-gold/90 font-body">Gold members reveal everyone who liked them</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gold flex-shrink-0" />
        </button>

        {/* Your Matches */}
        <section>
          <h2 className="text-xs font-heading font-semibold text-gold/80 uppercase tracking-widest mb-3">Your Matches</h2>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-7 h-7 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : matches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center px-6">
              <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mb-4 glow-gold-ring">
                <Heart className="w-7 h-7 text-gold" />
              </div>
              <p className="text-sm text-muted-foreground font-body">No matches yet. Keep swiping to find your Boo! 🔥</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {matches.map((match) => (
                <motion.button
                  key={match.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => navigate(`/chat/${match.id}`, { state: { match } })}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-[#29252E]/60 hover:bg-[#29252E] border border-white/5 hover:border-gold/20 transition-colors text-left"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold/40">
                      <ProfilePhoto src={match.matched_photo} alt={match.matched_name} className="w-full h-full object-cover" iconClassName="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-foreground text-sm">{match.matched_name}</h3>
                    <p className="text-xs font-body truncate mt-1 text-muted-foreground">{match.last_message || "Say hi! 👋"}</p>
                  </div>
                  {match.unread_count > 0 && (
                    <div className="w-6 h-6 rounded-full bg-gold text-[#171717] text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {match.unread_count}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </section>
      </div>
    </PullToRefreshWrapper>
  );
}