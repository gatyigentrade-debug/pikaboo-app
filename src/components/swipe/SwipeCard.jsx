import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { MapPin, Flame, Shield, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SwipeCard({ profile, onSwipe, isTop }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const photos = profile.photos || [];
  const photo = photos[imgIdx] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop";

  const handleDragEnd = (_, info) => {
    const threshold = 120;
    if (info.offset.x > threshold) {
      onSwipe("like");
    } else if (info.offset.x < -threshold) {
      onSwipe("dislike");
    }
  };

  const handleTapPhoto = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const tapX = e.clientX - rect.left;
    if (tapX > rect.width / 2 && imgIdx < photos.length - 1) {
      setImgIdx(imgIdx + 1);
    } else if (tapX <= rect.width / 2 && imgIdx > 0) {
      setImgIdx(imgIdx - 1);
    }
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
    <motion.div
      className="absolute inset-0 rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing card-enter"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
    >
      {/* Photo */}
      <div className="relative w-full h-full" onClick={handleTapPhoto}>
        <img
          src={photo}
          alt={profile.name}
          className="w-full h-full object-cover"
        />

        {/* Photo indicators */}
        {photos.length > 1 && (
          <div className="absolute top-4 left-4 right-4 flex gap-1.5 z-20">
            {photos.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full transition-colors ${
                  i === imgIdx ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        )}

        {/* Swipe labels */}
        <motion.div
          className="absolute top-20 left-6 z-20 border-4 border-green-400 rounded-xl px-4 py-2 -rotate-12"
          style={{ opacity: likeOpacity }}
        >
          <span className="text-green-400 font-heading font-black text-3xl">LEKKER</span>
        </motion.div>
        <motion.div
          className="absolute top-20 right-6 z-20 border-4 border-destructive rounded-xl px-4 py-2 rotate-12"
          style={{ opacity: nopeOpacity }}
        >
          <span className="text-destructive font-heading font-black text-3xl">NOPE</span>
        </motion.div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        {/* Profile info */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-3xl font-heading font-bold text-white">
              {profile.name}
            </h2>
            <span className="text-2xl font-heading font-light text-white/80">
              {profile.age}
            </span>
            {profile.is_verified && (
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-green-400" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-white/70 text-sm mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>{profile.city}</span>
            {profile.distance_km && (
              <span className="text-white/40">• {profile.distance_km} km away</span>
            )}
          </div>

          {profile.braai_starter && (
            <div className="flex items-start gap-2 bg-white/10 backdrop-blur-sm rounded-2xl px-3 py-2 mb-3">
              <Flame className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-white/90 text-sm font-body italic">
                "{profile.braai_starter}"
              </p>
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            {profile.home_language && (
              <Badge className="bg-primary/20 text-primary border-primary/30 border font-body text-xs">
                {profile.home_language}
              </Badge>
            )}
            {profile.braai_role && (
              <Badge className="bg-amber/20 text-amber border-amber/30 border font-body text-xs">
                🔥 {profile.braai_role}
              </Badge>
            )}
            {profile.spirit_animal && (
              <Badge className="bg-violet/20 text-violet border-violet/30 border font-body text-xs">
                {profile.spirit_animal}
              </Badge>
            )}
          </div>

          {/* Expand details */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(!showDetails);
            }}
            className="mt-3 flex items-center gap-1 text-white/50 text-xs"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showDetails ? "rotate-180" : ""}`} />
            {showDetails ? "Less" : "More about " + profile.name}
          </button>

          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 space-y-2 text-sm text-white/80"
            >
              {profile.bio && <p className="font-body">{profile.bio}</p>}
              {profile.dream_date_location && (
                <p className="text-white/60">
                  <span className="text-primary">Dream date:</span> {profile.dream_date_location}
                </p>
              )}
              {profile.cant_live_without && (
                <p className="text-white/60">
                  <span className="text-primary">Can't live without:</span> {profile.cant_live_without}
                </p>
              )}
              {profile.sports_team && (
                <p className="text-white/60">
                  <span className="text-primary">Team:</span> {profile.sports_team}
                </p>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}