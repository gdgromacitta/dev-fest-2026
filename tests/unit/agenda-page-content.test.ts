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

describe("Agenda page reference structure", () => {
  test("renders the screenshot-scoped agenda timeline layout", () => {
    const html = renderAgendaPage();

    // React escapes apostrophes in text nodes as `&#x27;`.
    expect(html).toContain(messages.agenda.heading.replace("'", "&#x27;"));
    expect(html).toContain(messages.agenda.intro);
    // Track names, level names, and toolbar labels are fixed English
    // taxonomy terms out of scope for translation.
    expect(html).toContain("Tracks:");
    expect(html).toContain("Levels:");
    expect(html).toContain("All Tracks");
    expect(html).toContain("09:00");
    expect(html).toContain("10:30");
    expect(html).toContain("12:00");
    expect(html).toContain("01:30");
    expect(html).toContain("03:00");
    expect(html).toContain(messages.agenda.lunchBreak.replace("&", "&amp;"));
    expect(html).toContain(messages.sessions["sess-101"].title);
    expect((html.match(/data-agenda-session=/g) ?? []).length).toBe(5);
  });
});
