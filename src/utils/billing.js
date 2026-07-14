import { toast } from "sonner";

// Google Play Billing Product IDs
export const BILLING_PRODUCTS = {
  PLUS_WEEKLY: "pikaboo_plus_weekly",
  PLUS_MONTHLY: "pikaboo_plus_monthly",
  GOLD_MONTHLY: "pikaboo_gold_monthly",
  // Power-ups (consumable one-time purchases)
  BOOST: "pikaboo_boost_friday",
  DRINK: "pikaboo_drink_3pack",
  UNBLUR: "pikaboo_unblur_single",
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
    if (window.AndroidBilling?.launchPurchaseFlow) {
      return await window.AndroidBilling.launchPurchaseFlow(productId);
    }
    // Web fallback — simulate billing
    toast.success("Purchase initiated", {
      description: `Product: ${productId}`,
    });
    return { success: true, productId };
  } catch (error) {
    toast.error("Purchase failed", { description: error.message });
    return { success: false, error };
  }
}