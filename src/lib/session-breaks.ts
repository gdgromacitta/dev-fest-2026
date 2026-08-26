import type { Session } from "@/src/types/content";

/**
 * Breaks, lunch, registration: sessions that belong to no single room.
 *
 * `isBreak` is authoritative when present — scripts/lib/sessionize-mapper.mjs
 * sets it from Sessionize's `isServiceSession`. The fallback, for content not
 * produced by the mapper (seed or hand-authored rows, where `isBreak` is
 * optional), mirrors the mapper exactly: no speaker AND no room. A talk whose
 * speaker isn't confirmed yet still has a room, and must stay a talk.
 *
 * This lives on its own so the agenda filter and the agenda list can never
 * drift apart: when they disagreed, a break was rendered by one and dropped
 * by the other.
 */
export const isBreakSession = (session: Session) =>
  session.isBreak ?? (session.speakerIds.length === 0 && !session.room);
