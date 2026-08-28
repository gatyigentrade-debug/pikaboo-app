import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Compass, Zap, Users, Grid3X3 } from "lucide-react";
import NearbyMap from "@/components/discover/NearbyMap";
import OnlineBubbles from "@/components/discover/OnlineBubbles";
import EncounterCard from "@/components/discover/EncounterCard";
import PullToRefreshWrapper from "@/components/common/PullToRefreshWrapper";

const DEFAULT_RADIUS_KM = 50;
const withTimeout = (promise, ms, fallback) =>
  Promise.race([promise, new Promise((resolve) => setTimeout(() => resolve(fallback), ms))]);

export default function Discover() {
  const { data: profiles = [], isLoading, refetch, isError } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      try {
        return await withTimeout(base44.entities.DatingProfile.list(), 8000, []);
      } catch {
        return [];
      }
    },
    retry: 1,
    staleTime: 60_000,
  });

  const handleRefresh = async () => { await refetch(); };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isEmpty = profiles.length === 0;

  return (
    <PullToRefreshWrapper onRefresh={handleRefresh} className="px-4 pt-[calc(1rem+env(safe-area-inset-top))]">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Compass className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-heading font-bold text-foreground">Discover</h1>
      </div>

      {/* Online now */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-violet" />
          <h2 className="text-sm font-heading font-semibold text-foreground">People Streaming</h2>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
        <OnlineBubbles profiles={profiles} />
      </section>

      {/* Map */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-heading font-semibold text-foreground">Near You</h2>
        </div>
        <NearbyMap />
      </section>

      {/* Encounters */}
      <section className="pb-24">
        <div className="flex items-center gap-2 mb-3">
          <Grid3X3 className="w-4 h-4 text-gold" />
          <h2 className="text-sm font-heading font-semibold text-foreground">Encounters</h2>
          <span className="text-xs text-muted-foreground font-body ml-auto">within {DEFAULT_RADIUS_KM} km</span>
        </div>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center text-center py-10 px-4 rounded-2xl border border-border/40 bg-secondary/30">
            <Grid3X3 className="w-8 h-8 text-muted-foreground mb-3" />
            <p className="text-sm font-heading font-bold text-foreground">No profiles nearby yet</p>
            <p className="text-xs text-muted-foreground font-body mt-1 mb-4 max-w-[220px]">
              {isError ? "Couldn't load profiles right now." : "Try expanding your filters or check back soon."}
            </p>
            <button onClick={() => refetch()} className="px-5 py-3 min-h-[44px] rounded-full bg-primary text-primary-foreground text-xs font-heading font-bold active:scale-95 transition-transform">
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {profiles.slice(0, 4).map((profile) => (
              <EncounterCard
                key={profile.id}
                profile={profile}
                onLike={() => {}}
                onPass={() => {}}
              />
            ))}
          </div>
        )}
      </section>
      </div>
    </PullToRefreshWrapper>
  );
}