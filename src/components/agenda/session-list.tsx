import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Session } from "@/src/types/content";
import { speakers } from "@/src/content/speakers";

type SessionListProps = {
  sessions: Session[];
};

const trackTone: Record<Session["track"], string> = {
  AI: "bg-[#ddf6f6] text-[#6dbbb8]",
  Mobile: "bg-[#dbe8ff] text-[#6d9df5]",
  Web: "bg-[#ece9ff] text-[#7c6ce5]",
  Cloud: "bg-[#efe6ff] text-[#8b75de]"
};

const levelTone: Record<Session["level"], string> = {
  beginner: "bg-[#e0f3df] text-[#65a764]",
  intermediate: "bg-[#ebf7d9] text-[#7bb65b]",
  advanced: "bg-[#ffe5e4] text-[#f28c83]"
};

const roomTone: Record<Session["room"], string> = {
  "Main Hall": "bg-[#f3efe6] text-[#a39b8d]",
  "Room A": "bg-[#edf1f7] text-[#90a0b9]",
  "Room B": "bg-[#edf1f7] text-[#90a0b9]",
  "Room C": "bg-[#edf1f7] text-[#90a0b9]"
};

const formatSlot = (value: string) => {
  const date = new Date(value);
  let hours = date.getHours();
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  const meridiem = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return {
    time: `${`${hours}`.padStart(2, "0")}:${minutes}`,
    meridiem
  };
};

const getSpeakerMeta = (speakerId: string) => {
  const speaker = speakers.find((item) => item.id === speakerId);
  if (!speaker) {
    return { name: "TBA", subtitle: "Speaker to be announced", initials: "T" };
  }
  const initials = speaker.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
  return {
    name: speaker.name,
    subtitle: `${speaker.title}, ${speaker.company}`,
    initials
  };
};

export function SessionList({ sessions }: SessionListProps) {
  const tSessions = useTranslations("sessions");
  const tAgenda = useTranslations("agenda");

  return (
    <section className="space-y-6" aria-live="polite">
      {sessions.map((session, index) => {
        const slot = formatSlot(session.start);
        const speaker = getSpeakerMeta(session.speakerIds[0] ?? "");
        const title = tSessions(`${session.id}.title`);

        return (
          <div key={session.id} className="grid gap-4 md:grid-cols-[4.5rem_minmax(0,1fr)] md:items-start">
            <div className="space-y-1 pt-1 text-right">
              <p className="m-0 text-[1.75rem] font-semibold tracking-[-0.05em] text-slate-800">{slot.time}</p>
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{slot.meridiem}</p>
            </div>
            <div className="relative pl-6 before:absolute before:bottom-[-1.5rem] before:left-0 before:top-0 before:w-px before:bg-slate-200 before:content-['']">
              <article
                data-agenda-session={session.id}
                className={`rounded-2xl border bg-white px-5 py-4 shadow-[0_1px_0_rgba(15,23,42,0.04)] ${
                  index === 2 ? "border-[#8cb6ff] shadow-[inset_3px_0_0_0_#4d8cff]" : "border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <span className={`rounded-md px-2 py-1 text-[0.6rem] font-bold uppercase tracking-[0.08em] ${trackTone[session.track]}`}>
                        {session.track}
                      </span>
                      <span className={`rounded-md px-2 py-1 text-[0.6rem] font-bold uppercase tracking-[0.08em] ${levelTone[session.level]}`}>
                        {session.level}
                      </span>
                      <span className={`rounded-md px-2 py-1 text-[0.6rem] font-bold uppercase tracking-[0.08em] ${roomTone[session.room]}`}>
                        {session.room}
                      </span>
                    </div>
                    <h3 className="m-0 text-[1.95rem] font-semibold leading-tight tracking-[-0.045em] text-slate-900 md:text-[1.8rem]">
                      {title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f4d4b0] text-[0.65rem] font-semibold text-slate-700">
                        {speaker.initials}
                      </span>
                      <p className="m-0">
                        <Link href={`/speakers#${session.speakerIds[0] ?? ""}`} className="focus-ring rounded font-semibold text-slate-600">
                          {speaker.name}
                        </Link>
                        {`, ${speaker.subtitle}`}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={tAgenda("saveSessionAriaLabel", { title })}
                    className={`focus-ring mt-2 rounded-lg p-2 ${index === 2 ? "bg-[#e7f0ff] text-[#4d8cff]" : "text-slate-400"}`}
                  >
                    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 fill-current">
                      <path d="M6 3.5A1.5 1.5 0 0 1 7.5 2h5A1.5 1.5 0 0 1 14 3.5v13.12c0 .69-.78 1.1-1.35.72L10 15.54l-2.65 1.8c-.57.38-1.35-.03-1.35-.72V3.5Z" />
                    </svg>
                  </button>
                </div>
              </article>
            </div>
            {index === 2 ? (
              <>
                <div className="space-y-1 text-right">
                  <p className="m-0 text-[1.75rem] font-semibold tracking-[-0.05em] text-slate-800">12:00</p>
                  <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">PM</p>
                </div>
                <div className="relative pl-6">
                  <div className="rounded-2xl border border-dashed border-[#c8d8ff] bg-[#f7fbff] px-5 py-4 text-center text-lg font-semibold text-[#4d8cff]">
                    {tAgenda("lunchBreak")}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        );
      })}
      {!sessions.length ? <p className="text-sm text-slate-600">{tAgenda("noSessionsMatch")}</p> : null}
    </section>
  );
}
