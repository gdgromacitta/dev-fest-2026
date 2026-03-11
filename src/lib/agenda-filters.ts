import type { Session, SessionLevel } from "@/src/types/content";

export type AgendaFilters = {
  track: string;
  level: SessionLevel | "";
  tags: string[];
  query: string;
};

export const defaultAgendaFilters: AgendaFilters = {
  track: "",
  level: "",
  tags: [],
  query: ""
};

export function filterSessions(items: Session[], filters: AgendaFilters) {
  const normalizedQuery = filters.query.trim().toLowerCase();
  return items.filter((session) => {
    if (filters.track && session.track !== filters.track) {
      return false;
    }
    if (filters.level && session.level !== filters.level) {
      return false;
    }
    if (filters.tags.length && !filters.tags.every((tag) => session.tags.includes(tag))) {
      return false;
    }
    if (normalizedQuery) {
      const haystack = `${session.title} ${session.abstract} ${session.tags.join(" ")}`.toLowerCase();
      if (!haystack.includes(normalizedQuery)) {
        return false;
      }
    }
    return true;
  });
}
