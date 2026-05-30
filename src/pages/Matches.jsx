import { useState } from "react";
import { MessageCircle, Heart } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import MatchCard from "@/components/matches/MatchCard";
import ChatView from "@/components/matches/ChatView";

const demoMatches = [
  {
    id: "m1",
    matched_name: "Naledi",
    matched_photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop",
    status: "matched",
    last_message: "My boerewors recipe is a family secret 🤫",
    last_message_time: "2026-05-30T14:30:00Z",
    unread_count: 2,
  },
  {
    id: "m2",
    matched_name: "Thabo",
    matched_photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    status: "pending",
    last_message: null,
    last_message_time: null,
    unread_count: 0,
  },
  {
    id: "m3",
    matched_name: "Zanele",
    matched_photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    status: "matched",
    last_message: "Let's debate: pap or rice? 🤔",
    last_message_time: "2026-05-29T10:00:00Z",
    unread_count: 0,
  },
];

export default function Matches() {
  const [selectedMatch, setSelectedMatch] = useState(null);

  const newMatches = demoMatches.filter((m) => m.status === "pending");
  const conversations = demoMatches.filter((m) => m.status === "matched");

  return (
    <div className="px-4 pt-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageCircle className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-heading font-bold text-foreground">Matches</h1>
      </div>

      {/* New matches */}
      {newMatches.length > 0 && (
        <section>
          <h2 className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            New Matches
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {newMatches.map((match) => (
              <button
                key={match.id}
                onClick={() => setSelectedMatch(match)}
                className="flex flex-col items-center gap-1.5 flex-shrink-0"
              >
                <div className="w-16 h-16 rounded-full border-2 border-primary p-0.5 glow-orange">
                  <img
                    src={match.matched_photo}
                    alt={match.matched_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <span className="text-xs font-body text-foreground">{match.matched_name}</span>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-primary fill-primary" />
                  <span className="text-[10px] text-primary font-body">New!</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Conversations */}
      <section className="pb-24">
        <h2 className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Messages
        </h2>
        <div className="space-y-2">
          {conversations.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onClick={() => setSelectedMatch(match)}
            />
          ))}
        </div>
        {conversations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-body text-sm">
              No messages yet. Start swiping to find your vibe!
            </p>
          </div>
        )}
      </section>

      {/* Chat View */}
      <AnimatePresence>
        {selectedMatch && (
          <ChatView
            match={selectedMatch}
            onBack={() => setSelectedMatch(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}