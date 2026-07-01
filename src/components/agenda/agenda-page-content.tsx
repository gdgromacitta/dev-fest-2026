"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { sessions } from "@/src/content/sessions";
import { defaultAgendaFilters, filterSessions } from "@/src/lib/agenda-filters";
import { FilterToolbar } from "@/src/components/agenda/filter-toolbar";
import { SessionList } from "@/src/components/agenda/session-list";

const trackOrder = ["Mobile", "Web", "Cloud", "AI"];
const tracks = trackOrder.filter((track) => sessions.some((session) => session.track === track));
const levels = ["beginner", "intermediate", "advanced"] as const;

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
        <SessionList sessions={visibleSessions} />
      </div>
    </div>
  );
}
