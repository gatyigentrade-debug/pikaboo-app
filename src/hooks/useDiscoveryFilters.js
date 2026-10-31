import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "pikaboo.discovery.filters";

export const DEFAULT_FILTERS = { distance: 50, ageMin: 18, ageMax: 60, interests: [] };

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_FILTERS };
    const parsed = JSON.parse(raw);
    return {
      distance: Number(parsed.distance) || DEFAULT_FILTERS.distance,
      ageMin: Math.max(18, Number(parsed.ageMin) || DEFAULT_FILTERS.ageMin),
      ageMax: Number(parsed.ageMax) || DEFAULT_FILTERS.ageMax,
      interests: Array.isArray(parsed.interests) ? parsed.interests : [],
    };
  } catch {
    return { ...DEFAULT_FILTERS };
  }
}

/**
 * Single source of truth for discovery filters, persisted to localStorage so
 * the Swipe tab and the Explore feed share the same saved state.
 */
export function useDiscoveryFilters() {
  const [filters, setFilters] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch {}
  }, [filters]);

  const save = useCallback((next) => {
    setFilters((prev) => ({
      ...prev,
      ...next,
      ageMin: Math.max(18, Number(next?.ageMin ?? prev.ageMin)),
    }));
  }, []);

  const reset = useCallback(() => setFilters({ ...DEFAULT_FILTERS }), []);

  return { filters, save, reset, setFilters };
}

/** Apply saved filters to a list of public profiles. */
export function filterProfiles(profiles, filters) {
  if (!filters || !Array.isArray(profiles)) return profiles || [];
  return profiles.filter((p) => {
    if (p.distanceKm != null && filters.distance != null && p.distanceKm > filters.distance) return false;
    if (p.age != null) {
      if (filters.ageMin != null && p.age < filters.ageMin) return false;
      if (filters.ageMax != null && p.age > filters.ageMax) return false;
    }
    if (filters.interests?.length) {
      const pi = Array.isArray(p.interests) ? p.interests : [];
      if (!filters.interests.some((i) => pi.includes(i))) return false;
    }
    return true;
  });
}