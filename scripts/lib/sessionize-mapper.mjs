// Maps a Sessionize `view/All` API response onto this repo's Session/Speaker
// shape (src/types/content.ts). Pure functions, no I/O — see
// scripts/fetch-sessionize.mjs for the orchestration that calls these.
//
// The response shape is pinned by tests/fixtures/sessionize-view-all.json,
// captured verbatim from a real event. Two traps live in that shape:
//
//   * A *category* lists its options under `items`. The name `categoryItems`
//     also exists, but on a *session*, where it holds the selected option ids.
//     Reading `categoryItems` off a category silently yields nothing.
//   * Category titles are free text the organizer types into the Sessionize
//     dashboard ("Topic", "Level of the Talk", …) and differ per event, so
//     they are matched against a candidate list and overridable via env.

const LEVELS = ["beginner", "intermediate", "advanced"];

export const DEFAULT_LEVEL = "intermediate";

// Candidate category titles, matched case-insensitively. Override per event
// with SESSIONIZE_{TRACK,LEVEL,TAGS}_CATEGORY (comma-separated) — see
// scripts/fetch-sessionize.mjs.
export const DEFAULT_CATEGORY_TITLES = {
  track: ["Track", "Topic", "Argomento"],
  level: ["Level", "Level of the Talk", "Livello"],
  tags: ["Tags", "Tag"]
};

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

// A category's options live under `items`; older/other Sessionize views have
// been seen using `categoryItems`, so accept either.
function optionsOf(category) {
  return category.items ?? category.categoryItems ?? [];
}

function selectedNamesByCategory(session, categories) {
  const selectedIds = new Set(session.categoryItems ?? []);
  const byCategory = new Map();
  for (const category of categories ?? []) {
    const names = optionsOf(category)
      .filter((item) => selectedIds.has(item.id))
      .map((item) => item.name);
    if (names.length) byCategory.set(normalize(category.title), names);
  }
  return byCategory;
}

function namesFor(byCategory, candidateTitles) {
  for (const title of candidateTitles) {
    const names = byCategory.get(normalize(title));
    if (names?.length) return names;
  }
  return undefined;
}

// Real level options are plain ("Beginner"), but organizers also write things
// like "Beginner friendly" or "L1 - Advanced", so fall back to a substring hit.
function normalizeLevel(rawNames) {
  const names = (rawNames ?? []).map(normalize);
  return (
    names.find((name) => LEVELS.includes(name)) ??
    names.map((name) => LEVELS.find((level) => name.includes(level))).find(Boolean) ??
    DEFAULT_LEVEL
  );
}

export function mapSession(session, { rooms, categories, categoryTitles = DEFAULT_CATEGORY_TITLES }) {
  const room = (rooms ?? []).find((r) => r.id === session.roomId);
  const byCategory = selectedNamesByCategory(session, categories);
  // The track category is often multi-select ("AI/ML" + "Frontend"). `track`
  // takes the first for the chip and column, but the rest must survive into
  // `tags` — they feed the filter chips and the search haystack, and dropping
  // them makes those talks unfindable by their other topics.
  const trackNames = namesFor(byCategory, categoryTitles.track) ?? [];
  const track = trackNames[0] ?? "";
  const level = normalizeLevel(namesFor(byCategory, categoryTitles.level));
  const tags = namesFor(byCategory, categoryTitles.tags) ?? trackNames;

  return {
    id: String(session.id),
    start: session.startsAt,
    end: session.endsAt,
    track,
    room: room?.name ?? "",
    level,
    tags,
    speakerIds: (session.speakers ?? []).map(String),
    // Breaks/lunch/registration are flagged by the organizer in Sessionize.
    // The fallback for events that don't set the flag requires BOTH no
    // speaker and no room: a real talk whose speaker isn't confirmed yet
    // still has a room, and must not be turned into a break banner.
    isBreak: Boolean(session.isServiceSession) || ((session.speakers ?? []).length === 0 && !room?.name)
  };
}

export function mapSpeaker(speaker, { sessionIdsBySpeakerId }) {
  return {
    id: String(speaker.id),
    name: speaker.fullName ?? `${speaker.firstName ?? ""} ${speaker.lastName ?? ""}`.trim(),
    title: speaker.tagLine ?? "",
    // Sessionize has no separate "company" field (organizers often bake it
    // into tagLine, e.g. "Developer Relations @ Google") — left blank rather
    // than guessing via string-splitting. Add a real mapping if the organizer
    // sets up a custom question for it.
    company: "",
    photo: speaker.profilePicture ?? "",
    links: (speaker.links ?? []).map((link) => ({
      label: link.title || link.linkType || "Link",
      url: link.url
    })),
    sessions: sessionIdsBySpeakerId.get(String(speaker.id)) ?? [],
    keynote: Boolean(speaker.isTopSpeaker)
  };
}

// Sessions still being scheduled come back with `startsAt`/`endsAt` null.
// `Session.start`/`.end` are typed `string`, so emitting those would write
// `null` into src/content/sessions.ts and fail the build's type check —
// drop them instead and let the caller report the count.
function isScheduled(session) {
  return Boolean(session.startsAt) && Boolean(session.endsAt);
}

export function mapAll(apiResponse, { categoryTitles = DEFAULT_CATEGORY_TITLES } = {}) {
  // `sort` is the order the organizer arranged the rooms in the Sessionize
  // dashboard; the UI derives its tab order from the order rooms first appear
  // in this array, so emit sessions in that order rather than API order.
  const rooms = [...(apiResponse.rooms ?? [])].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
  const roomRank = new Map(rooms.map((room, index) => [room.id, index]));
  const categories = apiResponse.categories ?? [];

  const allSessions = apiResponse.sessions ?? [];
  const scheduled = allSessions.filter(isScheduled);
  const skippedUnscheduled = allSessions.length - scheduled.length;

  // Carry the room rank alongside each mapped session rather than looking the
  // source row up again inside the comparator.
  const sessions = scheduled
    .map((session) => ({
      mapped: mapSession(session, { rooms, categories, categoryTitles }),
      roomRank: roomRank.get(session.roomId) ?? Number.MAX_SAFE_INTEGER
    }))
    .sort((a, b) => a.mapped.start.localeCompare(b.mapped.start) || a.roomRank - b.roomRank)
    .map((entry) => entry.mapped);

  const sessionIdsBySpeakerId = new Map();
  for (const session of sessions) {
    for (const speakerId of session.speakerIds) {
      const list = sessionIdsBySpeakerId.get(speakerId) ?? [];
      list.push(session.id);
      sessionIdsBySpeakerId.set(speakerId, list);
    }
  }

  const speakers = (apiResponse.speakers ?? []).map((speaker) => mapSpeaker(speaker, { sessionIdsBySpeakerId }));

  const sessionMessages = {};
  for (const session of scheduled) {
    sessionMessages[String(session.id)] = {
      title: session.title ?? "",
      // Sessionize returns CRLF from its textarea inputs; normalize so the
      // generated JSON doesn't churn on \r.
      abstract: (session.description ?? "").replace(/\r\n/g, "\n")
    };
  }

  const speakerMessages = {};
  for (const speaker of apiResponse.speakers ?? []) {
    // Sessionize only exposes one `bio` field — bioShort/bioLong both get
    // the same fetched text as-is (single-language, no separate summary).
    const bio = (speaker.bio ?? "").replace(/\r\n/g, "\n");
    speakerMessages[String(speaker.id)] = { bioShort: bio, bioLong: bio };
  }

  return { sessions, speakers, sessionMessages, speakerMessages, skippedUnscheduled };
}
