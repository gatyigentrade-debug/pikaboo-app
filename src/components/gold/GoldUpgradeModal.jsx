import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Zap, Eye, Heart, RotateCcw, Crown } from "lucide-react";

const PERKS = [
  {
    icon: Eye,
    title: "See Who Likes You",
    description: "Browse everyone who already swiped right on you",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    icon: Zap,
    title: "Unlimited Swipes",
    description: "Never run out of likes again",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
  {
    icon: RotateCcw,
    title: "Rewind",
    description: "Go back and change your mind anytime",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Star,
    title: "5 Super Likes / Day",
    description: "Stand out from the crowd",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
  {
    icon: Heart,
    title: "Gold Badge",
    description: "Show off your PikaBoo Gold status",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
];

const PLANS = [
  { id: "1m", label: "1 Month", price: "R149", per: "/mo", popular: false },
  { id: "3m", label: "3 Months", price: "R99", per: "/mo", badge: "Save 33%", popular: true },
  { id: "6m", label: "6 Months", price: "R79", per: "/mo", badge: "Best Value", popular: false },
];

export default function GoldUpgradeModal({ isOpen, onClose, onUpgrade }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[80] max-h-[92vh] overflow-y-auto rounded-t-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gold gradient header */}
            <div className="relative bg-gradient-to-br from-yellow-500 via-amber-400 to-orange-500 pt-8 pb-12 px-6 text-center overflow-hidden">
              {/* Sparkle dots */}
              <div className="absolute top-4 left-8 w-2 h-2 bg-white/60 rounded-full animate-sparkle" />
              <div className="absolute top-8 right-12 w-1.5 h-1.5 bg-white/50 rounded-full animate-sparkle" style={{ animationDelay: "0.5s" }} />
              <div className="absolute top-6 left-1/3 w-1 h-1 bg-white/40 rounded-full animate-sparkle" style={{ animationDelay: "1s" }} />

              <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 flex items-center justify-center">
                <X className="w-4 h-4 text-white" />
              </button>

              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="w-8 h-8 text-white drop-shadow-lg" />
                <h2 className="text-3xl font-heading font-black text-white drop-shadow">PikaBoo Gold</h2>
              </div>
              <p className="text-white/90 font-body text-sm">Unlock your full potential</p>
            </div>

            {/* White card body */}
            <div className="bg-card -mt-6 rounded-t-3xl px-5 pt-6 pb-8 space-y-6">
              {/* Perks list */}
              <div className="space-y-3">
                {PERKS.map((perk) => (
                  <div key={perk.title} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${perk.bg} flex items-center justify-center flex-shrink-0`}>
                      <perk.icon className={`w-5 h-5 ${perk.color}`} />
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
                    onClick={() => onUpgrade(plan)}
                    className={`relative rounded-2xl border-2 p-3 text-center transition-all ${
                      plan.popular
                        ? "border-yellow-400 bg-yellow-400/10"
                        : "border-border bg-secondary hover:border-yellow-400/50"
                    }`}
                  >
                    {plan.badge && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-[9px] font-heading font-black px-2 py-0.5 rounded-full whitespace-nowrap">
                        {plan.badge}
                      </span>
                    )}
                    <p className="text-xs text-muted-foreground font-body">{plan.label}</p>
                    <p className="text-xl font-heading font-black text-foreground mt-0.5">{plan.price}</p>
                    <p className="text-[10px] text-muted-foreground font-body">{plan.per}</p>
                  </button>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() => onUpgrade(PLANS[1])}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 text-black font-heading font-black text-base shadow-lg shadow-yellow-500/30 hover:opacity-90 transition-opacity"
              >
                ✨ Get PikaBoo Gold
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