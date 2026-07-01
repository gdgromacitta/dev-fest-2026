import type { Session } from "@/src/types/content";

// `title` and `abstract` are translated content and live in
// messages/{locale}.json under the `sessions.<id>.*` namespace, keyed by `id`.
export const sessions: Session[] = [
  {
    id: "sess-101",
    start: "2026-11-21T09:00:00+01:00",
    end: "2026-11-21T10:00:00+01:00",
    track: "AI",
    room: "Main Hall",
    level: "beginner",
    tags: ["AI", "Keynote"],
    speakerIds: ["s-ada"]
  },
  {
    id: "sess-102",
    start: "2026-11-21T10:30:00+01:00",
    end: "2026-11-21T11:15:00+01:00",
    track: "Mobile",
    room: "Room A",
    level: "intermediate",
    tags: ["Mobile", "Flutter"],
    speakerIds: ["s-milo"]
  },
  {
    id: "sess-205",
    start: "2026-11-21T10:30:00+01:00",
    end: "2026-11-21T11:15:00+01:00",
    track: "Cloud",
    room: "Room B",
    level: "advanced",
    tags: ["Cloud", "Kubernetes"],
    speakerIds: ["s-nora"]
  },
  {
    id: "sess-301",
    start: "2026-11-21T13:30:00+01:00",
    end: "2026-11-21T14:15:00+01:00",
    track: "AI",
    room: "Room C",
    level: "beginner",
    tags: ["AI", "Product"],
    speakerIds: ["s-lina"]
  },
  {
    id: "sess-401",
    start: "2026-11-21T15:00:00+01:00",
    end: "2026-11-21T15:45:00+01:00",
    track: "Web",
    room: "Room A",
    level: "advanced",
    tags: ["Web", "Performance"],
    speakerIds: ["s-omar"]
  }
];
