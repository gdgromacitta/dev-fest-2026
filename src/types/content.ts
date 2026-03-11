export type SocialLink = {
  label: string;
  url: string;
};

export type TeamMember = {
  name: string;
  role: string;
  bioShort: string;
  photo: string;
  links: SocialLink[];
  accentColor?: string;
};

export type Speaker = {
  id: string;
  name: string;
  title: string;
  company: string;
  bioShort: string;
  bioLong: string;
  photo: string;
  links: SocialLink[];
  sessions: string[];
  keynote?: boolean;
};

export type SessionLevel = "beginner" | "intermediate" | "advanced";

export type Session = {
  id: string;
  title: string;
  abstract: string;
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
  notes: string[];
  accessibilityInfo: string[];
  directions: string[];
};
