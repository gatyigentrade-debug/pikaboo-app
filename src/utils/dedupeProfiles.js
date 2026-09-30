/**
 * Returns the list with duplicate identities removed, keeping the first
 * occurrence (the freshest record, since feeds are sorted newest-first).
 * Records that carry no identity key are always kept, so nothing is hidden.
 */
export function dedupeByIdentity(list, keyOf = (item) => item?.id) {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  return list.filter((item) => {
    if (!item) return false;
    const key = keyOf(item);
    if (key === undefined || key === null) return true;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * A person is identified by the account that owns the profile record, falling
 * back to the record id for profiles saved before ownership was tracked.
 */
export const profileIdentity = (profile) => profile?.created_by_id || profile?.id;

/** De-duplicated profile list — one entry per person. */
export const dedupeProfiles = (profiles) => dedupeByIdentity(profiles, profileIdentity);

/** De-duplicated match list — one entry per matched person. */
export const dedupeMatches = (matches) =>
  dedupeByIdentity(matches, (match) => match?.matched_profile_id || match?.id);