import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PullToRefreshWrapper from "@/components/common/PullToRefreshWrapper";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Flame, Search, Map, List, SlidersHorizontal, X } from "lucide-react";
import MeetupsCategories, { CATEGORIES } from "@/components/meetups/MeetupsCategories";
import { base44 } from "@/api/base44Client";
import MeetupCard from "@/components/meetups/MeetupCard";
import CreateMeetupSheet from "@/components/meetups/CreateMeetupSheet";
import MeetupsMap from "@/components/meetups/MeetupsMap";

const FILTERS = ["All", "Singles Only", "Social", "Chill", "Family"];
const VIBE_MAP = { "Singles Only": "singles_only", Social: "social", Chill: "chill", Family: "family_friendly" };
const SORT_OPTIONS = [
  { label: "Upcoming", value: "upcoming" },
  { label: "This Week", value: "this_week" },
  { label: "This Weekend", value: "weekend" },
];
const DISTANCE_OPTIONS = [
  { label: "Any Distance", value: 0 },
  { label: "< 10 km", value: 10 },
  { label: "< 25 km", value: 25 },
  { label: "< 50 km", value: 50 },
];

export default function Meetups() {
  const [showCreate, setShowCreate] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [joinedIds, setJoinedIds] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // "list" | "map"
  const [sortBy, setSortBy] = useState("upcoming");
  const [maxDistance, setMaxDistance] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const queryClient = useQueryClient();

  const { data: meetups = [], isLoading } = useQuery({
    queryKey: ["meetups"],
    queryFn: () => base44.entities.BraaiMeetup.list("-date"),
  });

  const handleJoin = async (meetup) => {
    if (joinedIds.includes(meetup.id)) return;

    // Optimistically mark as joined before network request
    setJoinedIds((prev) => [...prev, meetup.id]);

    try {
      const user = await base44.auth.me();
      const updatedIds = [...(meetup.attendee_ids || []), user.id];
      const updatedNames = [...(meetup.attendee_names || []), user.full_name || "You"];
      await base44.entities.BraaiMeetup.update(meetup.id, {
        attendee_ids: updatedIds,
        attendee_names: updatedNames,
      });
      queryClient.invalidateQueries({ queryKey: ["meetups"] });
    } catch (error) {
      // Revert optimistic update on error
      setJoinedIds((prev) => prev.filter((id) => id !== meetup.id));
      console.error("Failed to join meetup:", error);
    }
  };

  const now = new Date();
  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
  endOfWeek.setHours(23, 59, 59, 999);
  const nextSaturday = new Date(now);
  nextSaturday.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7 || 7));
  nextSaturday.setHours(0, 0, 0, 0);
  const nextSunday = new Date(nextSaturday);
  nextSunday.setDate(nextSaturday.getDate() + 1);
  nextSunday.setHours(23, 59, 59, 999);

  const filtered = meetups
    .filter((m) => {
      const matchesVibe = activeFilter === "All" || m.vibe === VIBE_MAP[activeFilter];
      const matchesSearch = !search || m.title?.toLowerCase().includes(search.toLowerCase()) || m.location_name?.toLowerCase().includes(search.toLowerCase()) || m.city?.toLowerCase().includes(search.toLowerCase());
      const meetupDate = m.date ? new Date(m.date) : null;
      const matchesDate =
        sortBy === "this_week" ? meetupDate && meetupDate >= now && meetupDate <= endOfWeek :
        sortBy === "weekend" ? meetupDate && meetupDate >= nextSaturday && meetupDate <= nextSunday :
        meetupDate ? meetupDate >= now : true;
      const matchesDistance = maxDistance === 0 || !m.distance_km || m.distance_km <= maxDistance;
      const matchesCategory = activeCategory === "all" || m.category === activeCategory;
      return matchesVibe && matchesSearch && matchesDate && matchesDistance && matchesCategory;
    })
    .sort((a, b) => {
      const da = a.date ? new Date(a.date) : Infinity;
      const db = b.date ? new Date(b.date) : Infinity;
      return da - db;
    });

  const activeFilterCount = (sortBy !== "upcoming" ? 1 : 0) + (maxDistance > 0 ? 1 : 0);

  const handleRefresh = () => queryClient.invalidateQueries({ queryKey: ["meetups"] });

  return (
    <PullToRefreshWrapper onRefresh={handleRefresh}>
    <div className="px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-8 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-heading font-bold text-foreground">Braai Meetups</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Map / List toggle */}
          <div className="flex bg-secondary rounded-full p-0.5">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-heading font-semibold transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-heading font-semibold transition-colors ${viewMode === "map" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              <Map className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-primary text-primary-foreground text-xs font-heading font-bold glow-orange hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            Host One
          </button>
        </div>
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

      {/* Tinder-style Categories */}
      <MeetupsCategories activeCategory={activeCategory} onSelect={setActiveCategory} />

      {/* Filter chips + sort toggle row */}
      <div className="flex items-center gap-2">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-1">
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
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex-shrink-0 relative flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-heading font-semibold transition-colors ${
            showFilters || activeFilterCount > 0
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border/40 text-muted-foreground bg-secondary"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-primary-foreground text-primary text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Expanded filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-secondary/50 border border-border/40 rounded-2xl p-4 space-y-4">
              {/* Date filter */}
              <div>
                <p className="text-[11px] font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-2">Date</p>
                <div className="flex gap-2 flex-wrap">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-heading font-semibold border transition-colors ${
                        sortBy === opt.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border/40 text-muted-foreground bg-secondary hover:bg-secondary/80"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance filter */}
              <div>
                <p className="text-[11px] font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-2">Distance</p>
                <div className="flex gap-2 flex-wrap">
                  {DISTANCE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setMaxDistance(opt.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-heading font-semibold border transition-colors ${
                        maxDistance === opt.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border/40 text-muted-foreground bg-secondary hover:bg-secondary/80"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              {activeFilterCount > 0 && (
                <button
                  onClick={() => { setSortBy("upcoming"); setMaxDistance(0); }}
                  className="flex items-center gap-1 text-xs text-destructive font-heading font-semibold"
                >
                  <X className="w-3.5 h-3.5" /> Reset filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map View */}
      {viewMode === "map" && !isLoading && (
        <MeetupsMap
          meetups={filtered}
          joinedIds={joinedIds}
          onJoin={handleJoin}
        />
      )}

      {/* Content */}
      {viewMode === "list" && isLoading ? (
        <div className="flex justify-center py-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full"
          />
        </div>
      ) : viewMode === "list" && filtered.length === 0 ? (
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
      ) : viewMode === "list" ? (
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
      ) : null}

      <AnimatePresence>
        {showCreate && (
          <CreateMeetupSheet
            onClose={() => setShowCreate(false)}
            onCreated={() => queryClient.invalidateQueries({ queryKey: ["meetups"] })}
          />
        )}
      </AnimatePresence>
    </div>
    </PullToRefreshWrapper>
  );
}