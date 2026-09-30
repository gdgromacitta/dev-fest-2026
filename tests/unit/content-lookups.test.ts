import { getCoSpeakers, getSpeakerBySlug } from "@/src/lib/content";
import { sessions } from "@/src/content/sessions";
import { speakers } from "@/src/content/speakers";

describe("getSpeakerBySlug", () => {
  it("finds a speaker by slug", () => {
    const speaker = speakers[0];
    expect(getSpeakerBySlug(speaker.slug)).toBe(speaker);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getSpeakerBySlug("no-such-speaker")).toBeUndefined();
  });

  it("has unique slugs", () => {
    expect(new Set(speakers.map((s) => s.slug)).size).toBe(speakers.length);
  });
});

describe("getCoSpeakers", () => {
  it("never includes the excluded speaker", () => {
    for (const session of sessions) {
      for (const id of session.speakerIds) {
        expect(getCoSpeakers(session.id, id).map((s) => s.id)).not.toContain(id);
      }
    }
  });

  it("returns the other speakers of a multi-speaker session", () => {
    const session = sessions.find((s) => s.speakerIds.length > 1);
    if (!session) return;
    const [first, ...rest] = session.speakerIds;
    expect(getCoSpeakers(session.id, first).map((s) => s.id)).toEqual(
      rest.filter((id) => speakers.some((s) => s.id === id))
    );
  });

  it("returns [] for a single-speaker session and for an unknown session", () => {
    const single = sessions.find((s) => s.speakerIds.length === 1);
    expect(single).toBeDefined();
    expect(getCoSpeakers(single!.id, single!.speakerIds[0])).toEqual([]);
    expect(getCoSpeakers("missing", "x")).toEqual([]);
  });
});
