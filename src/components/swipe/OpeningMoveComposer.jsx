import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, X, Loader2, Lock, ShieldCheck } from "lucide-react";
import { base44 } from "@/api/base44Client";

const TONE_EMOJI = { flirty: "😍", humorous: "😂", sincere: "🤙" };

export default function OpeningMoveComposer({ matchedProfile, isVerified = true, onSend, onClose }) {
  const [icebreakers, setIcebreakers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [custom, setCustom] = useState("");
  const [step, setStep] = useState("prompt"); // "prompt" | "compose" | "sent"

  const prompt = matchedProfile?.braai_starter || "What's your most lekker SA experience?";

  const generateIcebreakers = async () => {
    if (!isVerified) return;
    setLoading(true);
    setStep("compose");
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an AI Wingman for PikaBoo, a South African dating app. Generate 3 short, cheeky, culturally relevant icebreaker replies to this profile prompt: "${prompt}". 
      
The person you are replying to has these traits:
- Name: ${matchedProfile?.name}
- City: ${matchedProfile?.city || "South Africa"}
- Braai role: ${matchedProfile?.braai_role || "unknown"}
- Spirit animal: ${matchedProfile?.spirit_animal || "unknown"}
- Home language: ${matchedProfile?.home_language || "English"}
- Looking for: ${matchedProfile?.looking_for || "not sure"}

Each reply must be 1–2 sentences max, use South African slang naturally (lekker, eish, yebo, bru, howzit, etc.), and feel personal — not generic. Vary the tones: one flirty, one humorous, one sincere.`,
      response_json_schema: {
        type: "object",
        properties: {
          suggestions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                text: { type: "string" },
                tone: { type: "string", enum: ["flirty", "humorous", "sincere"] },
              },
            },
          },
        },
      },
    });
    setIcebreakers(result?.suggestions || []);
    setLoading(false);
  };

  const handleSend = () => {
    const message = selected?.text || custom.trim();
    if (!message) return;
    setStep("sent");
    setTimeout(() => onSend(message), 1200);
  };

  const canSend = selected || custom.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-lg"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-lg bg-card rounded-t-3xl border border-border/40 overflow-hidden"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/40">
              <img src={matchedProfile?.photos?.[0] || ""} alt={matchedProfile?.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-heading font-bold text-foreground leading-tight">{matchedProfile?.name}'s Opening Move</p>
              <p className="text-[11px] text-muted-foreground font-body">Answer to start the chat</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* The prompt */}
          <div className="bg-secondary/60 rounded-2xl px-4 py-3 border border-primary/20">
            <p className="text-[11px] text-primary font-heading font-semibold uppercase tracking-wide mb-1">🔥 Their Question</p>
            <p className="text-sm font-body text-foreground italic">"{prompt}"</p>
          </div>

          {/* Step: initial prompt to generate */}
          {step === "prompt" && (
            <div className="space-y-3">
              {!isVerified ? (
                <div className="flex items-center gap-3 bg-yellow-400/10 border border-yellow-400/30 rounded-2xl px-4 py-3">
                  <Lock className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-heading font-bold text-yellow-400">Verify to unlock AI Wingman</p>
                    <p className="text-[11px] text-muted-foreground font-body">Complete your selfie check to get AI icebreaker suggestions.</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={generateIcebreakers}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-violet to-primary text-white font-heading font-bold text-sm glow-violet hover:opacity-90 transition-opacity"
                >
                  <Sparkles className="w-4 h-4" />
                  ✨ Get AI Wingman Suggestions
                </button>
              )}
              <div className="relative flex items-center gap-2">
                <div className="flex-1 h-px bg-border/40" />
                <span className="text-[11px] text-muted-foreground font-body">or write your own</span>
                <div className="flex-1 h-px bg-border/40" />
              </div>
              <textarea
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder={`Reply to ${matchedProfile?.name}...`}
                rows={3}
                className="w-full bg-secondary border border-border/40 rounded-2xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              />
              <button
                onClick={handleSend}
                disabled={!canSend}
                className="w-full py-3 rounded-full bg-primary text-primary-foreground font-heading font-bold text-sm glow-orange disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4 inline mr-2" />
                Send Opening Move 🔥
              </button>
            </div>
          )}

          {/* Step: compose with icebreakers */}
          {step === "compose" && (
            <div className="space-y-3">
              {loading ? (
                <div className="flex flex-col items-center gap-3 py-6">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Sparkles className="w-6 h-6 text-violet" />
                  </motion.div>
                  <p className="text-sm text-muted-foreground font-body">AI Wingman is cooking... 🍖</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-400" />
                    <p className="text-[11px] text-green-400 font-heading font-semibold">Verified · AI Wingman Active</p>
                  </div>
                  <div className="space-y-2">
                    {icebreakers.map((ice, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => { setSelected(ice); setCustom(""); }}
                        className={`w-full text-left px-4 py-3 rounded-2xl border transition-all ${
                          selected?.text === ice.text
                            ? "border-primary bg-primary/15 text-foreground"
                            : "border-border/40 bg-secondary/50 text-foreground hover:border-primary/40"
                        }`}
                      >
                        <span className="text-sm mr-1">{TONE_EMOJI[ice.tone] || "💬"}</span>
                        <span className="text-sm font-body">{ice.text}</span>
                      </motion.button>
                    ))}
                  </div>
                  <div className="relative flex items-center gap-2">
                    <div className="flex-1 h-px bg-border/40" />
                    <span className="text-[11px] text-muted-foreground font-body">or write your own</span>
                    <div className="flex-1 h-px bg-border/40" />
                  </div>
                  <textarea
                    value={custom}
                    onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
                    placeholder="Write something personal..."
                    rows={2}
                    className="w-full bg-secondary border border-border/40 rounded-2xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!canSend}
                    className="w-full py-3 rounded-full bg-primary text-primary-foreground font-heading font-bold text-sm glow-orange disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                  >
                    <Send className="w-4 h-4 inline mr-2" />
                    Send Opening Move 🔥
                  </button>
                </>
              )}
            </div>
          )}

          {/* Step: sent confirmation */}
          {step === "sent" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-8"
            >
              <div className="text-5xl">🔥</div>
              <h3 className="font-heading font-black text-xl text-foreground">Move Sent!</h3>
              <p className="text-sm text-muted-foreground font-body text-center">
                Your opening move is on the way to {matchedProfile?.name}. Lekker bru!
              </p>
            </motion.div>
          )}
        </div>

        {/* Safe zone padding */}
        <div className="h-6" />
      </motion.div>
    </motion.div>
  );
}