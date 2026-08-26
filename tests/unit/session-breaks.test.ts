import { isBreakSession } from "@/src/lib/session-breaks";
import { filterSessions, defaultAgendaFilters } from "@/src/lib/agenda-filters";
import { sessionsForRoom } from "@/src/lib/agenda-rooms";
import type { Session } from "@/src/types/content";

// The break predicate has drifted between the filter and the list twice now.
// These pin the two consumers to the same answer for every shape a Session
// can take, including content the mapper never touched (isBreak undefined).
const base: Session = {
  id: "s",
  start: "2026-10-10T10:00:00",
  end: "2026-10-10T10:45:00",
  track: "AI",
  room: "Maria",
  level: "beginner",
  tags: ["AI"],
  speakerIds: ["sp-1"]
};

const shapes: { name: string; session: Session; isBreak: boolean }[] = [
  { name: "flagged break", session: { ...base, isBreak: true }, isBreak: true },
  { name: "flagged talk", session: { ...base, isBreak: false }, isBreak: false },
  {
    name: "flagged talk with neither speaker nor room",
    session: { ...base, isBreak: false, speakerIds: [], room: "" },
    isBreak: false
  },
  { name: "unflagged ordinary talk", session: base, isBreak: false },
  {
    name: "unflagged, speaker unconfirmed but roomed",
    session: { ...base, speakerIds: [] },
    isBreak: false
  },
  {
    name: "unflagged, roomless but with a speaker",
    session: { ...base, room: "" },
    isBreak: false
  },
  {
    name: "unflagged seed-style lunch row",
    session: { ...base, speakerIds: [], room: "", track: "", tags: [] },
    isBreak: true
  }
];

describe("isBreakSession", () => {
  for (const { name, session, isBreak } of shapes) {
    test(`${name} -> ${isBreak}`, () => {
      expect(isBreakSession(session)).toBe(isBreak);
    });
  }
});

describe("consumers agree with the predicate", () => {
  const activeFilters = { track: "Nonexistent", level: "advanced" as const, tags: ["nope"], query: "zzz" };

  for (const { name, session, isBreak } of shapes) {
    test(`filterSessions keeps "${name}" iff it is a break`, () => {
      const kept = filterSessions([session], activeFilters).length === 1;
      expect(kept).toBe(isBreak);
    });

    test(`sessionsForRoom shows "${name}" under every room iff it is a break`, () => {
      const elsewhere = sessionsForRoom([session], "SomeOtherRoom").map((s) => s.id);
      expect(elsewhere.includes(session.id)).toBe(isBreak);
    });
  }

  test("a break survives filters and reaches every tab together", () => {
    const lunch: Session = { ...base, id: "lunch", speakerIds: [], room: "", track: "", tags: [] };
    const talk: Session = { ...base, id: "talk" };
    const filtered = filterSessions([talk, lunch], { ...defaultAgendaFilters, track: "Nonexistent" });
    expect(filtered.map((s) => s.id)).toEqual(["lunch"]);
    expect(sessionsForRoom(filtered, "Maria").map((s) => s.id)).toEqual(["lunch"]);
  });
});
