type SpeakerShowcaseCard = {
  name: string;
  role: string;
  company: string;
  photo: string;
  selected?: boolean;
};

export const speakerShowcaseTabs = ["All Speakers", "Web & Mobile", "Cloud & AI", "Design", "Firebase"] as const;

export const speakerShowcaseCards: SpeakerShowcaseCard[] = [
  {
    name: "Alice Johnson",
    role: "Web Engineer",
    company: "Google",
    photo: "https://placehold.co/280x320/2b3140/f2c3a7?text=%20"
  },
  {
    name: "Bob Brown",
    role: "Cloud Architect",
    company: "Google",
    photo: "https://placehold.co/280x320/21384d/cfd8e3?text=%20"
  },
  {
    name: "Charlie Davis",
    role: "Staff Software Engineer",
    company: "Uber",
    photo: "https://placehold.co/280x320/13253b/f0d0b2?text=%20",
    selected: true
  },
  {
    name: "David Smith",
    role: "CDE, Angular",
    company: "Google",
    photo: "https://placehold.co/280x320/315777/e1d6ca?text=%20"
  },
  {
    name: "Eve Wilson",
    role: "UX Researcher",
    company: "Google",
    photo: "https://placehold.co/280x320/e3d6d0/fff7f2?text=%20"
  },
  {
    name: "Frank Miller",
    role: "CTO",
    company: "Google",
    photo: "https://placehold.co/280x320/202d3b/cfd5dc?text=%20"
  },
  {
    name: "Grace Lee",
    role: "Lead Designer",
    company: "Google",
    photo: "https://placehold.co/280x320/1a1f2a/f1e2d7?text=%20"
  },
  {
    name: "Henry Zhang",
    role: "Android Engineer",
    company: "Google",
    photo: "https://placehold.co/280x320/27344a/e4ebf5?text=%20"
  }
] as const;

export const featuredSpeaker = {
  name: "Charlie Davis",
  title: "Staff Software Engineer @ Uber",
  badge: "Web Expert",
  photo: "https://placehold.co/360x420/213024/e2c2a4?text=%20",
  about:
    "Charlie is a Staff Engineer at Uber where she leads the web performance infrastructure team. With over 12 years of experience in the industry, she has been a vocal advocate for accessible web patterns and modern CSS architecture. She is a frequent contributor to open-source and loves building tools that make developers' lives easier.",
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
