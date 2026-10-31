import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ProfilePhoto from "@/components/common/ProfilePhoto";
import useDiscoverableProfiles from "@/hooks/useDiscoverableProfiles";

export default function ExploreCategorySheet({ category, onClose }) {
  const navigate = useNavigate();
  const { discoverable: profiles, isLoading } = useDiscoverableProfiles();
  const [liked, setLiked] = useState({});
  const toggleLike = (id) => setLiked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col"
      >
        {/* Header with tinted image */}
        <div
          className="relative h-36 flex-shrink-0"
          style={{ backgroundColor: category.color }}
        >
          <img
            src={category.image}
            alt={category.label}
            className="w-full h-full object-cover absolute inset-0"
            style={{ mixBlendMode: "luminosity", opacity: 0.4 }}
          />
          <div className="absolute inset-0" style={{ backgroundColor: category.tint }} />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-black/40 flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4 right-16">
            <h2 className="text-white font-heading font-bold text-xl drop-shadow-md">
              {category.label}
            </h2>
            <div className="flex items-center gap-1 mt-1">
              <Users className="w-3.5 h-3.5 text-white/80" />
              <span className="text-white/80 text-xs font-body">{profiles.length} people here</span>
            </div>
          </div>
        </div>

        {/* Profiles grid — real, complete profiles only */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-xs text-muted-foreground font-body mb-3">
            People in this vibe near you 👀
          </p>

          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-7 h-7 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm font-heading font-bold text-foreground">No one here yet</p>
              <p className="text-xs text-muted-foreground font-body mt-1">
                Profiles show up once they're complete.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {profiles.slice(0, 9).map((p) => (
                <motion.div
                  key={p.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/profile/${p.id}`, { state: { profiles, startId: p.id, category } })}
                  className="relative rounded-2xl overflow-hidden aspect-square cursor-pointer"
                >
                  <ProfilePhoto
                    src={p.photos?.[0]}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    iconClassName="w-8 h-8"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-xs font-heading font-semibold leading-tight">
                      {p.name}{p.age ? `, ${p.age}` : ""}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleLike(p.id); }}
                    aria-label={`Like ${p.name}`}
                    className="absolute top-2 right-2 w-9 h-9 rounded-full bg-gold flex items-center justify-center active:scale-90 transition-transform z-10"
                  >
                    <Heart className={`w-4 h-4 text-black ${liked[p.id] ? "fill-black" : ""}`} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div
          className="px-4 pt-4 border-t border-border/40 flex-shrink-0"
          style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
        >
          <Button
            className="w-full rounded-full bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] text-black font-heading font-bold"
            onClick={onClose}
          >
            Start Swiping in This Vibe 🔥
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}