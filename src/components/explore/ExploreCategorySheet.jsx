import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DEMO_PROFILES = [
  {
    name: "Nomsa", age: 24, photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&faces=1",
    bio: "Amapiano soul, kota connoisseur, and weekend hiker. Looking for someone to chase sunsets with.",
    braai_starter: "If you could only eat one kota combo forever, what's on it?",
    home_language: "isiZulu", braai_role: "Salady", spirit_animal: "Springbok", sports_team: "Kaizer Chiefs", looking_for: "relationship",
    favorite_kota_spot: "Panyaza in Braamfontein", dream_date_location: "Sunset picnic at Walter Sisulu", cant_live_without: "Log drums & good coffee",
  },
  {
    name: "Thabo", age: 27, photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop",
    bio: "Diski fanatic, braai master in training, and road-trip romantic. Let's chase the horizon.",
    braai_starter: "Chiefs or Pirates — and defend your answer 🔥",
    home_language: "Sesotho", braai_role: "Grill Master", spirit_animal: "Honey Badger", sports_team: "Orlando Pirates", looking_for: "casual",
    favorite_kota_spot: "The corner spot in Soweto", dream_date_location: "Drive-in at the Top Star", cant_live_without: "My vrrr phanda playlist",
  },
  {
    name: "Zanele", age: 22, photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop",
    bio: "Creative spirit, foodie darling, and sunset chaser. I collect moments, not things.",
    braai_starter: "Best shisanyama in Joburg — where we going first?",
    home_language: "isiXhosa", braai_role: "Fire Maker", spirit_animal: "Hadeda", sports_team: "Mamelodi Sundowns", looking_for: "friendship",
    favorite_kota_spot: "Kota Zone in Tembisa", dream_date_location: "Rooftop dinner in Maboneng", cant_live_without: "My film camera",
  },
  {
    name: "Lebo", age: 25, photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop",
    bio: "Soft-life king, gym rat, and coffee snob. Building a life worth travelling for.",
    braai_starter: "What's your ideal Sunday — braai or brunch?",
    home_language: "Setswana", braai_role: "Braai Boss", spirit_animal: "Dassie", sports_team: "Springboks", looking_for: "relationship",
    favorite_kota_spot: "Gourmet Kota in Sandton", dream_date_location: "Wine farm weekend in Stellenbosch", cant_live_without: "Espresso & gym sessions",
  },
  {
    name: "Sipho", age: 29, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
    bio: "Outdoorsy, easy-going, and big on family. Looking for something real and lasting.",
    braai_starter: "Mountains or ocean — pick one for our first trip.",
    home_language: "Sepedi", braai_role: "Grill Master", spirit_animal: "Pangolin", sports_team: "Springboks", looking_for: "relationship",
    favorite_kota_spot: "Local tshisa nyama in Atteridgeville", dream_date_location: "Hiking the Drakensberg", cant_live_without: "My hiking boots",
  },
  {
    name: "Ayanda", age: 23, photo: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=120&h=120&fit=crop",
    bio: "Nightlife lover, amapiano DJ on the side, and serial foodie. Let's vibe.",
    braai_starter: "What's the one song that gets you on the dance floor?",
    home_language: "siSwati", braai_role: "Salady", spirit_animal: "Springbok", sports_team: "Kaizer Chiefs", looking_for: "not_sure",
    favorite_kota_spot: "Late-night kota in Yeoville", dream_date_location: "Rooftop set at a club in Rosebank", cant_live_without: "My DJ headphones",
  },
];

export default function ExploreCategorySheet({ category, onClose }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState({});
  const toggleLike = (name) => setLiked((prev) => ({ ...prev, [name]: !prev[name] }));
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
                  onClick={(e) => { e.stopPropagation(); toggleLike(p.name); }}
                  className="absolute top-2 right-2 w-9 h-9 rounded-full bg-primary/80 flex items-center justify-center active:scale-90 transition-transform"
                >
                  <Heart className={`w-4 h-4 text-white ${liked[p.name] ? "fill-white" : ""}`} />
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