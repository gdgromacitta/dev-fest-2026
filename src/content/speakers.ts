import type { Speaker } from "@/src/types/content";

export const speakers: Speaker[] = [
  {
    id: "s-ada",
    name: "Sarah Chen",
    title: "Google Developer Expert",
    company: "GDG",
    bioShort: "Connects AI, web, and community trends through practical developer education.",
    bioLong:
      "Sarah leads community keynotes and developer enablement programs, helping teams understand how emerging Google technologies fit into real product work.",
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
    bioShort: "Helps teams build polished mobile interfaces with resilient UI architecture.",
    bioLong:
      "James works with engineering teams adopting Flutter for real products, focusing on adaptive interface patterns and maintainable component systems.",
    photo: "/images/speakers-milo.jpg",
    links: [{ label: "GitHub", url: "https://github.com" }],
    sessions: ["sess-102"]
  },
  {
    id: "s-nora",
    name: "Dr. Elena Rodriguez",
    title: "Cloud Architect",
    company: "GKE Studio",
    bioShort: "Designs resilient cloud platforms for teams operating at scale.",
    bioLong:
      "Elena focuses on Kubernetes platform architecture, progressive delivery, and operations models that keep microservice systems understandable.",
    photo: "/images/speakers-nora.jpg",
    links: [{ label: "X", url: "https://x.com" }],
    sessions: ["sess-205"]
  },
  {
    id: "s-lina",
    name: "Maya Patel",
    title: "AI Engineer",
    company: "Gemini Studio",
    bioShort: "Builds practical AI workflows with a focus on evaluation and product safety.",
    bioLong:
      "Maya helps product and engineering teams ship AI features responsibly, with emphasis on API ergonomics, observability, and developer onboarding.",
    photo: "https://placehold.co/320x400",
    links: [{ label: "LinkedIn", url: "https://www.linkedin.com" }],
    sessions: ["sess-301"]
  },
  {
    id: "s-omar",
    name: "David Miller",
    title: "Web Specialist",
    company: "Web Labs",
    bioShort: "Explores emerging browser capabilities and AI-assisted interaction models.",
    bioLong:
      "David focuses on modern web platform features, performance engineering, and applied AI tooling for browser experiences.",
    photo: "https://placehold.co/320x400",
    links: [{ label: "GitHub", url: "https://github.com" }],
    sessions: ["sess-401"]
  }
];
