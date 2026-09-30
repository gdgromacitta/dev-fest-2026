import { localeFromPath } from "@/src/components/not-found/locale-from-path";
import en from "@/messages/en.json";
import it from "@/messages/it.json";

describe("localeFromPath", () => {
  test.each([
    ["/en/x", "en"],
    ["/it/x", "it"],
    ["/garbage", "it"],
    ["/", "it"],
    ["", "it"],
    ["/en", "en"],
    ["/english/x", "it"]
  ])("%s -> %s", (path, expected) => {
    expect(localeFromPath(path)).toBe(expected);
  });
});

describe("notFound messages", () => {
  test("keys exist in both catalogues", () => {
    const keys = ["title", "body", "backHome", "gameTitle", "gameHint"];
    expect(Object.keys(en.notFound).sort()).toEqual([...keys].sort());
    expect(Object.keys(it.notFound).sort()).toEqual([...keys].sort());
    for (const k of keys) {
      expect((en.notFound as Record<string, string>)[k]).toBeTruthy();
      expect((it.notFound as Record<string, string>)[k]).toBeTruthy();
    }
  });
});
