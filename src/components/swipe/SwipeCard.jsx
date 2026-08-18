import { useState, useImperativeHandle, forwardRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation, useMotionTemplate } from "framer-motion";
import { MapPin, Flame, ChevronDown, MessageCircle, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ReportUserSheet from "@/components/common/ReportUserSheet";

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
  const boxShadow = useMotionTemplate`0 0 40px rgba(74, 222, 128, ${likeGlow}), 0 0 40px rgba(248, 113, 113, ${nopeGlow})`;

  const photos = profile.photos || [];
  const photo = photos[imgIdx] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop";

  const flyOff = async (direction) => {
    await controls.start({
      x: direction === "like" ? 700 : -700,
      y: -40,
      rotate: direction === "like" ? 35 : -35,
      scale: 0.85,
      opacity: 0,
      transition: { duration: 0.35, ease: "easeOut" },
    });
    onSwipe(direction === "like" ? "like" : "dislike");
  };

  useImperativeHandle(ref, () => ({ flyOff }));

  const handleDragEnd = (_, info) => {
    const swipeThreshold = 80;
    const velocityThreshold = 500;
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
      <div className="absolute inset-0 rounded-3xl overflow-hidden bg-secondary scale-[0.95] opacity-60">
        <img src={photo} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
      </div>
    );
  }

  return (
    <>
      <motion.div
        className="absolute inset-0 rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing card-enter touch-none"
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
          <img src={photo} alt={profile.name} className="w-full h-full object-cover" />

          {/* Photo indicators */}
          {photos.length > 1 && (
            <div className="absolute top-4 left-4 right-4 flex gap-1.5 z-20">
              {photos.map((_, i) => (
                <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${i === imgIdx ? "bg-white" : "bg-white/30"}`} />
              ))}
            </div>
          )}

          {/* Report button */}
          <button
            onClick={(e) => { e.stopPropagation(); setShowReport(true); }}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-destructive/60 transition-colors"
          >
            <Flag className="w-3.5 h-3.5 text-white" />
          </button>

          {/* Swipe labels */}
          <motion.div className="absolute top-20 left-6 z-20 border-4 border-green-400 rounded-xl px-4 py-2 -rotate-12" style={{ opacity: likeOpacity }}>
            <span className="text-green-400 font-heading font-black text-3xl">LEKKER</span>
          </motion.div>
          <motion.div className="absolute top-20 right-6 z-20 border-4 border-destructive rounded-xl px-4 py-2 rotate-12" style={{ opacity: nopeOpacity }}>
            <span className="text-destructive font-heading font-black text-3xl">NOPE</span>
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

          {/* Minimal on-photo info (Badoo style) */}
          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-heading font-bold text-white drop-shadow-lg">{profile.name}</h2>
              <span className="text-2xl font-heading font-light text-white/80 drop-shadow-lg">{profile.age}</span>
              {profile.is_verified && (
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow-lg" style={{boxShadow: '0 0 8px rgba(59,130,246,0.6)'}}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-white/80 text-sm mt-1 drop-shadow-lg">
              <MapPin className="w-3.5 h-3.5" />
              <span>{profile.city}</span>
              {profile.distance_km && <span className="text-white/50">· {profile.distance_km} km away</span>}
            </div>

            {/* Expand toggle */}
            <button
              onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}
              className="mt-2 flex items-center gap-1 text-white/70 text-xs font-heading font-semibold"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${showDetails ? "rotate-180" : ""}`} />
              {showDetails ? "Less" : "More about " + profile.name}
            </button>
          </div>

          {/* Slide-up details panel (Badoo style) */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                onClick={(e) => e.stopPropagation()}
                className="absolute inset-x-0 bottom-0 top-16 z-30 bg-background/95 backdrop-blur-xl rounded-t-3xl overflow-y-auto p-5 pt-4 touch-pan-y overscroll-contain"
              >
                {/* Grab handle */}
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-1 rounded-full bg-white/20" />
                </div>

                {/* Quote */}
                {profile.braai_starter && (
                  <div className="flex items-start gap-2 bg-white/10 rounded-2xl px-3 py-2 mb-3">
                    <Flame className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-white/90 text-sm font-body italic">"{profile.braai_starter}"</p>
                  </div>
                )}

                {/* Interest pills */}
                <div className="flex gap-2 flex-wrap mb-4">
                  {profile.home_language && <Badge className="bg-primary/20 text-primary border-primary/30 border font-body text-xs">{profile.home_language}</Badge>}
                  {profile.braai_role && <Badge className="bg-amber/20 text-amber border-amber/30 border font-body text-xs">🔥 {profile.braai_role}</Badge>}
                  {profile.spirit_animal && <Badge className="bg-violet/20 text-violet border-violet/30 border font-body text-xs">{profile.spirit_animal}</Badge>}
                  {profile.sports_team && <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border font-body text-xs">⚽ {profile.sports_team}</Badge>}
                  {profile.looking_for && (
                    <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30 border font-body text-xs">
                      {profile.looking_for === "relationship" ? "💍 Relationship" : profile.looking_for === "friendship" ? "🤝 Friendship" : profile.looking_for === "casual" ? "✌️ Casual" : "🤔 Not Sure"}
                    </Badge>
                  )}
                </div>

                {/* Lifestyle details */}
                {(profile.favorite_kota_spot || profile.dream_date_location || profile.cant_live_without) && (
                  <div className="space-y-2 mb-4">
                    {profile.favorite_kota_spot && (
                      <div className="flex items-center gap-2 bg-white/8 rounded-xl px-3 py-2">
                        <span className="text-base flex-shrink-0">📍</span>
                        <div className="min-w-0">
                          <p className="text-white/50 text-[10px] font-heading uppercase tracking-wide leading-none mb-0.5">Fave Spot</p>
                          <p className="text-white/90 text-xs font-body truncate">{profile.favorite_kota_spot}</p>
                        </div>
                      </div>
                    )}
                    {profile.cant_live_without && (
                      <div className="flex items-center gap-2 bg-white/8 rounded-xl px-3 py-2">
                        <span className="text-base flex-shrink-0">❤️</span>
                        <div className="min-w-0">
                          <p className="text-white/50 text-[10px] font-heading uppercase tracking-wide leading-none mb-0.5">Can't live without</p>
                          <p className="text-white/90 text-xs font-body truncate">{profile.cant_live_without}</p>
                        </div>
                      </div>
                    )}
                    {profile.dream_date_location && (
                      <div className="flex items-center gap-2 bg-white/8 rounded-xl px-3 py-2">
                        <span className="text-base flex-shrink-0">🌅</span>
                        <div className="min-w-0">
                          <p className="text-white/50 text-[10px] font-heading uppercase tracking-wide leading-none mb-0.5">Dream date</p>
                          <p className="text-white/90 text-xs font-body truncate">{profile.dream_date_location}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Bio */}
                {profile.bio && <p className="text-white/80 text-sm font-body mb-4">{profile.bio}</p>}

                {/* Message before matching */}
                {onMessage && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onMessage(profile); }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-heading font-semibold hover:bg-white/25 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Message {profile.name}
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Report sheet */}
      <AnimatePresence>
        {showReport && (
          <ReportUserSheet profileName={profile.name} onClose={() => setShowReport(false)} />
        )}
      </AnimatePresence>
    </>
  );
});

export default SwipeCard;