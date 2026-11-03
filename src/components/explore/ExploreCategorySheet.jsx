import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Heart, ArrowRight } from "lucide-react";
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
        className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#171717] rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col border-t border-gold/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with tinted image */}
        <div className="relative h-40 flex-shrink-0">
          <img
            src={category.image}
            alt={category.label}
            className="w-full h-full object-cover absolute inset-0"
          />
          {category.tint && <div className="absolute inset-0" style={{ backgroundColor: category.tint }} />}
          <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-black/30 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-gold/30 flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-white font-heading font-bold text-xl drop-shadow-md">{category.label}</h2>
            {category.description && (
              <p className="text-white/80 text-xs font-body mt-1 max-w-[90%]">{category.description}</p>
            )}
            <div className="flex items-center gap-1 mt-1.5">
              <Users className="w-3.5 h-3.5 text-gold" />
              <span className="text-gold/90 text-xs font-body">
                {profiles.length} {profiles.length === 1 ? "person" : "people"} here
              </span>
            </div>
          </div>
        </div>

        {/* Profiles grid — real, complete profiles only */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-xs text-muted-foreground font-body mb-3">People in this vibe near you 👀</p>

          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-7 h-7 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm font-heading font-bold text-foreground">No one here yet</p>
              <p className="text-xs text-muted-foreground font-body mt-1">Profiles show up once they're complete.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {profiles.slice(0, 9).map((p) => (
                <motion.div
                  key={p.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/profile/${p.id}`, { state: { profiles, startId: p.id, category } })}
                  className="relative rounded-2xl overflow-hidden aspect-square cursor-pointer border border-white/5 hover:border-gold/30 transition-colors"
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
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gold flex items-center justify-center active:scale-90 transition-transform z-10"
                  >
                    <Heart className={`w-3.5 h-3.5 text-[#171717] ${liked[p.id] ? "fill-[#171717]" : ""}`} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div
          className="px-4 pt-4 border-t border-gold/15 flex-shrink-0"
          style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
        >
          <button
            onClick={onClose}
            className="w-full h-12 rounded-full bg-gradient-to-r from-[#F3E5AB] to-[#D4A54A] text-[#171717] font-heading font-bold text-sm glow-gold active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            Start Swiping in This Vibe <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}