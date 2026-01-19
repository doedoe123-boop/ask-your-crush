// Calendar utilities for generating .ics files and Google Calendar links

interface CalendarEvent {
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM (24hr format)
  description?: string;
  location?: string;
}

/**
 * Generate an .ics file content for universal calendar support
 * Works with: Apple Calendar, Outlook, Google Calendar (via import)
 */
export function generateICS(event: CalendarEvent): string {
  const { title, date, time, description, location } = event;

  // Parse date
  const [year, month, day] = date.split("-");

  let dtStart: string;
  let dtEnd: string;

  if (time) {
    // Event with specific time (2 hour duration)
    const [hours, minutes] = time.split(":");
    const startDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes),
    );
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

    dtStart = formatDateTimeICS(startDate);
    dtEnd = formatDateTimeICS(endDate);
  } else {
    // All-day event
    dtStart = `${year}${month}${day}`;
    const nextDay = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day) + 1,
    );
    dtEnd = formatDateICS(nextDay);
  }

  const uid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@askyourcrush`;
  const now = formatDateTimeICS(new Date());

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ask Your Crush//Valentine Invite//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    time ? `DTSTART:${dtStart}` : `DTSTART;VALUE=DATE:${dtStart}`,
    time ? `DTEND:${dtEnd}` : `DTEND;VALUE=DATE:${dtEnd}`,
    `SUMMARY:${escapeICS(title)}`,
  ];

  if (description) {
    lines.push(`DESCRIPTION:${escapeICS(description)}`);
  }

  if (location) {
    lines.push(`LOCATION:${escapeICS(location)}`);
  }

  lines.push("END:VEVENT", "END:VCALENDAR");

  return lines.join("\r\n");
}

/**
 * Generate a Google Calendar URL (no API needed)
 */
export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const { title, date, time, description, location } = event;

  const [year, month, day] = date.split("-");

  let dates: string;

  if (time) {
    // Event with specific time
    const [hours, minutes] = time.split(":");
    const startDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes),
    );
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    dates = `${formatDateTimeGoogle(startDate)}/${formatDateTimeGoogle(endDate)}`;
  } else {
    // All-day event
    dates = `${year}${month}${day}/${year}${month}${String(parseInt(day) + 1).padStart(2, "0")}`;
  }

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: dates,
  });

  if (description) {
    params.set("details", description);
  }

  if (location) {
    params.set("location", location);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate Outlook Web URL
 */
export function generateOutlookUrl(event: CalendarEvent): string {
  const { title, date, time, description, location } = event;

  const [year, month, day] = date.split("-");

  let startdt: string;
  let enddt: string;

  if (time) {
    const [hours, minutes] = time.split(":");
    const startDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes),
    );
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    startdt = startDate.toISOString();
    enddt = endDate.toISOString();
  } else {
    startdt = `${year}-${month}-${day}T00:00:00`;
    enddt = `${year}-${month}-${String(parseInt(day) + 1).padStart(2, "0")}T00:00:00`;
  }

  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: title,
    startdt,
    enddt,
  });

  if (description) {
    params.set("body", description);
  }

  if (location) {
    params.set("location", location);
  }

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

// Helper functions
function formatDateTimeICS(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function formatDateICS(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function formatDateTimeGoogle(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeICS(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\n/g, "\\n");
}

/**
 * Create a downloadable .ics file blob URL
 */
export function createICSDownloadUrl(event: CalendarEvent): string {
  const icsContent = generateICS(event);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  return URL.createObjectURL(blob);
}
