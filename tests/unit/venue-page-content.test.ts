import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import VenuePage from "@/app/venue/page";

globalThis.React = React;

const renderVenuePage = () => renderToStaticMarkup(VenuePage());

describe("Venue page reference structure", () => {
  test("renders the screenshot-scoped venue hero and details layout", () => {
    const html = renderVenuePage();

    expect(html).toContain("Venue &amp; Location");
    expect(html).toContain("Venue Address");
    expect(html).toContain("How to get here");
    expect(html).toContain("Innovation Hub Main Hall");
    expect(html).toContain("Oct 24-25, 2024");
    expect(html).toContain("9:00 AM - 6:00 PM");
  });
});
