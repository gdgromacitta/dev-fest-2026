import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";
import { SessionList } from "@/src/components/agenda/session-list";
import { CalendarPopup, isCloseKey } from "@/src/components/agenda/add-to-calendar";
import type { Session } from "@/src/types/content";
import messages from "@/messages/en.json";

globalThis.React = React;

vi.mock("@/src/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: { href: string; children?: React.ReactNode }) =>
    React.createElement("a", { href, ...props }, children)
}));

const base = { end: "2026-10-10T11:00:00", track: "", level: "beginner" as const, tags: [], speakerIds: [] };
const talk: Session = { ...base, id: "talk-1", start: "2026-10-10T10:00:00", room: "Maria" };
const lunch: Session = { ...base, id: "lunch", start: "2026-10-10T13:00:00", room: "", isBreak: true };

const wrap = (node: React.ReactNode) =>
  renderToStaticMarkup(
    React.createElement(NextIntlClientProvider, { locale: "en", messages, timeZone: "Europe/Rome", children: node })
  );

describe("Add to calendar trigger", () => {
  const html = wrap(React.createElement(SessionList, { sessions: [talk, lunch], rooms: ["Maria"] }));

  it("renders on talks with disclosure ARIA, collapsed", () => {
    expect(html.match(/data-add-to-calendar=/g)).toHaveLength(1);
    expect(html).toContain('data-add-to-calendar="talk-1"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain("Add to calendar");
  });

  it("is absent on break rows", () => {
    expect(html).not.toContain('data-add-to-calendar="lunch"');
  });
});

describe("CalendarPopup", () => {
  const html = wrap(
    React.createElement(CalendarPopup, {
      id: "p1",
      googleUrl: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=x",
      icsHref: "/calendar/talk-1.en.ics"
    })
  );

  it("links Google in a new tab and the static .ics", () => {
    expect(html).toContain('href="https://calendar.google.com/calendar/render?action=TEMPLATE&amp;text=x"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('href="/calendar/talk-1.en.ics"');
  });
});

describe("isCloseKey", () => {
  it("closes on Escape only", () => {
    expect(isCloseKey("Escape")).toBe(true);
    expect(isCloseKey("Enter")).toBe(false);
  });
});
