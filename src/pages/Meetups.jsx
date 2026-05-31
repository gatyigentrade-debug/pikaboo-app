import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Flame, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MeetupCard from "@/components/meetups/MeetupCard";
import CreateMeetupSheet from "@/components/meetups/CreateMeetupSheet";

const FILTERS = ["All", "Singles Only", "Social", "Chill", "Family"];
const VIBE_MAP = { "Singles Only": "singles_only", Social: "social", Chill: "chill", Family: "family_friendly" };

export default function Meetups() {
  const [showCreate, setShowCreate] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [joinedIds, setJoinedIds] = useState([]);
  const queryClient = useQueryClient();

  const { data: meetups = [], isLoading } = useQuery({
    queryKey: ["meetups"],
    queryFn: () => base44.entities.BraaiMeetup.list("-date"),
  });

  const handleJoin = async (meetup) => {
    const user = await base44.auth.me();
    if (joinedIds.includes(meetup.id)) return;

    const updatedIds = [...(meetup.attendee_ids || []), user.id];
    const updatedNames = [...(meetup.attendee_names || []), user.full_name || "You"];
    await base44.entities.BraaiMeetup.update(meetup.id, {
      attendee_ids: updatedIds,
      attendee_names: updatedNames,
    });
    setJoinedIds((prev) => [...prev, meetup.id]);
    queryClient.invalidateQueries({ queryKey: ["meetups"] });
  };

  const filtered = meetups.filter((m) => {
    const matchesFilter = activeFilter === "All" || m.vibe === VIBE_MAP[activeFilter];
    const matchesSearch = !search || m.title?.toLowerCase().includes(search.toLowerCase()) || m.location_name?.toLowerCase().includes(search.toLowerCase()) || m.city?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="px-4 pt-4 pb-8 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-heading font-bold text-foreground">Braai Meetups</h1>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-primary text-primary-foreground text-xs font-heading font-bold glow-orange hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" />
          Host One
        </button>
      </div>

      {/* Tagline */}
      <p className="text-sm text-muted-foreground font-body -mt-2">
        Find singles at local braais near you 🥩
      </p>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search area or event..."
          className="w-full bg-secondary border-none rounded-full pl-9 pr-4 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-heading font-semibold border transition-colors ${
              activeFilter === f
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border/40 text-muted-foreground bg-secondary hover:bg-secondary/80"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full"
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <div className="text-5xl">🔥</div>
          <h3 className="font-heading font-bold text-foreground">No braais yet!</h3>
          <p className="text-sm text-muted-foreground font-body">Be the first to host one in your area.</p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-heading font-bold text-sm glow-orange"
          >
            🔥 Host a Braai
          </button>
        </div>
      ) : (
        <div className="space-y-4 pb-20">
          <AnimatePresence>
            {filtered.map((meetup) => (
              <MeetupCard
                key={meetup.id}
                meetup={meetup}
                hasJoined={joinedIds.includes(meetup.id) || meetup.attendee_ids?.includes("me")}
                onJoin={() => handleJoin(meetup)}
                onView={() => {}}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {showCreate && (
          <CreateMeetupSheet
            onClose={() => setShowCreate(false)}
            onCreated={() => queryClient.invalidateQueries({ queryKey: ["meetups"] })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}