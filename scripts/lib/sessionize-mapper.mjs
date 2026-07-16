// Maps a Sessionize `view/All` API response onto this repo's Session/Speaker
// shape (src/types/content.ts). Pure functions, no I/O — see
// scripts/fetch-sessionize.mjs for the orchestration that calls these.

const LEVELS = ["beginner", "intermediate", "advanced"];

// TODO: Sessionize has no first-class "track"/"level"/"tags" concept — these
// map from Category titles the organizer configures in the Sessionize
// dashboard. Unknown until the event is set up there; adjust to match once
// known.
export const TRACK_CATEGORY_NAME = "Track";
export const LEVEL_CATEGORY_NAME = "Level";
export const TAG_CATEGORY_NAME = "Tags";

function categoryItemNamesByCategory(session, categories) {
  const itemIds = new Set(session.categoryItems ?? []);
  const byCategory = new Map();
  for (const category of categories ?? []) {
    const names = (category.categoryItems ?? [])
      .filter((item) => itemIds.has(item.id))
      .map((item) => item.name);
    if (names.length) byCategory.set(category.title, names);
  }
  return byCategory;
}

function normalizeLevel(rawNames) {
  const normalized = (rawNames ?? [])
    .map((name) => name.trim().toLowerCase())
    .find((name) => LEVELS.includes(name));
  return normalized ?? "intermediate";
}

export function mapSession(session, { rooms, categories }) {
  const room = (rooms ?? []).find((r) => r.id === session.roomId);
  const byCategory = categoryItemNamesByCategory(session, categories);
  const track = byCategory.get(TRACK_CATEGORY_NAME)?.[0] ?? "";
  const level = normalizeLevel(byCategory.get(LEVEL_CATEGORY_NAME));
  const tags = byCategory.get(TAG_CATEGORY_NAME) ?? (track ? [track] : []);

  return {
    id: String(session.id),
    start: session.startsAt,
    end: session.endsAt,
    track,
    room: room?.name ?? "",
    level,
    tags,
    speakerIds: (session.speakers ?? []).map(String)
  };
}

export function mapSpeaker(speaker, { sessionIdsBySpeakerId }) {
  return {
    id: String(speaker.id),
    name: speaker.fullName ?? `${speaker.firstName ?? ""} ${speaker.lastName ?? ""}`.trim(),
    title: speaker.tagLine ?? "",
    // ponytail: Sessionize has no separate "company" field (organizers often
    // bake it into tagLine, e.g. "Engineer @ Google") — left blank rather
    // than guessing via string-splitting. Add a real mapping if the
    // organizer sets up a custom question for it.
    company: "",
    photo: speaker.profilePicture ?? "",
    links: (speaker.links ?? []).map((link) => ({
      label: link.title || link.linkType || "Link",
      url: link.url
    })),
    sessions: sessionIdsBySpeakerId.get(String(speaker.id)) ?? [],
    // TODO: no clean mapping yet — revisit via `isTopSpeaker` or a
    // configured category once the organizer's Sessionize setup is known.
    keynote: false
  };
}

export function mapAll(apiResponse) {
  const rooms = apiResponse.rooms ?? [];
  const categories = apiResponse.categories ?? [];
  const sessions = (apiResponse.sessions ?? []).map((session) => mapSession(session, { rooms, categories }));

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
  for (const session of apiResponse.sessions ?? []) {
    sessionMessages[String(session.id)] = {
      title: session.title ?? "",
      abstract: session.description ?? ""
    };
  }

  const speakerMessages = {};
  for (const speaker of apiResponse.speakers ?? []) {
    // Sessionize only exposes one `bio` field — bioShort/bioLong both get
    // the same fetched text as-is (single-language, no separate summary).
    const bio = speaker.bio ?? "";
    speakerMessages[String(speaker.id)] = { bioShort: bio, bioLong: bio };
  }

  return { sessions, speakers, sessionMessages, speakerMessages };
}
