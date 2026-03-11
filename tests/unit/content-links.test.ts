import { getSpeakerById, getSessionsBySpeaker } from "@/src/lib/content";

test("every speaker session id resolves to an existing session", () => {
  const speaker = getSpeakerById("s-ada");
  expect(speaker).toBeTruthy();
  const items = getSessionsBySpeaker("s-ada");
  expect(items.length).toBeGreaterThan(0);
  expect(items[0]?.title).toBeTruthy();
});
