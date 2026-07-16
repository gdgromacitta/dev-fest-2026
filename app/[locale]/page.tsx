import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { team } from "@/src/content/team";
import { sponsors } from "@/src/content/sponsors";
import { venue } from "@/src/content/venue";
import { registerUrl, cfpUrl, sponsorFormUrl } from "@/src/content/nav-links";
import { ShuffledTeamGrid } from "@/src/components/about/shuffled-team-grid";
import { features } from "@/src/content/features";

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

const heroBars = ["bg-primary", "bg-accent-red", "bg-accent-yellow", "bg-accent-green"];

const cfpTags = [
  { key: "cfpTag1", className: "bg-primary-soft text-primary-deep" },
  { key: "cfpTag2", className: "bg-accent-red-soft text-accent-red-deep" },
  { key: "cfpTag3", className: "bg-accent-green-soft text-accent-green-deep" },
  { key: "cfpTag4", className: "bg-accent-yellow-soft text-accent-yellow-deep" },
  { key: "cfpTag5", className: "bg-accent-gray-soft text-accent-gray-deep" }
];

const benefits = [
  { key: "benefit1", dot: "bg-primary" },
  { key: "benefit2", dot: "bg-accent-red" },
  { key: "benefit3", dot: "bg-accent-yellow" },
  { key: "benefit4", dot: "bg-accent-green" }
];

const tracks = [
  { titleKey: "track1Title", topicsKey: "track1Topics", bar: "bg-primary" },
  { titleKey: "track2Title", topicsKey: "track2Topics", bar: "bg-accent-red" },
  { titleKey: "track3Title", topicsKey: "track3Topics", bar: "bg-accent-green" }
];

const speakerSlots = [
  { label: "AI/ML", chip: "bg-primary-soft text-primary-deep" },
  { label: "Cloud", chip: "bg-accent-green-soft text-accent-green-deep" },
  { label: "Mobile", chip: "bg-accent-yellow-soft text-accent-yellow-deep" },
  { label: "Frontend", chip: "bg-accent-red-soft text-accent-red-deep" }
];

/** Register CTA, agenda, and sponsor form link targets — not translatable copy. */
const eventLinks = {
  registerHref: "https://gdg.community.dev/events/details/google-gdg-roma-citta-presents-devfest-roma-2026/",
  agendaHref: "/agenda",
  sponsorFormHref: sponsorFormUrl
} as const;

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const hasSponsors = sponsors.length > 0;

  return (
    <main className="pb-0">
      {/* ── 1. Hero ───────────────────────────────────────────── */}
      <section aria-labelledby="event-heading" className="bg-tint" data-section="event-info">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-4 py-16 md:px-16 md:py-24">
          <div className="eyebrow flex items-center gap-2.5 text-muted">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-primary" />
            {t("gdgBadge")}
          </div>
          <h1
            id="event-heading"
            className="m-0 max-w-4xl text-5xl font-bold leading-[1.05] text-ink md:text-[4.75rem]"
            data-event-title={t("eventTitle")}
          >
            {t("eventTitle")} <span className="text-primary">{t("eventSubtitle")}</span>
          </h1>
          <div className="flex flex-wrap gap-3.5 text-lg font-semibold text-ink md:text-xl">
            <span data-event-date={t("eventDate")}>{t("eventDate")}</span>
            <span aria-hidden="true" className="text-line-strong">·</span>
            <span data-event-location={t("eventLocation")}>{t("eventLocation")}</span>
          </div>
          <p className="m-0 max-w-2xl text-lg leading-relaxed text-muted">{t("eventDescription")}</p>
          <div className="mt-2 flex flex-wrap gap-3.5">
            <a href={registerUrl} className="btn-primary">{t("registerCta")}</a>
            {features.agenda && (
              <Link href="/agenda" className="btn-outline">{t("agendaCta")}</Link>
            )}
          </div>
          <div className="mt-4 flex gap-2.5">
            {heroBars.map((bar) => (
              <span key={bar} aria-hidden="true" className={`h-1.5 w-9 rounded-[3px] ${bar}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Venue strip ────────────────────────────────────── */}
      <section aria-labelledby="venue-heading" className="border-b border-line-soft" data-section="venue-summary">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-9 md:flex-row md:items-center md:justify-between md:px-16">
          <div>
            <div className="eyebrow mb-1.5 text-primary">{t("venueBadge")}</div>
            <h2 id="venue-heading" className="m-0 text-2xl font-semibold text-ink">{venue.name}</h2>
            <p className="m-0 mt-1 text-[15px] text-muted">
              {venue.address}, {venue.city}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/venue"
              className="btn-outline !px-6 !py-3 !text-sm"
              data-venue-cta="true"
            >
              {t("venueDetailsCta")}
            </Link>
            <a href={venue.mapsLinkUrl} target="_blank" rel="noreferrer noopener" className="btn-outline !px-6 !py-3 !text-sm">
              {t("openInMapsCta")}
            </a>
          </div>
        </div>
      </section>

      {/* ── 4. Call for Papers ───────────────────────────────── */}
      {/* Remove this section after July 31 2026 when CFP closes */}
      {features.cfp && (
        <section aria-labelledby="cfp-heading" data-section="cfp">
          <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-4 py-16 md:grid-cols-2 md:gap-[72px] md:px-16 md:py-24">
            <div>
              <div className="eyebrow mb-2.5 text-accent-red">{t("cfpBadge")}</div>
              <h2 id="cfp-heading" className="m-0 mb-4 text-3xl font-bold text-ink md:text-[2.375rem]">
                {t("cfpHeading")}
              </h2>
              <p className="m-0 mb-6 text-base leading-relaxed text-muted">{t("cfpDescription")}</p>
              <div className="mb-7 flex flex-wrap gap-2">
                {cfpTags.map((tag) => (
                  <span key={tag.key} className={`chip ${tag.className}`}>{t(tag.key)}</span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-5">
                <a href={cfpUrl} target="_blank" rel="noreferrer noopener" className="btn-dark">
                  {t("submitProposalCta")}
                </a>
                <span className="text-sm text-muted">
                  {t("cfpDeadlineLabel")} <strong className="text-ink">{t("cfpDeadlineDate")}</strong>
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-4 rounded-[20px] bg-tint p-9">
              {benefits.map((benefit) => (
                <div key={benefit.key} className="flex items-start gap-3">
                  <span aria-hidden="true" className={`mt-[7px] h-[9px] w-[9px] flex-none rounded-full ${benefit.dot}`} />
                  <span className="text-[15.5px] text-ink">{t(benefit.key)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 5. Program tracks ────────────────────────────────── */}
      {features.programTracks && (
        <section aria-labelledby="program-heading" className="bg-tint" data-section="program">
          <div className="mx-auto w-full max-w-[1440px] px-4 py-16 md:px-16 md:py-24">
            <div className="eyebrow mb-2.5 text-primary">{t("programBadge")}</div>
            <h2 id="program-heading" className="m-0 text-3xl font-bold text-ink md:text-[2.375rem]">
              {t("programHeading")}
            </h2>
            <p className="m-0 mt-3 max-w-xl text-base text-muted">{t("programSubtext")}</p>
            <div className="mt-11 grid gap-6 md:grid-cols-3">
              {tracks.map((track) => (
                <article key={track.titleKey} className="rounded-2xl bg-white p-7">
                  <div aria-hidden="true" className={`mb-[18px] h-[5px] w-8 rounded-[3px] ${track.bar}`} />
                  <h3 className="m-0 mb-3 text-xl font-semibold text-ink">{t(track.titleKey)}</h3>
                  <p className="m-0 text-[14.5px] leading-[1.9] text-muted">{t(track.topicsKey)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. Speakers preview ──────────────────────────────── */}
      {features.speakersPreview && (
        <section aria-labelledby="speakers-heading" data-section="speakers-preview">
          <div className="mx-auto w-full max-w-[1440px] px-4 py-16 md:px-16 md:py-24">
            <div className="eyebrow mb-2.5 text-accent-red">{t("speakersBadge")}</div>
            <h2 id="speakers-heading" className="m-0 text-3xl font-bold text-ink md:text-[2.375rem]">
              {t("speakersHeading")}
            </h2>
            <p className="m-0 mt-3 max-w-xl text-base text-muted">{t("speakersSubtext")}</p>
            <div className="mt-11 grid grid-cols-2 gap-6 md:grid-cols-4">
              {speakerSlots.map((slot) => (
                <div key={slot.label} className="flex flex-col items-center gap-3 text-center">
                  <span aria-hidden="true" className="h-24 w-24 rounded-full border border-dashed border-line-strong bg-tint" />
                  <div className="text-[15px] font-semibold text-ink">{t("speakerTba")}</div>
                  <span className={`chip !px-3 !py-[5px] !text-xs ${slot.chip}`}>{slot.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ── 6. Sponsors — tinted band between speakers and FAQ (design 1a) ── */}
      <section aria-labelledby="sponsors-heading" className="bg-tint" data-section="sponsors">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-16 md:px-16 md:py-24">
          {hasSponsors && (
            <>
              <div className="eyebrow mb-2.5 text-primary">{t("sponsorsCtaBadge")}</div>
              <h2 id="sponsors-heading" className="m-0 text-3xl font-bold text-ink md:text-[2.375rem]">
                {t("sponsorsHeading")}
              </h2>
              <ul role="list" className="m-0 mt-11 flex list-none flex-wrap gap-5 p-0" aria-label="Sponsors list">
                {sponsors.map((sponsor) => (
                  <li key={sponsor.name}>
                    <a
                      href={sponsor.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="focus-ring flex h-16 min-w-[180px] items-center justify-center rounded-[10px] border border-line bg-white px-6 text-[15px] font-semibold text-ink transition-colors duration-200 hover:border-line-strong"
                      data-sponsor-name={sponsor.name}
                      data-sponsor-tier={sponsor.tier}
                    >
                      {sponsor.name}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
          {/* Dark CTA banner from design 1a — always shown, sole sponsor CTA on the page */}
          <div className={`flex flex-col gap-6 rounded-[20px] bg-ink px-8 py-9 md:flex-row md:items-center md:justify-between md:px-10 ${hasSponsors ? "mt-11" : ""}`}>
            <div>
              {hasSponsors ? (
                <div className="mb-1.5 text-[22px] font-bold text-white">{t("sponsorsCtaHeading")}</div>
              ) : (
                <h2 id="sponsors-heading" className="m-0 mb-1.5 text-[22px] font-bold text-white">
                  {t("sponsorsCtaHeading")}
                </h2>
              )}
              <p className="m-0 text-[15px] text-white/70">{t("sponsorsCtaDescription")}</p>
            </div>
            <a
              href={eventLinks.sponsorFormHref}
              target="_blank"
              rel="noreferrer noopener"
              className="focus-ring inline-flex items-center justify-center self-start whitespace-nowrap rounded-full bg-white px-8 py-4 text-base font-semibold text-ink transition-colors duration-200 hover:bg-tint md:self-auto"
              data-sponsor-cta="true"
            >
              {t("sponsorsCtaButton")}
            </a>
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ───────────────────────────────────────────── */}
      {features.faq && (
        <section id="faq" aria-labelledby="faq-heading" data-section="faq">
          <div className="mx-auto w-full max-w-[1440px] px-4 py-16 md:px-16 md:py-24">
            <div className="max-w-[960px]">
              <div className="eyebrow mb-2.5 text-primary">{t("faqBadge")}</div>
              <h2 id="faq-heading" className="m-0 mb-8 text-3xl font-bold text-ink md:text-[2.375rem]">
                {t("faqHeading")}
              </h2>
              <div className="flex flex-col">
                {(["faq1", "faq2", "faq3"] as const).map((faq, index) => (
                  <div key={faq} className={`py-[22px] ${index < 2 ? "border-b border-line" : ""}`}>
                    <div className="mb-2 text-[17px] font-semibold text-ink">{t(`${faq}Question`)}</div>
                    <div className="text-[15px] leading-relaxed text-muted">{t(`${faq}Answer`)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 8. Meet the team ─────────────────────────────────── */}
      {features.team && (
        <section aria-labelledby="team-heading" className="bg-tint" data-section="meet-the-team">
          <div className="mx-auto w-full max-w-[1440px] px-4 py-16 md:px-16 md:py-24">
            <h2 id="team-heading" className="m-0 mb-3 text-3xl font-bold text-ink md:text-[2.375rem]">
              {t("teamHeading")}
            </h2>
            <p className="m-0 max-w-2xl text-base text-muted">{t("teamSubtext")}</p>
            <div className="mt-11 grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
              <ShuffledTeamGrid members={team} />
            </div>
            <div className="mt-10">
              <Link href="/about" className="btn-outline !px-6 !py-3 !text-sm">
                {t("learnMoreCta")}
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
