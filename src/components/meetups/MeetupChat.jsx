import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Users, MessageCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { format } from "date-fns";

export default function MeetupChat({ meetup, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState("You");
  const bottomRef = useRef(null);

  // Load user name once
  useEffect(() => {
    base44.auth.me().then((u) => setUserName(u?.full_name || "You")).catch(() => {});
  }, []);

  // Seed some demo messages so the chat feels alive
  useEffect(() => {
    setMessages([
      { id: "s1", sender: meetup.host_name || "Host", text: `Welcome to the ${meetup.title} group chat! 🔥 Hyped to meet you all!`, time: new Date(Date.now() - 60 * 60 * 1000) },
      { id: "s2", sender: "Naledi", text: "Can't wait! What should I bring besides my appetite? 😂", time: new Date(Date.now() - 30 * 60 * 1000) },
    ]);
  }, [meetup]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: userName, text, time: new Date(), isMe: true }]);
    setInput("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const attendees = meetup.attendee_ids?.length || 0;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        className="fixed bottom-0 left-0 right-0 z-[70] bg-card rounded-t-3xl flex flex-col"
        style={{ height: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-heading font-bold text-foreground text-sm truncate">{meetup.title}</p>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-body">
                <Users className="w-3 h-3" />
                <span>{attendees} attendees</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2 ${msg.isMe ? "flex-row-reverse" : "flex-row"}`}>
              {!msg.isMe && (
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  {msg.sender?.[0]?.toUpperCase() || "?"}
                </div>
              )}
              <div className={`max-w-[75%] ${msg.isMe ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                {!msg.isMe && (
                  <span className="text-[10px] font-heading font-semibold text-muted-foreground px-1">{msg.sender}</span>
                )}
                <div className={`px-3 py-2 rounded-2xl text-sm font-body ${msg.isMe ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-secondary text-foreground rounded-tl-sm"}`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-muted-foreground px-1">
                  {format(new Date(msg.time), "h:mm a")}
                </span>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-border/40 flex-shrink-0 pb-safe">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Say something to the group..."
            className="flex-1 bg-secondary rounded-full px-4 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center disabled:opacity-40 transition-opacity"
          >
            <Send className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
      </motion.div>
    </>
  );
}