/**
 * Pure calendar helpers (.ics serializer, Google Calendar URL builder).
 *
 * Deliberately free of React / next-intl imports so both a Node build step
 * (static .ics files) and client components can import this module.
 *
 * Sessionize `start`/`end` are Europe/Rome wall-clock strings with no offset
 * (e.g. `2026-10-10T14:05:00`). They are never parsed with `new Date(str)`,
 * which would depend on the machine's timezone (UTC on CI, Rome locally).
 */

export const EVENT_TIME_ZONE = "Europe/Rome";
export const UID_DOMAIN = "devfest2026.gdgromacitta.it";
const PRODID = "-//GDG Roma Citta//DevFest 2026//EN";

export interface CalendarEventInput {
  /** Stable session id; the UID is derived from it only. */
  id: string;
  title: string;
  description: string;
  location: string;
  /** Europe/Rome wall-clock, e.g. `2026-10-10T14:05:00`. */
  start: string;
  end: string;
}

export interface IcsOptions {
  /** DTSTAMP instant; defaults to now. Pass a fixed value for reproducible output. */
  stamp?: Date;
  /**
   * Optional SEQUENCE. Omitted by default: a build-time value (e.g. epoch
   * seconds of the build) can be passed so clients apply updates on re-import.
   */
  sequence?: number;
  /** VALARM DESCRIPTION text. */
  alarmDescription?: string;
}

const WALL_CLOCK = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;

const pad = (n: number, width = 2) => String(n).padStart(width, "0");

function parseWallClock(value: string): number {
  const m = WALL_CLOCK.exec(value);
  if (!m) throw new Error(`Invalid wall-clock date-time: ${value}`);
  const [, y, mo, d, h, mi, s] = m;
  // Wall-clock fields read as if they were UTC: a timezone-free number.
  return Date.UTC(+y, +mo - 1, +d, +h, +mi, +(s ?? 0));
}

const romeFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: EVENT_TIME_ZONE,
  hourCycle: "h23",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});

/** Offset (ms) of Europe/Rome from UTC at the given instant. */
function romeOffsetMs(instant: number): number {
  const parts: Record<string, number> = {};
  for (const p of romeFormat.formatToParts(new Date(instant))) {
    if (p.type !== "literal") parts[p.type] = Number(p.value);
  }
  const asUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  return asUtc - Math.floor(instant / 1000) * 1000;
}

/** Converts a Europe/Rome wall-clock string to the matching UTC instant. */
export function romeWallClockToDate(value: string): Date {
  const wall = parseWallClock(value);
  // Two passes settle the offset around DST transitions.
  let guess = wall - romeOffsetMs(wall);
  guess = wall - romeOffsetMs(guess);
  return new Date(guess);
}

function formatUtc(date: Date): string {
  return (
    `${pad(date.getUTCFullYear(), 4)}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
}

/** `2026-10-10T14:05:00` (Rome) -> `20261010T120500Z`. */
export function romeToUtcBasic(value: string): string {
  return formatUtc(romeWallClockToDate(value));
}

/** `2026-10-10T14:05:00` -> `20261010T140500` (local, no Z). */
export function romeToLocalBasic(value: string): string {
  const m = WALL_CLOCK.exec(value);
  if (!m) throw new Error(`Invalid wall-clock date-time: ${value}`);
  return `${m[1]}${m[2]}${m[3]}T${m[4]}${m[5]}${m[6] ?? "00"}`;
}

/** RFC 5545 TEXT escaping: backslash, comma, semicolon, newline. */
export function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");
}

const encoder = new TextEncoder();

/** Folds a content line at 75 octets, never splitting a UTF-8 character. */
export function foldIcsLine(line: string): string {
  if (encoder.encode(line).length <= 75) return line;
  const chunks: string[] = [];
  let current = "";
  let bytes = 0;
  // Continuation lines start with a space, which counts toward the 75.
  let limit = 75;
  for (const ch of line) {
    const size = encoder.encode(ch).length;
    if (bytes + size > limit) {
      chunks.push(current);
      current = "";
      bytes = 0;
      limit = 74;
    }
    current += ch;
    bytes += size;
  }
  chunks.push(current);
  return chunks.join("\r\n ");
}

export function buildEventUid(id: string): string {
  return `${id}@${UID_DOMAIN}`;
}

export function buildIcs(event: CalendarEventInput, options: IcsOptions = {}): string {
  const stamp = options.stamp ?? new Date();
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${PRODID}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${buildEventUid(event.id)}`,
    `DTSTAMP:${formatUtc(stamp)}`,
    ...(options.sequence !== undefined ? [`SEQUENCE:${options.sequence}`] : []),
    `DTSTART:${romeToUtcBasic(event.start)}`,
    `DTEND:${romeToUtcBasic(event.end)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    `LOCATION:${escapeIcsText(event.location)}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "TRIGGER:-PT10M",
    `DESCRIPTION:${escapeIcsText(options.alarmDescription ?? event.title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(foldIcsLine).join("\r\n") + "\r\n";
}

export function buildGoogleCalendarUrl(event: CalendarEventInput): string {
  const enc = encodeURIComponent;
  const dates = `${romeToLocalBasic(event.start)}/${romeToLocalBasic(event.end)}`;
  return (
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${enc(event.title)}` +
    `&dates=${dates}` +
    `&ctz=${enc(EVENT_TIME_ZONE)}` +
    `&details=${enc(event.description)}` +
    `&location=${enc(event.location)}`
  );
}
