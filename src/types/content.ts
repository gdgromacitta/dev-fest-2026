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
  // Sessionize "service sessions" — breaks, lunch, registration. Rendered as
  // a single row spanning every room column rather than inside one room.
  isBreak?: boolean;
};

export type Venue = {
  name: string;
  address: string;
  city: string;
  mapEmbedUrl: string;
  mapsLinkUrl: string;
};

export type SponsorTier = "main" | "platinum" | "gold" | "silver" | "bronze";

export type Sponsor = {
  name: string;
  url: string;
  /** Absent for non-tiered partners (see `community`). */
  tier?: SponsorTier;
  /**
   * Filename under `public/logos/` (e.g. "google.svg"). Omit to render a
   * name-based placeholder instead — adding the file and setting this field
   * is the only step needed to show a real logo, no code change required.
   */
  logo?: string;
  /**
   * Non-monetary partners (swag, licences, etc.) that aren't part of the
   * paid tier ladder but are still presented on the sponsors page.
   */
  community?: boolean;
};

/**
 * A past sponsor/partner shown in the "chi ha creduto in noi" marquee. Kept
 * as a separate shape from `Sponsor` — past entries have no tier and no
 * current CTA link, only a name and a logo image.
 */
export type PastSponsor = {
  name: string;
  /**
   * Full image URL (placehold.co placeholder today). Swapping in a real
   * asset later is a one-field change — no code change required.
   */
  logoUrl: string;
};
