import { sessions } from "@/src/content/sessions";
import { filterSessions } from "@/src/lib/agenda-filters";

test("filters by track, level, tag, and query", () => {
  // `query` matches against locale-invariant fields only (`id`/`tags`),
  // since `title`/`abstract` are translated content and no longer part of
  // the `Session` data model (see `sessions.<id>.*` in messages/{locale}.json).
  // "product" narrows sess-101 (tags: AI, Keynote) and sess-301 (tags: AI, Product)
  // down to sess-301 only.
  const result = filterSessions(sessions, {
    track: "AI",
    level: "beginner",
    tags: ["AI"],
    query: "product"
  });
  expect(result.length).toBe(1);
  expect(result[0]?.id).toBe("sess-301");
  expect(result[0]?.track).toBe("AI");
  expect(result[0]?.level).toBe("beginner");
});
