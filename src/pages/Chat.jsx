import { Shield, Bell, Heart } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import PullToRefreshWrapper from "@/components/common/PullToRefreshWrapper";
import ProfilePhoto from "@/components/common/ProfilePhoto";
import { dedupeMatches } from "@/utils/dedupeProfiles";
import { firstName } from "@/utils/profile";
import useDiscoverableProfiles from "@/hooks/useDiscoverableProfiles";

export default function Chat() {
  const navigate = useNavigate();
  const { eligibleIds } = useDiscoverableProfiles();

  const { data: rawMatches = [], refetch, isLoading } = useQuery({
    queryKey: ["matches"],
    queryFn: () => base44.entities.Match.filter({ status: "matched" }, '-updated_date'),
  });

  const handleRefresh = async () => { await refetch(); };

  // Complete profiles only, one row per person, first names only
  const matches = dedupeMatches(rawMatches)
    .filter((m) => eligibleIds.has(m.matched_profile_id))
    .map((m) => ({ ...m, matched_name: firstName(m.matched_name) }));

  const newMatches = matches.filter((m) => !m.last_message);
  const conversations = matches.filter((m) => m.last_message);

  const fmtTime = (t) => (t ? new Date(t).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" }) : "");

  return (
    <PullToRefreshWrapper onRefresh={handleRefresh} className="px-4 pt-[calc(1rem+env(safe-area-inset-top))]">
      <div className="space-y-6 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold text-gradient-gold">Chat</h1>
          <div className="flex items-center gap-2">
            <button aria-label="Safety" className="w-11 h-11 rounded-full bg-[#29252E] flex items-center justify-center text-muted-foreground hover:text-gold transition-colors">
              <Shield className="w-4 h-4" />
            </button>
            <button
              onClick={() => toast.info("No new notifications", { description: "You're all caught up! 🎉" })}
              aria-label="Notifications"
              className="w-11 h-11 rounded-full bg-[#29252E] flex items-center justify-center text-muted-foreground hover:text-gold transition-colors"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* New Matches */}
        {newMatches.length > 0 && (
          <section>
            <h2 className="text-xs font-heading font-semibold text-gold/80 uppercase tracking-widest mb-3">New Matches</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <Link
                to="/likes"
                className="flex-shrink-0 w-24 h-28 rounded-2xl border-2 border-gold/40 bg-gradient-to-br from-[#2A0A3B]/40 to-[#171717] flex flex-col items-center justify-center p-2 text-center"
              >
                <Heart className="w-6 h-6 text-gold mb-1" />
                <p className="text-sm text-gold font-heading font-bold">Likes</p>
                <p className="text-[11px] text-muted-foreground font-body leading-tight">See who's into you</p>
              </Link>
              {newMatches.map((m) => (
                <button
                  key={m.id}
                  onClick={() => navigate(`/chat/${m.id}`, { state: { match: m } })}
                  className="flex-shrink-0 w-24 h-28 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center"
                >
                  <ProfilePhoto src={m.matched_photo} alt={m.matched_name} className="w-full h-full object-cover" iconClassName="w-8 h-8" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] to-transparent" />
                  <span className="absolute bottom-2 left-2 right-2 text-xs font-heading font-semibold text-white truncate">{m.matched_name}</span>
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-gold text-[#171717] text-[10px] font-heading font-bold">NEW</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Messages */}
        <section>
          <h2 className="text-xs font-heading font-semibold text-gold/80 uppercase tracking-widest mb-3">Messages</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-7 h-7 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center px-6">
              <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mb-4 glow-gold-ring">
                <Heart className="w-7 h-7 text-gold" />
              </div>
              <p className="text-sm text-muted-foreground font-body">No conversations yet. Start chatting with your matches!</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {conversations.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => navigate(`/chat/${msg.id}`, { state: { match: msg } })}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-[#29252E]/60 hover:bg-[#29252E] border border-white/5 hover:border-gold/20 transition-colors text-left"
                >
                  <div className="relative flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${msg.unread_count > 0 ? "border-gold" : "border-gold/25"}`}>
                      <ProfilePhoto src={msg.matched_photo} alt={msg.matched_name} className="w-full h-full object-cover" iconClassName="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-foreground text-sm">{msg.matched_name}</h3>
                    <p className="text-sm text-muted-foreground font-body truncate mt-0.5">{msg.last_message || "Say hi! 👋"}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {msg.last_message_time && <span className="text-xs text-muted-foreground font-body">{fmtTime(msg.last_message_time)}</span>}
                    {msg.unread_count > 0 && (
                      <div className="w-5 h-5 rounded-full bg-gold text-[#171717] text-xs font-bold flex items-center justify-center">{msg.unread_count}</div>
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