import { useState } from "react";
import { MapPin, Camera, Pencil, ShoppingBag, ChevronRight } from "lucide-react";
import PikaBooShop from "@/components/shop/PikaBooShop";

const myProfile = {
  name: "Nemza",
  age: 25,
  city: "Johannesburg",
  vibe: "Chill Vibe",
  bio: "Testing the waters",
  interests: ["Amapiano", "Soccer", "Road Trips", "Braai"],
  photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"],
};

export default function Profile() {
  const [showShop, setShowShop] = useState(false);

  return (
    <div className="pb-28">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5">
        <h1 className="text-xl font-heading font-bold text-foreground">My Profile</h1>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold/40 text-gold text-xs font-heading font-bold">
          <Pencil className="w-3 h-3" />
          Edit
        </button>
      </div>

      {/* Hero */}
      <div className="flex flex-col items-center pt-6 pb-5">
        <div className="relative">
          <div className="w-28 h-28 rounded-full border-4 border-gold overflow-hidden glow-gold">
            <img src={myProfile.photos[0]} alt={myProfile.name} className="w-full h-full object-cover" />
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gold flex items-center justify-center border-2 border-background">
            <Camera className="w-4 h-4 text-black" />
          </button>
        </div>
        <h2 className="text-xl font-heading font-bold text-foreground mt-3">
          {myProfile.name}, {myProfile.age}
        </h2>
        <div className="flex items-center gap-1 text-muted-foreground text-sm font-body mt-0.5">
          <MapPin className="w-3.5 h-3.5" />
          {myProfile.city}
        </div>
        <span className="mt-2 px-3 py-1 rounded-full border border-gold/40 text-gold text-xs font-body font-semibold">
          {myProfile.vibe}
        </span>
      </div>

      {/* Cards */}
      <div className="px-4 space-y-3">
        {/* Photos */}
        <div className="rounded-2xl bg-secondary/30 border border-border/40 p-4">
          <h3 className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Photos (1/6)
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="aspect-square rounded-xl overflow-hidden">
              <img src={myProfile.photos[0]} alt="" className="w-full h-full object-cover" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl border-2 border-dashed border-border/40 flex items-center justify-center">
                <Camera className="w-5 h-5 text-muted-foreground/40" />
              </div>
            ))}
          </div>
        </div>

        {/* About Me */}
        <div className="rounded-2xl bg-secondary/30 border border-border/40 p-4">
          <h3 className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider mb-2">
            About Me
          </h3>
          <p className="text-sm text-foreground/80 font-body">{myProfile.bio}</p>
        </div>

        {/* Interests */}
        <div className="rounded-2xl bg-secondary/30 border border-border/40 p-4">
          <h3 className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {myProfile.interests.map((interest) => (
              <span key={interest} className="px-3 py-1.5 rounded-full border border-gold/30 text-gold text-xs font-body">
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* PikaBoo Shop */}
        <button
          onClick={() => setShowShop(true)}
          className="w-full rounded-2xl border border-gold/30 bg-secondary/30 p-4 flex items-center gap-3 hover:bg-secondary/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="w-5 h-5 text-gold" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-heading font-bold text-foreground">PikaBoo Shop 🛍️</p>
            <p className="text-[11px] text-muted-foreground font-body">Insider · VIP · Boosts · Drink Tokens</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Shop Modal */}
      <PikaBooShop isOpen={showShop} onClose={() => setShowShop(false)} />
    </div>
  );
}