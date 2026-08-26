import { defaultAgendaFilters, filterSessions } from "@/src/lib/agenda-filters";
import type { Session } from "@/src/types/content";

// Synthetic sessions on purpose: this exercises filterSessions itself, so it
// must not break when src/content/sessions.ts is regenerated from Sessionize.
const session = (overrides: Partial<Session> & { id: string }): Session => ({
  start: "2026-10-10T10:00:00",
  end: "2026-10-10T10:45:00",
  track: "AI",
  room: "Main Hall",
  level: "beginner",
  tags: [],
  speakerIds: ["sp-1"],
  ...overrides
});

const catalogue: Session[] = [
  session({ id: "a", track: "AI", level: "beginner", tags: ["AI", "Keynote"] }),
  session({ id: "b", track: "AI", level: "beginner", tags: ["AI", "Product"] }),
  session({ id: "c", track: "AI", level: "advanced", tags: ["AI"] }),
  session({ id: "d", track: "Web", level: "beginner", tags: ["Web"] })
];

test("returns everything with the default filters", () => {
  expect(filterSessions(catalogue, defaultAgendaFilters)).toHaveLength(catalogue.length);
});

test("filters by track", () => {
  expect(filterSessions(catalogue, { ...defaultAgendaFilters, track: "Web" }).map((s) => s.id)).toEqual(["d"]);
});

test("filters by level", () => {
  expect(filterSessions(catalogue, { ...defaultAgendaFilters, level: "advanced" }).map((s) => s.id)).toEqual(["c"]);
});

test("requires every selected tag, not just one", () => {
  const result = filterSessions(catalogue, { ...defaultAgendaFilters, tags: ["AI", "Product"] });
  expect(result.map((s) => s.id)).toEqual(["b"]);
});

test("narrows by query across id and tags", () => {
  // `query` matches locale-invariant fields only (`id`/`tags`) — `title` and
  // `abstract` are translated content in messages/{locale}.json, not part of
  // the Session model.
  expect(filterSessions(catalogue, { ...defaultAgendaFilters, query: "product" }).map((s) => s.id)).toEqual(["b"]);
});

test("combines every filter", () => {
  const result = filterSessions(catalogue, {
    track: "AI",
    level: "beginner",
    tags: ["AI"],
    query: "product"
  });
  expect(result.map((s) => s.id)).toEqual(["b"]);
});

test("keeps breaks whatever the filters say", () => {
  // A break carries a defaulted level and no real track; filtering it out
  // would leave the schedule with unexplained gaps.
  const withBreak: Session[] = [
    ...catalogue,
    session({ id: "lunch", track: "", room: "", level: "intermediate", tags: [], speakerIds: [], isBreak: true })
  ];
  const result = filterSessions(withBreak, { track: "Web", level: "beginner", tags: ["Web"], query: "" });
  expect(result.map((s) => s.id)).toContain("lunch");
});

test("returns nothing when filters exclude everything", () => {
  // Breaks are exempt, so use a catalogue with none.
  expect(filterSessions(catalogue, { ...defaultAgendaFilters, track: "Nonexistent" })).toEqual([]);
});
