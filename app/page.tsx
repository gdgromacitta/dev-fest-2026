import type { Metadata } from "next";
import Link from "next/link";
import { team } from "@/src/content/team";
import { sponsors } from "@/src/content/sponsors";
import { venue } from "@/src/content/venue";
import { TeamCard } from "@/src/components/about/team-card";

export const metadata: Metadata = {
  title: "DevFest 2026 · Roma — Home",
  description:
    "DevFest 2026 by GDG Roma Città — A full-day developer conference on AI, Web, Cloud, and Mobile at Università degli Studi Roma Tre.",
  openGraph: {
    title: "DevFest 2026 · Roma",
    description: "Join GDG Roma Città for a day of talks, workshops, and community.",
    type: "website"
  }
};

/** Canonical event info — swap real values here when confirmed. */
const eventInfo = {
  title: "DevFest 2026",
  subtitle: "Roma",
  date: "TBA",
  location: "Roma, Italy",
  description:
    "A full-day developer conference organized by GDG Roma Città — a community of 495+ developers passionate about technology and innovation. Talks, workshops, and networking across AI, Web, Cloud, and Mobile.",
  registerHref: "#",
  agendaHref: "/agenda"
} as const;

export default function HomePage() {
  const hasSponsors = sponsors.length > 0;

  return (
    <main className="space-y-20 pb-16">
      {/* ── 1. Event info ─────────────────────────────────────── */}
      <section
        aria-labelledby="event-heading"
        className="bg-white px-4 pt-12 pb-10 md:px-10 md:pt-20 md:pb-16"
        data-section="event-info"
      >
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-2">
            <span className="inline-flex rounded-full bg-[#e8f0fe] px-3 py-1 text-[0.64rem] font-semibold tracking-[0.16em] text-[#5f8ee7] uppercase">
              GDG Roma Città
            </span>
          </div>

          <h1
            id="event-heading"
            className="m-0 text-[3.4rem] font-semibold leading-[0.94] tracking-[-0.05em] text-slate-950 md:text-[4.5rem]"
            data-event-title={eventInfo.title}
          >
            {eventInfo.title}
            <br />
            <span className="text-[#4d8cff]">{eventInfo.subtitle}</span>
          </h1>

          <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-600">
            <span
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-[#f5f6f8] px-4 py-2"
              data-event-date={eventInfo.date}
            >
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#34a853]" />
              {eventInfo.date}
            </span>
            <span
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-[#f5f6f8] px-4 py-2"
              data-event-location={eventInfo.location}
            >
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#ea4335]" />
              {eventInfo.location}
            </span>
          </div>

          <p className="m-0 max-w-2xl text-lg leading-8 text-slate-500">{eventInfo.description}</p>

          <div className="flex flex-wrap gap-3">
            <a
              href={eventInfo.registerHref}
              className="focus-ring inline-flex rounded-lg bg-[#4d8cff] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(77,140,255,0.18)] transition-colors duration-200 hover:bg-[#3e7ff0]"
            >
              Register Now
            </a>
            <Link
              href={eventInfo.agendaHref}
              className="focus-ring inline-flex rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:border-slate-300 hover:text-slate-950"
            >
              View Agenda
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Sponsors — completely absent when array is empty ── */}
      {hasSponsors && (
        <section
          aria-labelledby="sponsors-heading"
          className="px-4 md:px-10"
          data-section="sponsors"
        >
          <div className="mx-auto max-w-4xl">
            <div className="rounded-[2.5rem] bg-[#f3f4f6] px-8 py-14">
              <div className="space-y-4 text-center">
                <h2
                  id="sponsors-heading"
                  className="m-0 text-[2rem] font-semibold tracking-[-0.04em] text-slate-900"
                >
                  Our Sponsors
                </h2>
                <div className="mx-auto h-1 w-16 rounded-full bg-[#fbbc04]" />
                <p className="mx-auto max-w-lg text-sm leading-6 text-slate-500">
                  DevFest is made possible thanks to the generous support of our partners.
                </p>
              </div>

              <ul
                role="list"
                className="mt-10 flex flex-wrap justify-center gap-4"
                aria-label="Sponsors list"
              >
                {sponsors.map((sponsor) => (
                  <li key={sponsor.name}>
                    <a
                      href={sponsor.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="focus-ring inline-flex items-center rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-800 shadow-[0_1px_0_rgba(15,23,42,0.05)] transition-colors duration-200 hover:border-slate-300 hover:text-slate-950"
                      data-sponsor-name={sponsor.name}
                      data-sponsor-tier={sponsor.tier}
                    >
                      {sponsor.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ── 3. Venue summary ─────────────────────────────────── */}
      <section
        aria-labelledby="venue-heading"
        className="px-4 md:px-10"
        data-section="venue-summary"
      >
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[2.5rem] bg-white px-8 py-14 shadow-[0_1px_0_rgba(15,23,42,0.05)] ring-1 ring-slate-100">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div className="space-y-4">
                <span className="inline-flex rounded-full bg-[#fce8e6] px-3 py-1 text-[0.64rem] font-semibold tracking-[0.16em] text-[#c5442b] uppercase">
                  Venue
                </span>
                <h2
                  id="venue-heading"
                  className="m-0 text-[2rem] font-semibold tracking-[-0.04em] text-slate-900"
                >
                  {venue.name}
                </h2>
                <p className="m-0 text-lg leading-8 text-slate-500">
                  {venue.address}
                  <br />
                  {venue.city}
                </p>
              </div>

              <div className="flex flex-col gap-3 md:items-end">
                <Link
                  href="/venue"
                  className="focus-ring inline-flex rounded-xl bg-[#eef4ff] px-6 py-3 text-sm font-semibold text-[#4d8cff] transition-colors duration-200 hover:bg-[#dce9ff]"
                  data-venue-cta="true"
                >
                  Venue details &amp; map
                </Link>
                <a
                  href={venue.mapsLinkUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="focus-ring inline-flex rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition-colors duration-200 hover:border-slate-300 hover:text-slate-900"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Meet the team ─────────────────────────────────── */}
      <section
        aria-labelledby="team-heading"
        className="px-4 md:px-10"
        data-section="meet-the-team"
      >
        <div className="mx-auto max-w-5xl">
          <div className="rounded-[2.5rem] bg-[#f3f4f6] px-8 py-14">
            <div className="space-y-4 text-center">
              <h2
                id="team-heading"
                className="m-0 text-[2.35rem] font-semibold tracking-[-0.04em] text-slate-900"
              >
                Meet the Organizers
              </h2>
              <div className="mx-auto h-1 w-16 rounded-full bg-[#4d8cff]" />
              <p className="mx-auto max-w-xl text-sm leading-6 text-slate-500">
                The passionate volunteers behind DevFest working to create an inclusive and high-impact experience for everyone.
              </p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {team.map((member) => (
                <TeamCard key={member.name} member={member} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/about"
                className="focus-ring inline-flex rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:border-slate-300 hover:text-slate-950"
              >
                Learn more about the team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
