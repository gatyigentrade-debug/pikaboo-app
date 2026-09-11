import { Shield, Bell } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import PullToRefreshWrapper from "@/components/common/PullToRefreshWrapper";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function Chat() {
  const navigate = useNavigate();

  const { data: matches = [], refetch } = useQuery({
    queryKey: ["matches"],
    queryFn: () => base44.entities.Match.filter({ status: "matched" }, '-updated_date'),
  });

  const handleRefresh = async () => { await refetch(); };

  const newMatches = matches.filter((m) => !m.last_message);
  const conversations = matches.filter((m) => m.last_message);

  return (
    <PullToRefreshWrapper onRefresh={handleRefresh} className="px-4 pt-[calc(1rem+env(safe-area-inset-top))]">
      <div className="space-y-6 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold text-foreground">Chat</h1>
          <div className="flex items-center gap-2">
            <button aria-label="Safety" className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground">
              <Shield className="w-4 h-4" />
            </button>
            <button
              onClick={() => toast.info("No new notifications", { description: "You're all caught up! 🎉" })}
              aria-label="Notifications"
              className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* New Matches */}
        {newMatches.length > 0 && (
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
                <p className="text-sm text-muted-foreground font-body mt-1">Likes</p>
              </Link>
              {/* User tiles */}
              {newMatches.map((m) => (
                <button
                  key={m.id}
                  onClick={() => navigate(`/chat/${m.id}`, { state: { match: m } })}
                  className="flex-shrink-0 w-24 h-28 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-2"
                >
                  {m.matched_photo ? (
                    <img src={m.matched_photo} alt={m.matched_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-heading font-black text-foreground mb-1">{m.matched_name?.[0] || "?"}</span>
                  )}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Messages */}
        <section>
          <h2 className="text-sm font-heading font-semibold text-foreground mb-3">Messages</h2>
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-muted-foreground font-body">No conversations yet. Start chatting with your matches!</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {conversations.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => navigate(`/chat/${msg.id}`, { state: { match: msg } })}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-secondary/40 hover:bg-secondary/60 transition-colors text-left"
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full border-2 border-gold/30 overflow-hidden">
                      {msg.matched_photo ? (
                        <img src={msg.matched_photo} alt={msg.matched_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary">
                          <span className="text-lg font-heading font-bold text-foreground">{msg.matched_name?.[0] || "?"}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-foreground text-sm">{msg.matched_name}</h3>
                    <p className="text-sm text-muted-foreground font-body truncate mt-0.5">
                      {msg.last_message || "Say hi! 👋"}
                    </p>
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {msg.last_message_time && (
                      <span className="text-sm text-muted-foreground font-body">
                        {new Date(msg.last_message_time).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                    {msg.unread_count > 0 && (
                      <div className="w-5 h-5 rounded-full bg-yellow-400 text-black text-sm font-bold flex items-center justify-center">
                        {msg.unread_count}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </PullToRefreshWrapper>
  );
}