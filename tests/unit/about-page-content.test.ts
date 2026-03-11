import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AboutPage from "@/app/about/page";

globalThis.React = React;

const renderAboutPage = () => renderToStaticMarkup(AboutPage());

describe("About page reference structure", () => {
  test("renders the screenshot-scoped hero, organizers grid, and values strip", () => {
    const html = renderAboutPage();

    expect(html).toContain("About GDG");
    expect(html).toContain("DevFest");
    expect(html).toContain("Join the Community");
    expect(html).toContain("Read Manifesto");
    expect((html.match(/data-organizer-card=/g) ?? []).length).toBe(8);
    expect((html.match(/data-about-value=/g) ?? []).length).toBe(3);
  });

  test("uses placeholder image urls instead of generated svg data uris", () => {
    const html = renderAboutPage();

    expect(html).toContain("https://placehold.co/600x400");
    expect(html).not.toContain("data:image/svg+xml");
  });
});
