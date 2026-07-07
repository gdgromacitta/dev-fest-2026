import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";
import { SpeakersPageContent } from "@/src/components/speakers/speakers-page-content";
import messages from "@/messages/it.json";

globalThis.React = React;

// SpeakersPageContent is a client component (it calls useTranslations),
// which requires a NextIntlClientProvider ancestor — normally supplied by
// the locale layout, which isn't part of this unit render.
const renderSpeakersPage = () =>
  renderToStaticMarkup(
    React.createElement(NextIntlClientProvider, {
      locale: "it",
      messages,
      timeZone: "Europe/Rome",
      children: React.createElement(SpeakersPageContent)
    })
  );

describe("Speakers page reference structure", () => {
  test("renders the screenshot-scoped hero, speaker wall, and featured panel", () => {
    const html = renderSpeakersPage();

    expect(html).toContain(messages.speakerShowcase.heading);
    expect(html).toContain(messages.speakerShowcase.tabs.all);
    expect(html).toContain(messages.speakerShowcase.tabs.webMobile.replace("&", "&amp;"));
    expect(html).toContain(messages.speakerShowcase.tabs.cloudAi.replace("&", "&amp;"));
    expect(html).toContain("Charlie Davis");
    expect(html).toContain(messages.speakerShowcase.scheduledSessions);
    expect((html.match(/data-showcase-speaker=/g) ?? []).length).toBe(8);
  });
});
