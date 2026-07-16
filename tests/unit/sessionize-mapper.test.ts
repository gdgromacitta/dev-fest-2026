import { mapAll } from "../../scripts/lib/sessionize-mapper.mjs";

const fixture = {
  rooms: [{ id: 1, name: "Main Hall" }],
  categories: [
    { title: "Track", categoryItems: [{ id: 10, name: "AI" }] },
    { title: "Level", categoryItems: [{ id: 20, name: "Beginner" }] }
  ],
  sessions: [
    {
      id: "sess-1",
      title: "Intro to AI",
      description: "An intro talk.",
      startsAt: "2026-11-21T09:00:00+01:00",
      endsAt: "2026-11-21T10:00:00+01:00",
      roomId: 1,
      speakers: ["sp-1"],
      categoryItems: [10, 20]
    },
    {
      id: "sess-2",
      title: "Unconfigured level",
      description: "No level category configured.",
      startsAt: "2026-11-21T10:30:00+01:00",
      endsAt: "2026-11-21T11:00:00+01:00",
      roomId: 1,
      speakers: ["sp-1"],
      categoryItems: []
    }
  ],
  speakers: [
    {
      id: "sp-1",
      fullName: "Ada Lovelace",
      tagLine: "Engineer",
      bio: "Works on AI.",
      profilePicture: "https://example.com/ada.jpg",
      links: [{ title: "GitHub", url: "https://github.com/ada" }]
    }
  ]
};

test("maps sessions with configured categories", () => {
  const { sessions } = mapAll(fixture);
  expect(sessions[0]).toEqual({
    id: "sess-1",
    start: "2026-11-21T09:00:00+01:00",
    end: "2026-11-21T10:00:00+01:00",
    track: "AI",
    room: "Main Hall",
    level: "beginner",
    tags: ["AI"],
    speakerIds: ["sp-1"]
  });
});

test("falls back to intermediate when level category is unconfigured", () => {
  const { sessions } = mapAll(fixture);
  expect(sessions[1]?.level).toBe("intermediate");
  expect(sessions[1]?.track).toBe("");
});

test("maps speakers and derives their session ids", () => {
  const { speakers } = mapAll(fixture);
  expect(speakers[0]).toMatchObject({
    id: "sp-1",
    name: "Ada Lovelace",
    title: "Engineer",
    company: "",
    photo: "https://example.com/ada.jpg",
    links: [{ label: "GitHub", url: "https://github.com/ada" }],
    sessions: ["sess-1", "sess-2"],
    keynote: false
  });
});

test("builds translated messages entries from title/abstract/bio", () => {
  const { sessionMessages, speakerMessages } = mapAll(fixture);
  expect(sessionMessages["sess-1"]).toEqual({ title: "Intro to AI", abstract: "An intro talk." });
  expect(speakerMessages["sp-1"]).toEqual({ bioShort: "Works on AI.", bioLong: "Works on AI." });
});
