"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AddToCalendar } from "@/src/components/agenda/add-to-calendar";
import { Dialog } from "@/src/components/ui/dialog";
import { Link } from "@/src/i18n/navigation";
import { features } from "@/src/content/features";
import { speakers } from "@/src/content/speakers";
import { isBreakSession } from "@/src/lib/session-breaks";
import { toggleSession, useSavedSessionIds } from "@/src/lib/saved-sessions";
import { UNASSIGNED_ROOM, roomKey } from "@/src/lib/agenda-rooms";
import type { Session } from "@/src/types/content";

export type SpeakerMeta = {
  name: string;
  subtitle: string;
  initials: string;
  // Absent for TBA / unknown speakers, which have no page to link to.
  slug?: string;
  photo?: string;
};

export const getSpeakerMeta = (speakerId: string, fallbackName: string, fallbackSubtitle: string): SpeakerMeta => {
  const speaker = speakers.find((item) => item.id === speakerId);
  if (!speaker) {
    return { name: fallbackName, subtitle: fallbackSubtitle, initials: fallbackName.slice(0, 1) };
  }
  const initials = speaker.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
  return {
    name: speaker.name,
    // `company` is blank for Sessionize-sourced speakers (no such field) —
    // join only what's there so the subtitle never ends in a stray comma.
    subtitle: [speaker.title, speaker.company].filter(Boolean).join(", "),
    initials,
    slug: speaker.slug,
    photo: speaker.photo || undefined
  };
};

/**
 * Maps a location hash to the session it should open. Breaks and unknown ids
 * resolve to null, so a stale or hand-edited hash never opens anything.
 */
export function resolveHashSession(hash: string, sessions: Session[]): Session | null {
  let id = hash.replace(/^#/, "");
  if (!id) return null;
  try {
    id = decodeURIComponent(id);
  } catch {
    // Malformed escape: fall through with the raw value, which won't match.
  }
  const session = sessions.find((item) => item.id === id);
  return session && !isBreakSession(session) ? session : null;
}

const formatTime = (value: string) => {
  const date = new Date(value);
  return `${`${date.getHours()}`.padStart(2, "0")}:${`${date.getMinutes()}`.padStart(2, "0")}`;
};

/**
 * Modal state synced with the URL hash. Opening pushes `#<sessionId>` so the
 * Back gesture closes it; closing removes the hash without leaving an extra
 * history entry (history.back() when this modal pushed one, replaceState when
 * it was opened from a deep link or a forward/back navigation we did not push).
 */
export function useSessionModal(sessions: Session[]) {
  const [openId, setOpenId] = useState<string | null>(null);
  // True while the current hash entry sits on top of a /agenda entry that we
  // (or the browser history) can step back to.
  const hasEntry = useRef(false);
  const sessionsRef = useRef(sessions);

  useEffect(() => {
    sessionsRef.current = sessions;
  });

  useEffect(() => {
    const initial = resolveHashSession(window.location.hash, sessionsRef.current);
    if (initial) {
      // Deep link: there is no earlier in-app entry to go back to.
      hasEntry.current = false;
      // Opening from the URL is the mount-time sync of external state.
      setOpenId(initial.id);
    }
    const onPopState = () => {
      const next = resolveHashSession(window.location.hash, sessionsRef.current);
      // Arriving on a hash via history navigation means an entry exists below.
      hasEntry.current = next !== null;
      setOpenId(next ? next.id : null);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const open = useCallback((id: string) => {
    // Keep the router's history.state intact; Next reads it on popstate.
    window.history.pushState(window.history.state, "", `#${encodeURIComponent(id)}`);
    hasEntry.current = true;
    setOpenId(id);
  }, []);

  const close = useCallback(() => {
    setOpenId(null);
    if (hasEntry.current) {
      hasEntry.current = false;
      window.history.back();
    } else if (window.location.hash) {
      const { pathname, search } = window.location;
      window.history.replaceState(window.history.state, "", `${pathname}${search}`);
    }
  }, []);

  const session = openId ? (sessions.find((item) => item.id === openId) ?? null) : null;
  return { session, open, close };
}

type SessionDialogProps = {
  session: Session | null;
  onClose: () => void;
};

export function SessionDialog({ session, onClose }: SessionDialogProps) {
  return (
    <Dialog open={session !== null} onClose={onClose} title={session ? <SessionTitle id={session.id} /> : ""}>
      {session ? <SessionDetails session={session} /> : null}
    </Dialog>
  );
}

function SessionTitle({ id }: { id: string }) {
  const tSessions = useTranslations("sessions");
  return <>{tSessions(`${id}.title`)}</>;
}

function SessionDetails({ session }: { session: Session }) {
  const tSessions = useTranslations("sessions");
  const tAgenda = useTranslations("agenda");
  const savedIds = useSavedSessionIds();
  const saved = savedIds.includes(session.id);
  const title = tSessions(`${session.id}.title`);
  const hasAbstract = tSessions.has(`${session.id}.abstract`);
  const room = roomKey(session);
  const lineup = (session.speakerIds.length ? session.speakerIds : [""]).map((id) => ({
    id,
    meta: getSpeakerMeta(id, tAgenda("speakerTba"), tAgenda("speakerTbaSubtitle"))
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <p className="m-0 text-sm text-slate-600">
          {formatTime(session.start)}–{formatTime(session.end)}
          {" · "}
          {room === UNASSIGNED_ROOM ? tAgenda("unassignedRoom") : room}
        </p>
        <button
          type="button"
          aria-label={tAgenda("saveSessionAriaLabel", { title })}
          aria-pressed={saved}
          onClick={() => toggleSession(session.id)}
          className={`focus-ring flex-none rounded-lg p-1 transition-colors ${
            saved ? "text-[#2b6cd4]" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className={`h-7 w-7 ${saved ? "fill-current" : "fill-none"}`}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          >
            <path d="M6 3.5A1.5 1.5 0 0 1 7.5 2h5A1.5 1.5 0 0 1 14 3.5v13.12c0 .69-.78 1.1-1.35.72L10 15.54l-2.65 1.8c-.57.38-1.35-.03-1.35-.72V3.5Z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-wrap gap-2 text-[0.65rem] font-bold uppercase tracking-[0.08em]">
        {session.track ? <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-600">{session.track}</span> : null}
        <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-600">{session.level}</span>
        {session.tags
          .filter((tag) => tag !== session.track)
          .map((tag) => (
            <span key={tag} className="rounded-md border border-slate-200 px-2 py-1 text-slate-500">
              {tag}
            </span>
          ))}
      </div>

      {hasAbstract ? (
        <p className="m-0 whitespace-pre-line text-sm leading-relaxed text-slate-700">
          {tSessions(`${session.id}.abstract`)}
        </p>
      ) : null}

      <section aria-label={tAgenda("modalSpeakers")}>
        <ul className="m-0 list-none space-y-3 p-0">
          {lineup.map(({ id, meta }, index) => (
            <li key={id || `tba-${index}`} className="flex items-center gap-3">
              {meta.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={meta.photo} alt="" className="h-10 w-10 flex-none rounded-full object-cover" />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#f4d4b0] text-xs font-semibold text-slate-700"
                >
                  {meta.initials}
                </span>
              )}
              <div className="min-w-0 text-sm">
                <p className="m-0 font-semibold text-slate-800">
                  {features.speakers && meta.slug ? (
                    <Link href={`/speakers/${meta.slug}`} className="focus-ring rounded">
                      {meta.name}
                    </Link>
                  ) : (
                    meta.name
                  )}
                </p>
                {meta.subtitle ? <p className="m-0 text-slate-500">{meta.subtitle}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <AddToCalendar session={session} title={title} />
    </div>
  );
}
