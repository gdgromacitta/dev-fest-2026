"use client";

import type { AgendaFilters } from "@/src/lib/agenda-filters";

type FilterToolbarProps = {
  filters: AgendaFilters;
  tracks: string[];
  levels: readonly AgendaFilters["level"][];
  onFiltersChange: (value: AgendaFilters) => void;
};

const trackChipTone: Record<string, string> = {
  Mobile: "bg-[#111827] text-white",
  Web: "bg-white text-slate-700",
  Cloud: "bg-white text-slate-700",
  AI: "bg-white text-slate-700"
};

const levelChipTone: Record<string, string> = {
  beginner: "text-slate-700",
  intermediate: "text-slate-700",
  advanced: "text-slate-700"
};

export function FilterToolbar({ filters, tracks, levels, onFiltersChange }: FilterToolbarProps) {
  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Tracks:</span>
        <button
          type="button"
          className={`focus-ring rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
            !filters.track ? "bg-[#4d8cff] text-white" : "bg-white text-slate-700"
          }`}
          onClick={() => onFiltersChange({ ...filters, track: "" })}
        >
          All Tracks
        </button>
        {tracks.map((track) => {
          const selected = filters.track === track;
          return (
            <button
              key={track}
              type="button"
              aria-pressed={selected}
              className={`focus-ring inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold transition-colors ${
                selected ? "bg-[#111827] text-white" : trackChipTone[track] ?? "bg-white text-slate-700"
              }`}
              onClick={() => onFiltersChange({ ...filters, track: selected ? "" : track })}
            >
              <span className={`h-2 w-2 rounded-full ${selected ? "bg-white" : "bg-slate-800"}`} />
              {track}
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Levels:</span>
        {levels.map((level) => {
          const selected = filters.level === level;
          return (
            <button
              key={level || "all"}
              type="button"
              aria-pressed={selected}
              className={`focus-ring rounded-full px-2 py-1 text-xs font-semibold capitalize transition-colors ${
                selected ? "bg-white text-slate-950 shadow-[0_1px_0_rgba(15,23,42,0.06)]" : levelChipTone[level ?? ""] ?? "text-slate-700"
              }`}
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  level: selected ? "" : level
                })
              }
            >
              {level}
            </button>
          );
        })}
      </div>
    </section>
  );
}
