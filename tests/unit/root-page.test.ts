import React from "react";
import { vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";
import HomePage from "@/app/[locale]/page";
import { venue } from "@/src/content/venue";
import messages from "@/messages/it.json";

globalThis.React = React;

// next-intl/server's getTranslations() is only resolvable to its
// react-server implementation inside the Next.js RSC runtime (it depends on
// next/headers for locale/request access, which isn't available under
// Vitest). Mock it with a minimal translator backed by the same it.json
// messages used elsewhere in this test, scoped to the requested namespace.
vi.mock("next-intl/server", () => ({
  getTranslations:
    async ({ namespace }: { locale: string; namespace: string }) => {
      const allMessages = messages as unknown as Record<string, Record<string, string>>;
      const dict = allMessages[namespace] ?? {};
      return (key: string) => dict[key] ?? key;
    }
}));

// HomePage is an async server component (it calls getTranslations, which
// resolves locale from params) and also renders client components
// (e.g. TeamCard) that call useTranslations, which requires a
// NextIntlClientProvider ancestor — normally supplied by the locale layout,
// which isn't part of this unit render.
const renderHomePage = async () => {
  const element = await HomePage({ params: Promise.resolve({ locale: "it" }) });

  return renderToStaticMarkup(
    React.createElement(NextIntlClientProvider, { locale: "it", messages, timeZone: "Europe/Rome", children: element })
  );
};

describe("root page — landing page", () => {
  test("renders the event info section with title, date, and location", async () => {
    const html = await renderHomePage();

    expect(html).toContain("DevFest Roma");
    expect(html).toContain("Roma");
    expect(html).toContain("10 Ottobre 2026");
  });

  test("renders the venue summary section with a link to /venue", async () => {
    const html = await renderHomePage();

    expect(html).toContain('href="/venue"');
    expect(html).toContain(venue.name);
  });

  test("renders the meet-the-team section with all organizer cards", async () => {
    const html = await renderHomePage();

    expect((html.match(/data-organizer-card=/g) ?? []).length).toBe(5);
  });

  test("sponsor section is absent from DOM when sponsors array is empty", async () => {
    const html = await renderHomePage();

    expect(html).not.toContain('data-section="sponsors"');
  });
});
