/**
 * Assembles the calendar event for one agenda session in one locale.
 *
 * Shared by the static `.ics` route (app/calendar/[file]/route.ts) and any
 * client-side Google Calendar link, so both outputs carry the same content.
 * Pure: takes messages/content as arguments, no React / next-intl imports.
 */
import type { Session, Speaker, Venue } from "@/src/types/content";
import type { CalendarEventInput } from "@/src/lib/calendar-events";

export const SITE_ORIGIN = "https://devfest2026.gdgromacitta.it";

/** Labels live in code (not messages/*.json) to keep this feature self-contained. */
const LABELS = {
  en: { speakers: "Speakers", room: "Room", agenda: "Agenda", reminder: "Starting in 10 minutes" },
  it: { speakers: "Relatori", room: "Sala", agenda: "Agenda", reminder: "Inizia tra 10 minuti" },
} as const;

type Locale = keyof typeof LABELS;

export interface CalendarMessages {
  agenda?: { unassignedRoom?: string; speakerTba?: string };
  sessions?: Record<string, { title?: string } | undefined>;
}

export interface SessionCalendarContext {
  locale: string;
  messages: CalendarMessages;
  speakers: Pick<Speaker, "id" | "name">[];
  venue: Pick<Venue, "name" | "address">;
}

const labelsFor = (locale: string) => LABELS[(locale in LABELS ? locale : "en") as Locale];

/** Back-link to the agenda. No per-session anchor exists on the page today. */
export const agendaUrl = (locale: string) => `${SITE_ORIGIN}/${locale}/agenda`;

export function buildSessionCalendarEvent(
  session: Session,
  { locale, messages, speakers, venue }: SessionCalendarContext,
): CalendarEventInput {
  const labels = labelsFor(locale);
  const title = messages.sessions?.[session.id]?.title?.trim() || session.id;
  const names = session.speakerIds
    .map((id) => speakers.find((s) => s.id === id)?.name)
    .filter((name): name is string => Boolean(name));
  const speakerLine = names.length ? names.join(", ") : (messages.agenda?.speakerTba ?? "TBA");
  const room = session.room?.trim() || messages.agenda?.unassignedRoom || "";

  const description = [
    `${labels.speakers}: ${speakerLine}`,
    `${labels.room}: ${room}`,
    `${labels.agenda}: ${agendaUrl(locale)}`,
  ].join("\n");

  const location = [room, venue.name, venue.address].filter(Boolean).join(", ");

  return { id: session.id, title, description, location, start: session.start, end: session.end };
}

export const calendarReminder = (locale: string) => labelsFor(locale).reminder;

/** Public URL path of a session's static .ics file. */
export const icsPath = (id: string, locale: string) => `/calendar/${id}.${locale}.ics`;
