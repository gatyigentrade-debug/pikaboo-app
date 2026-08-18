import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Eye, Wine, Star, Crown, Check, Heart, Sparkles } from "lucide-react";
import { triggerPurchase, BILLING_PRODUCTS } from "@/utils/billing";

const VENUES = ["Marble JHB", "Shimmy CPT", "The Rooftop", "Ocean Basket"];

const FREE_PERKS = [
  "Swipe in any category",
  "Basic matches & chat",
  "10 likes per day",
];

const PLUS_PERKS = [
  "Unlimited Likes",
  "See Who Likes You",
  "Unlimited Rewinds",
  "5 Super Likes weekly",
  "1 Boost weekly",
  "Advanced Filters",
  "Read Receipts",
  "Premium Badge",
  "Priority Matching",
];

const GOLD_PERKS = [
  "Unlimited Boosts",
  "Unlimited Super Likes",
  "Passport Mode",
  "Top Profile Placement",
  "Profile Insights",
  "See Who Viewed Me",
  "Gold Badge",
  "Priority Support",
  "Exclusive Venue Offers",
  "Date Guarantee",
];

const POWER_UPS = [
  { id: "boost", icon: Zap, name: "Friday Night Boost ⚡", tag: "WKD ONLY", tagColor: "text-gold border-gold/40", desc: "Hyper-boost your profile in a category between 6 PM–midnight tonight", price: "R19", productId: BILLING_PRODUCTS.BOOST, iconBg: "bg-gold/15", iconColor: "text-gold" },
  { id: "drink", icon: Wine, name: "Buy a Drink 🥂", tag: "3-PACK", tagColor: "text-violet border-violet/40", desc: "3 premium animated icebreakers — pins your message to the top of their inbox", price: "R29", productId: BILLING_PRODUCTS.DRINK, iconBg: "bg-violet/15", iconColor: "text-violet" },
  { id: "unblur", icon: Eye, name: "Instant Unblur 👁️", desc: "Reveal a blurred profile without a match — one use", price: "R9", productId: BILLING_PRODUCTS.UNBLUR, iconBg: "bg-teal-500/15", iconColor: "text-teal-400" },
  { id: "super5", icon: Heart, name: "5 Super Likes", desc: "Stand out and triple your chances of matching", price: "R29", productId: BILLING_PRODUCTS.SUPER_LIKES_5, iconBg: "bg-pink-500/15", iconColor: "text-pink-400" },
  { id: "super20", icon: Heart, name: "20 Super Likes", tag: "BEST VALUE", tagColor: "text-amber border-amber/40", desc: "Bulk super likes for the serious swiper", price: "R99", productId: BILLING_PRODUCTS.SUPER_LIKES_20, iconBg: "bg-amber/15", iconColor: "text-amber" },
  { id: "spotlight", icon: Sparkles, name: "Profile Spotlight (24h)", desc: "Be one of the top profiles in your area for 24 hours", price: "R49", productId: BILLING_PRODUCTS.SPOTLIGHT, iconBg: "bg-yellow-400/15", iconColor: "text-yellow-400" },
];

export default function PikaBooShop({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [plusCycle, setPlusCycle] = useState("week"); // "week" | "month"

  const plusPrice = plusCycle === "week" ? "R39/week" : "R99/month";
  const plusProductId = plusCycle === "week" ? BILLING_PRODUCTS.PLUS_WEEKLY : BILLING_PRODUCTS.PLUS_MONTHLY;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-xl flex items-center justify-between px-4 py-4 border-b border-border/30">
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <X className="w-4 h-4 text-foreground" />
              </button>
              <h2 className="text-lg font-heading font-bold text-foreground">PikaBoo Shop</h2>
              <div className="w-8" />
            </div>

            <div className="px-4 py-5 space-y-6">
              {/* Section A: Free VIP Pass */}
              <div className="rounded-2xl border border-gold/30 bg-secondary/30 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-[10px] font-heading font-bold">VIP</span>
                  <h3 className="text-sm font-heading font-bold text-foreground">Free 24-Hour VIP Pass 🎁</h3>
                </div>
                <p className="text-xs text-muted-foreground font-body leading-relaxed">
                  Unlock all VIP perks for free — Line Jumping, 4 Unblurs, partner venue vouchers — for exactly 24 hours. One-time offer.
                </p>
                <div className="flex gap-2 flex-wrap">
                  {["⚡ Line Jump", "👁 4 Unblurs", "🥂 Date Guarantee"].map((chip) => (
                    <span key={chip} className="px-2.5 py-1 rounded-full border border-gold/30 text-gold text-[10px] font-body">
                      {chip}
                    </span>
                  ))}
                </div>
                <button className="w-full h-11 rounded-full bg-gold text-black font-heading font-bold flex items-center justify-center gap-2">
                  ⚡ Claim Free VIP Pass
                </button>
              </div>

              {/* Current plan badge */}
              <div className="flex justify-center">
                <span className="px-3 py-1 rounded-full bg-secondary text-xs font-body text-muted-foreground">
                  Current plan: <span className="text-gold font-bold">Free</span>
                </span>
              </div>

              {/* Section B: Choose Your Tier */}
              <section>
                <h3 className="text-base font-heading font-bold text-foreground">Choose Your Tier</h3>
                <p className="text-xs text-muted-foreground font-body mb-3">Upgrade anytime, cancel monthly</p>

                <div className="space-y-3">
                  {/* Free Tier */}
                  <div className="rounded-2xl bg-secondary/30 border border-border/40 p-4">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <p className="text-sm font-heading font-bold text-muted-foreground">Free</p>
                        <p className="text-lg font-heading font-bold text-foreground">R0 <span className="text-xs text-muted-foreground font-body">/ Forever</span></p>
                      </div>
                    </div>
                    <ul className="space-y-1.5">
                      {FREE_PERKS.map((p) => (
                        <li key={p} className="flex items-center gap-2 text-xs text-muted-foreground font-body">
                          <Check className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pikaboo Plus Tier */}
                  <div className="rounded-2xl bg-secondary/30 border border-gold/40 p-4 relative">
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-gold text-black text-[9px] font-heading font-bold">POPULAR</span>
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-gold" fill="currentColor" />
                      <p className="text-sm font-heading font-bold text-gold">Pikaboo Plus</p>
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-gold/15 text-gold text-[10px] font-heading font-bold mb-3">
                      3-Day FREE Trial
                    </span>
                    {/* Cycle toggle */}
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => setPlusCycle("week")}
                        className={`flex-1 py-2 rounded-full text-xs font-heading font-bold transition-colors ${
                          plusCycle === "week" ? "bg-gold text-black" : "border border-gold/30 text-gold"
                        }`}
                      >
                        R39/week
                      </button>
                      <button
                        onClick={() => setPlusCycle("month")}
                        className={`flex-1 py-2 rounded-full text-xs font-heading font-bold transition-colors ${
                          plusCycle === "month" ? "bg-gold text-black" : "border border-gold/30 text-gold"
                        }`}
                      >
                        R99/month
                      </button>
                    </div>
                    <ul className="space-y-1.5 mb-4">
                      {PLUS_PERKS.map((p) => (
                        <li key={p} className="flex items-center gap-2 text-xs text-foreground font-body">
                          <Check className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => { onClose(); navigate("/subscriptions"); }}
                      className="w-full h-11 rounded-full bg-gold text-black font-heading font-bold"
                    >
                      Upgrade to Plus — {plusPrice}
                    </button>
                  </div>

                  {/* Pikaboo Gold Tier */}
                  <div className="rounded-2xl bg-secondary/30 border-2 border-amber/50 p-4 relative">
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber text-black text-[9px] font-heading font-bold">GOLD</span>
                    <div className="flex items-center gap-2 mb-1">
                      <Crown className="w-4 h-4 text-amber" fill="currentColor" />
                      <p className="text-sm font-heading font-bold text-amber">Pikaboo Gold</p>
                    </div>
                    <p className="text-lg font-heading font-bold text-foreground mb-1">R199 <span className="text-xs text-muted-foreground font-body font-normal">/ per month</span></p>
                    <p className="text-xs text-amber/80 font-body font-semibold mb-3">Includes everything in Plus, plus:</p>
                    <ul className="space-y-1.5 mb-4">
                      {GOLD_PERKS.map((p) => (
                        <li key={p} className="flex items-center gap-2 text-xs text-foreground font-body">
                          <Check className="w-3.5 h-3.5 text-amber flex-shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => { onClose(); navigate("/subscriptions"); }}
                      className="w-full h-11 rounded-full bg-amber text-black font-heading font-bold"
                    >
                      Upgrade to Gold — R199/month
                    </button>
                  </div>
                </div>
              </section>

              {/* Section C: Power-Ups */}
              <section>
                <h3 className="text-base font-heading font-bold text-foreground">Power-Ups</h3>
                <p className="text-xs text-muted-foreground font-body mb-3">One-time boosts, no subscription needed</p>
                <div className="space-y-3">
                  {POWER_UPS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-secondary/30 border border-border/40 p-3">
                        <div className={`w-11 h-11 rounded-full ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 ${item.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-heading font-bold text-foreground">{item.name}</p>
                            {item.tag && (
                              <span className={`px-1.5 py-0.5 rounded-full border text-[9px] font-heading font-bold ${item.tagColor}`}>
                                {item.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground font-body mt-0.5 line-clamp-2">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => triggerPurchase(item.productId)}
                          className="flex-shrink-0 px-4 py-2 rounded-full border border-gold/40 text-gold text-xs font-heading font-bold hover:bg-gold/10 transition-colors"
                        >
                          {item.price}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Section D: Date Guarantee */}
              <section>
                <div className="rounded-2xl border border-gold/30 bg-secondary/30 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wine className="w-5 h-5 text-gold" />
                      <div>
                        <h3 className="text-sm font-heading font-bold text-foreground">The Date Guarantee</h3>
                        <p className="text-[10px] text-muted-foreground font-body">Gold exclusive</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber text-black text-[9px] font-heading font-bold">GOLD EXCLUSIVE</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-body leading-relaxed">
                    Once you and a match hit a 10-message streak and you fully unblur their profile, PikaBoo automatically drops a voucher for a partner venue — Marble, Shimmy Beach Club, The Rooftop Lounge, and more.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {VENUES.map((v) => (
                      <span key={v} className="px-2.5 py-1 rounded-full border border-gold/30 text-gold text-[10px] font-body">
                        {v}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Check className="w-4 h-4 text-gold" />
                    <span className="text-xs font-body text-gold font-semibold">You're earning Date Guarantee vouchers</span>
                  </div>
                </div>
              </section>
            </div>

            <div className="h-6" style={{ paddingBottom: "env(safe-area-inset-bottom)" }} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}