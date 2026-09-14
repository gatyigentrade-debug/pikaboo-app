import { toast } from "sonner";

// Google Play Billing Product IDs
// IMPORTANT: These must match exactly the product IDs configured in the
// Google Play Console (Monetize → Products). If a product is "not found",
// verify the ID here matches the Console entry (case-sensitive, no spaces).
export const BILLING_PRODUCTS = {
  // Subscriptions
  PLUS_WEEKLY: "pikaboo_plus_weekly",
  PREMIUM_MONTHLY: "pikaboo_premium_monthly",
  GOLD_MONTHLY: "pikaboo_gold_monthly",
  // Consumable power-ups (one-time purchases)
  BOOST: "pikaboo_boost_friday",
  UNBLUR: "pikaboo_unblur_instant",
  SUPER_LIKES_5: "pikaboo_superlikes_5",
  SUPER_LIKES_20: "pikaboo_superlikes_20",
  SPOTLIGHT: "pikaboo_spotlight_24h",
};

/**
 * Triggers a Google Play billing purchase via the native Android bridge.
 * Falls back to a simulated flow on web.
 */
export async function triggerPurchase(productId) {
  try {
    if (window.PikaBooNative?.buyProduct) {
      window.PikaBooNative.buyProduct(productId);
      return { success: true, productId };
    }
    // Web fallback — simulate a successful native purchase so consumables
    // grant immediately in the preview (the native bridge calls
    // window.onPurchaseSuccess, which dispatches the same event).
    window.dispatchEvent(
      new CustomEvent("pikaboo:purchase-success", { detail: { productId } })
    );
    return { success: true, productId };
  } catch (error) {
    toast.error("Purchase failed", { description: error.message });
    return { success: false, error };
  }
}

// Global purchase-error listener — catches native "product not found" and
// other billing errors for ALL purchase points (Shop, Gold modal, Subscriptions).
// Subscriptions.jsx also shows an inline error; this toast covers the rest.
if (typeof window !== "undefined" && !window.__pikabooPurchaseErrorInit) {
  window.__pikabooPurchaseErrorInit = true;
  window.addEventListener("pikaboo:purchase-error", (e) => {
    const raw = e?.detail;
    const msg = typeof raw === "string" ? raw : raw?.message || raw?.error || "";
    const lower = (msg || "").toLowerCase();
    if (lower.includes("not found") || lower.includes("unavailable") || lower.includes("not available") || lower.includes("item not found")) {
      toast.error("Product not available", {
        description: "This item isn't available yet. Please try again later or contact support.",
      });
    } else if (lower.includes("cancel") || lower.includes("user")) {
      // User cancelled — no toast needed
    } else {
      toast.error("Purchase failed", { description: msg || "Please try again." });
    }
  });
}