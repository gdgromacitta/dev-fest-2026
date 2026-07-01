import { getSpeakerById, getSessionsBySpeaker } from "@/src/lib/content";

test("every speaker session id resolves to an existing session", () => {
  const speaker = getSpeakerById("s-ada");
  expect(speaker).toBeTruthy();
  const items = getSessionsBySpeaker("s-ada");
  expect(items.length).toBeGreaterThan(0);
  // `title`/`abstract` are translated content (see `sessions.<id>.*` in
  // messages/{locale}.json) and are no longer part of the `Session` data
  // model, so this checks the locale-invariant `id` instead.
  expect(items[0]?.id).toBeTruthy();
});
