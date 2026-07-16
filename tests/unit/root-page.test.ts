import React from "react";
import { vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";
import HomePage from "@/app/[locale]/page";
import { venue } from "@/src/content/venue";
import { sponsors } from "@/src/content/sponsors";
import messages from "@/messages/it.json";

globalThis.React = React;

// next-intl/server's getTranslations() is only resolvable to its
// react-server implementation inside the Next.js RSC runtime (it depends on
// next/headers for locale/request access, which isn't available under
// Vitest). Mock it with a minimal translator backed by the same it.json
// messages used elsewhere in this test, scoped to the requested namespace.
vi.mock("next-intl/server", () => ({
  setRequestLocale: () => {},
  getTranslations:
    async ({ namespace }: { locale: string; namespace: string }) => {
      const allMessages = messages as unknown as Record<string, Record<string, string>>;
      const dict = allMessages[namespace] ?? {};
      return (key: string) => dict[key] ?? key;
    }
}));

// `@/src/i18n/navigation`'s locale-aware `Link` (used by HomePage's "Venue
// Details" CTA, so it correctly resolves to /it/venue or /en/venue instead
// of an unprefixed — now 404ing — /venue) is built on next-intl's
// `createNavigation`, which imports `next/navigation` — a module Next.js
// resolves via its own webpack aliasing at runtime/build time, but Vitest's
// Node environment cannot resolve on its own. Mock it with a plain anchor,
// matching the next-intl/server mocking pattern above.
vi.mock("@/src/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: { href: string; children?: React.ReactNode }) =>
    React.createElement("a", { href, ...props }, children)
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

  test("renders a Become a Sponsor CTA banner when sponsors array is empty", async () => {
    const html = await renderHomePage();

    expect(html).toContain('data-section="sponsors"');
    expect(html).toContain(messages.home.sponsorsCtaHeading);
    expect(html).toContain(messages.home.sponsorsCtaDescription);
    expect((html.match(/data-sponsor-cta="true"/g) ?? []).length).toBe(1);
    expect(html).toContain(
      `href="https://docs.google.com/forms/d/e/1FAIpQLScracoBDSFefwj54UCV_r1Um7oD-c3Y1NBVE16WHFwJRCckFw/viewform"`
    );
    expect(html).toContain('rel="noreferrer noopener"');
  });

  test("renders sponsor logos plus a Become a Sponsor CTA button when sponsors array is populated", async () => {
    // src/content/sponsors.ts is empty in this repo today; temporarily
    // populate the live array (rather than editing the content file) to
    // exercise the populated-state markup, then restore it.
    sponsors.push({ name: "Test Sponsor", url: "https://example.com", tier: "gold" });

    try {
      const html = await renderHomePage();

      expect(html).toContain('data-section="sponsors"');
      expect(html).toContain('data-sponsor-name="Test Sponsor"');
      expect(html).toContain(messages.home.sponsorsHeading);
      expect((html.match(/data-sponsor-cta="true"/g) ?? []).length).toBe(1);
      expect(html).toContain(messages.home.sponsorsCtaButton);
    } finally {
      sponsors.length = 0;
    }
  });
});
