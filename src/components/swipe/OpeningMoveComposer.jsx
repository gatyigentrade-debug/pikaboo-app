import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, X, RefreshCw, ShieldCheck, Lock, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

const TONE_EMOJI  = { flirty: "😍", humorous: "😂", sincere: "🤙" };
const TONE_LABEL  = { flirty: "Flirty", humorous: "Playful", sincere: "Sincere" };
const TONE_COLOR  = {
  flirty:   "text-pink-400 bg-pink-400/10 border-pink-400/30",
  humorous: "text-amber  bg-amber/10    border-amber/30",
  sincere:  "text-violet bg-violet/10   border-violet/30",
};

function ProfileChips({ profile }) {
  const chips = [
    profile.braai_role      && { label: `🔥 ${profile.braai_role}` },
    profile.spirit_animal   && { label: `🦁 ${profile.spirit_animal}` },
    profile.sports_team     && { label: `⚽ ${profile.sports_team}` },
    profile.home_language   && { label: `💬 ${profile.home_language}` },
    profile.city            && { label: `📍 ${profile.city}` },
    profile.looking_for     && { label: profile.looking_for === "relationship" ? "💍 Relationship" : profile.looking_for === "friendship" ? "🤝 Friendship" : "✌️ Casual" },
  ].filter(Boolean);

  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((c, i) => (
        <span key={i} className="text-sm font-body px-2 py-0.5 rounded-full bg-secondary border border-border/40 text-muted-foreground">
          {c.label}
        </span>
      ))}
    </div>
  );
}

function IcebreakerSkeleton() {
  return (
    <div className="space-y-2">
      {[0,1,2].map(i => (
        <div key={i} className="h-16 rounded-2xl bg-secondary/60 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}

async function fetchIcebreakers(profile) {
  const prompt = profile?.braai_starter || "What's your most lekker South African experience?";
  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `You are "AI Wingman" — the cheeky, culturally fluent assistant inside PikaBoo, South Africa's hottest dating app.

Your job: write 3 short, punchy icebreaker replies to this profile prompt: "${prompt}"

Profile context for ${profile?.name || "them"}:
- City: ${profile?.city || "SA"}
- Braai role: ${profile?.braai_role || "—"}
- Spirit animal: ${profile?.spirit_animal || "—"}
- Sports team: ${profile?.sports_team || "—"}
- Home language: ${profile?.home_language || "English"}
- Looking for: ${profile?.looking_for || "—"}
- Bio: ${profile?.bio || "—"}
- Favourite spot: ${profile?.favorite_kota_spot || "—"}
- Can't live without: ${profile?.cant_live_without || "—"}
- Dream date: ${profile?.dream_date_location || "—"}

Rules:
1. Each reply is 1–2 sentences only.
2. Weave in at least one specific detail from their profile so it feels personal.
3. Use SA slang naturally (lekker, eish, yebo, bru, howzit, shame, sharp, sho't left, etc.) — never forced.
4. Tone variety: exactly one flirty, one humorous, one sincere.
5. Do NOT start with "Hey" or "Hi".`,
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
              why: { type: "string", description: "One short phrase explaining what profile detail this references" },
            },
          },
        },
      },
    },
  });
  return result?.suggestions || [];
}

export default function OpeningMoveComposer({ matchedProfile, isVerified = true, onSend, onClose }) {
  const [icebreakers, setIcebreakers]   = useState([]);
  const [loading, setLoading]           = useState(false);
  const [selected, setSelected]         = useState(null);
  const [custom, setCustom]             = useState("");
  const [sent, setSent]                 = useState(false);
  const [editingCustom, setEditingCustom] = useState(false);

  const prompt = matchedProfile?.braai_starter || "What's your most lekker SA experience?";
  const canSend = !!(selected || custom.trim());

  // Auto-generate on open for verified users
  useEffect(() => {
    if (isVerified && matchedProfile) generate();
  }, []);

  const generate = async () => {
    setLoading(true);
    setSelected(null);
    const results = await fetchIcebreakers(matchedProfile);
    setIcebreakers(results);
    setLoading(false);
  };

  const handleSelectIce = (ice) => {
    setSelected(ice);
    setCustom("");
    setEditingCustom(false);
  };

  const handleCustomChange = (val) => {
    setCustom(val);
    setSelected(null);
  };

  const handleSend = () => {
    const message = selected?.text || custom.trim();
    if (!message) return;
    setSent(true);
    setTimeout(() => onSend(message), 1400);
  };

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
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="w-full max-w-lg bg-card rounded-t-3xl border border-border/40 flex flex-col max-h-[92vh]"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/30 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/50">
                <img src={matchedProfile?.photos?.[0] || ""} alt={matchedProfile?.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-card" />
            </div>
            <div>
              <p className="text-sm font-heading font-bold text-foreground leading-tight">
                Opening Move for {matchedProfile?.name}
              </p>
              <p className="text-sm text-muted-foreground font-body">Answer their question to start chatting</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

          {/* Their question */}
          <div className="bg-gradient-to-br from-primary/10 to-violet/10 rounded-2xl px-4 py-3.5 border border-primary/20">
            <p className="text-sm text-primary font-heading font-bold uppercase tracking-widest mb-1.5">🔥 Their Opening Move</p>
            <p className="text-sm font-body text-foreground italic leading-relaxed">"{prompt}"</p>
          </div>

          {/* Profile interest chips */}
          <ProfileChips profile={matchedProfile || {}} />

          {/* Sent state */}
          {sent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-8 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.6 }}
                className="text-5xl"
              >🔥</motion.div>
              <h3 className="font-heading font-black text-xl text-foreground">Move Sent!</h3>
              <p className="text-sm text-muted-foreground font-body">
                Your opening move is on the way to {matchedProfile?.name}. Lekker bru! 🤙
              </p>
            </motion.div>
          )}

          {/* Main content (not sent) */}
          {!sent && (
            <>
              {/* Unverified gate */}
              {!isVerified && (
                <div className="flex items-start gap-3 bg-yellow-400/10 border border-yellow-400/30 rounded-2xl px-4 py-3">
                  <Lock className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-heading font-bold text-yellow-400">Verify your selfie to unlock AI Wingman</p>
                    <p className="text-sm text-muted-foreground font-body mt-0.5">Get 3 personalised icebreakers generated just for this match.</p>
                  </div>
                </div>
              )}

              {/* AI Suggestions */}
              {isVerified && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-sm text-green-400 font-heading font-semibold">AI Wingman</span>
                      <span className="text-sm text-muted-foreground font-body">· personalised for {matchedProfile?.name}</span>
                    </div>
                    <button
                      onClick={generate}
                      disabled={loading}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors disabled:opacity-40"
                    >
                      <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                      Refresh
                    </button>
                  </div>

                  {loading ? (
                    <>
                      <div className="flex items-center gap-2 py-1">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                          <Sparkles className="w-4 h-4 text-violet" />
                        </motion.div>
                        <p className="text-sm text-muted-foreground font-body">AI Wingman is cooking something lekker... 🍖</p>
                      </div>
                      <IcebreakerSkeleton />
                    </>
                  ) : (
                    <div className="space-y-2">
                      <AnimatePresence>
                        {icebreakers.map((ice, i) => (
                          <motion.button
                            key={ice.text}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            onClick={() => handleSelectIce(ice)}
                            className={`w-full text-left px-4 py-3 rounded-2xl border transition-all group relative overflow-hidden ${
                              selected?.text === ice.text
                                ? "border-primary bg-primary/10"
                                : "border-border/40 bg-secondary/40 hover:border-primary/40 hover:bg-secondary/70"
                            }`}
                          >
                            {/* Tone badge */}
                            <span className={`inline-flex items-center gap-1 text-sm font-heading font-bold px-2 py-0.5 rounded-full border mb-1.5 ${TONE_COLOR[ice.tone]}`}>
                              {TONE_EMOJI[ice.tone]} {TONE_LABEL[ice.tone]}
                            </span>
                            <p className="text-sm font-body text-foreground leading-snug">{ice.text}</p>
                            {ice.why && (
                              <p className="text-sm text-muted-foreground font-body mt-1 opacity-70">↳ {ice.why}</p>
                            )}
                            {selected?.text === ice.text && (
                              <div className="absolute right-3 top-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <ChevronRight className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </motion.button>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              )}

              {/* Divider */}
              <div className="relative flex items-center gap-2">
                <div className="flex-1 h-px bg-border/40" />
                <span className="text-sm text-muted-foreground font-body flex-shrink-0">or write your own</span>
                <div className="flex-1 h-px bg-border/40" />
              </div>

              {/* Custom textarea */}
              <div className="relative">
                <textarea
                  value={custom}
                  onChange={(e) => handleCustomChange(e.target.value)}
                  onFocus={() => setEditingCustom(true)}
                  placeholder={`Reply to ${matchedProfile?.name}...`}
                  rows={editingCustom ? 3 : 2}
                  className={`w-full bg-secondary border rounded-2xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none transition-all ${
                    custom.trim() && !selected ? "border-primary/50" : "border-border/40"
                  }`}
                />
                {custom.trim().length > 0 && (
                  <span className="absolute bottom-3 right-3 text-sm text-muted-foreground font-body">
                    {custom.trim().length}/280
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Send button — fixed at bottom */}
        {!sent && (
          <div className="px-5 py-4 border-t border-border/30 flex-shrink-0">
            <button
              onClick={handleSend}
              disabled={!canSend}
              className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-heading font-bold text-sm glow-orange disabled:opacity-35 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {selected ? "Send This Move 🔥" : custom.trim() ? "Send Your Move 🔥" : "Choose or Write a Reply"}
            </button>
          </div>
        )}

        {/* Safe area */}
        <div className="h-2 flex-shrink-0" />
      </motion.div>
    </motion.div>
  );
}