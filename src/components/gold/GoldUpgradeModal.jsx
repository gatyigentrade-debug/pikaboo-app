import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Zap, Eye, Heart, RotateCcw, Crown } from "lucide-react";

const PERKS = [
  {
    icon: Eye,
    title: "See Who Likes You",
    description: "Browse everyone who already swiped right on you",
  },
  {
    icon: Zap,
    title: "Unlimited Swipes",
    description: "Never run out of likes again",
  },
  {
    icon: RotateCcw,
    title: "Rewind",
    description: "Go back and change your mind anytime",
  },
  {
    icon: Star,
    title: "5 Super Likes / Day",
    description: "Stand out from the crowd",
  },
  {
    icon: Heart,
    title: "Gold Badge",
    description: "Show off your PikaBoo Gold status",
  },
];

const PLANS = [
  { id: "plus_weekly", label: "Plus", price: "R39", per: "/week", productId: "pikaboo_plus_weekly", popular: false },
  { id: "premium_monthly", label: "Premium", price: "R99", per: "/mo", productId: "pikaboo_premium_monthly", popular: true, badge: "Most Popular" },
  { id: "gold_monthly", label: "Gold", price: "R199", per: "/mo", productId: "pikaboo_gold_monthly", badge: "Best Value", popular: false },
];

export default function GoldUpgradeModal({ onUpgrade }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]);
  const isOpen = searchParams.get("gold") === "true";

  const handleClose = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("gold");
    setSearchParams(next, { replace: true });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[80] max-h-[92vh] overflow-y-auto rounded-t-3xl border-t border-gold/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Royal + gold header */}
            <div className="relative pt-8 pb-12 px-6 text-center overflow-hidden" style={{ background: "linear-gradient(135deg, #2A0A3B 0%, #171717 70%)" }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 0%, rgba(212,165,74,0.25), transparent 65%)" }} />
              {/* Sparkle dots */}
              <div className="absolute top-4 left-8 w-2 h-2 bg-gold/70 rounded-full animate-sparkle" />
              <div className="absolute top-8 right-12 w-1.5 h-1.5 bg-gold/60 rounded-full animate-sparkle" style={{ animationDelay: "0.5s" }} />
              <div className="absolute top-6 left-1/3 w-1 h-1 bg-gold/50 rounded-full animate-sparkle" style={{ animationDelay: "1s" }} />

              <button onClick={handleClose} className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
                <X className="w-5 h-5 text-white" />
              </button>

              <div className="relative flex items-center justify-center gap-2 mb-2">
                <Crown className="w-8 h-8 text-gold drop-shadow-lg" />
                <h2 className="text-3xl font-heading font-black text-gradient-gold">PikaBoo Gold</h2>
              </div>
              <p className="relative text-muted-foreground font-body text-sm">Unlock your full potential</p>
            </div>

            {/* Card body */}
            <div className="bg-card -mt-6 rounded-t-3xl px-5 pt-6 pb-8 space-y-6">
              {/* Perks list */}
              <div className="space-y-3">
                {PERKS.map((perk) => (
                  <div key={perk.title} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                      <perk.icon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-foreground text-sm">{perk.title}</p>
                      <p className="text-muted-foreground font-body text-xs">{perk.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Plan selector */}
              <div className="grid grid-cols-3 gap-2">
                {PLANS.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`relative rounded-2xl border p-3 text-center transition-all ${
                      selectedPlan.id === plan.id
                        ? "border-gold bg-gold/10 glow-gold-ring"
                        : "border-white/10 bg-secondary hover:border-gold/40"
                    }`}
                  >
                    {plan.badge && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#F3E5AB] to-[#D4A54A] text-[#171717] text-xs font-heading font-black px-2 py-0.5 rounded-full whitespace-nowrap">
                        {plan.badge}
                      </span>
                    )}
                    <p className="text-xs text-muted-foreground font-body">{plan.label}</p>
                    <p className="text-xl font-heading font-black text-gradient-gold mt-0.5">{plan.price}</p>
                    <p className="text-xs text-muted-foreground font-body">{plan.per}</p>
                  </button>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() => {
                  if (window.PikaBooNative?.buyProduct) {
                    window.PikaBooNative.buyProduct(selectedPlan.productId);
                  } else {
                    onUpgrade?.(selectedPlan);
                  }
                }}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#F3E5AB] to-[#D4A54A] text-[#171717] font-heading font-black text-base active:scale-[0.98] transition-transform"
                style={{ boxShadow: "0 8px 28px -8px rgba(212,165,74,0.55)" }}
              >
                ✨ Get {selectedPlan.label} — {selectedPlan.price}{selectedPlan.per}
              </button>

              <p className="text-center text-xs text-muted-foreground font-body">
                Recurring billing. Cancel anytime.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}