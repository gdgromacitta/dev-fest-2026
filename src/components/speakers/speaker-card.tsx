"use client";

import { useTranslations } from "next-intl";
import type { Speaker } from "@/src/types/content";
import { Card } from "@/src/components/ui/card";

type SpeakerCardProps = {
  speaker: Speaker;
  onOpen: () => void;
};

export function SpeakerCard({ speaker, onOpen }: SpeakerCardProps) {
  const t = useTranslations("speakers");
  const tCard = useTranslations("speakerCard");

  return (
    <Card as="article" className="flex h-full flex-col gap-3" id={speaker.id}>
      {speaker.photo && (
        <img
          src={speaker.photo}
          alt={`${speaker.name} portrait`}
          className="h-40 w-full rounded-lg object-cover"
        />
      )}
      <div>
        <h3 className="m-0 text-lg font-semibold">{speaker.name}</h3>
        <p className="m-0 text-sm text-gblue">
          {speaker.title} at {speaker.company}
        </p>
      </div>
      <p className="m-0 line-clamp-4 text-sm text-slate-700">{t(`${speaker.id}.bioShort`)}</p>
      <div className="mt-auto flex justify-end pt-3">
        <button
          type="button"
          className="focus-ring rounded text-sm font-semibold text-gblue hover:underline"
          onClick={onOpen}
        >
          {tCard("viewDetails")}
        </button>
      </div>
    </Card>
  );
}
