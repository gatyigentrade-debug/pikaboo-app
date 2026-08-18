import { createClientFromRequest } from "npm:@base44/sdk@0.8.40";
import { secrets } from "base44:runtime";
import { PLANS } from "../../shared/paystackPlans.ts";

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const planId = body.plan;
    const plan = PLANS[planId];
    if (!plan) return Response.json({ error: "Invalid plan" }, { status: 400 });

    const reference = `pikaboo_${planId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secrets.get("PAYSTACK_SECRET_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: plan.amountKobo,
        currency: "ZAR",
        reference,
        metadata: {
          user_id: user.id,
          plan: planId,
          custom_fields: [
            { display_name: "User ID", variable_name: "user_id", value: user.id },
            { display_name: "Plan", variable_name: "plan", value: planId },
          ],
        },
      }),
    });

    const data = await res.json();
    if (!data.status) {
      return Response.json({ error: data.message || "Paystack init failed" }, { status: 400 });
    }

    return Response.json({
      access_code: data.data.access_code,
      reference,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}