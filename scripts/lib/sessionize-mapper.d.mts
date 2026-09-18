import type { Session, Speaker } from "../../src/types/content";

type Id = string | number;
type CategoryTitles = { track: string[]; level: string[]; tags: string[] };
type ApiSession = {
  id: Id;
  startsAt?: string | null;
  endsAt?: string | null;
  roomId?: Id | null;
  categoryItems?: Id[];
  speakers?: Id[];
  isServiceSession?: boolean;
  title?: string;
  description?: string | null;
};
type Room = { id: Id; name: string; sort?: number };
type Category = {
  title: string;
  items?: { id: Id; name: string }[];
  categoryItems?: { id: Id; name: string }[];
};
type ApiSpeaker = {
  id: Id;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  tagLine?: string | null;
  profilePicture?: string | null;
  bio?: string | null;
  isTopSpeaker?: boolean;
  links?: { title?: string; linkType?: string; url: string }[];
};
export const DEFAULT_LEVEL: "intermediate";
export const DEFAULT_CATEGORY_TITLES: CategoryTitles;
export function mapSession(
  session: ApiSession,
  options: { rooms?: Room[]; categories?: Category[]; categoryTitles?: CategoryTitles }
): Omit<Session, "start" | "end"> & { start: string | null | undefined; end: string | null | undefined };
export function mapSpeaker(
  speaker: ApiSpeaker,
  options: { sessionIdsBySpeakerId: Map<string, string[]> }
): Speaker;
export function mapAll(
  apiResponse: { sessions?: ApiSession[]; speakers?: ApiSpeaker[]; rooms?: Room[]; categories?: Category[] },
  options?: { categoryTitles?: CategoryTitles }
): {
  sessions: Session[];
  speakers: Speaker[];
  sessionMessages: Record<string, { title: string; abstract: string }>;
  speakerMessages: Record<string, { bioShort: string; bioLong: string }>;
  skippedUnscheduled: number;
};
