import React from "react";
import { vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";
import { AgendaPageContent } from "@/src/components/agenda/agenda-page-content";
import messages from "@/messages/it.json";

globalThis.React = React;

// `@/src/i18n/navigation`'s locale-aware `Link` (used by SessionList to
// deep-link to /speakers#<id>) is built on next-intl's `createNavigation`,
// which imports `next/navigation` — a module Next.js resolves via its own
// webpack aliasing at runtime/build time, but Vitest's Node environment
// cannot resolve on its own. Mock it with a plain anchor, matching the
// `next-intl/server` mocking pattern already used in these tests.
vi.mock("@/src/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: { href: string; children?: React.ReactNode }) =>
    React.createElement("a", { href, ...props }, children)
}));

// AgendaPageContent is a client component (it calls useTranslations),
// which requires a NextIntlClientProvider ancestor — normally supplied by
// the locale layout, which isn't part of this unit render.
const renderAgendaPage = () =>
  renderToStaticMarkup(
    React.createElement(NextIntlClientProvider, {
      locale: "it",
      messages,
      timeZone: "Europe/Rome",
      children: React.createElement(AgendaPageContent)
    })
  );

import { sessions } from "@/src/content/sessions";
import { roomsFrom, sessionsForRoom } from "@/src/lib/agenda-rooms";

// Asserted against whatever content is committed, so regenerating
// src/content/sessions.ts from Sessionize can't break these.
describe("Agenda page structure", () => {
  test("renders the page chrome and filter toolbar", () => {
    const html = renderAgendaPage();

    // React escapes apostrophes in text nodes as `&#x27;`.
    expect(html).toContain(messages.agenda.heading.replace("'", "&#x27;"));
    expect(html).toContain(messages.agenda.intro.replace("'", "&#x27;"));
    // Track names, level names, and toolbar labels are fixed English
    // taxonomy terms out of scope for translation.
    expect(html).toContain("Tracks:");
    expect(html).toContain("Levels:");
    expect(html).toContain("All Tracks");
  });

  test("renders a tab per room, or none for a single-room event", () => {
    const html = renderAgendaPage();
    const rooms = roomsFrom(sessions);
    const tabs = [...html.matchAll(/role="tab"/g)].length;

    expect(tabs).toBe(rooms.length > 1 ? rooms.length : 0);
    for (const room of rooms) expect(html).toContain(room);
  });

  test("shows exactly the first room's sessions on load", () => {
    const html = renderAgendaPage();
    const firstRoom = roomsFrom(sessions)[0];
    const expected = sessionsForRoom(sessions, firstRoom ?? "")
      .filter((session) => !session.isBreak && session.speakerIds.length)
      .map((session) => session.id);

    const rendered = [...html.matchAll(/data-agenda-session="([^"]+)"/g)].map((match) => match[1]);
    expect(rendered).toEqual(expected);
    expect(rendered.length).toBeGreaterThan(0);
  });

  test("renders each visible session's translated title and start time", () => {
    const html = renderAgendaPage();
    const firstRoom = roomsFrom(sessions)[0] ?? "";

    for (const session of sessionsForRoom(sessions, firstRoom).slice(0, 3)) {
      const entry = (messages.sessions as Record<string, { title: string } | undefined>)[session.id];
      if (entry) expect(html).toContain(entry.title.replace(/&/g, "&amp;").replace(/'/g, "&#x27;"));

      const date = new Date(session.start);
      const hours = `${date.getHours() % 12 || 12}`.padStart(2, "0");
      expect(html).toContain(`${hours}:${`${date.getMinutes()}`.padStart(2, "0")}`);
    }
  });
});
