import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Phone, Video, Send, Smile, Mic } from "lucide-react";
import { Input } from "@/components/ui/input";

const sampleMessages = [
  { id: 1, sender: "them", text: "Howzit! Saw you're also a Grill Master 🔥", time: "14:30" },
  { id: 2, sender: "me", text: "Ja nee, my boerewors game is strong! 😄", time: "14:32" },
  { id: 3, sender: "them", text: "We should have a braai-off sometime! Loser makes the salads 🥗", time: "14:35" },
  { id: 4, sender: "me", text: "Eish, you're on! But I warn you, my peri-peri marinade is legendary", time: "14:36" },
];

export default function ChatView({ match, onBack }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(sampleMessages);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "me",
        text: message,
        time: new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setMessage("");
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-0 z-50 bg-background flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50 bg-card/80 backdrop-blur-lg">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 rounded-full overflow-hidden border border-primary/30">
          <img
            src={match.matched_photo || ""}
            alt={match.matched_name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-heading font-semibold text-sm text-foreground">{match.matched_name}</h3>
          <p className="text-[10px] text-green-400 font-body">Online now</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground">
            <Phone className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground">
            <Video className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
          <span className="text-6xl font-heading font-black rotate-[-20deg]">PikaBoo</span>
        </div>

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                  msg.sender === "me"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-secondary text-foreground rounded-bl-md"
                }`}
              >
                <p className="text-sm font-body">{msg.text}</p>
                <p
                  className={`text-[10px] mt-1 ${
                    msg.sender === "me" ? "text-primary-foreground/60" : "text-muted-foreground"
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border/50 bg-card/80 backdrop-blur-lg">
        <div className="flex items-center gap-2">
          <button className="text-muted-foreground hover:text-foreground flex-shrink-0">
            <Smile className="w-5 h-5" />
          </button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="bg-secondary border-none rounded-full text-sm font-body placeholder:text-muted-foreground"
          />
          <button className="text-muted-foreground hover:text-foreground flex-shrink-0">
            <Mic className="w-5 h-5" />
          </button>
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0 disabled:opacity-40"
          >
            <Send className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}