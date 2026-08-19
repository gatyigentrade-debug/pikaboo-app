import { createClientFromRequest } from "npm:@base44/sdk@0.8.40";
import { secrets } from "base44:runtime";

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const public_key = secrets.get("PAYSTACK_PUBLIC_KEY");
    if (!public_key) return Response.json({ error: "Public key not configured" }, { status: 500 });
    return Response.json({ public_key });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}