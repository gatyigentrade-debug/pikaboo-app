import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Compass, Zap, Users, Grid3X3 } from "lucide-react";
import NearbyMap from "@/components/discover/NearbyMap";
import OnlineBubbles from "@/components/discover/OnlineBubbles";
import EncounterCard from "@/components/discover/EncounterCard";

export default function Discover() {
  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["profiles"],
    queryFn: () => base44.entities.DatingProfile.list(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 space-y-6">
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
        </div>
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
      </section>
    </div>
  );
}