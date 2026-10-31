import { useState, useImperativeHandle, forwardRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation, useMotionTemplate } from "framer-motion";
import { MapPin, Flame, ChevronDown, MessageCircle, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ReportUserSheet from "@/components/common/ReportUserSheet";
import ProfilePhoto from "@/components/common/ProfilePhoto";
import { firstName, isVerifiedProfile, realPhotos } from "@/utils/profile";

const SwipeCard = forwardRef(function SwipeCard({ profile, onSwipe, isTop, onMessage }, ref) {
  const [imgIdx, setImgIdx] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const x = useMotionValue(0);
  const controls = useAnimation();
  const rotate = useTransform(x, [-250, 250], [-24, 24]);
  const scale = useTransform(x, [-250, 0, 250], [0.94, 1, 0.94]);
  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-120, -20], [1, 0]);
  const cardOpacity = useTransform(x, [-300, -200, 0, 200, 300], [0, 1, 1, 1, 0]);
  const likeGlow = useTransform(x, [20, 150], [0, 0.55]);
  const nopeGlow = useTransform(x, [-150, -20], [0.55, 0]);
  const boxShadow = useMotionTemplate`0 0 44px rgba(212,175,55, ${likeGlow}), 0 0 44px rgba(244,63,94, ${nopeGlow})`;

  // Only real uploaded photos — no stock fallback that could pass as this person
  const photos = realPhotos(profile);
  const photo = photos[imgIdx] || null;
  const displayName = firstName(profile.name);
  const verified = isVerifiedProfile(profile);

  const flyOff = (direction, action) => {
    controls.start({
      x: direction === "like" ? 700 : -700,
      y: -40,
      rotate: direction === "like" ? 35 : -35,
      scale: 0.85,
      opacity: 0,
      transition: { duration: 0.35, ease: "easeOut" },
    });
    // Call onSwipe after the animation duration — don't rely on the
    // animation promise resolving (it can hang if the component re-renders).
    setTimeout(() => {
      onSwipe(action || (direction === "like" ? "like" : "dislike"));
    }, 350);
  };

  useImperativeHandle(ref, () => ({ flyOff }));

  const handleDragEnd = (_, info) => {
    const swipeThreshold = 60;
    const velocityThreshold = 400;
    const { offset, velocity } = info;
    if (offset.x > swipeThreshold || velocity.x > velocityThreshold) flyOff("like");
    else if (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) flyOff("dislike");
    else controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 25 } });
  };

  const handleTapPhoto = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const tapX = e.clientX - rect.left;
    if (tapX > rect.width / 2 && imgIdx < photos.length - 1) setImgIdx(imgIdx + 1);
    else if (tapX <= rect.width / 2 && imgIdx > 0) setImgIdx(imgIdx - 1);
  };

  if (!isTop) {
    return (
      <div className="absolute inset-0 rounded-[28px] overflow-hidden bg-[#0c0c0e] scale-[0.95] opacity-60 ring-1 ring-white/5">
        <ProfilePhoto src={photo} alt="" className="w-full h-full object-cover" iconClassName="w-24 h-24" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050300]/90 via-[#050300]/20 to-transparent" />
      </div>
    );
  }

  return (
    <>
      <motion.div
        className={`absolute inset-0 rounded-[28px] overflow-hidden cursor-grab active:cursor-grabbing card-enter premium-card-shadow ${showDetails ? "touch-pan-y" : "touch-none"}`}
        style={{ x, rotate, scale, opacity: cardOpacity, boxShadow }}
        animate={controls}
        drag={showDetails ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Photo */}
        <div className="relative w-full h-full" onClick={handleTapPhoto}>
          <ProfilePhoto src={photo} alt={displayName} className="w-full h-full object-cover" iconClassName="w-24 h-24" />

          {/* Photo indicators */}
          {photos.length > 1 && (
            <div className="absolute top-4 left-4 right-4 pr-10 flex gap-1.5 z-20">
              {photos.map((_, i) => (
                <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${i === imgIdx ? "bg-gold" : "bg-white/25"}`} />
              ))}
            </div>
          )}

          {/* Report button */}
          <button
            onClick={(e) => { e.stopPropagation(); setShowReport(true); }}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-rose-500/60 transition-colors"
          >
            <Flag className="w-3.5 h-3.5 text-white" />
          </button>

          {/* Swipe labels */}
          <motion.div className="absolute top-20 left-6 z-20 rounded-xl px-4 py-2 -rotate-12 border-4 border-gold" style={{ opacity: likeOpacity, boxShadow: "0 0 26px rgba(212,175,55,0.45)" }}>
            <span className="text-gold font-heading font-black text-3xl tracking-tight">LEKKER</span>
          </motion.div>
          <motion.div className="absolute top-20 right-6 z-20 rounded-xl px-4 py-2 rotate-12 border-4 border-rose-500" style={{ opacity: nopeOpacity, boxShadow: "0 0 26px rgba(244,63,94,0.4)" }}>
            <span className="text-rose-400 font-heading font-black text-3xl tracking-tight">NOPE</span>
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050300] via-[#050300]/45 to-transparent" />

          {/* Auto-expanding bio + details (inline, smooth) */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10">
            <div className="flex items-baseline gap-2 flex-wrap">
              <h2 className="text-3xl font-heading font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] leading-tight tracking-tight">{displayName}</h2>
              {profile.age ? (
                <span className="text-2xl font-heading font-light text-white/75 drop-shadow-lg leading-tight">{profile.age}</span>
              ) : null}
              {verified && (
                <span className="inline-flex w-6 h-6 rounded-full bg-gradient-to-br from-[#F3E5AB] to-[#D4AF37] items-center justify-center" style={{ boxShadow: "0 0 10px rgba(212,175,55,0.55)" }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#1a1205" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-white/85 text-sm mt-1 drop-shadow-lg">
              <MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0" />
              <span className="truncate">{profile.city}</span>
              {profile.distanceKm != null && <span className="text-white/55 flex-shrink-0">· {profile.distanceKm} km away</span>}
            </div>

            {/* Smoothly expanding details */}
            <AnimatePresence initial={false}>
              {showDetails && (
                <motion.div
                  key="details"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="pt-3 max-h-[42vh] overflow-y-auto overscroll-contain touch-pan-y pr-1 -mr-1">
                    {/* Quote */}
                    {profile.braai_starter && (
                      <div className="flex items-start gap-2 bg-gold/10 border border-gold/20 rounded-2xl px-3 py-2 mb-3">
                        <Flame className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                        <p className="text-white/90 text-sm font-body italic">"{profile.braai_starter}"</p>
                      </div>
                    )}

                    {/* Interest pills */}
                    <div className="flex gap-2 flex-wrap mb-3">
                      {profile.home_language && <Badge className="bg-gold/15 text-gold border-gold/30 border font-body text-sm">{profile.home_language}</Badge>}
                      {profile.braai_role && <Badge className="bg-amber/20 text-amber border-amber/30 border font-body text-sm">🔥 {profile.braai_role}</Badge>}
                      {profile.spirit_animal && <Badge className="bg-violet/20 text-violet border-violet/30 border font-body text-sm">{profile.spirit_animal}</Badge>}
                      {profile.sports_team && <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 border font-body text-sm">⚽ {profile.sports_team}</Badge>}
                      {profile.looking_for && (
                        <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30 border font-body text-sm">
                          {profile.looking_for === "relationship" ? "💍 Relationship" : profile.looking_for === "friendship" ? "🤝 Friendship" : profile.looking_for === "casual" ? "✌️ Casual" : "🤔 Not Sure"}
                        </Badge>
                      )}
                    </div>

                    {/* Lifestyle details */}
                    {(profile.favorite_kota_spot || profile.dream_date_location || profile.cant_live_without) && (
                      <div className="space-y-2 mb-3">
                        {profile.favorite_kota_spot && (
                          <div className="flex items-center gap-2 bg-white/8 rounded-xl px-3 py-2">
                            <span className="text-base flex-shrink-0">📍</span>
                            <div className="min-w-0">
                              <p className="text-white/50 text-xs font-heading uppercase tracking-wide leading-none mb-0.5">Fave Spot</p>
                              <p className="text-white/90 text-sm font-body truncate">{profile.favorite_kota_spot}</p>
                            </div>
                          </div>
                        )}
                        {profile.cant_live_without && (
                          <div className="flex items-center gap-2 bg-white/8 rounded-xl px-3 py-2">
                            <span className="text-base flex-shrink-0">❤️</span>
                            <div className="min-w-0">
                              <p className="text-white/50 text-xs font-heading uppercase tracking-wide leading-none mb-0.5">Can't live without</p>
                              <p className="text-white/90 text-sm font-body truncate">{profile.cant_live_without}</p>
                            </div>
                          </div>
                        )}
                        {profile.dream_date_location && (
                          <div className="flex items-center gap-2 bg-white/8 rounded-xl px-3 py-2">
                            <span className="text-base flex-shrink-0">🌅</span>
                            <div className="min-w-0">
                              <p className="text-white/50 text-xs font-heading uppercase tracking-wide leading-none mb-0.5">Dream date</p>
                              <p className="text-white/90 text-sm font-body truncate">{profile.dream_date_location}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bio */}
                    {profile.bio && <p className="text-white/80 text-sm font-body mb-3">{profile.bio}</p>}

                    {/* Message before matching */}
                    {onMessage && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onMessage(profile); }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-gold/15 backdrop-blur-sm border border-gold/40 text-gold text-sm font-heading font-semibold hover:bg-gold/25 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Message {displayName}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Expand toggle */}
            <button
              onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}
              className="mt-2 flex items-center gap-1 text-gold/90 text-sm font-heading font-semibold"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${showDetails ? "rotate-180" : ""}`} />
              {showDetails ? "Less" : "More about " + displayName}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Report sheet */}
      <AnimatePresence>
        {showReport && (
          <ReportUserSheet profileName={displayName} onClose={() => setShowReport(false)} />
        )}
      </AnimatePresence>
    </>
  );
});

export default SwipeCard;