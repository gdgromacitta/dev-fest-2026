import { getSpeakerById, getSessionsBySpeaker } from "@/src/lib/content";
import { sessions } from "@/src/content/sessions";
import { speakers } from "@/src/content/speakers";

// Asserted against whatever content is committed — seed data or a Sessionize
// sync — so regenerating src/content/* can't break these.

test("content is non-empty", () => {
  expect(sessions.length).toBeGreaterThan(0);
  expect(speakers.length).toBeGreaterThan(0);
});

test("getSpeakerById resolves a known speaker and rejects an unknown one", () => {
  const first = speakers[0]!;
  expect(getSpeakerById(first.id)).toMatchObject({ id: first.id, name: first.name });
  expect(getSpeakerById("definitely-not-a-speaker-id")).toBeNull();
});

test("every session id listed on a speaker resolves to an existing session", () => {
  const sessionIds = new Set(sessions.map((session) => session.id));
  const dangling = speakers.flatMap((speaker) =>
    speaker.sessions.filter((id) => !sessionIds.has(id)).map((id) => `${speaker.id} -> ${id}`)
  );
  expect(dangling).toEqual([]);
});

test("every speakerId referenced by a session resolves to an existing speaker", () => {
  const speakerIds = new Set(speakers.map((speaker) => speaker.id));
  const dangling = sessions.flatMap((session) =>
    session.speakerIds.filter((id) => !speakerIds.has(id)).map((id) => `${session.id} -> ${id}`)
  );
  expect(dangling).toEqual([]);
});

test("getSessionsBySpeaker agrees with the speaker's own session list", () => {
  for (const speaker of speakers) {
    const derived = getSessionsBySpeaker(speaker.id).map((session) => session.id);
    expect([...derived].sort()).toEqual([...speaker.sessions].sort());
  }
});
