import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AgendaPage from "@/app/agenda/page";

globalThis.React = React;

const renderAgendaPage = () => renderToStaticMarkup(AgendaPage());

describe("Agenda page reference structure", () => {
  test("renders the screenshot-scoped agenda timeline layout", () => {
    const html = renderAgendaPage();

    expect(html).toContain("Event Agenda");
    expect(html).toContain("Tracks:");
    expect(html).toContain("Levels:");
    expect(html).toContain("All Tracks");
    expect(html).toContain("09:00");
    expect(html).toContain("10:30");
    expect(html).toContain("12:00");
    expect(html).toContain("01:30");
    expect(html).toContain("03:00");
    expect(html).toContain("Lunch Break &amp; Networking");
    expect((html.match(/data-agenda-session=/g) ?? []).length).toBe(5);
  });
});
