"use client";

import { useTranslations } from "next-intl";
import type { TeamMember } from "@/src/types/content";

type TeamCardProps = {
  member: TeamMember;
  /** Localised alt text for the portrait image. Defaults to "{name} portrait". */
  portraitAlt?: string;
};

export function TeamCard({ member, portraitAlt }: TeamCardProps) {
  const t = useTranslations("team");

  return (
    <article
      data-organizer-card={member.name}
      className="rounded-2xl border border-slate-100 bg-white px-5 py-6 text-center shadow-[0_1px_0_rgba(15,23,42,0.04)]"
    >
      <img
        src={member.photo}
        alt={portraitAlt ?? `${member.name} portrait`}
        width={84}
        height={84}
        className="mx-auto h-[84px] w-[84px] rounded-full object-cover"
      />
      <div className="mt-4 space-y-1">
        <h3 className="m-0 text-[1.02rem] font-semibold tracking-[-0.03em] text-slate-900">{member.name}</h3>
        <p className="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.08em]" style={{ color: member.accentColor ?? "#1a73e8" }}>
          {t(`${member.id}.role`)}
        </p>
        <p className="m-0 text-[0.78rem] leading-5 text-slate-500">{t(`${member.id}.bioShort`)}</p>
      </div>
      <div className="mt-4 flex items-center justify-center gap-3 text-slate-400">
        {member.links.map((link) => (
          <a
            key={`${member.name}-${link.label}`}
            href={link.url}
            aria-label={`${member.name} ${link.label}`}
            className="focus-ring rounded-full p-1 transition-colors duration-200 hover:text-slate-600"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current">
              <path d="M11.4 2a1 1 0 0 1 0 2h-4l7.3 7.3a1 1 0 0 1-1.4 1.4L6 5.4v4a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1h6.4Z" />
              <path d="M4 7a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" />
            </svg>
          </a>
        ))}
      </div>
    </article>
  );
}
