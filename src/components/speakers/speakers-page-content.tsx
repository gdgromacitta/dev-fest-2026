"use client";

import { featuredSpeaker, speakerShowcaseCards, speakerShowcaseTabs } from "@/src/content/speaker-showcase";

export function SpeakersPageContent() {
  return (
    <div className="bg-[#f3f4f6]">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-4 md:px-6 md:py-5">
        <section className="overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_65%_20%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_85%_10%,rgba(125,93,255,0.22),transparent_25%),linear-gradient(120deg,#20124d_0%,#2a145d_35%,#131a34_100%)] px-8 py-14 text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
          <div className="max-w-xl space-y-4">
            <h1 className="m-0 max-w-lg text-[3.3rem] font-semibold leading-[1.02] tracking-[-0.05em]">Meet our Featured Speakers</h1>
            <p className="m-0 max-w-lg text-base leading-7 text-white/75">
              Join industry leaders and community experts as they share insights on Web, Cloud, AI and Mobile development.
            </p>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-5 text-sm font-semibold text-slate-400">
              {speakerShowcaseTabs.map((tab, index) => (
                <button
                  key={tab}
                  type="button"
                  className={`focus-ring rounded-full transition-colors ${index === 0 ? "text-[#4d8cff]" : "text-slate-400 hover:text-slate-600"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="text-sm font-semibold text-slate-400">Sorted A-Z</div>
          </div>

          <div className="grid gap-5 md:grid-cols-4">
            {speakerShowcaseCards.map((speaker) => (
              <article
                key={speaker.name}
                data-showcase-speaker={speaker.name}
                className="space-y-4 rounded-2xl bg-white p-3 shadow-[0_1px_0_rgba(15,23,42,0.05)]"
              >
                <img src={speaker.photo} alt={`${speaker.name} portrait`} className="h-[14.5rem] w-full rounded-xl object-cover" />
                <div className="space-y-2 px-1 pb-1">
                  <div className="space-y-1">
                    <h2 className="m-0 text-[1.05rem] font-semibold tracking-[-0.03em] text-slate-900">{speaker.name}</h2>
                    <p className="m-0 text-sm font-medium text-[#6f95e8]">{speaker.role}</p>
                    <p className="m-0 text-sm text-slate-400">@ {speaker.company}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <button type="button" className="focus-ring rounded-full text-sm font-semibold text-slate-500">
                      View Bio
                    </button>
                    {speaker.selected ? (
                      <span className="rounded-full bg-[#e8f0ff] px-3 py-1 text-xs font-semibold text-[#4d8cff]">Selected</span>
                    ) : (
                      <span className="text-slate-300">→</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[1.8rem] bg-white p-5 shadow-[0_1px_0_rgba(15,23,42,0.05)]">
          <div className="grid gap-6 md:grid-cols-[18rem_minmax(0,1fr)]">
            <img src={featuredSpeaker.photo} alt={`${featuredSpeaker.name} portrait`} className="h-[19rem] w-full rounded-[1.3rem] object-cover" />
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="m-0 text-[2.1rem] font-semibold tracking-[-0.05em] text-slate-900">{featuredSpeaker.name}</h2>
                  <p className="m-0 text-base font-semibold text-[#7ea0ef]">{featuredSpeaker.title}</p>
                </div>
                <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold text-[#4d8cff]">{featuredSpeaker.badge}</span>
              </div>

              <div className="space-y-2">
                <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">About</p>
                <p className="m-0 max-w-3xl text-sm leading-7 text-slate-500">{featuredSpeaker.about}</p>
              </div>

              <div className="space-y-3">
                <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Scheduled Sessions</p>
                <div className="space-y-3">
                  {featuredSpeaker.sessions.map((session) => (
                    <div key={session.title} className="grid grid-cols-[4rem_minmax(0,1fr)_5rem] gap-4 border-t border-slate-100 pt-3 first:border-t-0 first:pt-0">
                      <div className="text-xs font-semibold uppercase leading-5 text-slate-400">{session.date}</div>
                      <div className="space-y-1">
                        <p className="m-0 text-sm font-semibold text-slate-900">{session.title}</p>
                        <p className="m-0 text-xs text-slate-400">{session.location}</p>
                      </div>
                      <div className="text-right text-xs font-semibold text-[#7ea0ef]">{session.anchor}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
