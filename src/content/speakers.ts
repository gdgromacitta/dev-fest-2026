import type { Speaker } from "@/src/types/content";

// `bioShort` and `bioLong` are translated content and live in
// messages/{locale}.json under the `speakers.<id>.*` namespace, keyed by `id`.
export const speakers: Speaker[] = [
  {
    id: "s-ada",
    name: "Sarah Chen",
    title: "Google Developer Expert",
    company: "GDG",
    photo: "/images/speakers-ada.jpg",
    links: [{ label: "LinkedIn", url: "https://www.linkedin.com" }],
    sessions: ["sess-101"],
    keynote: true
  },
  {
    id: "s-milo",
    name: "James Wilson",
    title: "Senior DevRel",
    company: "Flutter Labs",
    photo: "/images/speakers-milo.jpg",
    links: [{ label: "GitHub", url: "https://github.com" }],
    sessions: ["sess-102"]
  },
  {
    id: "s-nora",
    name: "Dr. Elena Rodriguez",
    title: "Cloud Architect",
    company: "GKE Studio",
    photo: "/images/speakers-nora.jpg",
    links: [{ label: "X", url: "https://x.com" }],
    sessions: ["sess-205"]
  },
  {
    id: "s-lina",
    name: "Maya Patel",
    title: "AI Engineer",
    company: "Gemini Studio",
    photo: "https://placehold.co/320x400",
    links: [{ label: "LinkedIn", url: "https://www.linkedin.com" }],
    sessions: ["sess-301"]
  },
  {
    id: "s-omar",
    name: "David Miller",
    title: "Web Specialist",
    company: "Web Labs",
    photo: "https://placehold.co/320x400",
    links: [{ label: "GitHub", url: "https://github.com" }],
    sessions: ["sess-401"]
  }
];
