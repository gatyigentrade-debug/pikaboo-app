import { base44 } from "base44-deno-sdk";

export default async function handler() {
  const now = new Date();
  const in23Hours = new Date(now.getTime() + 23 * 60 * 60 * 1000);
  const in25Hours = new Date(now.getTime() + 25 * 60 * 60 * 1000);

  // Fetch all upcoming meetups
  const meetups = await base44.entities.BraaiMeetup.list();

  // Filter to meetups starting in the 23–25 hour window (i.e. ~24h away)
  const upcomingMeetups = meetups.filter((m: any) => {
    const meetupDate = new Date(m.date);
    return meetupDate >= in23Hours && meetupDate <= in25Hours;
  });

  if (upcomingMeetups.length === 0) {
    console.log("No meetups in the 24-hour reminder window.");
    return { sent: 0 };
  }

  // Fetch all users
  const users = await base44.entities.User.list();
  const userMap: Record<string, any> = {};
  for (const user of users) {
    userMap[user.id] = user;
  }

  let totalSent = 0;

  for (const meetup of upcomingMeetups) {
    const attendeeIds: string[] = meetup.attendee_ids || [];
    const meetupDate = new Date(meetup.date);
    const dateStr = meetupDate.toLocaleDateString("en-ZA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeStr = meetupDate.toLocaleTimeString("en-ZA", {
      hour: "2-digit",
      minute: "2-digit",
    });

    for (const attendeeId of attendeeIds) {
      const user = userMap[attendeeId];
      if (!user?.email) continue;

      const firstName = user.full_name?.split(" ")[0] || "there";

      await base44.integrations.Core.SendEmail({
        to: user.email,
        from_name: "PikaBoo 🔥",
        subject: `🥩 Reminder: "${meetup.title}" braai is tomorrow!`,
        body: `
Hey ${firstName}!

Just a heads-up — the braai you're attending is happening tomorrow!

🔥 ${meetup.title}
📍 ${meetup.location_name}${meetup.city ? `, ${meetup.city}` : ""}
🗓️ ${dateStr} at ${timeStr}
${meetup.bring ? `🧺 Don't forget to bring: ${meetup.bring}` : ""}
${meetup.host_name ? `👤 Hosted by: ${meetup.host_name}` : ""}

Get ready to fire up the braai! See you there 🤙

— The PikaBoo Team
        `.trim(),
      });

      totalSent++;
    }

    console.log(`Sent reminders for meetup "${meetup.title}" to ${attendeeIds.length} attendees.`);
  }

  return { sent: totalSent, meetups_processed: upcomingMeetups.length };
}