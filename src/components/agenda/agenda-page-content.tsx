"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { sessions } from "@/src/content/sessions";
import { defaultAgendaFilters, filterSessions } from "@/src/lib/agenda-filters";
import { FilterToolbar } from "@/src/components/agenda/filter-toolbar";
import { SessionList } from "@/src/components/agenda/session-list";
import { roomsFrom } from "@/src/lib/agenda-rooms";
import { PageHero } from "@/src/components/layout/page-hero";

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
    <>
      <PageHero id="agenda-heading" eyebrow={t("heading")} lines={[t("titleLine1"), t("titleLine2")]}>
        <p className="m-0 max-w-3xl text-lg leading-8 text-muted">{t("intro")}</p>
      </PageHero>
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-16 md:px-16 md:pb-24">
        <div className="space-y-10 rounded-[22px] bg-tint p-4 md:p-8">
          <FilterToolbar filters={filters} tracks={tracks} levels={levels} onFiltersChange={setFilters} />
          <SessionList sessions={visibleSessions} rooms={rooms} />
        </div>
      </div>
    </>
  );
}
