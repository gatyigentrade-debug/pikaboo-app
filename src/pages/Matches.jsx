import { motion } from "framer-motion";
import { Heart, ChevronRight, BadgeCheck, MapPin, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PullToRefreshWrapper from "@/components/common/PullToRefreshWrapper";

const demoMatches = [
  {
    id: "m1",
    matched_name: "Zintle",
    matched_photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop",
    matched_age: 24,
    city: "Cape Town",
    status: "matched",
    last_message: "Hey! Your voice note was so nice 😍",
    last_message_time: "10:30",
    unread_count: 2,
    is_verified: true,
    time_ago: "3m ago",
  },
  {
    id: "m2",
    matched_name: "Anele",
    matched_photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    matched_age: 27,
    city: "Johannesburg",
    status: "matched",
    last_message: "Recently active, match now!",
    last_message_time: "09:11",
    unread_count: 0,
    is_verified: true,
    likes_you: true,
    time_ago: "12m ago",
  },
  {
    id: "m3",
    matched_name: "Mpho",
    matched_photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    matched_age: 25,
    city: "Durban",
    status: "matched",
    last_message: "Voice note",
    last_message_time: "Yesterday",
    unread_count: 0,
    is_verified: false,
    time_ago: "1d ago",
  },
];

const blurredAvatars = [
  { color: "#4A1A5A", initial: "Z" },
  { color: "#7A2010", initial: "A" },
  { color: "#5A1030", initial: "M" },
  { color: "#2A3A4A", initial: "K" },
];

export default function Matches() {
  const navigate = useNavigate();
  const handleRefresh = () => new Promise((res) => setTimeout(res, 1000));

  return (
    <PullToRefreshWrapper onRefresh={handleRefresh} className="px-4 pt-[calc(1rem+env(safe-area-inset-top))]">
      <div className="space-y-6 pb-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Matches</h1>
            <p className="text-xs text-muted-foreground font-body mt-0.5">3 people liked you back</p>
          </div>
          <Link to="/likes" className="relative">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <Heart className="w-5 h-5 text-gold" fill="currentColor" />
            </div>
            <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-gold text-black text-[10px] font-heading font-bold flex items-center justify-center">
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
          <div className="space-y-2.5">
            {demoMatches.map((match) => (
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
                    <img src={match.matched_photo} alt={match.matched_name} className="w-full h-full object-cover" />
                  </div>
                  {match.is_verified && (
                    <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-gold flex items-center justify-center border-2 border-background">
                      <BadgeCheck className="w-3 h-3 text-black" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-foreground text-sm">
                      {match.matched_name}, {match.matched_age}
                    </h3>
                    {match.likes_you && (
                      <span className="px-1.5 py-0.5 rounded-full bg-gold/20 text-gold text-[9px] font-heading font-bold">
                        LIKES YOU
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground font-body">{match.city}</span>
                    <span className="text-[11px] text-muted-foreground">·</span>
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground font-body">{match.time_ago}</span>
                  </div>
                  <p className={`text-xs font-body truncate mt-1 ${match.unread_count > 0 ? "text-foreground" : "text-muted-foreground"}`}>
                    {match.last_message}
                  </p>
                </div>

                {/* Unread badge */}
                {match.unread_count > 0 && (
                  <div className="w-6 h-6 rounded-full bg-yellow-400 text-black text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                    {match.unread_count}
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </section>
      </div>

    </PullToRefreshWrapper>
  );
}