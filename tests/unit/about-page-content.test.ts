import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AboutPage from "@/app/[locale]/about/page";

globalThis.React = React;

const renderAboutPage = () => renderToStaticMarkup(AboutPage());

describe("About page reference structure", () => {
  test("renders the screenshot-scoped hero, organizers grid, and values strip", () => {
    const html = renderAboutPage();

    expect(html).toContain("About GDG");
    expect(html).toContain("DevFest");
    expect(html).toContain("Join the Community");
    expect(html).toContain("Read Manifesto");
    expect((html.match(/data-organizer-card=/g) ?? []).length).toBe(5);
    expect((html.match(/data-about-value=/g) ?? []).length).toBe(3);
  });

  test("renders the GDG logo as a file reference, not an inlined data uri", () => {
    const html = renderAboutPage();

    expect(html).toContain("/logos/gdg-roma-light.svg");
    expect(html).not.toContain("data:image/svg+xml");
  });
});
