import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Crown, Heart, Lock, Star, Send } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import PullToRefreshWrapper from "@/components/common/PullToRefreshWrapper";
import ProfilePhoto from "@/components/common/ProfilePhoto";
import { useMyProfile } from "@/hooks/useMyProfile";
import { useGold } from "@/hooks/useGold";
import { firstName, isVerifiedProfile, ageFromDob } from "@/utils/profile";

function VerifiedMini() {
  return (
    <span className="inline-flex w-4 h-4 rounded-full bg-gradient-to-br from-[#F3E5AB] to-[#D4AF37] items-center justify-center flex-shrink-0">
      <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
        <path d="M2 6l3 3 5-5" stroke="#1a1205" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function EmptyLikes({ icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mb-4 glow-gold-ring">
        {icon || <Heart className="w-7 h-7 text-gold" />}
      </div>
      <p className="text-sm font-heading font-bold text-foreground mb-1">{title || "No likes yet"}</p>
      <p className="text-xs text-muted-foreground font-body">{subtitle || "Keep swiping — your admirers will show up here."}</p>
    </div>
  );
}

export default function Likes() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("received");
  const { profile: myProfile } = useMyProfile();
  const { isGold } = useGold();
  const myProfileId = myProfile?.id;

  // Real likes received (visible to Gold per existing access rules)
  const { data: received = [], refetch: refetchReceived, isLoading: recLoading } = useQuery({
    queryKey: ["swipe-likes-received", myProfileId],
    queryFn: () => base44.entities.SwipeLike.filter({ liked_profile_id: myProfileId }, "-created_date"),
    enabled: !!myProfileId,
  });

  // Real likes sent
  const { data: sent = [], refetch: refetchSent, isLoading: sentLoading } = useQuery({
    queryKey: ["swipe-likes-sent", myProfileId],
    queryFn: () => base44.entities.SwipeLike.filter({ liker_profile_id: myProfileId }, "-created_date"),
    enabled: !!myProfileId,
  });

  // Fetch the liked profiles for sent likes to show real premium cards
  const sentIds = sent.map((s) => s.liked_profile_id).filter(Boolean);
  const { data: sentProfiles = [] } = useQuery({
    queryKey: ["sent-liked-profiles", sentIds.join(",")],
    queryFn: async () => {
      const results = await Promise.all(
        sentIds.map((id) => base44.entities.DatingProfile.get(id).catch(() => null))
      );
      return results.filter(Boolean);
    },
    enabled: sentIds.length > 0,
  });

  const handleRefresh = async () => {
    await Promise.all([refetchReceived(), refetchSent()]);
  };

  return (
    <PullToRefreshWrapper onRefresh={handleRefresh} className="px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-32">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Link to="/matches" aria-label="Back" className="w-11 h-11 rounded-full bg-[#29252E] flex items-center justify-center border border-white/5">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </Link>
        <h1 className="text-2xl font-heading font-bold text-gradient-gold">Likes</h1>
        {isGold && (
          <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] text-[#171717] text-xs font-heading font-black">
            <Crown className="w-3 h-3" /> GOLD
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-white/10 mb-5">
        {[
          { id: "received", label: "Received" },
          { id: "sent", label: "Sent" },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="pb-2 relative">
            <span className={`text-sm font-heading font-bold ${tab === t.id ? "text-foreground" : "text-muted-foreground"}`}>{t.label}</span>
            {tab === t.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full" />}
          </button>
        ))}
      </div>

      {tab === "received" ? (
        isGold ? (
          recLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-7 h-7 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : received.length === 0 ? (
            <EmptyLikes />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {received.map((like, i) => (
                <motion.button
                  key={like.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => like.liker_profile_id && navigate(`/profile/${like.liker_profile_id}`)}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-gold/20 premium-card-shadow text-left"
                >
                  <ProfilePhoto src={like.liker_photo} alt={firstName(like.liker_name)} className="w-full h-full object-cover" iconClassName="w-10 h-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent" />
                  {like.is_super_like && (
                    <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-sky-500/80 flex items-center justify-center">
                      <Star className="w-3.5 h-3.5 text-white" fill="currentColor" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-gold/90 text-[#171717] text-[10px] font-heading font-bold flex items-center gap-1">
                    <Heart className="w-2.5 h-2.5" fill="currentColor" /> LIKES YOU
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white font-heading font-bold text-sm truncate drop-shadow-lg">{firstName(like.liker_name)}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          )
        ) : (
          /* Non-gold: honest locked state — blurred silhouettes, no fake people */
          <div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 bg-[#29252E]">
                  <div className="absolute inset-0 blur-md scale-110">
                    <ProfilePhoto src={null} alt="" className="w-full h-full object-cover" iconClassName="w-12 h-12" />
                  </div>
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-gold/70" />
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-gold/25 bg-gradient-to-br from-[#2A0A3B]/40 to-[#171717] p-4 text-center">
              <p className="text-sm font-heading font-bold text-foreground mb-1">Who's into you is locked</p>
              <p className="text-xs text-muted-foreground font-body">
                Gold members can see everyone who liked them, with photos and first names. Upgrade to reveal your admirers.
              </p>
            </div>
          </div>
        )
      ) : (
        /* Sent tab — real liked profiles */
        sentLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-7 h-7 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sentProfiles.length === 0 ? (
          <EmptyLikes icon={<Send className="w-7 h-7 text-gold" />} title="No likes sent yet" subtitle="When you like someone, they'll show up here." />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {sentProfiles.map((p, i) => (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/profile/${p.id}`)}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-gold/20 premium-card-shadow text-left"
              >
                <ProfilePhoto src={p.photos?.[0]} alt={firstName(p.name)} className="w-full h-full object-cover" iconClassName="w-10 h-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="flex items-center gap-1">
                    <p className="text-white font-heading font-bold text-sm truncate drop-shadow-lg">{firstName(p.name)}</p>
                    {ageFromDob(p.date_of_birth) && <span className="text-white/70 text-xs">{ageFromDob(p.date_of_birth)}</span>}
                    {isVerifiedProfile(p) && <VerifiedMini />}
                  </div>
                  {p.city && <p className="text-white/70 text-xs font-body truncate">{p.city}</p>}
                </div>
              </motion.button>
            ))}
          </div>
        )
      )}

      {/* Sticky CTA for non-gold received */}
      {tab === "received" && !isGold && (
        <div className="fixed left-0 right-0 px-4 z-30" style={{ bottom: "calc(6rem + env(safe-area-inset-bottom))" }}>
          <button
            onClick={() => navigate("/subscriptions")}
            className="w-full max-w-lg mx-auto h-12 rounded-full bg-gradient-to-r from-[#F3E5AB] to-[#D4A54A] text-[#171717] font-heading font-bold flex items-center justify-center gap-2 glow-gold active:scale-95 transition-transform"
          >
            <Crown className="w-4 h-4" /> See who likes you
          </button>
        </div>
      )}
    </PullToRefreshWrapper>
  );
}