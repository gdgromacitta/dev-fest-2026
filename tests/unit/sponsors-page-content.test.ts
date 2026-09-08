import React from "react";
import { vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { sponsors } from "@/src/content/sponsors";
import { pastSponsors } from "@/src/content/past-sponsors";
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

describe("Sponsors page — tier rendering", () => {
  test("renders tiers in Main, Platinum, Gold, Silver, Bronze order with their labels", async () => {
    const { default: SponsorsPage } = await import("@/app/[locale]/sponsors/page");
    const element = await SponsorsPage({ params: Promise.resolve({ locale: "it" }) });
    const html = renderToStaticMarkup(element);

    const mainIndex = html.indexOf("Main Sponsor");
    const goldIndex = html.indexOf("Gold");
    const silverIndex = html.indexOf("Silver");

    expect(mainIndex).toBeGreaterThan(-1);
    expect(goldIndex).toBeGreaterThan(mainIndex);
    expect(silverIndex).toBeGreaterThan(goldIndex);

    // Real seed data has no Platinum or Bronze sponsors — those tiers must
    // render nothing at all, not a bare heading with an empty list.
    expect(html).not.toContain("Platinum");
    expect(html).not.toContain("Bronze");
  });

  test("Platinum and Bronze tiers render nothing when empty (no bare heading)", async () => {
    const platinumSponsors = sponsors.filter((sponsor) => sponsor.tier === "platinum");
    const bronzeSponsors = sponsors.filter((sponsor) => sponsor.tier === "bronze");

    expect(platinumSponsors).toHaveLength(0);
    expect(bronzeSponsors).toHaveLength(0);
  });

  test("renders the community section for JetBrains", async () => {
    const { default: SponsorsPage } = await import("@/app/[locale]/sponsors/page");
    const element = await SponsorsPage({ params: Promise.resolve({ locale: "it" }) });
    const html = renderToStaticMarkup(element);

    expect(html).toContain("JetBrains");
    expect(html).toContain("Community &amp; Swag Partner");
  });

  test("SponsorLogo falls back to the sponsor name when logo is unset", async () => {
    const { SponsorLogo } = await import("@/src/components/sponsors/sponsor-logo");
    const html = renderToStaticMarkup(
      React.createElement(SponsorLogo, { sponsor: { name: "NoLogo Inc", url: "https://example.com" } })
    );

    expect(html).toContain("NoLogo Inc");
    expect(html).not.toContain("<img");
  });

  test("renders the past-sponsors strip with all nine seed entries", async () => {
    const { default: SponsorsPage } = await import("@/app/[locale]/sponsors/page");
    const element = await SponsorsPage({ params: Promise.resolve({ locale: "it" }) });
    const html = renderToStaticMarkup(element);

    expect(pastSponsors).toHaveLength(9);
    for (const sponsor of pastSponsors) {
      expect(html).toContain(sponsor.name);
    }
    expect(html).toContain("Chi ha creduto in noi");
  });
});

describe("Sponsors page — community section omitted when empty", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.doUnmock("@/src/content/sponsors");
  });

  test("omits the community heading entirely when there are no community sponsors", async () => {
    vi.doMock("@/src/content/sponsors", () => ({
      sponsors: [{ name: "Google", url: "https://google.com", tier: "main" }]
    }));

    const { default: SponsorsPage } = await import("@/app/[locale]/sponsors/page");
    const element = await SponsorsPage({ params: Promise.resolve({ locale: "it" }) });
    const html = renderToStaticMarkup(element);

    expect(html).not.toContain("Community & Swag Partner");
  });
});

describe("Past-sponsors marquee — empty state", () => {
  test("renders nothing when the past-sponsor list is empty", async () => {
    const { PastSponsorsMarquee } = await import("@/src/components/sponsors/past-sponsors-marquee");
    const html = renderToStaticMarkup(
      React.createElement(PastSponsorsMarquee, { sponsors: [], heading: "Chi ha creduto in noi" })
    );

    expect(html).toBe("");
  });
});
