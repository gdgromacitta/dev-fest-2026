import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { team } from "@/src/content/team";
import { sponsors } from "@/src/content/sponsors";
import { venue } from "@/src/content/venue";
import { ShuffledTeamGrid } from "@/src/components/about/shuffled-team-grid";

export const metadata: Metadata = {
  title: "DevFest Roma 2026 — Home",
  description:
    "DevFest Roma 2026 by GDG Roma Città — A full-day developer conference on AI, Web, Cloud, and Mobile at Università degli Studi Roma Tre.",
  openGraph: {
    title: "DevFest Roma 2026",
    description: "Join GDG Roma Città for a day of talks, workshops, and community.",
    type: "website"
  }
};

type Props = {
  params: Promise<{ locale: string }>;
};

/** Register CTA and agenda link targets — not translatable copy. */
const eventLinks = {
  registerHref: "https://gdg.community.dev/events/details/google-gdg-roma-citta-presents-devfest-roma-2026/",
  agendaHref: "/agenda"
} as const;

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const hasSponsors = sponsors.length > 0;

  return (
    <main className="space-y-6 pb-16">
      {/* ── 1. Event info ─────────────────────────────────────── */}
      <section
        aria-labelledby="event-heading"
        className="px-4 md:px-10"
        data-section="event-info"
      >
        <div className="mx-auto max-w-4xl">
        <div className="rounded-[2.5rem] bg-white px-8 py-14 shadow-[0_1px_0_rgba(15,23,42,0.05)] ring-1 ring-slate-100">
        <div className="space-y-8">
          <div className="space-y-2">
            <span className="inline-flex rounded-full bg-[#e8f0fe] px-3 py-1 text-[0.64rem] font-semibold tracking-[0.16em] text-[#5f8ee7] uppercase">
              {t("gdgBadge")}
            </span>
          </div>

          <h1
            id="event-heading"
            className="m-0 text-[3.4rem] font-semibold leading-[0.94] tracking-[-0.05em] text-slate-950 md:text-[4.5rem]"
            data-event-title={t("eventTitle")}
          >
            {t("eventTitle")}
            <br />
            <span className="text-[#4d8cff]">{t("eventSubtitle")}</span>
          </h1>

          <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-600">
            <span
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-[#f5f6f8] px-4 py-2"
              data-event-date={t("eventDate")}
            >
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#34a853]" />
              {t("eventDate")}
            </span>
            <span
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-[#f5f6f8] px-4 py-2"
              data-event-location={t("eventLocation")}
            >
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#ea4335]" />
              {t("eventLocation")}
            </span>
          </div>

          <p className="m-0 max-w-2xl text-lg leading-8 text-slate-500">{t("eventDescription")}</p>

          <div className="flex flex-wrap gap-3">
            <a
              href={eventLinks.registerHref}
              className="focus-ring inline-flex rounded-lg bg-[#4d8cff] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(77,140,255,0.18)] transition-colors duration-200 hover:bg-[#3e7ff0]"
            >
              {t("registerCta")}
            </a>
            {/* Restore once agenda is live:
            <Link
              href={eventLinks.agendaHref}
              className="focus-ring inline-flex rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:border-slate-300 hover:text-slate-950"
            >
              View Agenda
            </Link>
            */}
          </div>
        </div>
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
                  {t("sponsorsHeading")}
                </h2>
                <div className="mx-auto h-1 w-16 rounded-full bg-[#fbbc04]" />
                <p className="mx-auto max-w-lg text-sm leading-6 text-slate-500">
                  {t("sponsorsDescription")}
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
                  {t("venueBadge")}
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
                  {t("venueDetailsCta")}
                </Link>
                <a
                  href={venue.mapsLinkUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="focus-ring inline-flex rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition-colors duration-200 hover:border-slate-300 hover:text-slate-900"
                >
                  {t("openInMapsCta")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Call for Papers ───────────────────────────────── */}
      {/* Remove this section after July 31 2026 when CFP closes */}
      <section
        aria-labelledby="cfp-heading"
        className="px-4 md:px-10"
        data-section="cfp"
      >
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[2.5rem] bg-white px-8 py-14 shadow-[0_1px_0_rgba(15,23,42,0.05)] ring-1 ring-slate-100">
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-[#e6f4ea] px-3 py-1 text-[0.64rem] font-semibold tracking-[0.16em] text-[#34a853] uppercase">
                {t("cfpBadge")}
              </span>
              <h2
                id="cfp-heading"
                className="m-0 text-[2rem] font-semibold tracking-[-0.04em] text-slate-900"
              >
                {t("cfpHeading")}
              </h2>
              <p className="m-0 max-w-2xl text-lg leading-8 text-slate-500">
                {t("cfpDescription")}
              </p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">{t("topicsHeading")}</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4d8cff]" />{t("topic1")}</li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4d8cff]" />{t("topic2")}</li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4d8cff]" />{t("topic3")}</li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4d8cff]" />{t("topic4")}</li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4d8cff]" />{t("topic5")}</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">{t("speakerBenefitsHeading")}</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#34a853]" />{t("benefit1")}</li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#34a853]" />{t("benefit2")}</li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#34a853]" />{t("benefit3")}</li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#34a853]" />{t("benefit4")}</li>
                </ul>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="https://sessionize.com/devfest-roma-2026/"
                target="_blank"
                rel="noreferrer noopener"
                className="focus-ring inline-flex rounded-lg bg-[#34a853] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(52,168,83,0.18)] transition-colors duration-200 hover:bg-[#2d9647]"
              >
                {t("submitProposalCta")}
              </a>
              <span className="text-sm text-slate-400">
                {t("cfpDeadlineLabel")} <strong className="text-slate-600">{t("cfpDeadlineDate")}</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Meet the team ─────────────────────────────────── */}
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
                {t("teamHeading")}
              </h2>
              <div className="mx-auto h-1 w-16 rounded-full bg-[#4d8cff]" />
              <p className="mx-auto max-w-xl text-sm leading-6 text-slate-500">
                {t("teamSubtext")}
              </p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <ShuffledTeamGrid members={team} />
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/about"
                className="focus-ring inline-flex rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:border-slate-300 hover:text-slate-950"
              >
                {t("learnMoreCta")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
