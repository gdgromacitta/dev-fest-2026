import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import HomePage from "@/app/[locale]/page";
import { venue } from "@/src/content/venue";

globalThis.React = React;

const renderHomePage = () => renderToStaticMarkup(HomePage());

describe("root page — landing page", () => {
  test("renders the event info section with title, date, and location", () => {
    const html = renderHomePage();

    expect(html).toContain("DevFest Roma");
    expect(html).toContain("Roma");
    expect(html).toContain("October 10, 2026");
  });

  test("renders the venue summary section with a link to /venue", () => {
    const html = renderHomePage();

    expect(html).toContain('href="/venue"');
    expect(html).toContain(venue.name);
  });

  test("renders the meet-the-team section with all organizer cards", () => {
    const html = renderHomePage();

    expect((html.match(/data-organizer-card=/g) ?? []).length).toBe(5);
  });

  test("sponsor section is absent from DOM when sponsors array is empty", () => {
    const html = renderHomePage();

    expect(html).not.toContain('data-section="sponsors"');
  });
});
