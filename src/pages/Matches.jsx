import { motion } from "framer-motion";
import { Heart, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PullToRefreshWrapper from "@/components/common/PullToRefreshWrapper";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

const blurredAvatars = [
  { color: "#4A1A5A", initial: "Z" },
  { color: "#7A2010", initial: "A" },
  { color: "#5A1030", initial: "M" },
  { color: "#2A3A4A", initial: "K" },
];

export default function Matches() {
  const navigate = useNavigate();

  const { data: matches = [], refetch } = useQuery({
    queryKey: ["matches"],
    queryFn: () => base44.entities.Match.filter({ status: "matched" }, '-updated_date'),
  });

  const handleRefresh = async () => { await refetch(); };

  return (
    <PullToRefreshWrapper onRefresh={handleRefresh} className="px-4 pt-[calc(1rem+env(safe-area-inset-top))]">
      <div className="space-y-6 pb-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Matches</h1>
            <p className="text-xs text-muted-foreground font-body mt-0.5">{matches.length} people liked you back</p>
          </div>
          <Link to="/likes" className="relative">
            <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center">
              <Heart className="w-5 h-5 text-gold" fill="currentColor" />
            </div>
            <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-gold text-black text-xs font-heading font-bold flex items-center justify-center">
              8
            </div>
          </Link>
        </div>

        {/* Gold banner card */}
        <button
          onClick={() => navigate("/subscriptions")}
          className="w-full rounded-2xl border border-gold/30 bg-secondary/50 p-4 flex items-center gap-3 active:scale-[0.98] transition-transform text-left"
        >
          {/* Overlapping avatars */}
          <div className="flex -space-x-3 flex-shrink-0">
            {blurredAvatars.map((a, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full border-2 border-background flex items-center justify-center text-white font-heading font-bold text-sm"
                style={{ backgroundColor: a.color }}
              >
                {a.initial}
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-muted-foreground text-xs font-bold">
              +5
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-heading font-bold text-foreground">8 people liked you</p>
            <p className="text-xs text-gold font-body">👑 Go Gold to reveal them all</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        </button>

        {/* Your Matches */}
        <section>
          <h2 className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Your Matches
          </h2>
          {matches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
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
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-secondary/40 hover:bg-secondary/60 transition-colors text-left"
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold/40">
                      {match.matched_photo ? (
                        <img src={match.matched_photo} alt={match.matched_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary">
                          <span className="text-lg font-heading font-bold text-foreground">{match.matched_name?.[0] || "?"}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-foreground text-sm">
                      {match.matched_name}
                    </h3>
                    <p className="text-xs font-body truncate mt-1 text-muted-foreground">
                      {match.last_message || "Say hi! 👋"}
                    </p>
                  </div>

                  {/* Unread badge */}
                  {match.unread_count > 0 && (
                    <div className="w-6 h-6 rounded-full bg-yellow-400 text-black text-xs font-bold flex items-center justify-center flex-shrink-0">
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