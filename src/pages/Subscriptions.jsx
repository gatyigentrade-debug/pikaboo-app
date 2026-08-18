import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Crown, Check, Loader2, ArrowLeft, Zap, Eye, Heart, RotateCcw, Star } from "lucide-react";
import { base44 } from "@/api/base44Client";
import VipSuccessModal from "@/components/payment/VipSuccessModal";

const PLANS = [
  { id: "weekly", label: "Weekly VIP", price: "R49", amount: 4900, per: "/ week", popular: false },
  { id: "monthly", label: "Monthly VIP", price: "R149", amount: 14900, per: "/ month", popular: true, badge: "Most Popular" },
  { id: "quarterly", label: "3-Month Premium", price: "R349", amount: 34900, per: "/ 3 months", popular: false, badge: "Best Value" },
];

const PERKS = [
  { icon: Eye, title: "See Who Likes You", color: "text-yellow-400", bg: "bg-yellow-400/10" },
  { icon: Zap, title: "Unlimited Swipes", color: "text-orange-400", bg: "bg-orange-400/10" },
  { icon: RotateCcw, title: "Unlimited Rewinds", color: "text-blue-400", bg: "bg-blue-400/10" },
  { icon: Star, title: "5 Super Likes / Week", color: "text-cyan-400", bg: "bg-cyan-400/10" },
  { icon: Heart, title: "VIP Badge", color: "text-pink-400", bg: "bg-pink-400/10" },
];

const genRef = (planId) =>
  `pikaboo_${planId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export default function Subscriptions() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // Load Paystack Inline V2 SDK
    if (!document.getElementById("paystack-inline-v2")) {
      const script = document.createElement("script");
      script.id = "paystack-inline-v2";
      script.src = "https://js.paystack.co/v2/inline.js";
      script.async = true;
      document.body.appendChild(script);
    }
    // Fetch public key + user email
    (async () => {
      try {
        const cfg = await base44.functions.invoke("getPaystackConfig", {});
        setPublicKey(cfg.data.public_key);
      } catch (e) {
        setError("Payment config unavailable. Try again later.");
      }
      try {
        const me = await base44.auth.me();
        if (me?.email) setUserEmail(me.email);
        if (me?.id) setUserId(me.id);
      } catch (e) {
        /* ignore */
      }
    })();
  }, []);

  const handleSubscribe = async () => {
    setError("");
    if (!window.PaystackPop) {
      setError("Payment SDK still loading, please try again in a moment.");
      return;
    }
    if (!publicKey) {
      setError("Payment config unavailable. Try again later.");
      return;
    }
    if (!userEmail) {
      setError("We couldn't load your email. Please re-open the app and try again.");
      return;
    }
    const plan = PLANS.find((p) => p.id === selectedPlan);
    const reference = genRef(selectedPlan);
    setLoading(true);
    try {
      const paystack = new window.PaystackPop();
      paystack.newTransaction({
        key: publicKey,
        email: userEmail,
        amount: plan.amount,
        currency: "ZAR",
        ref: reference,
        metadata: {
          user_id: userId,
          plan: selectedPlan,
          custom_fields: [
            { display_name: "User ID", variable_name: "user_id", value: userId },
            { display_name: "Plan", variable_name: "plan", value: selectedPlan },
          ],
        },
        onSuccess: async (transaction) => {
          try {
            const verifyRes = await base44.functions.invoke("verifyPaystackPayment", {
              reference: transaction.reference || reference,
            });
            if (verifyRes.data.success) {
              setLoading(false);
              setShowSuccess(true);
              setTimeout(() => {
                setShowSuccess(false);
                navigate("/discover");
              }, 2600);
            } else {
              setError(verifyRes.data.error || "Verification failed. If you were charged, contact support.");
              setLoading(false);
            }
          } catch (e) {
            setError(e.message || "Verification failed. If you were charged, contact support.");
            setLoading(false);
          }
        },
        onCancel: () => setLoading(false),
        onError: (err) => {
          setError(err?.message || "Payment failed. Please try again.");
          setLoading(false);
        },
      });
    } catch (e) {
      setError(e.message || "Failed to start payment");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-xl flex items-center gap-3 px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-4 border-b border-border/30">
        <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="text-lg font-heading font-bold text-foreground">PikaBoo VIP</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        {/* Hero */}
        <div className="relative rounded-3xl bg-gradient-to-br from-yellow-500 via-amber-400 to-orange-500 px-6 py-8 text-center overflow-hidden">
          <div className="absolute top-4 left-8 w-2 h-2 bg-white/60 rounded-full animate-sparkle" />
          <div className="absolute top-8 right-12 w-1.5 h-1.5 bg-white/50 rounded-full animate-sparkle" style={{ animationDelay: "0.5s" }} />
          <div className="absolute top-6 left-1/3 w-1 h-1 bg-white/40 rounded-full animate-sparkle" style={{ animationDelay: "1s" }} />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-3"
          >
            <Crown className="w-8 h-8 text-white drop-shadow-lg" />
          </motion.div>
          <h2 className="text-2xl font-heading font-black text-white drop-shadow">Unlock PikaBoo VIP</h2>
          <p className="text-white/90 font-body text-sm mt-1">Real people. Real connections. Faster.</p>
        </div>

        {/* Perks */}
        <div className="space-y-3">
          {PERKS.map((perk) => (
            <div key={perk.title} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${perk.bg} flex items-center justify-center flex-shrink-0`}>
                <perk.icon className={`w-5 h-5 ${perk.color}`} />
              </div>
              <p className="font-heading font-semibold text-foreground text-sm">{perk.title}</p>
              <Check className="w-4 h-4 text-green-400 ml-auto" />
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
                className={`w-full relative rounded-2xl border-2 p-4 text-left transition-all ${
                  active ? "border-amber bg-amber/10" : "border-border bg-secondary/30"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-2.5 right-4 bg-amber text-black text-[9px] font-heading font-black px-2 py-0.5 rounded-full">
                    {plan.badge}
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? "border-amber bg-amber" : "border-muted-foreground"}`}>
                      {active && <div className="w-2 h-2 rounded-full bg-black" />}
                    </div>
                    <div>
                      <p className="font-heading font-bold text-foreground">{plan.label}</p>
                      <p className="text-xs text-muted-foreground font-body">Billed {plan.per.replace("/", "per")}</p>
                    </div>
                  </div>
                  <p className="text-xl font-heading font-black text-foreground">{plan.price}</p>
                </div>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="p-3 rounded-xl text-sm text-center bg-destructive/15 text-red-300 font-body">{error}</div>
        )}

        {/* CTA */}
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full h-14 rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 text-black font-heading font-black text-base shadow-lg shadow-amber/30 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Crown className="w-5 h-5" />
              Subscribe to VIP — {PLANS.find((p) => p.id === selectedPlan).price}
            </>
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground font-body pb-4">
          Secure payment via Paystack · Cancel anytime · ZAR
        </p>
      </div>

      <VipSuccessModal isOpen={showSuccess} plan={selectedPlan} onClose={() => setShowSuccess(false)} />
    </div>
  );
}