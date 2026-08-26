import fixture from "../fixtures/sessionize-view-all.json";
import { mapAll } from "../../scripts/lib/sessionize-mapper.mjs";

// The fixture is a verbatim slice of a real Sessionize `view/All` response
// (event od2jlmwc). Do not hand-edit its shape to make a test pass — the
// point is that it pins the shape the API actually returns.

const CATEGORY_TITLES = { track: ["Topic"], level: ["Level of the Talk"], tags: ["Tags"] };

describe("against the real API shape", () => {
  test("reads category options from `items`, not `categoryItems`", () => {
    // Regression: a category lists its options under `items`; `categoryItems`
    // is the *session* field holding selected ids. Reading the wrong one
    // yields no track, no tags, and a defaulted level for every session.
    const { sessions } = mapAll(fixture, { categoryTitles: CATEGORY_TITLES });

    expect(sessions.map((s) => s.track)).toEqual(["AI/ML", "Other", "AI/ML"]);
    expect(sessions.every((s) => s.track !== "")).toBe(true);
  });

  test("resolves every level rather than falling back to the default", () => {
    const { sessions } = mapAll(fixture, { categoryTitles: CATEGORY_TITLES });
    expect(sessions.map((s) => s.level)).toEqual(["intermediate", "beginner", "advanced"]);
  });

  test("maps a session onto the Session shape", () => {
    const { sessions } = mapAll(fixture, { categoryTitles: CATEGORY_TITLES });
    expect(sessions[0]).toEqual({
      id: "1046422",
      start: "2025-10-25T10:00:00",
      end: "2025-10-25T10:45:00",
      track: "AI/ML",
      room: "Maria",
      level: "intermediate",
      tags: ["AI/ML"],
      speakerIds: ["df577d1f-1e8c-491a-a9de-5c8bbdb91bd7"]
    });
  });

  test("maps speakers and derives their session ids", () => {
    const { speakers } = mapAll(fixture, { categoryTitles: CATEGORY_TITLES });
    const alfredo = speakers.find((s) => s.name === "Alfredo Morresi");
    expect(alfredo).toMatchObject({
      id: "6fc71432-0fc4-4160-a7c9-0284e55e6398",
      title: "Developer Relations @ Google",
      company: "",
      photo: "https://cdn.sessionize.com/image/970e-400o400o1-Xda5G7dE1SHvGgMQinayWf.png",
      sessions: ["1056519"],
      keynote: false
    });
  });

  test("normalizes CRLF out of fetched prose", () => {
    const { sessionMessages } = mapAll(fixture, { categoryTitles: CATEGORY_TITLES });
    const abstracts = Object.values(sessionMessages).map((m) => m.abstract);
    expect(abstracts.some((a) => a.includes("\n"))).toBe(true);
    expect(abstracts.every((a) => !a.includes("\r"))).toBe(true);
  });
});

describe("category title matching", () => {
  test("yields empty tracks when titles match nothing", () => {
    // The pre-fix behaviour, now reachable only by misconfiguration.
    const { sessions } = mapAll(fixture, {
      categoryTitles: { track: ["Track"], level: ["Level"], tags: ["Tags"] }
    });
    expect(sessions.every((s) => s.track === "")).toBe(true);
    expect(sessions.every((s) => s.level === "intermediate")).toBe(true);
  });

  test("matches titles case-insensitively and tries each candidate", () => {
    const { sessions } = mapAll(fixture, {
      categoryTitles: { track: ["Track", "tOpIc"], level: ["level of the talk"], tags: ["Tags"] }
    });
    expect(sessions[0]?.track).toBe("AI/ML");
    expect(sessions[1]?.level).toBe("beginner");
  });

  test("falls back to the track when no tags category is configured", () => {
    const { sessions } = mapAll(fixture, { categoryTitles: CATEGORY_TITLES });
    expect(sessions[1]?.tags).toEqual(["Other"]);
  });
});

describe("unscheduled sessions", () => {
  // Sessionize returns null start/end while an agenda is still being built.
  // `Session.start` is typed `string`, so emitting these would write `null`
  // into src/content/sessions.ts and fail the build's type check.
  const withUnscheduled = {
    ...fixture,
    sessions: [
      ...fixture.sessions,
      { ...fixture.sessions[0], id: "9001", title: "Not yet scheduled", startsAt: null, endsAt: null, roomId: null }
    ]
  };

  test("drops them and reports the count", () => {
    const { sessions, skippedUnscheduled } = mapAll(withUnscheduled, { categoryTitles: CATEGORY_TITLES });
    expect(skippedUnscheduled).toBe(1);
    expect(sessions.map((s) => s.id)).not.toContain("9001");
    expect(sessions.every((s) => typeof s.start === "string" && typeof s.end === "string")).toBe(true);
  });

  test("keeps them out of the translated messages too", () => {
    const { sessionMessages } = mapAll(withUnscheduled, { categoryTitles: CATEGORY_TITLES });
    expect(Object.keys(sessionMessages)).not.toContain("9001");
  });
});

describe("defaults", () => {
  test("works with no options passed", () => {
    // "Topic" and "Level of the Talk" are in the shipped candidate lists.
    const { sessions } = mapAll(fixture);
    expect(sessions[0]?.track).toBe("AI/ML");
    expect(sessions[2]?.level).toBe("advanced");
  });
});
