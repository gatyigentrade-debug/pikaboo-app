import { Shield, Settings, BadgeCheck, Mic } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PullToRefreshWrapper from "@/components/common/PullToRefreshWrapper";

const newMatches = [
  { id: "c1", matched_name: "Zintle", matched_photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop", color: "#4A1A5A", initial: "Z", is_verified: true },
  { id: "c2", matched_name: "Anele", matched_photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop", color: "#5A3010", initial: "A", is_verified: true, likes_you: true },
  { id: "c3", matched_name: "Mpho", matched_photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop", color: "#5A1030", initial: "M", is_verified: false },
];

const messages = [
  { id: "m1", name: "Zintle", initial: "Z", color: "#4A1A5A", preview: "Hey! Your voice note was so nice 😍", time: "10:30", unread: 2, is_verified: true, is_voice: false },
  { id: "m2", name: "Anele", initial: "A", color: "#5A3010", preview: "Recently active, match now!", time: "09:11", unread: 0, is_verified: true, likes_you: true, is_active: true },
  { id: "m3", name: "Mpho", initial: "M", color: "#5A1030", preview: "Voice note", time: "Yesterday", unread: 0, is_verified: false, is_voice: true },
];

export default function Chat() {
  const navigate = useNavigate();
  const handleRefresh = () => new Promise((res) => setTimeout(res, 1000));

  return (
    <PullToRefreshWrapper onRefresh={handleRefresh} className="px-4 pt-[calc(1rem+env(safe-area-inset-top))]">
      <div className="space-y-6 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold text-foreground">Chat</h1>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground">
              <Shield className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* New Matches */}
        <section>
          <h2 className="text-sm font-heading font-semibold text-foreground mb-3">New Matches</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {/* Likes card */}
            <Link
              to="/likes"
              className="flex-shrink-0 w-24 h-28 rounded-2xl border-2 border-gold/50 bg-secondary/50 flex flex-col items-center justify-center p-2"
            >
              <p className="text-2xl font-heading font-black text-gold">17</p>
              <p className="text-lg">🐝🐝</p>
              <p className="text-[10px] text-muted-foreground font-body mt-1">Likes</p>
            </Link>
            {/* User tiles */}
            {newMatches.map((m) => (
              <button
                key={m.id}
                onClick={() => navigate(`/chat/${m.id}`, { state: { match: m } })}
                className="flex-shrink-0 w-24 h-28 rounded-2xl flex flex-col items-center justify-center p-2"
                style={{ backgroundColor: m.color }}
              >
                <span className="text-3xl font-heading font-black text-white mb-1">{m.initial}</span>
                <span className="text-[10px] text-white/70 font-body">{m.matched_name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Messages */}
        <section>
          <h2 className="text-sm font-heading font-semibold text-foreground mb-3">Messages</h2>
          <div className="space-y-2.5">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => navigate(`/chat/${msg.id}`, { state: { match: { matched_name: msg.name, matched_photo: "", id: msg.id } } })}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-secondary/40 hover:bg-secondary/60 transition-colors text-left"
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-12 h-12 rounded-full border-2 border-gold/30 flex items-center justify-center"
                    style={{ backgroundColor: msg.color }}
                  >
                    <span className="text-lg font-heading font-bold text-white">{msg.initial}</span>
                  </div>
                  {msg.is_verified && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-gold flex items-center justify-center border-2 border-background">
                      <BadgeCheck className="w-2.5 h-2.5 text-black" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-foreground text-sm">{msg.name}</h3>
                    {msg.likes_you && (
                      <span className="px-1.5 py-0.5 rounded-full bg-gold/20 text-gold text-[9px] font-heading font-bold">
                        LIKES YOU
                      </span>
                    )}
                  </div>
                  <p className={`text-xs font-body truncate mt-0.5 flex items-center gap-1 ${
                    msg.is_active ? "text-yellow-400" : "text-muted-foreground"
                  }`}>
                    {msg.is_voice && <Mic className="w-3 h-3 flex-shrink-0" />}
                    {msg.preview}
                  </p>
                </div>

                {/* Right side */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-[10px] text-muted-foreground font-body">{msg.time}</span>
                  {msg.unread > 0 && (
                    <div className="w-5 h-5 rounded-full bg-yellow-400 text-black text-[10px] font-bold flex items-center justify-center">
                      {msg.unread}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

    </PullToRefreshWrapper>
  );
}