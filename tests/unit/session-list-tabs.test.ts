import React from "react";
import { vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";
import { SessionList } from "@/src/components/agenda/session-list";
import { UNASSIGNED_ROOM, roomsFrom, sessionsForRoom } from "@/src/lib/agenda-rooms";
import type { Session } from "@/src/types/content";
import messages from "@/messages/it.json";

globalThis.React = React;

vi.mock("@/src/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: { href: string; children?: React.ReactNode }) =>
    React.createElement("a", { href, ...props }, children)
}));

const ROOMS = ["Maria", "Anna", "Ludovica"];

const talk = (id: string, room: string, start: string, track = "AI/ML"): Session => ({
  id,
  start,
  end: start,
  track,
  room,
  level: "beginner",
  tags: [track],
  speakerIds: ["sp-1"]
});

const lunch: Session = {
  id: "break-1",
  start: "2026-10-10T13:00:00",
  end: "2026-10-10T14:00:00",
  track: "",
  room: "",
  level: "beginner",
  tags: [],
  speakerIds: [],
  isBreak: true
};

const schedule = [
  talk("a", "Maria", "2026-10-10T10:00:00"),
  talk("b", "Anna", "2026-10-10T10:00:00", "DevOps"),
  talk("c", "Ludovica", "2026-10-10T10:00:00", "Frontend"),
  lunch,
  talk("d", "Maria", "2026-10-10T14:00:00", "Other")
];

const render = (sessions: Session[], rooms: string[] | undefined = ROOMS) =>
  renderToStaticMarkup(
    React.createElement(NextIntlClientProvider, {
      locale: "it",
      messages,
      timeZone: "Europe/Rome",
      // Omit `rooms` entirely when undefined — passing it through would still
      // be an explicit prop and would not exercise the derive-from-data path.
      children: React.createElement(SessionList, rooms ? { sessions, rooms } : { sessions })
    })
  );

// A default parameter fires on `undefined`, so "no rooms prop" needs its own
// renderer rather than `render(sessions, undefined)`.
const renderDerivingRooms = (sessions: Session[]) =>
  renderToStaticMarkup(
    React.createElement(NextIntlClientProvider, {
      locale: "it",
      messages,
      timeZone: "Europe/Rome",
      children: React.createElement(SessionList, { sessions })
    })
  );

const cards = (html: string) => [...html.matchAll(/data-agenda-session="([^"]+)"/g)].map((m) => m[1]);
const breaks = (html: string) => [...html.matchAll(/data-agenda-break="([^"]+)"/g)].map((m) => m[1]);

describe("room partitioning", () => {
  test("each room tab shows only its own talks", () => {
    expect(sessionsForRoom(schedule, "Maria").map((s) => s.id)).toEqual(["a", "break-1", "d"]);
    expect(sessionsForRoom(schedule, "Anna").map((s) => s.id)).toEqual(["b", "break-1"]);
    expect(sessionsForRoom(schedule, "Ludovica").map((s) => s.id)).toEqual(["c", "break-1"]);
  });

  test("breaks belong to no room, so they appear under every tab", () => {
    for (const room of ROOMS) {
      expect(sessionsForRoom(schedule, room).map((s) => s.id)).toContain("break-1");
    }
  });

  test("orders each tab by start time", () => {
    const starts = sessionsForRoom(schedule, "Maria").map((s) => s.start);
    expect([...starts]).toEqual([...starts].sort());
  });

  test("an unknown room shows breaks only", () => {
    expect(sessionsForRoom(schedule, "Nowhere").map((s) => s.id)).toEqual(["break-1"]);
  });

  test("roomsFrom lists rooms in first-appearance order and excludes breaks", () => {
    expect(roomsFrom(schedule)).toEqual(ROOMS);
  });
});

describe("tabs", () => {
  test("renders one tab per room with a session count", () => {
    const html = render(schedule);
    const tabs = [...html.matchAll(/role="tab"/g)];
    expect(tabs).toHaveLength(3);
    for (const room of ROOMS) expect(html).toContain(room);
  });

  test("selects the first room by default and marks only it selected", () => {
    const html = render(schedule);
    expect((html.match(/aria-selected="true"/g) ?? [])).toHaveLength(1);
    expect(html).toMatch(/id="agenda-room-tab-maria-0"[^>]*aria-selected="true"/);
  });

  test("shows only the selected room's talks, plus breaks", () => {
    const html = render(schedule);
    expect(cards(html)).toEqual(["a", "d"]);
    expect(breaks(html)).toEqual(["break-1"]);
  });

  test("wires each tab to its panel for assistive tech", () => {
    const html = render(schedule);
    expect(html).toContain('role="tablist"');
    expect(html).toContain('role="tabpanel"');
    expect(html).toContain('aria-controls="agenda-room-panel-maria-0"');
    expect(html).toContain('aria-labelledby="agenda-room-tab-maria-0"');
  });

  test("uses roving tabindex so the tablist is a single tab stop", () => {
    const html = render(schedule);
    expect((html.match(/tabindex="0"/g) ?? [])).toHaveLength(1);
    expect((html.match(/tabindex="-1"/g) ?? [])).toHaveLength(2);
  });

  test("omits the tablist entirely for a single-room event", () => {
    const html = render([talk("a", "Solo", "2026-10-10T10:00:00")], ["Solo"]);
    expect(html).not.toContain('role="tablist"');
    expect(cards(html)).toEqual(["a"]);
  });

  test("derives rooms from the data when none are passed", () => {
    const html = renderDerivingRooms(schedule);
    expect([...html.matchAll(/role="tab"/g)]).toHaveLength(3);
  });

  test("reports no matches when filters empty the schedule", () => {
    expect(render([], ROOMS)).toContain(messages.agenda.noSessionsMatch);
  });
});

describe("breaks", () => {
  test("labels an untitled break neutrally, not as lunch", () => {
    const html = render(schedule);
    expect(html).toContain(messages.agenda.breakLabel);
    expect(html).not.toContain(messages.agenda.lunchBreak);
  });

  test("prefers the break's own translated title when there is one", () => {
    const titled: Session = { ...lunch, id: Object.keys(messages.sessions)[0]! };
    const html = render([talk("a", "Maria", "2026-10-10T10:00:00"), titled]);
    const entry = (messages.sessions as Record<string, { title: string }>)[titled.id]!;
    expect(html).toContain(entry.title.replace(/&/g, "&amp;").replace(/'/g, "&#x27;"));
  });
});

describe("break detection matches the mapper", () => {
  // scripts/lib/sessionize-mapper.mjs sets isBreak only when a session has
  // neither speaker nor room. The UI predicate must agree, or a talk awaiting
  // speaker confirmation becomes a break banner under every tab.
  const unconfirmed = (id: string, room: string): Session => ({
    ...talk(id, room, "2026-10-10T11:00:00"),
    speakerIds: [],
    isBreak: false
  });

  test("keeps a roomed, speaker-less talk in its own room tab", () => {
    const sessions = [talk("a", "Maria", "2026-10-10T10:00:00"), unconfirmed("tba", "Anna")];
    expect(sessionsForRoom(sessions, "Anna").map((s) => s.id)).toEqual(["tba"]);
    // Not duplicated into the other rooms the way a break would be.
    expect(sessionsForRoom(sessions, "Maria").map((s) => s.id)).toEqual(["a"]);
  });

  test("keeps such a room in the tab list", () => {
    expect(roomsFrom([talk("a", "Maria", "2026-10-10T10:00:00"), unconfirmed("tba", "Anna")])).toEqual([
      "Maria",
      "Anna"
    ]);
  });

  test("renders it as a session card, not a break banner", () => {
    const html = render([unconfirmed("tba", "Maria")], ["Maria"]);
    expect(cards(html)).toEqual(["tba"]);
    expect(breaks(html)).toEqual([]);
  });

  test("still infers a break when there is no room either", () => {
    const roomless: Session = { ...talk("x", "", "2026-10-10T12:00:00"), speakerIds: [], isBreak: undefined };
    expect(sessionsForRoom([talk("a", "Maria", "2026-10-10T10:00:00"), roomless], "Maria").map((s) => s.id)).toEqual([
      "a",
      "x"
    ]);
  });
});

describe("sessions with no room", () => {
  // mapSession leaves `room: ""` when Sessionize has no roomId, or points at
  // a room absent from the response. Such a talk is not a break, so it must
  // still reach a tab instead of silently vanishing from the agenda.
  const roomless = (id: string): Session => ({ ...talk(id, "", "2026-10-10T11:00:00"), isBreak: false });

  test("gets its own bucket rather than disappearing", () => {
    const sessions = [talk("a", "Maria", "2026-10-10T10:00:00"), roomless("orphan")];
    expect(roomsFrom(sessions)).toEqual(["Maria", UNASSIGNED_ROOM]);
    expect(sessionsForRoom(sessions, UNASSIGNED_ROOM).map((s) => s.id)).toEqual(["orphan"]);
  });

  test("appears in exactly one tab", () => {
    const sessions = [talk("a", "Maria", "2026-10-10T10:00:00"), roomless("orphan")];
    const tabsContaining = roomsFrom(sessions).filter((room) =>
      sessionsForRoom(sessions, room).some((s) => s.id === "orphan")
    );
    expect(tabsContaining).toEqual([UNASSIGNED_ROOM]);
  });

  test("every talk reaches some tab", () => {
    const sessions = [talk("a", "Maria", "2026-10-10T10:00:00"), roomless("orphan"), lunch];
    const reached = new Set(roomsFrom(sessions).flatMap((room) => sessionsForRoom(sessions, room).map((s) => s.id)));
    for (const session of sessions) expect(reached).toContain(session.id);
  });

  test("labels the bucket through messages, never as a raw sentinel", () => {
    // Needs a second room so the tablist renders at all.
    const html = renderDerivingRooms([talk("a", "Maria", "2026-10-10T10:00:00"), roomless("orphan")]);
    expect(html).toContain(messages.agenda.unassignedRoom);
    expect(html).not.toContain(UNASSIGNED_ROOM);
    expect(html).not.toContain("\u0000");
  });

  test("keeps the sentinel out of generated ids", () => {
    const html = renderDerivingRooms([talk("a", "Maria", "2026-10-10T10:00:00"), roomless("orphan")]);
    for (const id of [...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1])) {
      expect(id).toMatch(/^[a-z0-9-]+$/);
    }
  });
});

describe("filters that empty a room", () => {
  test("says so instead of rendering a lone break banner", () => {
    // Breaks bypass filters entirely (see filterSessions), so a room whose
    // talks are all filtered out would otherwise show just a break banner.
    const html = render([lunch], ["Maria", "Anna"]);
    expect(html).toContain(messages.agenda.noSessionsMatch);
    expect(breaks(html)).toEqual([]);
  });

  test("still renders breaks alongside talks when the room has any", () => {
    const html = render([talk("a", "Maria", "2026-10-10T10:00:00"), lunch], ["Maria"]);
    expect(cards(html)).toEqual(["a"]);
    expect(breaks(html)).toEqual(["break-1"]);
  });
});

describe("tab accessibility", () => {
  test("points aria-controls only at the panel that exists", () => {
    const html = render(schedule);
    const controls = [...html.matchAll(/aria-controls="([^"]+)"/g)].map((m) => m[1]);
    expect(controls).toEqual(["agenda-room-panel-maria-0"]);
    expect(html).toContain('id="agenda-room-panel-maria-0"');
  });

  test("does not wrap the swapped panel in a live region", () => {
    // A tabpanel announces itself on selection; a live region would re-read
    // the whole list on every arrow keypress.
    expect(render(schedule)).not.toMatch(/role="tabpanel"[^>]*aria-live/);
  });
});

describe("speaker links", () => {
  test("renders the speaker as plain text while /speakers is unpublished", () => {
    // features.speakers is off: linking to /speakers would 404, and the
    // page emits no per-speaker anchors to scroll to anyway.
    const html = render(schedule);
    expect(html).not.toContain('href="/speakers#');
  });
});

describe("co-speakers", () => {
  test("renders every speaker on a paired talk, not just the first", () => {
    const paired: Session = { ...talk("pair", "Maria", "2026-10-10T10:00:00"), speakerIds: ["sp-1", "sp-2"] };
    const html = render([paired], ["Maria"]);
    // Both fall back to the TBA name here (no matching content speakers), so
    // assert the count of rendered names rather than distinct strings.
    const names = html.split(messages.agenda.speakerTba).length - 1;
    expect(names).toBe(2);
  });
});

describe("generated ids", () => {
  test("stay unique when room names slugify identically", () => {
    const sessions = [
      talk("a", "Sala 1", "2026-10-10T10:00:00"),
      talk("b", "sala-1", "2026-10-10T10:00:00"),
      talk("c", "!!!", "2026-10-10T10:00:00")
    ];
    const html = renderDerivingRooms(sessions);
    const ids = [...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.length > 0)).toBe(true);
  });
});

describe("filter announcements", () => {
  test("announces the visible count instead of re-reading the list", () => {
    // FilterToolbar lives outside this component, so without a status region
    // a filter change would announce nothing at all.
    const html = render(schedule);
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
    // ...but not on the panel itself, which would re-read every card.
    expect(html).not.toMatch(/role="tabpanel"[^>]*aria-live/);
  });
});

describe("unknown track names", () => {
  test("never emits undefined into a class attribute", () => {
    // Sessionize category names differ per event; none of these are in the
    // designed colour map.
    expect(render(schedule)).not.toMatch(/class="[^"]*undefined/);
    expect(render(schedule, ["Anna"])).not.toMatch(/class="[^"]*undefined/);
  });

  test("assigns the same tone to the same track on every render", () => {
    expect(render(schedule)).toEqual(render(schedule));
  });

  test("omits the track chip when the track is blank", () => {
    const html = render([talk("a", "Maria", "2026-10-10T10:00:00", "")], ["Maria"]);
    expect(html).not.toMatch(/class="[^"]*undefined/);
    expect(cards(html)).toEqual(["a"]);
  });
});
