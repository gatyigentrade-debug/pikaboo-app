import { toast } from "sonner";

// Google Play Billing Product IDs
export const BILLING_PRODUCTS = {
  // Subscriptions
  PLUS_WEEKLY: "pikaboo_plus_weekly",
  PREMIUM_MONTHLY: "pikaboo_premium_monthly",
  GOLD_MONTHLY: "pikaboo_gold_monthly",
  // Consumable power-ups (one-time purchases)
  BOOST: "pikaboo_boost_friday",
  DRINK: "pikaboo_drink_3pack",
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