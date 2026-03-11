import Link from "next/link";
import { getSessionsBySpeaker } from "@/src/lib/content";
import type { Speaker } from "@/src/types/content";

type SpeakerDialogProps = {
  speaker: Speaker;
  onClose: () => void;
};

export function SpeakerDialog({ speaker, onClose }: SpeakerDialogProps) {
  const speakerSessions = getSessionsBySpeaker(speaker.id);

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/35 p-4">
      <section role="dialog" aria-modal="true" aria-label={`${speaker.name} details`} className="flat-card max-w-xl space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="m-0 text-xl font-semibold">{speaker.name}</h2>
            <p className="m-0 text-sm text-slate-600">
              {speaker.title} at {speaker.company}
            </p>
          </div>
          <button type="button" className="focus-ring rounded-md border border-slate-300 px-3 py-1 text-sm" onClick={onClose}>
            Close
          </button>
        </div>
        <p className="m-0 text-sm text-slate-700">{speaker.bioLong}</p>
        <section>
          <h3 className="m-0 text-sm font-semibold uppercase text-slate-500">Sessions</h3>
          <ul className="mb-0 mt-2 space-y-1 pl-5">
            {speakerSessions.map((session) => (
              <li key={session.id}>
                <Link href={`/agenda#${session.id}`} className="focus-ring rounded text-sm font-semibold text-gblue">
                  {session.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </div>
  );
}
