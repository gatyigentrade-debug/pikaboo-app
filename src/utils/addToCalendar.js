/**
 * Generates and triggers download of an .ics calendar file.
 * Works natively on iOS (opens in Calendar), Android, and desktop.
 */
export function addToCalendar(meetup) {
  const start = new Date(meetup.date);
  // Default duration: 3 hours for a braai 🔥
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);

  const pad = (n) => String(n).padStart(2, "0");
  const fmt = (d) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T` +
    `${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

  const location = [meetup.location_name, meetup.city].filter(Boolean).join(", ");
  const description = [
    meetup.description,
    meetup.bring ? `Bring: ${meetup.bring}` : null,
    meetup.host_name ? `Hosted by ${meetup.host_name}` : null,
  ]
    .filter(Boolean)
    .join("\\n");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PikaBoo//Braai Meetups//EN",
    "BEGIN:VEVENT",
    `UID:${meetup.id}@pikaboo`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:🔥 ${meetup.title}`,
    location ? `LOCATION:${location}` : null,
    description ? `DESCRIPTION:${description}` : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${meetup.title.replace(/\s+/g, "_")}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}