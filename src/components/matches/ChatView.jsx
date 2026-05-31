import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Phone, Video, Send, Smile, Mic, MoreVertical, ImagePlus, Check, CheckCheck, Lightbulb, Flag } from "lucide-react";
import { Input } from "@/components/ui/input";
import ReportBlockSheet from "@/components/matches/ReportBlockSheet";

const QUICK_REPLIES = ["😍 Lekker!", "🔥 Howzit?", "Let's braai! 🥩", "Tell me more 👀", "You're funny 😂"];

const EMOJI_REACTIONS = ["❤️", "😂", "😮", "😢", "👏", "🔥"];

const SA_ICEBREAKERS = [
  "What is your go-to braai side dish?",
  "Pap or rice? 🤔",
  "What's your favorite kota spot?",
  "Bunny chow or gatsby? 🥪",
  "What's your spirit animal?",
  "Tell me about your sports team loyalty 🏉",
  "What's the one thing you can't live without?",
  "Dream date location?",
  "Best South African experience you've had?",
  "If you could have any braai role, what would it be?",
];

const makeTime = (offsetMins = 0) => {
  const d = new Date(Date.now() - offsetMins * 60000);
  return d.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
};

const buildSample = (name) => [
  { id: 1, sender: "them", text: `Howzit! Saw you're also a Grill Master 🔥`, time: makeTime(10), read: true, reaction: null },
  { id: 2, sender: "me",   text: "Ja nee, my boerewors game is strong! 😄",   time: makeTime(9),  read: true, reaction: null },
  { id: 3, sender: "them", text: "We should have a braai-off sometime! Loser makes the salads 🥗", time: makeTime(5), read: true, reaction: null },
  { id: 4, sender: "me",   text: "Eish, you're on! My peri-peri marinade is legendary 🌶️", time: makeTime(3), read: true, reaction: null },
  { id: 5, sender: "them", text: `So what are you up to this weekend?`, time: makeTime(1), read: false, reaction: null },
];

export default function ChatView({ match, onBack }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(() => buildSample(match.matched_name));
  const [showEmoji, setShowEmoji] = useState(false);
  const [showIcebreakers, setShowIcebreakers] = useState(messages.length === 0);
  const [reactionTarget, setReactionTarget] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showReportSheet, setShowReportSheet] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate typing indicator
  useEffect(() => {
    const t = setTimeout(() => setIsTyping(true), 1200);
    const t2 = setTimeout(() => setIsTyping(false), 4000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  const handleSend = (text = message) => {
    if (!text.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: "me",
      text: text.trim(),
      time: makeTime(0),
      read: false,
      reaction: null,
    };
    setMessages((prev) => [...prev, newMsg]);
    setMessage("");
    setShowEmoji(false);
    setShowIcebreakers(false);
    // Simulate read after 1.5s
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMsg.id ? { ...m, read: true } : m))
      );
    }, 1500);
  };

  const handleReaction = (msgId, emoji) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, reaction: m.reaction === emoji ? null : emoji } : m))
    );
    setReactionTarget(null);
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className="fixed inset-0 z-50 bg-background flex flex-col"
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-3 border-b border-border/40 bg-card/90 backdrop-blur-xl">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors -ml-1">
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/40">
            <img src={match.matched_photo || ""} alt={match.matched_name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-sm text-foreground leading-tight">{match.matched_name}</h3>
          <p className="text-[11px] text-green-400 font-body">Active now</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <Phone className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <Video className="w-4 h-4" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu((v) => !v)}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {showMoreMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -4 }}
                  className="absolute right-0 top-10 bg-card border border-border/60 rounded-2xl shadow-xl z-20 overflow-hidden min-w-[180px]"
                >
                  <button
                    onClick={() => { setShowMoreMenu(false); setShowReportSheet(true); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Flag className="w-4 h-4" />
                    Report / Block
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Match badge ── */}
      <div className="flex justify-center py-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full overflow-hidden border-3 border-primary/50 glow-orange">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="You" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col items-center">
            <div className="flex gap-0.5">
              {[0,1,2].map(i => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i===1 ? 'bg-primary scale-125' : 'bg-primary/50'}`} />
              ))}
            </div>
            <span className="text-[10px] text-primary font-heading font-bold mt-1">It's a Match!</span>
          </div>
          <div className="w-14 h-14 rounded-full overflow-hidden border-3 border-primary/50 glow-orange">
            <img src={match.matched_photo || ""} alt={match.matched_name} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        className="flex-1 overflow-y-auto px-4 space-y-1 pb-2"
        onClick={() => { setReactionTarget(null); setShowEmoji(false); setShowMoreMenu(false); }}
      >
        {/* Watermark */}
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none opacity-[0.025]">
          <span className="text-7xl font-heading font-black rotate-[-20deg] select-none">PikaBoo</span>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => {
            const isMe = msg.sender === "me";
            const showAvatar = !isMe && (idx === 0 || messages[idx - 1].sender === "me");
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"} relative`}
              >
                {/* Their avatar */}
                {!isMe && (
                  <div className="w-6 h-6 flex-shrink-0">
                    {showAvatar && (
                      <div className="w-6 h-6 rounded-full overflow-hidden">
                        <img src={match.matched_photo || ""} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                )}

                <div className="relative max-w-[72%]">
                  {/* Long-press to react */}
                  <div
                    onDoubleClick={() => setReactionTarget(reactionTarget === msg.id ? null : msg.id)}
                    className={`px-4 py-2.5 rounded-2xl cursor-pointer select-none ${
                      isMe
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-secondary text-foreground rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm font-body leading-relaxed">{msg.text}</p>
                    <div className={`flex items-center gap-1 mt-0.5 ${isMe ? "justify-end" : "justify-start"}`}>
                      <span className={`text-[10px] ${isMe ? "text-primary-foreground/55" : "text-muted-foreground"}`}>
                        {msg.time}
                      </span>
                      {isMe && (
                        msg.read
                          ? <CheckCheck className="w-3 h-3 text-blue-400" />
                          : <Check className="w-3 h-3 text-primary-foreground/50" />
                      )}
                    </div>
                  </div>

                  {/* Emoji reaction bubble */}
                  {msg.reaction && (
                    <div className={`absolute -bottom-3 ${isMe ? "left-2" : "right-2"} bg-card border border-border/50 rounded-full px-1.5 py-0.5 text-sm shadow`}>
                      {msg.reaction}
                    </div>
                  )}

                  {/* Reaction picker */}
                  <AnimatePresence>
                    {reactionTarget === msg.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 4 }}
                        className={`absolute ${isMe ? "right-0" : "left-0"} -top-12 bg-card border border-border/60 rounded-full px-3 py-1.5 flex gap-2 shadow-xl z-10`}
                      >
                        {EMOJI_REACTIONS.map((e) => (
                          <button
                            key={e}
                            onClick={(ev) => { ev.stopPropagation(); handleReaction(msg.id, e); }}
                            className="text-lg hover:scale-125 transition-transform"
                          >
                            {e}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex items-end gap-2"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                <img src={match.matched_photo || ""} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="bg-secondary rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* ── Icebreakers (first message only) ── */}
      <AnimatePresence>
        {showIcebreakers && messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 border-t border-border/40 bg-secondary/30 space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber" />
                <span className="text-xs font-heading font-semibold text-foreground">Icebreaker ideas</span>
                <button
                  onClick={() => setShowIcebreakers(false)}
                  className="text-[10px] text-muted-foreground hover:text-foreground ml-auto"
                >
                  ✕
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {SA_ICEBREAKERS.map((ice) => (
                  <button
                    key={ice}
                    onClick={() => handleSend(ice)}
                    className="text-xs font-body px-2.5 py-1.5 rounded-full border border-amber/30 text-amber bg-amber/5 hover:bg-amber/15 transition-colors text-left"
                  >
                    {ice}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Quick Replies ── */}
      <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-hide">
        {QUICK_REPLIES.map((qr) => (
          <button
            key={qr}
            onClick={() => handleSend(qr)}
            className="flex-shrink-0 text-xs font-body px-3 py-1.5 rounded-full border border-primary/30 text-primary bg-primary/5 hover:bg-primary/15 transition-colors"
          >
            {qr}
          </button>
        ))}
      </div>

      {/* ── Input Bar ── */}
      <div className="px-4 py-3 border-t border-border/40 bg-card/90 backdrop-blur-xl pb-safe">
        <div className="flex items-center gap-2">
          <button className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0">
            <ImagePlus className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={`Message ${match.matched_name}...`}
              className="bg-secondary border-none rounded-full text-sm font-body placeholder:text-muted-foreground pr-10"
            />
            <button
              onClick={() => setShowEmoji((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>
          {message.trim() ? (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => handleSend()}
              className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0 glow-orange"
            >
              <Send className="w-4 h-4 text-primary-foreground" />
            </motion.button>
          ) : (
            <button className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0">
              <Mic className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Emoji strip */}
        <AnimatePresence>
          {showEmoji && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex gap-3 pt-3 pb-1 px-1">
                {["😍","🔥","😂","❤️","🤙","🥩","😎","🌶️","🤣","👀","🥰","😘","🤝","🎉","💪"].map((e) => (
                  <button
                    key={e}
                    onClick={() => setMessage((m) => m + e)}
                    className="text-xl hover:scale-125 transition-transform flex-shrink-0"
                  >
                    {e}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Report / Block Sheet */}
      {showReportSheet && (
        <ReportBlockSheet
          matchName={match.matched_name}
          onClose={() => setShowReportSheet(false)}
        />
      )}
    </motion.div>
  );
}