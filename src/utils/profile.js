export const MIN_AGE = 18;

/** First token of a name — surnames are never shown to other users. */
export function firstName(name) {
  return (name || "").trim().split(/\s+/)[0] || "";
}

/** Age in whole years from a date of birth, or null when it can't be derived. */
export function ageFromDob(dateOfBirth) {
  if (!dateOfBirth) return null;
  const birth = new Date(dateOfBirth);
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) age -= 1;
  return age >= 0 && age < 120 ? age : null;
}

export function isAdult(dateOfBirth) {
  const age = ageFromDob(dateOfBirth);
  return age !== null && age >= MIN_AGE;
}

/** Uploaded photo URLs only — empty strings and blanks are never a photo. */
export function realPhotos(profile) {
  return (profile?.photos || []).filter((url) => typeof url === "string" && url.trim());
}

export function hasRealPhoto(profile) {
  return realPhotos(profile).length > 0;
}

export function hasSavedLocation(profile) {
  const lat = Number(profile?.latitude);
  const lng = Number(profile?.longitude);
  return Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0);
}

/** The blue tick is only earned through the real verification flow. */
export function isVerifiedProfile(profile) {
  return profile?.is_verified === true && profile?.verification_status === "verified";
}

export const ISSUE_LABELS = {
  photo: "a photo",
  name: "a first name",
  date_of_birth: "a date of birth",
  age: "an age of 18 or older",
  gender: "a gender",
  location: "a city or saved location",
};

/** Everything a profile still needs before anyone else may see it. */
export function profileIssues(profile) {
  const issues = [];
  if (!hasRealPhoto(profile)) issues.push("photo");
  if (!firstName(profile?.name)) issues.push("name");
  if (!profile?.date_of_birth) issues.push("date_of_birth");
  else if (!isAdult(profile.date_of_birth)) issues.push("age");
  if (!profile?.gender) issues.push("gender");
  if (!(profile?.city || "").trim() && !hasSavedLocation(profile)) issues.push("location");
  return issues;
}

export function isDiscoverable(profile) {
  return profileIssues(profile).length === 0;
}

/** Great-circle distance in whole km, or null when either side has no location. */
export function distanceBetween(from, to) {
  if (!hasSavedLocation(from) || !hasSavedLocation(to)) return null;
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(Number(to.latitude) - Number(from.latitude));
  const dLng = toRad(Number(to.longitude) - Number(from.longitude));
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(Number(from.latitude))) *
      Math.cos(toRad(Number(to.latitude))) *
      Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)));
}

/** Public card shape: first name, derived age, real distance, verified flag. */
export function toPublicProfile(profile, viewer) {
  return {
    ...profile,
    name: firstName(profile?.name),
    age: ageFromDob(profile?.date_of_birth),
    distanceKm: viewer ? distanceBetween(viewer, profile) : null,
    verified: isVerifiedProfile(profile),
  };
}