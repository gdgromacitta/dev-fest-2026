"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/** Doors open 10 Oct 2026, 09:00 Europe/Rome (CEST, UTC+2). */
const EVENT_START = Date.UTC(2026, 9, 10, 7, 0, 0);
const EVENT_LENGTH_MS = 11 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

type Phase = { kind: "before"; days: number } | { kind: "today" } | { kind: "after" };

function phaseAt(now: number): Phase {
  const diff = EVENT_START - now;
  if (diff > 0) return { kind: "before", days: Math.ceil(diff / DAY_MS) };
  if (diff > -EVENT_LENGTH_MS) return { kind: "today" };
  return { kind: "after" };
}

type Props = {
  /** Server render time — the static HTML ships with the count as of the build. */
  renderedAt: number;
  className?: string;
};

export function CountdownTile({ renderedAt, className }: Props) {
  const t = useTranslations("home");
  // Hydrate with the build-time value so server and client markup match,
  // then refresh against the visitor's clock.
  const [now, setNow] = useState(renderedAt);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
  }, []);

  const phase = phaseAt(now);

  const value = phase.kind === "before" ? String(phase.days) : phase.kind === "today" ? "0" : "10.10";
  const label =
    phase.kind === "before"
      ? t("countdownLabel", { count: phase.days })
      : phase.kind === "today"
        ? t("countdownToday")
        : t("countdownPast");

  return (
    <div className={`bento-tile bg-accent-yellow text-ink ${className ?? ""}`} data-bento-tile="countdown">
      <p className="bento-figure m-0">{value}</p>
      <p className="m-0 font-semibold">{label}</p>
      <span className="mt-auto text-[12.5px] font-semibold uppercase tracking-[0.06em] tabular-nums">
        {t("countdownDate")}
      </span>
    </div>
  );
}
