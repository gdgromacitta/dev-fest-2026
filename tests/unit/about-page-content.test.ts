import React from "react";
import { vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";
import AboutPage from "@/app/[locale]/about/page";
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

// AboutPage is an async server component (it calls getTranslations, which
// resolves locale from params) and also renders client components
// (e.g. TeamCard) that call useTranslations, which requires a
// NextIntlClientProvider ancestor — normally supplied by the locale layout,
// which isn't part of this unit render.
const renderAboutPage = async () => {
  const element = await AboutPage({ params: Promise.resolve({ locale: "it" }) });

  return renderToStaticMarkup(
    React.createElement(NextIntlClientProvider, { locale: "it", messages, children: element })
  );
};

describe("About page reference structure", () => {
  test("renders the screenshot-scoped hero, organizers grid, and values strip", async () => {
    const html = await renderAboutPage();

    expect(html).toContain("About GDG");
    expect(html).toContain("DevFest");
    expect(html).toContain("Unisciti alla Comunità");
    expect(html).toContain("Leggi il Manifesto");
    expect((html.match(/data-organizer-card=/g) ?? []).length).toBe(5);
    expect((html.match(/data-about-value=/g) ?? []).length).toBe(3);
  });

  test("renders the GDG logo as a file reference, not an inlined data uri", async () => {
    const html = await renderAboutPage();

    expect(html).toContain("/logos/gdg-roma-light.svg");
    expect(html).not.toContain("data:image/svg+xml");
  });
});
