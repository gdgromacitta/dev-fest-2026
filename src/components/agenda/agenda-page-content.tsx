"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { sessions } from "@/src/content/sessions";
import { defaultAgendaFilters, filterSessions } from "@/src/lib/agenda-filters";
import { FilterToolbar } from "@/src/components/agenda/filter-toolbar";
import { SessionList } from "@/src/components/agenda/session-list";
import { roomsFrom } from "@/src/lib/agenda-rooms";

// Preferred display order; any track the data has that isn't listed here
// (Sessionize category names differ per event) is appended rather than dropped.
const trackOrder = ["Mobile", "Web", "Cloud", "AI"];
const tracks = [...new Set(sessions.map((session) => session.track).filter(Boolean))].sort(
  (a, b) => {
    const ia = trackOrder.indexOf(a);
    const ib = trackOrder.indexOf(b);
    return (ia === -1 ? trackOrder.length : ia) - (ib === -1 ? trackOrder.length : ib) || a.localeCompare(b);
  }
);
const levels = ["beginner", "intermediate", "advanced"] as const;
// Room columns, in the order the rooms first appear in the schedule. Derived
// from every session (not the filtered set) so the grid keeps its shape while
// filters narrow what's shown.
const rooms = roomsFrom(sessions);

export function AgendaPageContent() {
  const t = useTranslations("agenda");
  const [filters, setFilters] = useState(defaultAgendaFilters);
  const visibleSessions = useMemo(() => filterSessions(sessions, filters), [filters]);

  return (
    <div className="bg-[#f3f4f6] px-4 py-10 md:px-5 md:py-12">
      <div className="mx-auto max-w-5xl space-y-10">
        <section className="space-y-3">
          <h1 className="m-0 text-5xl font-semibold tracking-[-0.05em] text-slate-950">{t("heading")}</h1>
          <p className="m-0 max-w-4xl text-lg leading-8 text-slate-500">{t("intro")}</p>
        </section>
        <FilterToolbar filters={filters} tracks={tracks} levels={levels} onFiltersChange={setFilters} />
        <SessionList sessions={visibleSessions} rooms={rooms} />
      </div>
    </div>
  );
}
