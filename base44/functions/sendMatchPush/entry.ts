import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const match_id = body.match_id;

    if (!match_id) return Response.json({ error: 'match_id is required' }, { status: 400 });

    // Look up the match record
    const match = await base44.asServiceRole.entities.Match.get(match_id);
    if (!match) return Response.json({ skipped: true, reason: 'Match not found' });

    // The matched person's DatingProfile holds their user id (created_by_id)
    let recipientId = null;
    try {
      const matchedProfile = await base44.asServiceRole.entities.DatingProfile.get(match.matched_profile_id);
      recipientId = matchedProfile?.created_by_id || null;
    } catch (e) {
      // profile lookup failed
    }
    if (!recipientId) return Response.json({ skipped: true, reason: 'No recipient user found' });

    // Get the liker's first name for a personal touch
    let likerName = 'Someone';
    try {
      const likerProfiles = await base44.asServiceRole.entities.DatingProfile.filter({ created_by_id: match.user_profile_id });
      if (likerProfiles && likerProfiles.length > 0) likerName = likerProfiles[0].name || likerName;
    } catch (e) {
      // name lookup failed — use fallback
    }

    // Send the native push notification
    await base44.asServiceRole.integrations.Core.SendPushNotification({
      user_id: recipientId,
      title: "🔥 It's a Lekker Match!",
      content: likerName + " matched with you! Tap to start the conversation.",
      action_label: "Start Chatting",
      action_url: "/matches"
    });

    return Response.json({ sent: true, recipientId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}