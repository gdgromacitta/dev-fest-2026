import { describe, expect, it } from "vitest";
import { buildIcs } from "@/src/lib/calendar-events";
import { buildSessionCalendarEvent, icsPath } from "@/src/lib/session-calendar-event";

const venue = { name: "Roma Tre", address: "Via Volterra 60" };
const speakers = [{ id: "sp1", name: "Ada Lovelace" }, { id: "sp2", name: "Alan Turing" }];
const messages = {
  agenda: { unassignedRoom: "Da assegnare", speakerTba: "Da annunciare" },
  sessions: { s1: { title: "Signals" }, s2: { title: "No room talk" } },
};
const base = { start: "2026-10-10T10:15:00", end: "2026-10-10T11:00:00", track: "", level: "beginner", tags: [] } as const;

describe("buildSessionCalendarEvent", () => {
  it("builds title, speakers, room, venue and agenda link", () => {
    const e = buildSessionCalendarEvent(
      { ...base, id: "s1", room: "Sala N11", speakerIds: ["sp1", "sp2"] } as never,
      { locale: "it", messages, speakers, venue },
    );
    expect(e.title).toBe("Signals");
    expect(e.description).toContain("Relatori: Ada Lovelace, Alan Turing");
    expect(e.description).toContain("Sala: Sala N11");
    expect(e.description).toContain("https://devfest2026.gdgromacitta.it/it/agenda");
    expect(e.location).toBe("Sala N11, Roma Tre, Via Volterra 60");
  });

  it("handles TBA speakers and missing room", () => {
    const e = buildSessionCalendarEvent(
      { ...base, id: "s2", room: "", speakerIds: [] } as never,
      { locale: "en", messages, speakers, venue },
    );
    expect(e.description).toContain("Speakers: Da annunciare");
    expect(e.description).toContain("Room: Da assegnare");
    const ics = buildIcs(e, { stamp: new Date(Date.UTC(2026, 0, 1)) });
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("SUMMARY:No room talk");
  });

  it("exposes a flat URL path", () => {
    expect(icsPath("s1", "en")).toBe("/calendar/s1.en.ics");
  });
});
