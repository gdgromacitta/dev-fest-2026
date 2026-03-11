import { sessions } from "@/src/content/sessions";
import { speakers } from "@/src/content/speakers";

export const getSpeakerById = (id: string) => speakers.find((speaker) => speaker.id === id) ?? null;

export const getSessionsBySpeaker = (speakerId: string) =>
  sessions.filter((session) => session.speakerIds.includes(speakerId));
