export type SocialLink = {
  label: string;
  url: string;
};

export type TeamMember = {
  id: string;
  name: string;
  photo: string;
  links: SocialLink[];
  accentColor?: string;
};

// `bioShort` and `bioLong` are translated content and live in
// messages/{locale}.json under the `speakers.<id>.*` namespace, keyed by `id`.
export type Speaker = {
  id: string;
  name: string;
  title: string;
  company: string;
  photo: string;
  links: SocialLink[];
  sessions: string[];
  keynote?: boolean;
};

export type SessionLevel = "beginner" | "intermediate" | "advanced";

// `title` and `abstract` are translated content and live in
// messages/{locale}.json under the `sessions.<id>.*` namespace, keyed by `id`.
export type Session = {
  id: string;
  start: string;
  end: string;
  track: string;
  room: string;
  level: SessionLevel;
  tags: string[];
  speakerIds: string[];
};

export type Venue = {
  name: string;
  address: string;
  city: string;
  mapEmbedUrl: string;
  mapsLinkUrl: string;
};

export type Sponsor = {
  name: string;
  url: string;
  tier: "gold" | "silver" | "bronze" | "community";
};
