import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Crown, Check, Loader2, Zap, Eye, Heart, RotateCcw, Star, Sparkles } from "lucide-react";
import VipSuccessModal from "@/components/payment/VipSuccessModal";
import ScreenHeader from "@/components/pika/ScreenHeader";

const PLANS = [
  { id: "plus_weekly", label: "PikaBoo Plus", price: "R39", per: "/ week", productId: "pikaboo_plus_weekly", popular: false },
  { id: "premium_monthly", label: "PikaBoo Premium", price: "R99", per: "/ month", productId: "pikaboo_premium_monthly", popular: true, badge: "Most Popular" },
  { id: "gold_monthly", label: "PikaBoo Gold", price: "R199", per: "/ month", productId: "pikaboo_gold_monthly", popular: false, badge: "Best Value" },
];

const PERKS = [
  { icon: Eye, title: "See Who Likes You" },
  { icon: Zap, title: "Unlimited Swipes" },
  { icon: RotateCcw, title: "Unlimited Rewinds" },
  { icon: Star, title: "5 Super Likes / Week" },
  { icon: Heart, title: "VIP Badge" },
];

export default function Subscriptions() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("premium_monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubscribe = () => {
    setError("");
    const plan = PLANS.find((p) => p.id === selectedPlan);
    if (!window.PikaBooNative?.buyProduct) {
      setError("Google Play billing is not available. Please use the PikaBoo app on Android.");
      return;
    }
    setLoading(true);
    window.PikaBooNative.buyProduct(plan.productId);
    // Failsafe: clear loading if the native bridge never calls back
    setTimeout(() => {
      setLoading((prev) => {
        if (prev) {
          setError("Purchase timed out. Please try again.");
          return false;
        }
        return prev;
      });
    }, 30000);
  };

  // React to native IAP callbacks dispatched from main.jsx
  useEffect(() => {
    const onSuccess = (e) => {
      const productId = typeof e?.detail === "string" ? e.detail : e?.detail?.productId;
      const subscriptionIds = PLANS.map((p) => p.productId);
      // Only handle subscription products — ignore consumable purchase events
      if (productId && !subscriptionIds.includes(productId)) return;
      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/discover");
      }, 2600);
    };
    const onError = (e) => {
      setLoading(false);
      const raw = e?.detail;
      const msg = typeof raw === "string" ? raw : raw?.message || raw?.error || "";
      const lower = (msg || "").toLowerCase();
      if (lower.includes("not found") || lower.includes("unavailable") || lower.includes("not available") || lower.includes("item not found")) {
        setError("This product isn't available yet. Please verify it's configured in Google Play Console.");
      } else if (lower.includes("cancel") || lower.includes("user")) {
        // User cancelled — silently clear loading
      } else {
        setError(msg || "Purchase failed. Please try again.");
      }
    };
    window.addEventListener("pikaboo:purchase-success", onSuccess);
    window.addEventListener("pikaboo:purchase-error", onError);
    return () => {
      window.removeEventListener("pikaboo:purchase-success", onSuccess);
      window.removeEventListener("pikaboo:purchase-error", onError);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <ScreenHeader title="PikaBoo VIP" icon={Crown} fallback="/profile" />

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 pb-10">
        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden px-6 py-8 text-center" style={{ background: "linear-gradient(135deg, #2A0A3B 0%, #171717 60%, #0A0A0C 100%)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 0%, rgba(212,165,74,0.22), transparent 65%)" }} />
          <div className="absolute top-4 left-8 w-2 h-2 bg-gold/70 rounded-full animate-sparkle" />
          <div className="absolute top-8 right-12 w-1.5 h-1.5 bg-gold/60 rounded-full animate-sparkle" style={{ animationDelay: "0.5s" }} />
          <div className="absolute top-6 left-1/3 w-1 h-1 bg-gold/50 rounded-full animate-sparkle" style={{ animationDelay: "1s" }} />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center glow-gold-ring"
            style={{ background: "linear-gradient(135deg, rgba(243,229,171,0.18), rgba(212,165,74,0.08))" }}
          >
            <Crown className="w-8 h-8 text-gold drop-shadow-lg" />
          </motion.div>
          <h2 className="relative text-2xl font-heading font-black text-gradient-gold">Unlock PikaBoo VIP</h2>
          <p className="relative text-muted-foreground font-body text-sm mt-1">Real people. Real connections. Faster.</p>
        </div>

        {/* Perks */}
        <div className="space-y-2.5">
          {PERKS.map((perk) => (
            <div key={perk.title} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-secondary/40 px-4 py-3">
              <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                <perk.icon className="w-4 h-4 text-gold" />
              </div>
              <p className="font-heading font-semibold text-foreground text-sm flex-1">{perk.title}</p>
              <Check className="w-4 h-4 text-gold" />
            </div>
          ))}
        </div>

        {/* Plans */}
        <div className="space-y-3">
          {PLANS.map((plan) => {
            const active = selectedPlan === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full relative rounded-2xl border p-4 text-left transition-all ${
                  active ? "border-gold bg-gold/10 glow-gold-ring" : "border-white/5 bg-secondary/40"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-[#F3E5AB] to-[#D4A54A] text-[#171717] text-xs font-heading font-black px-2.5 py-0.5 rounded-full">
                    {plan.badge}
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? "border-gold bg-gold" : "border-muted-foreground/50"}`}>
                      {active && <div className="w-2 h-2 rounded-full bg-[#171717]" />}
                    </div>
                    <div>
                      <p className="font-heading font-bold text-foreground">{plan.label}</p>
                      <p className="text-xs text-muted-foreground font-body">Billed {plan.per.replace("/", "per")}</p>
                    </div>
                  </div>
                  <p className="text-xl font-heading font-black text-gradient-gold">{plan.price}</p>
                </div>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="p-3 rounded-xl text-sm text-center bg-destructive/15 text-coral font-body">{error}</div>
        )}

        {/* CTA */}
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#F3E5AB] to-[#D4A54A] text-[#171717] font-heading font-black text-base disabled:opacity-60 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          style={{ boxShadow: "0 8px 28px -8px rgba(212,165,74,0.55)" }}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Subscribe to VIP — {PLANS.find((p) => p.id === selectedPlan).price}
            </>
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground font-body pb-2">
          Secure payment via Google Play · Cancel anytime · ZAR
        </p>
      </div>

      <VipSuccessModal isOpen={showSuccess} plan={selectedPlan} onClose={() => setShowSuccess(false)} />
    </div>
  );
}