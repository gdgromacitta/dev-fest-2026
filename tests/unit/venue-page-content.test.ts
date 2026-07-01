import React from "react";
import { vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import VenuePage from "@/app/[locale]/venue/page";
import messages from "@/messages/it.json";

globalThis.React = React;

// next-intl/server's getTranslations() is only resolvable to its
// react-server implementation inside the Next.js RSC runtime (it depends on
// next/headers for locale/request access, which isn't available under
// Vitest). Mock it with a minimal translator backed by the same it.json
// messages used elsewhere in this test, scoped to the requested namespace.
// The venue namespace has nested keys (e.g. "notes.date"), so the lookup
// walks the dotted path instead of a flat dictionary access.
vi.mock("next-intl/server", () => ({
  getTranslations:
    async ({ namespace }: { locale: string; namespace: string }) => {
      const allMessages = messages as unknown as Record<string, unknown>;
      const dict = (allMessages[namespace] ?? {}) as Record<string, unknown>;
      return (key: string) => {
        const value = key.split(".").reduce<unknown>((acc, segment) => {
          if (acc && typeof acc === "object" && segment in acc) {
            return (acc as Record<string, unknown>)[segment];
          }
          return undefined;
        }, dict);
        return typeof value === "string" ? value : key;
      };
    }
}));

const renderVenuePage = async () => {
  const element = await VenuePage({ params: Promise.resolve({ locale: "it" }) });

  return renderToStaticMarkup(element);
};

describe("Venue page reference structure", () => {
  test("renders the screenshot-scoped venue hero and details layout", async () => {
    const html = await renderVenuePage();

    expect(html).toContain("Sede e Location");
    expect(html).toContain("Indirizzo Sede");
    expect(html).toContain("Come raggiungerci");
    expect(html).toContain("Università degli Studi Roma Tre");
    expect(html).toContain("10 Ottobre 2026");
    expect(html).toContain("9:00 - 18:00");
  });

  test("renders translated transport, parking, and accessibility copy", async () => {
    const html = await renderVenuePage();

    expect(html).toContain("Trasporto Pubblico");
    expect(html).toContain("facilmente raggiungibile con i mezzi pubblici");
    expect(html).toContain("Parcheggio e Auto");
    expect(html).toContain("Non è disponibile un parcheggio dedicato");
    expect(html).toContain("Accessibilità");
    expect(html).toContain("verranno confermati più vicino alla data");
    expect(html).toContain("Ci impegniamo a rendere DevFest Roma 2026");
  });
});
