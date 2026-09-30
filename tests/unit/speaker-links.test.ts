import React from "react";
import { vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";
import { SpeakerCard } from "@/src/components/speakers/speaker-card";
import { resolveLegacySpeakerPath } from "@/src/components/speakers/legacy-hash-redirect";
import { speakers } from "@/src/content/speakers";
import messages from "@/messages/it.json";

globalThis.React = React;

// next-intl's createNavigation imports next/navigation, unresolvable under
// Vitest; mock Link with a plain anchor (same pattern as the agenda tests).
vi.mock("@/src/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: { href: string; children?: React.ReactNode }) =>
    React.createElement("a", { href, ...props }, children)
}));

describe("resolveLegacySpeakerPath", () => {
  const [speaker] = speakers;

  test("maps a known uuid hash to the locale-prefixed speaker page", () => {
    expect(resolveLegacySpeakerPath(`#${speaker.id}`, "en")).toBe(`/en/speakers/${speaker.slug}`);
    expect(resolveLegacySpeakerPath(`#${speaker.id}`, "it")).toBe(`/it/speakers/${speaker.slug}`);
  });

  test("returns null for an unknown hash", () => {
    expect(resolveLegacySpeakerPath("#unknown", "it")).toBeNull();
  });

  test("returns null for an empty hash", () => {
    expect(resolveLegacySpeakerPath("", "it")).toBeNull();
    expect(resolveLegacySpeakerPath("#", "it")).toBeNull();
  });
});

describe("SpeakerCard", () => {
  test("links to the speaker detail page", () => {
    const [speaker] = speakers;
    const html = renderToStaticMarkup(
      React.createElement(NextIntlClientProvider, {
        locale: "it",
        messages,
        timeZone: "Europe/Rome",
        children: React.createElement(SpeakerCard, { speaker })
      })
    );
    expect(html).toContain(`href="/speakers/${speaker.slug}"`);
    expect(html).not.toContain("/speakers#");
  });
});
