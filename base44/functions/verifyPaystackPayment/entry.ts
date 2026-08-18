import { createClientFromRequest } from "npm:@base44/sdk@0.8.40";
import { secrets } from "base44:runtime";
import { PLANS, getPlanDurationDays } from "../../shared/paystackPlans.ts";

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const reference = body.reference;
    if (!reference) return Response.json({ error: "Missing reference" }, { status: 400 });

    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secrets.get("PAYSTACK_SECRET_KEY")}` },
    });
    const data = await res.json();

    if (!data.status || data.data.status !== "success") {
      return Response.json({ error: "Payment not successful", paystack_status: data.data?.status }, { status: 400 });
    }

    const planId = data.data.metadata?.plan || body.plan;
    const plan = PLANS[planId];
    if (!plan) return Response.json({ error: "Invalid plan in transaction" }, { status: 400 });

    const profiles = await base44.entities.DatingProfile.filter({ created_by_id: user.id });
    const profile = profiles[0];
    if (!profile) return Response.json({ error: "Profile not found" }, { status: 404 });

    const expiresAt = new Date(Date.now() + getPlanDurationDays(planId) * 24 * 60 * 60 * 1000).toISOString();

    await base44.entities.DatingProfile.update(profile.id, {
      is_vip: true,
      vip_plan: planId,
      vip_expires_at: expiresAt,
    });

    return Response.json({ success: true, plan: planId, expires_at: expiresAt });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}