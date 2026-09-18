"use client";

import { useEffect, useState } from "react";
import type { Speaker } from "@/src/types/content";
import { speakers } from "@/src/content/speakers";
import { shuffle } from "@/src/lib/shuffle";
import { SpeakerCard } from "@/src/components/speakers/speaker-card";
import { SpeakerDialog } from "@/src/components/speakers/speaker-dialog";

export function SpeakersGrid() {
  const [openId, setOpenId] = useState<string | null>(null);
  // Starts in fetch order so server HTML and the first client render match,
  // then shuffles post-hydration (same pattern as ShuffledTeamGrid).
  const [ordered, setOrdered] = useState<Speaker[]>(speakers);
  const openSpeaker = ordered.find((speaker) => speaker.id === openId) ?? null;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrdered(shuffle(speakers));
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
        {ordered.map((speaker) => (
          <SpeakerCard key={speaker.id} speaker={speaker} onOpen={() => setOpenId(speaker.id)} />
        ))}
      </div>
      {openSpeaker && <SpeakerDialog speaker={openSpeaker} onClose={() => setOpenId(null)} />}
    </>
  );
}
