import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Flame, CheckCircle } from "lucide-react";
import ProfilePhoto from "@/components/common/ProfilePhoto";
import { firstName, isVerifiedProfile, realPhotos } from "@/utils/profile";

const LOOKING = {
  relationship: "💍 Relationship",
  friendship: "🤝 Friendship",
  casual: "✌️ Casual",
  not_sure: "🤔 Not sure",
};

function VerifiedBadge() {
  return (
    <span className="inline-flex w-5 h-5 rounded-full bg-gradient-to-br from-[#F3E5AB] to-[#D4AF37] items-center justify-center" style={{ boxShadow: "0 0 8px rgba(212,175,55,0.5)" }}>
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
        <path d="M2 6l3 3 5-5" stroke="#1a1205" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <p className="text-xs font-heading font-semibold uppercase tracking-widest text-gold/80 mb-2">{title}</p>
      {children}
    </div>
  );
}

export default function SwipeInfoSheet({ profile, myInterests = [], onClose }) {
  const displayName = firstName(profile?.name);
  const photo = realPhotos(profile)[0] || null;
  const verified = isVerifiedProfile(profile);
  const theirInterests = (profile?.interests || []).filter(Boolean);
  const sharedSet = new Set((myInterests || []).map((i) => String(i).toLowerCase()));

  return (
    <AnimatePresence>
      {profile && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/65 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed bottom-0 left-0 right-0 z-[80] max-w-lg mx-auto bg-card rounded-t-3xl border-t border-gold/20 max-h-[88vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between px-5 py-3 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gold/30">
                  <ProfilePhoto src={photo} alt={displayName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading font-bold text-xl text-foreground">{displayName}</h2>
                    {profile?.age ? <span className="text-lg text-muted-foreground font-heading">{profile.age}</span> : null}
                    {verified && <VerifiedBadge />}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-gold" />
                    <span className="truncate">{profile?.city}</span>
                    {profile?.distanceKm != null && <span>· {profile.distanceKm} km</span>}
                  </div>
                </div>
              </div>
              <button onClick={onClose} aria-label="Close" className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto overscroll-contain px-5 pb-8 space-y-5">
              {profile?.braai_starter && (
                <div className="flex items-start gap-2 bg-gold/10 border border-gold/20 rounded-2xl px-4 py-3">
                  <Flame className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                  <p className="text-foreground/90 text-sm font-body italic">"{profile.braai_starter}"</p>
                </div>
              )}

              {profile?.bio && <p className="text-foreground/80 text-sm font-body leading-relaxed">{profile.bio}</p>}

              {profile?.looking_for && (
                <Section title="Intentions">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-coral/15 border border-coral/30 text-coral text-sm font-body">
                    {LOOKING[profile.looking_for] || profile.looking_for}
                  </span>
                </Section>
              )}

              <Section title="Vibes">
                <div className="flex flex-wrap gap-2">
                  {profile?.home_language && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary border border-border/50 text-muted-foreground text-sm font-body">💬 {profile.home_language}</span>
                  )}
                  {profile?.braai_role && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber/15 border border-amber/30 text-amber text-sm font-body">🔥 {profile.braai_role}</span>
                  )}
                  {profile?.spirit_animal && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-violet/15 border border-violet/30 text-violet text-sm font-body">{profile.spirit_animal}</span>
                  )}
                  {profile?.sports_team && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-body">⚽ {profile.sports_team}</span>
                  )}
                </div>
              </Section>

              {theirInterests.length > 0 && (
                <Section title="Interests">
                  <div className="flex flex-wrap gap-2">
                    {theirInterests.map((interest) => {
                      const shared = sharedSet.has(String(interest).toLowerCase());
                      return (
                        <span
                          key={interest}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-body border ${
                            shared
                              ? "bg-gold/15 border-gold/50 text-gold"
                              : "bg-secondary border-border/50 text-muted-foreground"
                          }`}
                        >
                          {shared && <CheckCircle className="w-3 h-3" />}
                          {interest}
                        </span>
                      );
                    })}
                  </div>
                </Section>
              )}

              {(profile?.favorite_kota_spot || profile?.dream_date_location || profile?.cant_live_without) && (
                <Section title="Lifestyle">
                  <div className="space-y-2">
                    {profile?.favorite_kota_spot && (
                      <div className="flex items-center gap-2.5 bg-secondary/50 rounded-xl px-3 py-2">
                        <span className="text-base">📍</span>
                        <div className="min-w-0">
                          <p className="text-muted-foreground/70 text-xs font-heading uppercase tracking-wide leading-none mb-0.5">Fave Spot</p>
                          <p className="text-foreground/90 text-sm font-body truncate">{profile.favorite_kota_spot}</p>
                        </div>
                      </div>
                    )}
                    {profile?.cant_live_without && (
                      <div className="flex items-center gap-2.5 bg-secondary/50 rounded-xl px-3 py-2">
                        <span className="text-base">💛</span>
                        <div className="min-w-0">
                          <p className="text-muted-foreground/70 text-xs font-heading uppercase tracking-wide leading-none mb-0.5">Can't live without</p>
                          <p className="text-foreground/90 text-sm font-body truncate">{profile.cant_live_without}</p>
                        </div>
                      </div>
                    )}
                    {profile?.dream_date_location && (
                      <div className="flex items-center gap-2.5 bg-secondary/50 rounded-xl px-3 py-2">
                        <span className="text-base">🌅</span>
                        <div className="min-w-0">
                          <p className="text-muted-foreground/70 text-xs font-heading uppercase tracking-wide leading-none mb-0.5">Dream date</p>
                          <p className="text-foreground/90 text-sm font-body truncate">{profile.dream_date_location}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Section>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}