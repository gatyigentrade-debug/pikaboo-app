import { motion } from "framer-motion";
import { Heart, X } from "lucide-react";

export default function EncounterCard({ profile, onLike, onPass }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl overflow-hidden aspect-[3/4] group"
    >
      <img
        src={profile.photos?.[0]}
        alt={profile.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-sm font-heading font-bold text-white">
          {profile.name}, {profile.age}
        </p>
        <p className="text-xs text-white/60 font-body">{profile.city}</p>

        <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onPass}
            className="flex-1 bg-destructive/20 hover:bg-destructive/30 text-destructive rounded-xl py-1.5 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={onLike}
            className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary rounded-xl py-1.5 flex items-center justify-center"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}