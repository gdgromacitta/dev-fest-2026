import { describe, expect, it } from "vitest";
import {
  buildEventUid,
  buildGoogleCalendarUrl,
  buildIcs,
  escapeIcsText,
  foldIcsLine,
  romeToUtcBasic,
} from "@/src/lib/calendar-events";

const event = {
  id: "s-42",
  title: "Signals, Zone; and more",
  description: "Line one\nLine two",
  location: "Room A, Via Roma 1",
  start: "2026-10-10T14:05:00",
  end: "2026-10-10T15:00:00",
};
const stamp = new Date(Date.UTC(2026, 0, 1, 0, 0, 0));

describe("Rome to UTC", () => {
  // Run under both `TZ=UTC` and `TZ=Europe/Rome`: result must not change.
  it("converts CEST wall-clock to UTC", () => {
    expect(romeToUtcBasic("2026-10-10T14:05:00")).toBe("20261010T120500Z");
  });
  it("uses the winter offset after DST ends", () => {
    expect(romeToUtcBasic("2026-10-26T14:05:00")).toBe("20261026T130500Z");
  });
});

describe("escapeIcsText", () => {
  it("escapes backslash, comma, semicolon and newline", () => {
    expect(escapeIcsText("a\\b,c;d\ne")).toBe("a\\\\b\\,c\\;d\\ne");
  });
});

describe("foldIcsLine", () => {
  const octets = (s: string) => new TextEncoder().encode(s).length;
  it("leaves short lines alone", () => {
    expect(foldIcsLine("SUMMARY:hi")).toBe("SUMMARY:hi");
  });
  it("folds at 75 octets and unfolds losslessly with emoji and accents", () => {
    const line = "DESCRIPTION:" + "è🎉ü".repeat(40);
    const folded = foldIcsLine(line);
    const parts = folded.split("\r\n");
    expect(parts.length).toBeGreaterThan(1);
    for (const part of parts) expect(octets(part)).toBeLessThanOrEqual(75);
    expect(folded.replace(/\r\n /g, "")).toBe(line);
  });
});

describe("buildIcs", () => {
  const ics = buildIcs(event, { stamp });
  it("is a CRLF VCALENDAR with one VEVENT", () => {
    expect(ics.startsWith("BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
    expect(ics.replace(/\r\n/g, "")).not.toMatch(/[\r\n]/);
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(1);
  });
  it("has UTC times, stamp and escaped text", () => {
    expect(ics).toContain("DTSTAMP:20260101T000000Z\r\n");
    expect(ics).toContain("DTSTART:20261010T120500Z\r\n");
    expect(ics).toContain("DTEND:20261010T130000Z\r\n");
    expect(ics).toContain("SUMMARY:Signals\\, Zone\\; and more\r\n");
    expect(ics).toContain("DESCRIPTION:Line one\\nLine two\r\n");
    expect(ics).toContain("LOCATION:Room A\\, Via Roma 1\r\n");
    expect(ics).not.toContain("SEQUENCE");
  });
  it("has a display VALARM 10 minutes before", () => {
    expect(ics).toContain(
      "BEGIN:VALARM\r\nACTION:DISPLAY\r\nTRIGGER:-PT10M\r\nDESCRIPTION:",
    );
    expect(ics).toContain("END:VALARM\r\nEND:VEVENT");
  });
  it("has a UID that is stable across locales", () => {
    const it = buildIcs({ ...event, title: "Titolo", description: "Descrizione" }, { stamp: new Date() });
    const uid = "UID:s-42@devfest2026.gdgromacitta.it\r\n";
    expect(buildEventUid("s-42")).toBe("s-42@devfest2026.gdgromacitta.it");
    expect(ics).toContain(uid);
    expect(it).toContain(uid);
  });
  it("emits SEQUENCE only when provided", () => {
    expect(buildIcs(event, { stamp, sequence: 7 })).toContain("SEQUENCE:7\r\n");
  });
});

describe("buildGoogleCalendarUrl", () => {
  it("uses local times, no Z, ctz and encoded params", () => {
    expect(buildGoogleCalendarUrl(event)).toBe(
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
        "&text=Signals%2C%20Zone%3B%20and%20more" +
        "&dates=20261010T140500/20261010T150000" +
        "&ctz=Europe%2FRome" +
        "&details=Line%20one%0ALine%20two" +
        "&location=Room%20A%2C%20Via%20Roma%201",
    );
  });
});
