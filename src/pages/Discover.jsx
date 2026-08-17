import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Heart, X, Star, Undo2, MapPin, BadgeCheck, Loader2 } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import { base44 } from "@/api/base44Client";

// Always-on fallback so the screen is never blank.
const FALLBACK_PROFILES = [
  { id: "f1", name: "Nomsa", age: 24, city: "Johannesburg", bio: "Amapiano soul & shisanyama nights. Looking for someone who can keep up on the dance floor. 💃", photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=900&fit=crop", is_verified: true },
  { id: "f2", name: "Thabo", age: 27, city: "Pretoria", bio: "Diski darling ⚽ Chiefs till I die. Braai boss on weekends — swipe right if you bring the salad.", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=900&fit=crop", is_verified: true },
  { id: "f3", name: "Zanele", age: 22, city: "Durban", bio: "Beach baby & kota connoisseur. Soft life only. ✨", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=900&fit=crop", is_verified: false },
  { id: "f4", name: "Lebo", age: 25, city: "Cape Town", bio: "Hiker, foodie, hopeless romantic. Let's chase sunsets on Table Mountain. 🌄", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=900&fit=crop", is_verified: true },
  { id: "f5", name: "Sipho", age: 29, city: "Bloemfontein", bio: "Honey badger energy. Grill master, gym rat, gentle heart. 🍖", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=900&fit=crop", is_verified: false },
];

const withTimeout = (p, ms, fallback) =>
  Promise.race([p, new Promise((res) => setTimeout(() => res(fallback), ms))]);

const normalize = (p) => ({
  id: p.id,
  name: p.name || "PikaBoo user",
  age: p.age,
  city: p.city || "South Africa",
  bio: p.bio || p.braai_starter || "Say hi 👋",
  photo:
    (p.photos && p.photos[0]) ||
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=900&fit=crop",
  is_verified: !!p.is_verified,
});

export default function Discover() {
  const [real, setReal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let done = false;
    const timer = setTimeout(() => {
      if (!done) setLoading(false);
    }, 8000);
    withTimeout(base44.entities.DatingProfile.list(), 8000, [])
      .then((p) => {
        done = true;
        clearTimeout(timer);
        setReal(Array.isArray(p) && p.length ? p : []);
        setLoading(false);
      })
      .catch(() => {
        done = true;
        clearTimeout(timer);
        setLoading(false);
      });
    return () => {
      done = true;
      clearTimeout(timer);
    };
  }, []);

  // Real profiles if we have them, otherwise guaranteed fallback content.
  const deck = useMemo(() => (real.length ? real.map(normalize) : FALLBACK_PROFILES), [real]);

  const top = deck[index] || deck[0];
  const behind = deck.slice(index + 1, index + 3);

  const advance = () => setIndex((i) => (i + 1 < deck.length ? i + 1 : 0));
  const swipe = (dir) => {
    setHistory((h) => [...h, index]);
    advance();
  };
  const undo = () => {
    setHistory((h) => {
      if (!h.length) return h;
      const last = h[h.length - 1];
      setIndex(last);
      return h.slice(0, -1);
    });
  };

  const onDragEnd = (e, info) => {
    if (info.offset.x > 120) swipe("right");
    else if (info.offset.x < -120) swipe("left");
  };

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: "#0A0A0C" }}>
      {/* Ambient gold glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 18%, rgba(212,175,55,0.10) 0%, transparent 55%)" }}
      />

      {/* Header */}
      <div className="relative z-10 px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-2 flex items-center gap-2">
        <Compass className="w-6 h-6 text-gold" />
        <h1 className="text-2xl font-heading font-bold text-white">Discover</h1>
        <span className="ml-auto text-xs text-gold/70 font-body">{deck.length} nearby</span>
      </div>

      {/* Card area */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-4" style={{ minHeight: "58vh" }}>
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
            <p className="text-xs text-gold/60 font-body">Finding your vibes…</p>
          </div>
        ) : (
          <div className="relative w-full max-w-sm h-[62vh]">
            {/* Background stack */}
            {behind.map((p, i) => (
              <div
                key={"bg-" + p.id + "-" + i}
                className="absolute inset-0 rounded-3xl overflow-hidden border border-gold/15"
                style={{
                  transform: `scale(${0.94 - i * 0.04}) translateY(${(i + 1) * 14}px)`,
                  zIndex: 5 - i,
                  opacity: 0.8,
                }}
              >
                <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              </div>
            ))}

            {/* Top draggable card */}
            <AnimatePresence>
              <motion.div
                key={top.id + "-" + index}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={onDragEnd}
                initial={{ scale: 0.96, opacity: 0, y: 18 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                className="absolute inset-0 rounded-3xl overflow-hidden border border-gold/25 cursor-grab active:cursor-grabbing"
                style={{ zIndex: 10, boxShadow: "0 22px 50px rgba(0,0,0,0.65)" }}
              >
                <img src={top.photo} alt={top.name} className="w-full h-full object-cover pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                {/* Swipe hints */}
                <motion.div
                  className="absolute top-6 left-6 px-3 py-1 rounded-full border-2 border-gold text-gold font-heading font-bold text-sm rotate-[-12deg]"
                  style={{ opacity: 0 }}
                  animate={{ opacity: 0 }}
                >
                  LIKE
                </motion.div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-heading font-bold text-white drop-shadow-md">
                      {top.name}
                      {top.age ? `, ${top.age}` : ""}
                    </h2>
                    {top.is_verified && <BadgeCheck className="w-5 h-5 text-gold" />}
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-white/80 text-sm font-body">
                    <MapPin className="w-3.5 h-3.5" /> {top.city}
                  </div>
                  <p className="text-white/90 text-sm font-body mt-2 line-clamp-3">{top.bio}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="relative z-10 flex items-center justify-center gap-5 pb-6">
        <button
          onClick={undo}
          disabled={!history.length}
          className="w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform disabled:opacity-30"
          style={{ border: "1px solid rgba(212,175,55,0.4)", background: "rgba(20,20,25,0.6)" }}
        >
          <Undo2 className="w-5 h-5 text-gold" />
        </button>
        <button
          onClick={() => swipe("left")}
          className="w-14 h-14 rounded-full flex items-center justify-center active:scale-95 transition-transform"
          style={{ border: "1px solid rgba(212,175,55,0.4)", background: "rgba(20,20,25,0.6)" }}
        >
          <X className="w-6 h-6 text-rose-400" />
        </button>
        <button
          onClick={() => swipe("up")}
          className="w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform"
          style={{ border: "1px solid rgba(212,175,55,0.4)", background: "rgba(20,20,25,0.6)" }}
        >
          <Star className="w-5 h-5 text-gold" />
        </button>
        <button
          onClick={() => swipe("right")}
          className="w-14 h-14 rounded-full flex items-center justify-center active:scale-95 transition-transform"
          style={{ border: "1px solid rgba(212,175,55,0.4)", background: "rgba(20,20,25,0.6)" }}
        >
          <Heart className="w-6 h-6 text-gold" />
        </button>
      </div>

      <div className="h-20" />
      <BottomNav />
    </div>
  );
}