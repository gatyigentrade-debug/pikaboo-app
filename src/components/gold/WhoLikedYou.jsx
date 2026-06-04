import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Crown, Lock } from "lucide-react";
import { base44 } from "@/api/base44Client";

const MOCK_BLURRED = [
  { id: "b1", name: "Thandi", photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80" },
  { id: "b2", name: "Amara", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80" },
  { id: "b3", name: "Lerato", photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&q=80" },
  { id: "b4", name: "Zola", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80" },
  { id: "b5", name: "Nandi", photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80" },
  { id: "b6", name: "Kemi", photo: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=80" },
];

export default function WhoLikedYou({ isGold, myProfileId, onUpgrade }) {
  const { data: likes = [] } = useQuery({
    queryKey: ["swipe-likes", myProfileId],
    queryFn: () => base44.entities.SwipeLike.filter({ liked_profile_id: myProfileId }),
    enabled: isGold && !!myProfileId,
  });

  const displayItems = isGold ? likes : MOCK_BLURRED;
  const count = isGold ? likes.length : "12+";

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-400" />
          <h2 className="font-heading font-bold text-foreground text-base">
            {isGold ? "Who Liked You" : "People Who Liked You"}
          </h2>
          <span className="px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 text-xs font-heading font-bold">
            {count}
          </span>
        </div>
        {!isGold && (
          <button
            onClick={onUpgrade}
            className="text-xs font-heading font-bold text-yellow-400 underline underline-offset-2"
          >
            Unlock
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2">
        {displayItems.slice(0, 6).map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            className="relative aspect-square rounded-2xl overflow-hidden"
          >
            <img
              src={isGold ? item.liker_photo : item.photo}
              alt={isGold ? item.liker_name : item.name}
              className={`w-full h-full object-cover transition-all duration-300 ${!isGold ? "blur-md scale-110" : ""}`}
            />
            {!isGold && (
              <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
                <Lock className="w-5 h-5 text-white mb-1" />
              </div>
            )}
            {isGold && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5">
                <p className="text-white text-xs font-heading font-semibold truncate">{item.liker_name}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Upgrade CTA for free users */}
      {!isGold && (
        <button
          onClick={onUpgrade}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 text-black font-heading font-black text-sm shadow-lg shadow-yellow-500/20 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Crown className="w-4 h-4" />
          See who likes you — Get Gold
        </button>
      )}
    </div>
  );
}