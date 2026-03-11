import type { Session } from "@/src/types/content";

export const sessions: Session[] = [
  {
    id: "sess-101",
    title: "The Future of Tech: AI, Web and Beyond",
    abstract: "A keynote exploring how the next wave of Google technologies is reshaping product teams and developer workflows.",
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
    title: "Building Adaptive UIs with Flutter",
    abstract: "A practical intro to building responsive mobile interfaces with production-minded design systems.",
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
    title: "Scalable Microservices with GKE",
    abstract: "Patterns for designing resilient cloud services with Kubernetes, observability, and safe rollout paths.",
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
    title: "Getting Started with Gemini API",
    abstract: "An intro to building practical AI experiences with Gemini, evaluation basics, and production guardrails.",
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
    title: "Modern Web: From WebAssembly to AI Browsing",
    abstract: "A tour through the latest browser capabilities, web runtimes, and AI-assisted interaction patterns.",
    start: "2026-11-21T15:00:00+01:00",
    end: "2026-11-21T15:45:00+01:00",
    track: "Web",
    room: "Room A",
    level: "advanced",
    tags: ["Web", "Performance"],
    speakerIds: ["s-omar"]
  }
];
