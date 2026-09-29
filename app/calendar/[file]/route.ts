import { buildIcs } from "@/src/lib/calendar-events";
import {
  buildSessionCalendarEvent,
  calendarReminder,
} from "@/src/lib/session-calendar-event";
import { isBreakSession } from "@/src/lib/session-breaks";
import { routing } from "@/i18n/routing";
import { sessions } from "@/src/content/sessions";
import { speakers } from "@/src/content/speakers";
import { venue } from "@/src/content/venue";

// Static export: one flat `calendar/<id>.<locale>.ics` file per non-break
// session and locale, generated from the same content the agenda renders.
export const dynamic = "force-static";
export const dynamicParams = false;

// Fixed DTSTAMP so rebuilding unchanged content yields identical files.
const STAMP = new Date(Date.UTC(2026, 0, 1));

const fileName = (id: string, locale: string) => `${id}.${locale}.ics`;

export function generateStaticParams() {
  return sessions
    .filter((s) => !isBreakSession(s))
    .flatMap((s) => routing.locales.map((locale) => ({ file: fileName(s.id, locale) })));
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const match = /^(.+)\.([a-z]{2})\.ics$/.exec(file);
  const locale = match?.[2];
  const session = match && sessions.find((s) => s.id === match[1]);
  if (!session || !locale || !(routing.locales as readonly string[]).includes(locale)) {
    return new Response("Not found", { status: 404 });
  }
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const event = buildSessionCalendarEvent(session, { locale, messages, speakers, venue });
  const body = buildIcs(event, { stamp: STAMP, alarmDescription: `${calendarReminder(locale)}: ${event.title}` });
  return new Response(body, {
    headers: { "Content-Type": "text/calendar; charset=utf-8" },
  });
}
