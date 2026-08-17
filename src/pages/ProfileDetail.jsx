import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Share2, MapPin, BadgeCheck } from "lucide-react";

export default function ProfileDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const profile = location.state?.profile;

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-sm text-muted-foreground font-body">Profile not found.</p>
        <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-heading font-bold">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero image */}
      <div className="relative w-full aspect-[3/4] max-h-[68vh]">
        <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-black/40" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-[calc(1rem+env(safe-area-inset-top))] left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <button
          className="absolute top-[calc(1rem+env(safe-area-inset-top))] right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform"
        >
          <Share2 className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Info card */}
      <div className="flex-1 -mt-6 relative z-10 bg-background rounded-t-3xl px-5 pt-5 pb-28">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-heading font-bold text-foreground">{profile.name}</h1>
          <span className="text-xl font-heading text-muted-foreground">{profile.age}</span>
          <BadgeCheck className="w-5 h-5 text-gold" />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-body mb-4">
          <MapPin className="w-3.5 h-3.5" /> Nearby · within 50 km
        </div>

        <p className="text-sm text-muted-foreground font-body leading-relaxed">
          Hey, I'm {profile.name}. Let's see where the vibe takes us 🌙
        </p>
      </div>

      {/* Action bar */}
      <div
        className="fixed bottom-0 left-0 right-0 px-5 py-4 bg-background/90 backdrop-blur-xl border-t border-border/40 flex items-center gap-4"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}
      >
        <button
          onClick={() => navigate(-1)}
          className="w-12 h-12 rounded-full border border-border flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex-1 max-w-xs h-12 rounded-full bg-gradient-to-r from-yellow-400 to-gold text-black font-heading font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
        >
          <Heart className="w-5 h-5" /> Like
        </motion.button>
      </div>
    </div>
  );
}