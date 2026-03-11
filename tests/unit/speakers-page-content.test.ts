import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import SpeakersPage from "@/app/speakers/page";

globalThis.React = React;

const renderSpeakersPage = () => renderToStaticMarkup(SpeakersPage());

describe("Speakers page reference structure", () => {
  test("renders the screenshot-scoped hero, speaker wall, and featured panel", () => {
    const html = renderSpeakersPage();

    expect(html).toContain("Meet our Featured Speakers");
    expect(html).toContain("All Speakers");
    expect(html).toContain("Web &amp; Mobile");
    expect(html).toContain("Cloud &amp; AI");
    expect(html).toContain("Charlie Davis");
    expect(html).toContain("Scheduled Sessions");
    expect((html.match(/data-showcase-speaker=/g) ?? []).length).toBe(8);
  });
});
