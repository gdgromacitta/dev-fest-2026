// `role` (per card), tab labels, and `featuredSpeaker.about` are translated
// content and live in messages/{locale}.json under the `speakerShowcase.*`
// namespace: `speakerShowcase.cards.<id>.role`, `speakerShowcase.tabs.<tabId>`,
// and `speakerShowcase.featured.about`, keyed by the stable `id`/`tabId`
// below.
type SpeakerShowcaseCard = {
  id: string;
  name: string;
  company: string;
  photo: string;
  selected?: boolean;
};

export const speakerShowcaseTabs = ["all", "webMobile", "cloudAi", "design", "firebase"] as const;

export const speakerShowcaseCards: SpeakerShowcaseCard[] = [
  {
    id: "alice-johnson",
    name: "Alice Johnson",
    company: "Google",
    photo: "https://placehold.co/280x320/2b3140/f2c3a7?text=%20"
  },
  {
    id: "bob-brown",
    name: "Bob Brown",
    company: "Google",
    photo: "https://placehold.co/280x320/21384d/cfd8e3?text=%20"
  },
  {
    id: "charlie-davis",
    name: "Charlie Davis",
    company: "Uber",
    photo: "https://placehold.co/280x320/13253b/f0d0b2?text=%20",
    selected: true
  },
  {
    id: "david-smith",
    name: "David Smith",
    company: "Google",
    photo: "https://placehold.co/280x320/315777/e1d6ca?text=%20"
  },
  {
    id: "eve-wilson",
    name: "Eve Wilson",
    company: "Google",
    photo: "https://placehold.co/280x320/e3d6d0/fff7f2?text=%20"
  },
  {
    id: "frank-miller",
    name: "Frank Miller",
    company: "Google",
    photo: "https://placehold.co/280x320/202d3b/cfd5dc?text=%20"
  },
  {
    id: "grace-lee",
    name: "Grace Lee",
    company: "Google",
    photo: "https://placehold.co/280x320/1a1f2a/f1e2d7?text=%20"
  },
  {
    id: "henry-zhang",
    name: "Henry Zhang",
    company: "Google",
    photo: "https://placehold.co/280x320/27344a/e4ebf5?text=%20"
  }
] as const;

export const featuredSpeaker = {
  name: "Charlie Davis",
  title: "Staff Software Engineer @ Uber",
  badge: "Web Expert",
  photo: "https://placehold.co/360x420/213024/e2c2a4?text=%20",
  sessions: [
    {
      date: "OCT 24",
      title: "Scaling Web Performance at Uber",
      location: "10:30 AM - Room A Main Stage",
      anchor: "Agenda # 1"
    },
    {
      date: "OCT 25",
      title: "Panel: The Future of Frontend",
      location: "02:00 PM - Conference Hall 2",
      anchor: "Agenda # 1"
    }
  ]
} as const;
