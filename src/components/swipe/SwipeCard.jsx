import { useState, useImperativeHandle, forwardRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation, useMotionTemplate } from "framer-motion";
import { MapPin, Flag, Info } from "lucide-react";
import ReportUserSheet from "@/components/common/ReportUserSheet";
import ProfilePhoto from "@/components/common/ProfilePhoto";
import { firstName, isVerifiedProfile, realPhotos } from "@/utils/profile";

const SwipeCard = forwardRef(function SwipeCard({ profile, onSwipe, isTop, onInfo }, ref) {
  const [imgIdx, setImgIdx] = useState(0);
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
  const boxShadow = useMotionTemplate`0 0 44px rgba(212,175,55, ${likeGlow}), 0 0 44px rgba(232,121,121, ${nopeGlow})`;

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
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-black/20 to-transparent" />
      </div>
    );
  }

  return (
    <>
      <motion.div
        className="absolute inset-0 rounded-[28px] overflow-hidden cursor-grab active:cursor-grabbing card-enter premium-card-shadow touch-none"
        style={{ x, rotate, scale, opacity: cardOpacity, boxShadow }}
        animate={controls}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
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

          {/* Report */}
          <button
            onClick={(e) => { e.stopPropagation(); setShowReport(true); }}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-coral/60 transition-colors"
          >
            <Flag className="w-3.5 h-3.5 text-white" />
          </button>

          {/* Swipe labels */}
          <motion.div className="absolute top-20 left-6 z-20 rounded-xl px-4 py-2 -rotate-12 border-2 border-gold" style={{ opacity: likeOpacity, boxShadow: "0 0 26px rgba(212,175,55,0.45)" }}>
            <span className="text-gold font-heading font-black text-3xl tracking-tight">LEKKER</span>
          </motion.div>
          <motion.div className="absolute top-20 right-6 z-20 rounded-xl px-4 py-2 rotate-12 border-2 border-coral" style={{ opacity: nopeOpacity, boxShadow: "0 0 26px rgba(232,121,121,0.4)" }}>
            <span className="text-coral font-heading font-black text-3xl tracking-tight">NOPE</span>
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-black/40 to-transparent" />

          {/* Identity */}
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

            {profile.bio && (
              <p className="text-white/85 text-sm font-body mt-2 line-clamp-2 drop-shadow-lg">{profile.bio}</p>
            )}

            {onInfo && (
              <button
                onClick={(e) => { e.stopPropagation(); onInfo(profile); }}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-gold/40 text-gold text-xs font-heading font-semibold hover:bg-white/15 transition-colors"
              >
                <Info className="w-3.5 h-3.5" />
                View profile
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showReport && (
          <ReportUserSheet profileName={displayName} onClose={() => setShowReport(false)} />
        )}
      </AnimatePresence>
    </>
  );
});

export default SwipeCard;