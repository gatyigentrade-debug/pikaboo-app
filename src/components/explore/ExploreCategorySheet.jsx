import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DEMO_PROFILES = [
  { name: "Nomsa", age: 24, photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&faces=1" },
  { name: "Thabo", age: 27, photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop" },
  { name: "Zanele", age: 22, photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop" },
  { name: "Lebo", age: 25, photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop" },
  { name: "Sipho", age: 29, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop" },
  { name: "Ayanda", age: 23, photo: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=120&h=120&fit=crop" },
];

export default function ExploreCategorySheet({ category, onClose }) {
  const navigate = useNavigate();
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
              <span className="text-white/80 text-xs font-body">{category.count} people here</span>
            </div>
          </div>
        </div>

        {/* Profiles grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-xs text-muted-foreground font-body mb-3">
            People in this vibe near you 👀
          </p>
          <div className="grid grid-cols-3 gap-3">
            {DEMO_PROFILES.map((p) => (
              <motion.div
                key={p.name}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/profile/${encodeURIComponent(p.name)}`, { state: { profiles: DEMO_PROFILES, startName: p.name, category } })}
                className="relative rounded-2xl overflow-hidden aspect-square cursor-pointer"
              >
                <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs font-heading font-semibold leading-tight">
                    {p.name}, {p.age}
                  </p>
                </div>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-2 right-2 w-9 h-9 rounded-full bg-primary/80 flex items-center justify-center"
                >
                  <Heart className="w-4 h-4 text-white" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="p-4 border-t border-border/40 flex-shrink-0">
          <Button className="w-full rounded-full bg-primary font-heading font-bold" onClick={onClose}>
            Start Swiping in This Vibe 🔥
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}