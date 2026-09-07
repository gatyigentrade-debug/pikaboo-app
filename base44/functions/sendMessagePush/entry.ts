import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const message_id = body.message_id;

    if (!message_id) return Response.json({ error: 'message_id is required' }, { status: 400 });

    // Look up the message record
    const message = await base44.asServiceRole.entities.Message.get(message_id);
    if (!message) return Response.json({ skipped: true, reason: 'Message not found' });
    if (!message.recipient_id) return Response.json({ skipped: true, reason: 'No recipient on message' });

    // Get the sender's first name
    let senderName = 'Someone';
    try {
      const senderProfiles = await base44.asServiceRole.entities.DatingProfile.filter({ created_by_id: message.sender_id });
      if (senderProfiles && senderProfiles.length > 0) senderName = senderProfiles[0].name || senderName;
    } catch (e) {
      // name lookup failed
    }

    // Send the native push notification to the recipient
    await base44.asServiceRole.integrations.Core.SendPushNotification({
      user_id: message.recipient_id,
      title: "💬 New message from " + senderName,
      content: message.text || "You have a new message",
      action_label: "Reply",
      action_url: "/chat/" + message.match_id
    });

    return Response.json({ sent: true, recipientId: message.recipient_id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}