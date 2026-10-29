import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useMyProfile } from "@/hooks/useMyProfile";
import { isDiscoverable, profileIssues, toPublicProfile } from "@/utils/profile";

export async function fetchAllProfiles() {
  const res = await base44.entities.DatingProfile.list("-created_date", 200);
  return Array.isArray(res) ? res : res?.items || [];
}

/**
 * Single source for every profile feed: loads profiles, drops anyone who is
 * incomplete or under 18, removes the signed-in user, and adds the derived
 * first name, age and distance for the viewer.
 */
export default function useDiscoverableProfiles() {
  const { user } = useAuth();
  const { profile: myProfile, isLoading: myProfileLoading, refetch: refetchMine } = useMyProfile();

  const { data: raw = [], isLoading, refetch } = useQuery({
    queryKey: ["allProfiles"],
    queryFn: fetchAllProfiles,
    staleTime: 60_000,
  });

  const discoverable = useMemo(
    () =>
      raw
        .filter((p) => p.created_by_id !== user?.id)
        .filter(isDiscoverable)
        .map((p) => toPublicProfile(p, myProfile)),
    [raw, user?.id, myProfile]
  );

  const eligibleIds = useMemo(() => new Set(discoverable.map((p) => p.id)), [discoverable]);
  const myIssues = useMemo(() => (myProfile ? profileIssues(myProfile) : []), [myProfile]);

  const refresh = async () => {
    await Promise.all([refetch(), refetchMine()]);
  };

  return {
    myProfile,
    myIssues,
    isLoading: isLoading || myProfileLoading,
    discoverable,
    eligibleIds,
    refresh,
  };
}