"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { AddToCalendar } from "@/src/components/agenda/add-to-calendar";
import { Link } from "@/src/i18n/navigation";
import type { Session } from "@/src/types/content";
import { SessionDialog, SpeakerAvatar, getSpeakerMeta, useSessionModal } from "@/src/components/agenda/session-dialog";
import { features } from "@/src/content/features";
import { isBreakSession } from "@/src/lib/session-breaks";
import { toggleSession, useSavedSessionIds } from "@/src/lib/saved-sessions";
import { SAVED_TAB, UNASSIGNED_ROOM, roomKey, roomsFrom, savedTabSessions, sessionsForRoom } from "@/src/lib/agenda-rooms";

type SessionListProps = {
  sessions: Session[];
  // Every room in the schedule, in display order. Passed in so the tabs stay
  // put while filters hide individual sessions; falls back to the rooms
  // present in `sessions`.
  rooms?: string[];
  // Every session, unfiltered. Lets the Saved tab tell "nothing saved" from
  // "saved but hidden by the filters"; falls back to `sessions`.
  allSessions?: Session[];
};

// Track and room names come from Sessionize category/room titles the organizer
// types per event, so no fixed map can cover them. Known names keep their
// designed colour; anything else gets a stable palette entry picked by hashing
// the name — deterministic, so server and client render the same class.
const trackPalette = [
  "bg-[#ddf6f6] text-[#6dbbb8]",
  "bg-[#dbe8ff] text-[#6d9df5]",
  "bg-[#ece9ff] text-[#7c6ce5]",
  "bg-[#efe6ff] text-[#8b75de]",
  "bg-[#fdeede] text-[#c8914f]",
  "bg-[#e4f5e6] text-[#66a870]"
];

const trackTone: Record<string, string> = {
  AI: trackPalette[0],
  Mobile: trackPalette[1],
  Web: trackPalette[2],
  Cloud: trackPalette[3]
};

const levelTone: Record<Session["level"], string> = {
  beginner: "bg-[#e0f3df] text-[#65a764]",
  intermediate: "bg-[#ebf7d9] text-[#7bb65b]",
  advanced: "bg-[#ffe5e4] text-[#f28c83]"
};

function hashIndex(value: string, length: number) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % length;
}

function toneFor(value: string, known: Record<string, string>, palette: string[]) {
  if (!value) return "bg-slate-100 text-slate-500";
  return known[value] ?? palette[hashIndex(value, palette.length)];
}

// 24-hour clock (15:00, not 3:00 PM) — the Italian convention for the event.
const formatSlot = (value: string) => {
  const date = new Date(value);
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  return { time: `${hours}:${minutes}` };
};

// Room names are free text, so a slug alone can collide ("Sala 1" / "sala-1")
// or come out empty. The index keeps every generated id unique, which
// aria-controls/aria-labelledby depend on.
const slugify = (value: string, index: number) =>
  `${value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "room"}-${index}`;

export function SessionList({ sessions, rooms: roomsProp, allSessions }: SessionListProps) {
  const tSessions = useTranslations("sessions");
  const tAgenda = useTranslations("agenda");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // Server snapshot is empty, so first render is unsaved and hydration matches.
  const savedIds = useSavedSessionIds();
  // Resolve against every session so filters never block a deep link.
  const modal = useSessionModal(allSessions ?? sessions);

  const rooms = roomsProp?.length ? roomsProp : roomsFrom(sessions);

  const saved = savedTabSessions(allSessions ?? sessions, sessions, savedIds);
  // The Saved tab only exists once something is saved. The server snapshot
  // and the hydration render have no saves, so it never causes a mismatch.
  const showSaved = saved.total > 0;
  const tabs = showSaved ? [...rooms, SAVED_TAB] : rooms;

  const [selectedRoom, setSelectedRoom] = useState(rooms[0] ?? "");
  // Unsaving the last session removes the tab: fall back to a room tab so
  // saving again later doesn't silently re-select Saved.
  if (selectedRoom === SAVED_TAB && !showSaved) {
    setSelectedRoom(rooms[0] ?? "");
  }
  // Filters can drop the selected room out of the list entirely.
  const activeRoom = tabs.includes(selectedRoom) ? selectedRoom : (rooms[0] ?? "");
  const activeIndex = Math.max(0, tabs.indexOf(activeRoom));
  const savedActive = activeRoom === SAVED_TAB;

  // The focused unsave button disappears with the Saved tab; move focus to the
  // first room tab instead of losing it to <body>.
  const wasSavedActive = useRef(false);
  useEffect(() => {
    if (wasSavedActive.current && !showSaved) {
      tabRefs.current[0]?.focus();
    }
    wasSavedActive.current = savedActive;
  }, [savedActive, showSaved]);

  const roomLabel = (room: string) => {
    if (room === SAVED_TAB) return tAgenda("savedTab");
    return room === UNASSIGNED_ROOM ? tAgenda("unassignedRoom") : room;
  };

  const countFor = (room: string) =>
    room === SAVED_TAB
      ? saved.visible.length
      : sessions.filter((session) => !isBreakSession(session) && roomKey(session) === room).length;

  const visible = savedActive ? saved.visible : sessionsForRoom(sessions, activeRoom);
  // Breaks alone aren't an agenda — if filters left this room with no talks,
  // say so instead of rendering a solitary break banner.
  const hasTalks = visible.some((session) => !isBreakSession(session));

  // Roving focus: arrows move between tabs, Home/End jump to the ends.
  const onTabKeyDown = (event: KeyboardEvent, index: number) => {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: tabs.length - 1
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const target = (next + tabs.length) % tabs.length;
    setSelectedRoom(tabs[target]!);
    tabRefs.current[target]?.focus();
  };

  if (!sessions.length && !showSaved) {
    return <p className="text-sm text-slate-600">{tAgenda("noSessionsMatch")}</p>;
  }

  return (
    <section className="space-y-6">
      {tabs.length === 1 ? (
        <p className="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">
          {roomLabel(tabs[0]!)}
        </p>
      ) : null}

      {tabs.length > 1 ? (
        <div
          role="tablist"
          aria-label={tAgenda("roomTabsLabel")}
          className="flex flex-wrap gap-2 border-b border-slate-200 pb-px"
        >
          {tabs.map((room, index) => {
            const selected = room === activeRoom;
            return (
              <button
                key={room}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`agenda-room-tab-${slugify(roomLabel(room), index)}`}
                // Only the selected tab has a panel in the DOM; pointing the
                // others at absent ids is invalid ARIA.
                aria-controls={selected ? `agenda-room-panel-${slugify(roomLabel(room), index)}` : undefined}
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => setSelectedRoom(room)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
                className={`focus-ring -mb-px rounded-t-lg border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                  selected
                    ? "border-[#4d8cff] text-[#2b6cd4]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {roomLabel(room)}
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-[0.7rem] font-bold ${
                    selected ? "bg-[#e7f0ff] text-[#2b6cd4]" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {countFor(room)}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      <p className="sr-only" role="status" aria-live="polite">
        {tAgenda("resultsStatus", { count: visible.filter((session) => !isBreakSession(session)).length })}
      </p>

      <div
        role={tabs.length > 1 ? "tabpanel" : undefined}
        id={`agenda-room-panel-${slugify(roomLabel(activeRoom), activeIndex)}`}
        aria-labelledby={tabs.length > 1 ? `agenda-room-tab-${slugify(roomLabel(activeRoom), activeIndex)}` : undefined}
        className="space-y-6"
      >
        {(hasTalks || savedActive ? visible : []).map((session) => {
          const slot = formatSlot(session.start);

          if (isBreakSession(session)) {
            return (
              <div
                key={session.id}
                className="grid gap-4 md:grid-cols-[4.5rem_minmax(0,1fr)] md:items-start"
                data-agenda-break={session.id}
              >
                <div className="space-y-1 pt-1 md:text-right">
                  <p className="m-0 text-[1.75rem] font-semibold tracking-[-0.05em] text-slate-800">{slot.time}</p>
                </div>
                <div className="relative md:pl-6">
                  <div className="rounded-2xl border border-dashed border-[#c8d8ff] bg-[#f7fbff] px-5 py-4 text-center text-lg font-semibold text-[#4d8cff]">
                    {tSessions.has(`${session.id}.title`)
                      ? tSessions(`${session.id}.title`)
                      : tAgenda("breakLabel")}
                  </div>
                </div>
              </div>
            );
          }

          // Paired talks are common on Sessionize; render every speaker, not
          // just the first.
          const lineup = (session.speakerIds.length ? session.speakerIds : [""]).map((id) =>
            getSpeakerMeta(id, tAgenda("speakerTba"), tAgenda("speakerTbaSubtitle"))
          );
          const speaker = lineup[0]!;
          const title = tSessions(`${session.id}.title`);
          const saved = savedIds.includes(session.id);

          return (
            <div key={session.id} className="grid gap-4 md:grid-cols-[4.5rem_minmax(0,1fr)] md:items-start">
              <div className="space-y-1 pt-1 md:text-right">
                <p className="m-0 text-[1.75rem] font-semibold tracking-[-0.05em] text-slate-800">{slot.time}</p>
              </div>
              <div className="relative md:pl-6 md:before:absolute md:before:bottom-[-1.5rem] md:before:left-0 md:before:top-0 md:before:w-px md:before:bg-slate-200 md:before:content-['']">
                <article
                  data-agenda-session={session.id}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_1px_0_rgba(15,23,42,0.04)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {savedActive ? (
                          <span className="rounded-md bg-slate-100 px-2 py-1 text-[0.6rem] font-bold uppercase tracking-[0.08em] text-slate-500">
                            {roomLabel(roomKey(session))}
                          </span>
                        ) : null}
                        {session.track ? (
                          <span
                            className={`rounded-md px-2 py-1 text-[0.6rem] font-bold uppercase tracking-[0.08em] ${toneFor(
                              session.track,
                              trackTone,
                              trackPalette
                            )}`}
                          >
                            {session.track}
                          </span>
                        ) : null}
                        <span
                          className={`rounded-md px-2 py-1 text-[0.6rem] font-bold uppercase tracking-[0.08em] ${levelTone[session.level]}`}
                        >
                          {session.level}
                        </span>
                      </div>
                      <h3 className="m-0 text-[1.95rem] font-semibold leading-tight tracking-[-0.045em] text-slate-900 md:text-[1.8rem]">
                        <button
                          type="button"
                          onClick={() => modal.open(session.id)}
                          className="focus-ring rounded p-0 text-left font-[inherit] tracking-[inherit] text-inherit hover:underline"
                        >
                          {title}
                        </button>
                      </h3>
                      <div className="flex items-center gap-3 pt-2 text-sm text-slate-500">
                        {/* One avatar per speaker, overlapping for paired talks. */}
                        <span className="flex flex-none -space-x-3">
                          {lineup.map((person, personIndex) => (
                            <SpeakerAvatar
                              key={session.speakerIds[personIndex] ?? personIndex}
                              meta={person}
                              className="h-11 w-11 text-xs ring-2 ring-white"
                            />
                          ))}
                        </span>
                        <div className="min-w-0">
                          <p className="m-0">
                            {lineup.map((person, personIndex) => (
                              <span key={session.speakerIds[personIndex] ?? personIndex}>
                                {personIndex > 0 ? ", " : ""}
                                {/* Only link out while /speakers is published —
                                    otherwise the route 404s and the anchor leads
                                    nowhere. */}
                                {features.speakers && person.slug ? (
                                  <Link
                                    href={`/speakers/${person.slug}`}
                                    className="focus-ring rounded font-semibold text-slate-600"
                                  >
                                    {person.name}
                                  </Link>
                                ) : (
                                  <span className="font-semibold text-slate-600">{person.name}</span>
                                )}
                              </span>
                            ))}
                          </p>
                          {/* Role on its own line under the name; paired talks list several names, so it's single-speaker only. */}
                          {speaker.subtitle && lineup.length === 1 ? (
                            <p className="m-0 mt-0.5 leading-snug">{speaker.subtitle}</p>
                          ) : null}
                        </div>
                      </div>
                      <AddToCalendar session={session} title={title} />
                    </div>
                    <button
                      type="button"
                      // Fixed label + aria-pressed: swapping the label would be
                      // announced as "Unsave, pressed".
                      aria-label={tAgenda("saveSessionAriaLabel", { title })}
                      aria-pressed={saved}
                      onClick={() => toggleSession(session.id)}
                      className={`focus-ring mt-2 flex-none rounded-lg p-2 transition-colors ${
                        saved ? "text-[#2b6cd4]" : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        className={`h-8 w-8 ${saved ? "fill-current" : "fill-none"}`}
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      >
                        <path d="M6 3.5A1.5 1.5 0 0 1 7.5 2h5A1.5 1.5 0 0 1 14 3.5v13.12c0 .69-.78 1.1-1.35.72L10 15.54l-2.65 1.8c-.57.38-1.35-.03-1.35-.72V3.5Z" />
                      </svg>
                    </button>
                  </div>
                </article>
              </div>
            </div>
          );
        })}

        {savedActive && !visible.length ? (
          <p className="text-sm text-slate-600">{tAgenda("savedHiddenByFilters", { count: saved.total })}</p>
        ) : null}
        {!savedActive && !hasTalks ? <p className="text-sm text-slate-600">{tAgenda("noSessionsMatch")}</p> : null}
      </div>
      <SessionDialog session={modal.session} onClose={modal.close} />
    </section>
  );
}
