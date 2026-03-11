import type { Speaker } from "@/src/types/content";
import { Card } from "@/src/components/ui/card";

type SpeakerCardProps = {
  speaker: Speaker;
  onOpen: () => void;
};

export function SpeakerCard({ speaker, onOpen }: SpeakerCardProps) {
  return (
    <Card as="article" className="h-full space-y-3" id={speaker.id}>
      <div>
        <h3 className="m-0 text-lg font-semibold">{speaker.name}</h3>
        <p className="m-0 text-sm text-gblue">
          {speaker.title} at {speaker.company}
        </p>
      </div>
      <p className="m-0 text-sm text-slate-700">{speaker.bioShort}</p>
      <button
        type="button"
        className="focus-ring rounded-md bg-gblue px-3 py-2 text-sm font-semibold text-white"
        onClick={onOpen}
      >
        View details
      </button>
    </Card>
  );
}
