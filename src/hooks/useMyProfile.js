import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

/**
 * Builds a safe starter profile for a user who has none yet. Only the fields
 * the schema requires (name, age) get real values — everything else is left
 * empty so the user can fill it in from the Edit dialog.
 */
function buildDefaultProfile(user) {
  const name =
    (user?.full_name || "").trim() ||
    (user?.email || "").split("@")[0] ||
    "New Boo";

  return {
    name,
    age: 18,
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