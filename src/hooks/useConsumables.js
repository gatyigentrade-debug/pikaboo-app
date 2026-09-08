import { useSyncExternalStore } from "react";
import { toast } from "sonner";
import { BILLING_PRODUCTS } from "@/utils/billing";

/**
 * Singleton consumables store.
 *
 * Tracks repeatable one-time purchases (Super Likes, Unblurs, Boost, Spotlight)
 * and exposes a React hook (`useConsumables`) so any component can read the
 * current inventory / active perks and consume units.
 *
 * The native Android bridge calls `window.onPurchaseSuccess(data)` (wired in
 * main.jsx) which dispatches a `pikaboo:purchase-success` DOM event. This store
 * listens for that event and grants the matching consumable immediately,
 * updating the UI and showing a confirmation toast.
 */

const STORAGE_KEY = "pikaboo_consumables";

const DEFAULT_STATE = {
  superLikes: 0,
  unblurs: 0,
  boostActiveUntil: null, // ISO timestamp
  spotlightActiveUntil: null, // ISO timestamp
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

let state = loadState();
const listeners = new Set();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / privacy errors */
  }
}

function setState(patch) {
  state = { ...state, ...patch };
  persist();
  listeners.forEach((l) => l());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

// productId -> grant definition
const PRODUCT_GRANTS = {
  [BILLING_PRODUCTS.SUPER_LIKES_5]: { superLikes: 5, label: "5 Super Likes", emoji: "💖" },
  [BILLING_PRODUCTS.SUPER_LIKES_20]: { superLikes: 20, label: "20 Super Likes", emoji: "💖" },
  [BILLING_PRODUCTS.UNBLUR]: { unblurs: 1, label: "1 Instant Unblur", emoji: "👁️" },
  [BILLING_PRODUCTS.BOOST]: { boostMs: 30 * 60 * 1000, label: "Friday Night Boost", emoji: "⚡" },
  [BILLING_PRODUCTS.SPOTLIGHT]: { spotlightMs: 24 * 60 * 60 * 1000, label: "Sunday Spotlight", emoji: "✨" },
};

/** Grant a consumable for a purchased product. Returns true if handled. */
export function grantConsumable(productId) {
  const def = PRODUCT_GRANTS[productId];
  if (!def) return false;

  const patch = {};
  if (def.superLikes) patch.superLikes = state.superLikes + def.superLikes;
  if (def.unblurs) patch.unblurs = state.unblurs + def.unblurs;
  if (def.boostMs) patch.boostActiveUntil = new Date(Date.now() + def.boostMs).toISOString();
  if (def.spotlightMs) patch.spotlightActiveUntil = new Date(Date.now() + def.spotlightMs).toISOString();

  setState(patch);
  toast.success(`${def.emoji} ${def.label} activated!`, {
    description: "Your power-up is ready to use.",
  });
  return true;
}

/** Spend one Super Like. Returns true if a unit was available. */
export function consumeSuperLike() {
  if (state.superLikes <= 0) return false;
  setState({ superLikes: state.superLikes - 1 });
  return true;
}

/** Spend one Instant Unblur. Returns true if a unit was available. */
export function consumeUnblur() {
  if (state.unblurs <= 0) return false;
  setState({ unblurs: state.unblurs - 1 });
  return true;
}

// Wire up the native purchase-success listener once.
if (typeof window !== "undefined" && !window.__pikabooConsumablesInit) {
  window.__pikabooConsumablesInit = true;
  window.addEventListener("pikaboo:purchase-success", (e) => {
    const data = e?.detail || {};
    const productId = data.productId || data.product_id || data.sku || data.id;
    if (productId) grantConsumable(productId);
  });
}

/**
 * React hook over the shared consumables store.
 * Components share the same state; any grant/consume updates every subscriber.
 */
export function useConsumables() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const now = Date.now();
  const boostActive = !!snapshot.boostActiveUntil && new Date(snapshot.boostActiveUntil).getTime() > now;
  const spotlightActive =
    !!snapshot.spotlightActiveUntil && new Date(snapshot.spotlightActiveUntil).getTime() > now;

  return {
    superLikes: snapshot.superLikes,
    unblurs: snapshot.unblurs,
    boostActiveUntil: snapshot.boostActiveUntil,
    spotlightActiveUntil: snapshot.spotlightActiveUntil,
    boostActive,
    spotlightActive,
    consumeSuperLike,
    consumeUnblur,
    grantConsumable,
  };
}