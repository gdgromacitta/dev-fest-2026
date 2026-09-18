"use client";

import { useEffect, useState } from "react";
import type { Speaker } from "@/src/types/content";
import { speakers } from "@/src/content/speakers";
import { shuffle } from "@/src/lib/shuffle";
import { Link } from "@/src/i18n/navigation";

const ROWS = 3;

function splitIntoRows(items: Speaker[], rows: number): Speaker[][] {
  return Array.from({ length: rows }, (_, i) => items.filter((_, index) => index % rows === i));
}

function Row({ speakers: rowSpeakers }: { speakers: Speaker[] }) {
  if (rowSpeakers.length === 0) return null;

  return (
    <ul role="list" className="flex flex-wrap justify-center gap-6">
      {rowSpeakers.map((speaker) => (
        <li key={speaker.id}>
          <Link
            href={`/speakers#${speaker.id}`}
            className="focus-ring flex w-24 flex-col items-center gap-2 rounded-lg text-center"
          >
            {speaker.photo ? (
              <img src={speaker.photo} alt={`${speaker.name} portrait`} className="h-20 w-20 rounded-full object-cover" />
            ) : (
              <span aria-hidden="true" className="h-20 w-20 rounded-full border border-dashed border-line-strong bg-tint" />
            )}
            <span className="line-clamp-2 text-xs font-semibold text-ink">{speaker.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SpeakersCarousel() {
  // Starts in fetch order so server HTML and the first client render match,
  // then shuffles post-hydration (same pattern as ShuffledTeamGrid).
  const [ordered, setOrdered] = useState<Speaker[]>(speakers);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrdered(shuffle(speakers));
  }, []);

  const rows = splitIntoRows(ordered, ROWS);

  return (
    <div className="mt-11 space-y-6">
      {rows.map((row, index) => (
        <Row key={index} speakers={row} />
      ))}
    </div>
  );
}
