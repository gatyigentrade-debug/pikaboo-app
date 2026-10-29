import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { ageFromDob } from "@/utils/profile";

/**
 * Builds a starter profile for a user who has none yet. No age, gender or
 * photo is invented: the profile stays hidden from feeds until the user adds
 * their real details in the Edit dialog.
 */
function buildDefaultProfile(user) {
  const name =
    (user?.full_name || "").trim() ||
    (user?.email || "").split("@")[0] ||
    "New Boo";

  return {
    name,
    bio: "",
    city: "",
    photos: [],
    interests: [],
    verification_status: "not_submitted",
    is_verified: false,
  };
}

// Shared in-flight promise so concurrent callers (app init + profile page)
// can never create two profiles for the same user.
let inFlight = null;

/**
 * Returns the signed-in user's dating profile, creating a default one the
 * first time if the user has none. Resolves to null when there is no signed-in
 * user rather than throwing, so app-init callers can call it safely.
 */
export async function ensureMyProfile() {
  if (inFlight) return inFlight;

  inFlight = (async () => {
    const user = await base44.auth.me();
    if (!user?.id) return null;

    const { items } = await base44.entities.DatingProfile.filter(
      { created_by_id: user.id },
      { limit: 1, sort: "-created_date" }
    );
    if (items?.[0]) return items[0];

    return await base44.entities.DatingProfile.create(buildDefaultProfile(user));
  })();

  try {
    return await inFlight;
  } finally {
    inFlight = null;
  }
}

/**
 * Stores the date of birth captured at sign-up on the signed-in user's profile
 * (creating the profile first if needed) and keeps the derived age in sync.
 */
export async function saveDateOfBirth(dateOfBirth) {
  const profile = await ensureMyProfile();
  if (!profile?.id) return null;
  return await base44.entities.DatingProfile.update(profile.id, {
    date_of_birth: dateOfBirth,
    age: ageFromDob(dateOfBirth),
  });
}

/**
 * Profile query for the signed-in user. Always resolves to an object (or null),
 * never an empty result set, so pages can render a fallback instead of nothing.
 */
export function useMyProfile() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["myProfile"],
    queryFn: ensureMyProfile,
    retry: 1,
  });

  return { profile: data ?? null, isLoading, isError, refetch };
}