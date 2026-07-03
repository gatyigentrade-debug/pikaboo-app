import { useState, useImperativeHandle, forwardRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { MapPin, Flame, ChevronDown, MessageCircle, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ReportUserSheet from "@/components/common/ReportUserSheet";

const SwipeCard = forwardRef(function SwipeCard({ profile, onSwipe, isTop, onMessage }, ref) {
  const [imgIdx, setImgIdx] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const x = useMotionValue(0);
  const controls = useAnimation();
  const rotate = useTransform(x, [-250, 250], [-20, 20]);
  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-120, -20], [1, 0]);
  const cardOpacity = useTransform(x, [-300, -200, 0, 200, 300], [0, 1, 1, 1, 0]);

  const photos = profile.photos || [];
  const photo = photos[imgIdx] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop";

  const flyOff = async (direction) => {
    await controls.start({
      x: direction === "like" ? 600 : -600,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeOut" },
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
        style={{ x, rotate, opacity: cardOpacity }}
        animate={controls}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.02 }}
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

          {/* Profile info */}
          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-3xl font-heading font-bold text-white">{profile.name}</h2>
              <span className="text-2xl font-heading font-light text-white/80">{profile.age}</span>
              {profile.is_verified && (
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow-lg" style={{boxShadow: '0 0 8px rgba(59,130,246,0.6)'}}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-white/70 text-sm mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>{profile.city}</span>
              {profile.distance_km && <span className="text-white/40">• {profile.distance_km} km away</span>}
            </div>

            {profile.braai_starter && (
              <div className="flex items-start gap-2 bg-white/10 backdrop-blur-sm rounded-2xl px-3 py-2 mb-3">
                <Flame className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-white/90 text-sm font-body italic">"{profile.braai_starter}"</p>
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
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

            {(profile.favorite_kota_spot || profile.dream_date_location || profile.cant_live_without) && (
              <div className="mt-3 space-y-1.5">
                {profile.favorite_kota_spot && (
                  <div className="flex items-center gap-2 bg-white/8 backdrop-blur-sm rounded-xl px-3 py-2">
                    <span className="text-base flex-shrink-0">📍</span>
                    <div className="min-w-0">
                      <p className="text-white/50 text-[10px] font-heading uppercase tracking-wide leading-none mb-0.5">Fave Spot</p>
                      <p className="text-white/90 text-xs font-body truncate">{profile.favorite_kota_spot}</p>
                    </div>
                  </div>
                )}
                {profile.cant_live_without && (
                  <div className="flex items-center gap-2 bg-white/8 backdrop-blur-sm rounded-xl px-3 py-2">
                    <span className="text-base flex-shrink-0">❤️</span>
                    <div className="min-w-0">
                      <p className="text-white/50 text-[10px] font-heading uppercase tracking-wide leading-none mb-0.5">Can't live without</p>
                      <p className="text-white/90 text-xs font-body truncate">{profile.cant_live_without}</p>
                    </div>
                  </div>
                )}
                {profile.dream_date_location && (
                  <div className="flex items-center gap-2 bg-white/8 backdrop-blur-sm rounded-xl px-3 py-2">
                    <span className="text-base flex-shrink-0">🌅</span>
                    <div className="min-w-0">
                      <p className="text-white/50 text-[10px] font-heading uppercase tracking-wide leading-none mb-0.5">Dream date</p>
                      <p className="text-white/90 text-xs font-body truncate">{profile.dream_date_location}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Message before matching */}
            {onMessage && (
              <button
                onClick={(e) => { e.stopPropagation(); onMessage(profile); }}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-heading font-semibold hover:bg-white/25 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Message {profile.name}
              </button>
            )}

            {/* Expand details */}
            <button
              onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}
              className="mt-2 flex items-center gap-1 text-white/50 text-xs"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${showDetails ? "rotate-180" : ""}`} />
              {showDetails ? "Less" : "More about " + profile.name}
            </button>

            {showDetails && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 space-y-2 text-sm text-white/80">
                {profile.bio && <p className="font-body">{profile.bio}</p>}
              </motion.div>
            )}
          </div>
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