import { ShuffledTeamGrid } from "@/src/components/about/shuffled-team-grid";
import { CountdownTile } from "@/src/components/home/countdown-tile";
import { HeroHeadline } from "@/src/components/home/hero-headline";
import { SpeakersCarousel } from "@/src/components/home/speakers-carousel";
import { PastSponsorsMarquee } from "@/src/components/sponsors/past-sponsors-marquee";
import { SponsorLogo } from "@/src/components/sponsors/sponsor-logo";
import { VenuePartnerLogo } from "@/src/components/venue/venue-partner-logo";
import { features } from "@/src/content/features";
import { cfpUrl, registerUrl, sponsorFormUrl } from "@/src/content/nav-links";
import { pastSponsors } from "@/src/content/past-sponsors";
import { socialImage } from "@/src/content/social-image";
import { speakers } from "@/src/content/speakers";
import { sponsors } from "@/src/content/sponsors";
import { team } from "@/src/content/team";
import { venue } from "@/src/content/venue";
import { Link } from "@/src/i18n/navigation";
import type { Sponsor, SponsorTier } from "@/src/types/content";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "DevFest Roma 2026 — Home",
  description:
    "DevFest Roma 2026 by GDG Roma Città — A full-day developer conference on AI, Web, Cloud, and Mobile at Università degli Studi Roma Tre.",
  openGraph: {
    title: "DevFest Roma 2026",
    description: "Join GDG Roma Città for a day of talks, workshops, and community.",
    images: [{ ...socialImage, alt: "DevFest Roma 2026" }],
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
  { titleKey: "track1Title", topicsKey: "track1Topics", swatch: "bg-primary" },
  { titleKey: "track2Title", topicsKey: "track2Topics", swatch: "bg-accent-red" },
  { titleKey: "track3Title", topicsKey: "track3Topics", swatch: "bg-accent-green" }
];

const themeWords = [
  { key: "theme1", className: "text-primary" },
  { key: "theme2", className: "text-accent-red" },
  { key: "theme3", className: "text-accent-green" }
] as const;

/** Sponsor rows in the bento tile, highest tier first; logo bounds track the tier. */
const sponsorRows: { key: SponsorTier | "technical" | "community"; labelKey: string; logoSize: string }[] = [
  { key: "main", labelKey: "mainLabel", logoSize: "h-12 w-40" },
  { key: "platinum", labelKey: "platinumLabel", logoSize: "h-10 w-32" },
  { key: "gold", labelKey: "goldLabel", logoSize: "h-8 w-28" },
  { key: "silver", labelKey: "silverLabel", logoSize: "h-7 w-24" },
  { key: "bronze", labelKey: "bronzeLabel", logoSize: "h-6 w-20" },
  { key: "technical", labelKey: "technicalLabel", logoSize: "h-8 w-24" },
  { key: "community", labelKey: "communityLabel", logoSize: "h-8 w-24" }
];

const inRow = (sponsor: Sponsor, key: SponsorTier | "technical" | "community") =>
  key === "technical" ? Boolean(sponsor.technical) : key === "community" ? Boolean(sponsor.community) : !sponsor.community && sponsor.tier === key;

const speakerSlots = [
  { label: "AI/ML", chip: "bg-primary-soft text-primary-deep" },
  { label: "Cloud", chip: "bg-accent-green-soft text-accent-green-deep" },
  { label: "Mobile", chip: "bg-accent-yellow-soft text-accent-yellow-deep" },
  { label: "Frontend", chip: "bg-accent-red-soft text-accent-red-deep" }
];

/** Static export: the countdown ships with the day count as of the build. */
const builtAt = Date.now();

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
  const tPastSponsors = await getTranslations({ locale, namespace: "pastSponsors" });
  const tSponsorsPage = await getTranslations({ locale, namespace: "sponsorsPage" });
  const hasSponsors = sponsors.length > 0;
  const hasSpeakers = features.speakers && speakers.length > 0;
  const hasTracks = features.programTracks;

  return (
    <main className="pb-0">
      {/* ── 1. Hero — the title is the visual ─────────────────── */}
      {/* Title and meta share one grid cell: the meta sits beside the short
          second line on wide screens and stacks under it on phones. */}
      <section aria-labelledby="event-heading" data-section="event-info">
        <div className="mx-auto w-full max-w-[1440px] px-4 pb-7 pt-9 md:px-16 md:pb-12 md:pt-20">
          <div className="eyebrow mb-3 flex items-center gap-2.5 text-muted md:mb-6">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-primary" />
            {t("gdgBadge")}
          </div>
          <div className="grid">
            <h1
              id="event-heading"
              className="hero-title m-0 md:[grid-area:1/1]"
              data-event-title={t("eventTitle")}
            >
              <HeroHeadline>
                <span className="block">{t("heroLine1")}</span>
                <span className="block text-primary">{t("heroLine2")}</span>
              </HeroHeadline>
              <span className="sr-only"> {t("eventSubtitle")}</span>
            </h1>
            <div className="mt-6 grid max-w-[30ch] gap-3.5 md:mt-0 md:self-end md:justify-self-end md:pb-[1.2vw] md:[grid-area:1/1]">
              <p className="m-0 font-flex text-[clamp(1.15rem,2vw,1.6rem)] font-bold leading-[1.15] tracking-[-0.01em] text-ink [font-variation-settings:'wdth'_88,'opsz'_32]">
                <span data-event-date={t("eventDate")}>{t("heroWhen")}</span>
                <br />
                {t("heroTime")}
              </p>
              <p className="m-0 text-[15px] text-muted" data-event-location={t("eventLocation")}>
                {t("heroSummary")}
              </p>
              {features.agenda && (
                <Link href="/agenda" className="btn-outline self-start !px-6 !py-3 !text-sm">{t("agendaCta")}</Link>
              )}
              <div className="mt-1.5 flex gap-2">
                {heroBars.map((bar) => (
                  <span key={bar} aria-hidden="true" className={`h-1.5 w-9 rounded-[3px] ${bar}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. At a glance — bento grid ─────────────────────── */}
      {/* Spans are tuned so every row fills: 2 cols on phones, 6 on tablets, 12 on desktop. */}
      <section aria-labelledby="bento-heading" data-section="at-a-glance">
        <h2 id="bento-heading" className="sr-only">{t("bentoHeading")}</h2>
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-2 gap-2.5 px-4 py-10 md:grid-cols-6 md:gap-3.5 md:px-16 md:py-16 lg:grid-cols-12">
          {/* Theme */}
          <article
            aria-labelledby="theme-heading"
            className="theme-tile bento-tile col-span-2 justify-between gap-10 bg-tint md:col-span-6 lg:col-span-7 lg:row-span-2"
            data-bento-tile="theme"
          >
            <div className="eyebrow text-muted">{t("themeBadge")}</div>
            <h3
              id="theme-heading"
              className="theme-words m-0"
            >
              {themeWords.map((word) => (
                <span key={word.key} className={word.className}>{t(word.key)}</span>
              ))}
            </h3>
            <p className="m-0 max-w-[42ch] text-base text-muted">
              <strong className="font-semibold text-ink">{t("themeTagline")}</strong> {t("themeSubtext")}
            </p>
          </article>

          {/* Register */}
          <a
            href={registerUrl}
            className="bento-tile bento-link col-span-2 bg-primary text-white md:col-span-4 lg:col-span-5"
            data-bento-tile="register"
          >
            <div className="eyebrow">{t("registerBadge")}</div>
            <p className="bento-figure m-0">{t("registerCta")}</p>
            <p className="m-0 max-w-[34ch] text-white/90">{t("registerTileText")}</p>
            <span className="bento-go">{t("registerTileCta")}</span>
          </a>

          {/* Countdown */}
          <CountdownTile
            renderedAt={builtAt}
            className={hasSpeakers ? "col-span-1 md:col-span-2 lg:col-span-2" : "col-span-2 md:col-span-2 lg:col-span-5"}
          />

          {/* Speakers */}
          {hasSpeakers && (
            <Link
              href="/speakers"
              className={`bento-tile bento-link col-span-1 bg-accent-green-deep text-white lg:col-span-3 ${hasTracks ? "md:col-span-2" : "md:col-span-6"}`}
              data-bento-tile="speakers"
            >
              <p className="bento-figure m-0">{speakers.length}</p>
              <p className="m-0 font-semibold">{t("speakersTileLabel")}</p>
              <span aria-hidden="true" className="hidden -space-x-2.5 sm:flex">
                {speakers.filter((speaker) => speaker.photo).slice(0, 5).map((speaker) => (
                  <img
                    key={speaker.id}
                    src={speaker.photo}
                    alt=""
                    width={36}
                    height={36}
                    loading="lazy"
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-accent-green-deep"
                  />
                ))}
              </span>
              <span className="bento-go">{t("speakersTileCta")}</span>
            </Link>
          )}

          {/* Tracks */}
          {hasTracks && (
            <article
              aria-labelledby="program-heading"
              className={`bento-tile col-span-2 border border-line bg-white lg:col-span-5 ${hasSpeakers ? "md:col-span-4" : "md:col-span-6"}`}
              data-section="program"
            >
              <div className="eyebrow text-primary">{t("programBadge")}</div>
              <h3 id="program-heading" className="m-0 text-[1.75rem] font-bold leading-tight text-ink">
                {t("programHeading")}
              </h3>
              <ul role="list" className="m-0 list-none p-0">
                {tracks.map((track) => (
                  <li
                    key={track.titleKey}
                    className="grid grid-cols-[14px_1fr] gap-x-3.5 gap-y-1 border-t border-line py-3.5 last:border-b"
                  >
                    <span aria-hidden="true" className={`mt-1.5 h-3.5 w-3.5 rounded ${track.swatch}`} />
                    <span className="font-display text-xl font-semibold text-ink">{t(track.titleKey)}</span>
                    <span className="col-start-2 text-[14.5px] text-muted">{t(track.topicsKey)}</span>
                  </li>
                ))}
              </ul>
            </article>
          )}

          {/* Venue */}
          <article
            aria-labelledby="venue-heading"
            className={`bento-tile col-span-2 bg-sand md:col-span-6 ${hasTracks ? "lg:col-span-7" : "lg:col-span-12"}`}
            data-section="venue-summary"
          >
            <div className="eyebrow text-accent-red-deep">{t("venueBadge")}</div>
            <h3 id="venue-heading" className="m-0 text-[2.5rem] font-bold leading-none tracking-[-0.03em] text-ink md:text-[3.5rem]">
              {venue.name}
            </h3>
            <p className="m-0 max-w-[48ch] text-[15px] text-muted">
              {venue.address}, {venue.city}
            </p>
            <div
              role="img"
              aria-label={t("venueRouteLabel")}
              className="flex flex-wrap items-center gap-2.5 text-[13.5px] font-semibold text-ink"
            >
              <span aria-hidden="true" className="grid h-[26px] w-[26px] place-items-center rounded-full bg-primary font-display text-sm font-bold text-white">
                B
              </span>
              <span>{t("venueMetroStop")}</span>
              <span aria-hidden="true" className="min-w-8 flex-1 border-t-2 border-dashed border-line-strong" />
              <span className="text-xs font-medium text-muted">{t("venueWalk")}</span>
              <span aria-hidden="true" className="min-w-8 flex-1 border-t-2 border-dashed border-line-strong" />
              <span aria-hidden="true" className="h-3 w-3 rounded-full bg-accent-red" />
              <span>{t("venueStreet")}</span>
            </div>
            <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-2">
              <div className="flex flex-wrap gap-3">
                <Link href="/venue" className="btn-outline !bg-white !px-6 !py-3 !text-sm" data-venue-cta="true">
                  {t("venueDetailsCta")}
                </Link>
                <a href={venue.mapsLinkUrl} target="_blank" rel="noreferrer noopener" className="btn-outline !bg-white !px-6 !py-3 !text-sm">
                  {t("openInMapsCta")}
                </a>
              </div>
              {/* Roma Tre's identity asks for a white surface around its mark. */}
              <VenuePartnerLogo label={t("venuePartnerLabel")} className="rounded-xl bg-white px-2 pt-2" />
            </div>
          </article>

          {/* Sponsors */}
          <article
            aria-labelledby="sponsors-heading"
            className="bento-tile col-span-2 border border-line bg-white md:col-span-6 lg:col-span-8 lg:row-span-2"
            data-section="sponsors"
          >
            <div className="eyebrow text-accent-green-deep">{t("sponsorsCtaBadge")}</div>
            <h3 id="sponsors-heading" className="m-0 text-[1.75rem] font-bold leading-tight text-ink">
              {hasSponsors ? t("sponsorsHeading") : t("sponsorsCtaHeading")}
            </h3>
            {hasSponsors && (
              <div className="flex flex-col">
                {sponsorRows.map((row) => {
                  const rowSponsors = sponsors.filter((sponsor) => inRow(sponsor, row.key));
                  if (rowSponsors.length === 0) return null;
                  return (
                    <div
                      key={row.key}
                      className="grid gap-2 border-t border-line py-3.5 sm:grid-cols-[150px_1fr] sm:items-center sm:gap-4"
                    >
                      <span className="eyebrow text-muted">{tSponsorsPage(row.labelKey)}</span>
                      <ul role="list" className="m-0 flex list-none flex-wrap items-center gap-x-8 gap-y-3 p-0">
                        {rowSponsors.map((sponsor) => (
                          <li key={sponsor.name} className="max-w-full">
                            <a
                              href={sponsor.url}
                              target="_blank"
                              rel="noreferrer noopener"
                              className={`focus-ring flex max-w-full items-center justify-center rounded-md text-[15px] font-semibold text-ink ${row.logoSize}`}
                              data-sponsor-name={sponsor.name}
                              data-sponsor-tier={sponsor.tier}
                            >
                              <SponsorLogo sponsor={sponsor} className="h-full w-full" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </article>

          {/* Community */}
          {features.about ? (
            <Link
              href="/about"
              className="bento-tile bento-link col-span-2 bg-accent-red-deep text-white md:col-span-6 lg:col-span-4"
              data-bento-tile="community"
            >
              <p className="bento-figure m-0">{t("communityValue")}</p>
              <p className="m-0 max-w-[32ch]">{t("communityText")}</p>
              <span className="bento-go">{t("learnMoreCta")}</span>
            </Link>
          ) : (
            <div
              className="bento-tile col-span-2 bg-accent-red-deep text-white md:col-span-6 lg:col-span-4"
              data-bento-tile="community"
            >
              <p className="bento-figure m-0">{t("communityValue")}</p>
              <p className="m-0 max-w-[32ch]">{t("communityText")}</p>
            </div>
          )}

          {/* Become a sponsor — the page's single sponsor CTA */}
          <div
            className="bento-tile col-span-2 justify-between bg-ink text-white md:col-span-6 lg:col-span-4"
            data-bento-tile="sponsor-cta"
          >
            <div>
              {hasSponsors && <div className="mb-1.5 text-[22px] font-bold leading-tight">{t("sponsorsCtaHeading")}</div>}
              <p className="m-0 text-[15px] text-white/70">{t("sponsorsCtaDescription")}</p>
            </div>
            <a
              href={eventLinks.sponsorFormHref}
              target="_blank"
              rel="noreferrer noopener"
              className="focus-ring inline-flex items-center justify-center self-start whitespace-nowrap rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-tint"
              data-sponsor-cta="true"
            >
              {t("sponsorsCtaButton")}
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

      {/* ── 6. Speakers preview ──────────────────────────────── */}
      {features.speakersPreview && (
        <section aria-labelledby="speakers-heading" data-section="speakers-preview">
          <div className="mx-auto w-full max-w-[1440px] px-4 py-16 md:px-16 md:py-24">
            <div className="eyebrow mb-2.5 text-accent-red">{t("speakersBadge")}</div>
            <h2 id="speakers-heading" className="m-0 text-3xl font-bold text-ink md:text-[2.375rem]">
              {t("speakersHeading")}
            </h2>
            <p className="m-0 mt-3 max-w-xl text-base text-muted">{t("speakersSubtext")}</p>
            {speakers.length > 0 ? (
              <SpeakersCarousel />
            ) : (
              <div className="mt-11 grid grid-cols-2 gap-6 md:grid-cols-4">
                {speakerSlots.map((slot) => (
                  <div key={slot.label} className="flex flex-col items-center gap-3 text-center">
                    <span aria-hidden="true" className="h-24 w-24 rounded-full border border-dashed border-line-strong bg-tint" />
                    <div className="text-[15px] font-semibold text-ink">{t("speakerTba")}</div>
                    <span className={`chip !px-3 !py-[5px] !text-xs ${slot.chip}`}>{slot.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}


      {/* ── 6b. Past sponsors — "chi ha creduto in noi" ──────── */}
      <PastSponsorsMarquee sponsors={pastSponsors} heading={tPastSponsors("heading")} />

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
