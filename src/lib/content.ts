import type { Speaker } from "@/src/types/content";
import { sessions } from "@/src/content/sessions";
import { speakers } from "@/src/content/speakers";

export const getSpeakerById = (id: string) => speakers.find((speaker) => speaker.id === id) ?? null;

export const getSessionsBySpeaker = (speakerId: string) =>
  sessions.filter((session) => session.speakerIds.includes(speakerId));

export const getSpeakerBySlug = (slug: string): Speaker | undefined =>
  speakers.find((speaker) => speaker.slug === slug);

export const getCoSpeakers = (sessionId: string, excludeSpeakerId: string): Speaker[] => {
  const session = sessions.find((s) => s.id === sessionId);
  if (!session) return [];
  return session.speakerIds
    .filter((id) => id !== excludeSpeakerId)
    .map((id) => speakers.find((speaker) => speaker.id === id))
    .filter((speaker): speaker is Speaker => speaker !== undefined);
};
