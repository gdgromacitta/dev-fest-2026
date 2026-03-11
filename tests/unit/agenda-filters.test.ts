import { sessions } from "@/src/content/sessions";
import { filterSessions } from "@/src/lib/agenda-filters";

test("filters by track, level, tag, and query", () => {
  const result = filterSessions(sessions, {
    track: "AI",
    level: "beginner",
    tags: ["AI"],
    query: "intro"
  });
  expect(result.length).toBe(1);
  expect(result[0]?.track).toBe("AI");
  expect(result[0]?.level).toBe("beginner");
});
