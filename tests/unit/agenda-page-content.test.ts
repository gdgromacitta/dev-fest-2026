import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";
import { AgendaPageContent } from "@/src/components/agenda/agenda-page-content";
import messages from "@/messages/it.json";

globalThis.React = React;

// AgendaPageContent is a client component (it calls useTranslations),
// which requires a NextIntlClientProvider ancestor — normally supplied by
// the locale layout, which isn't part of this unit render.
const renderAgendaPage = () =>
  renderToStaticMarkup(
    React.createElement(NextIntlClientProvider, {
      locale: "it",
      messages,
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
