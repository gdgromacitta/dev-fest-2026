import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { venue } from "@/src/content/venue";
import { registerUrl, contactEmail } from "@/src/content/nav-links";
import { features } from "@/src/content/features";
import { PageHero } from "@/src/components/layout/page-hero";
import { VenuePartnerLogo } from "@/src/components/venue/venue-partner-logo";

export const metadata: Metadata = {
  title: "Venue | DevFest Roma",
  description: "Find venue details, map, transport, and accessibility information for DevFest Roma 2026."
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function VenuePage({ params }: Props) {
  if (!features.venue) notFound();
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "venue" });

  // Public-transport directions (directions.publicTransport in messages/*.json)
  // are sourced from Roma Tre's own "dove siamo" page for the STM department,
  // the same block as this venue: https://stm.uniroma3.it/dove-siamo/
  const howToCards = [
    {
      headingKey: "publicTransportHeading", bodyKey: "directions.publicTransport", color: "text-primary", iconBg: "bg-white", tile: "bg-primary-soft md:col-span-12 lg:col-span-6",
      icon: <><rect x="5" y="3" width="14" height="15" rx="3" /><path d="M5 10h14M12 3v7M8 18l-2 3m10-3 2 3M8 14h1m6 0h1" /></>
    },
    {
      headingKey: "parkingHeading", bodyKey: "directions.parking", color: "text-accent-red", iconBg: "bg-white", tile: "bg-accent-red-soft md:col-span-6 lg:col-span-3",
      icon: <><path d="m5 10 2-6h10l2 6M3 10h18v8H3zM5 18v3m14-3v3M6 14h2m8 0h2" /></>
    }
  ];

  return (
    <main>
      <PageHero id="venue-heading" eyebrow={t("badge")} lines={[t("titleLine1"), t("titleLine2")]} srSuffix={venue.name}>
        <address className="m-0 max-w-xl text-lg not-italic leading-relaxed text-muted">
          <strong className="font-semibold text-ink">{venue.name}</strong>
          <br />
          {venue.department}
          <br />
          {venue.entrances.map((entrance) => entrance.address).join(" · ")}, {venue.city}
        </address>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <a href="#venue-map" className="btn-primary">
            {t("seeEntrancesCta")}
          </a>
          <a href={registerUrl} className="btn-outline">
            {t("registerCta")}
          </a>
        </div>
      </PageHero>

      {/* Map + key details */}
      <section id="venue-map" aria-label={t("mapAriaLabel")} className="scroll-mt-[88px]">
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-2.5 px-4 pb-4 md:grid-cols-6 md:gap-3.5 md:px-16 lg:grid-cols-12">
          {/* One map per entrance: the keyless Google embed only takes a
              single pin. Side by side from sm, stacked on phones. */}
          <div className="grid min-w-0 grid-cols-1 gap-2.5 sm:grid-cols-2 md:col-span-6 md:gap-3.5 lg:col-span-7 lg:row-span-2">
            {venue.entrances.map((entrance) => (
              <figure key={entrance.address} className="m-0 flex min-w-0 flex-col overflow-hidden rounded-[22px] border border-line bg-white">
                <iframe
                  src={entrance.mapEmbedUrl}
                  className="block h-64 w-full border-0 sm:h-80 lg:h-auto lg:min-h-[22rem] lg:flex-1"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`DevFest Roma 2026 — ${entrance.address}`}
                  allowFullScreen
                />
                <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3">
                  <span className="text-[15px] font-semibold text-ink">{entrance.address}</span>
                  <a
                    href={entrance.mapsLinkUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="focus-ring rounded text-sm font-semibold text-primary hover:underline"
                  >
                    {t("openInMapsCta")}
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
          <dl className="bento-tile m-0 bg-accent-yellow text-ink md:col-span-3 lg:col-span-5">
            <div>
              <dt className="eyebrow">{t("dateLabel")}</dt>
              <dd className="bento-figure m-0 mt-3 !text-[2.75rem] md:!text-[3.5rem]">{t("notes.date")}</dd>
            </div>
            <div className="mt-auto">
              <dt className="eyebrow">{t("timeLabel")}</dt>
              <dd className="m-0 mt-1.5 font-display text-2xl font-bold tabular-nums">{t("notes.time")}</dd>
            </div>
          </dl>
          <div className="bento-tile bg-sand md:col-span-3 lg:col-span-5">
            <dl className="m-0">
              <dt className="eyebrow text-accent-red-deep">{t("entrancesLabel")}</dt>
              <dd className="m-0 mt-3 text-[15.5px] leading-relaxed text-ink">
                <span className="mb-1 block text-muted">{venue.department}</span>
                {venue.entrances.map((entrance) => (
                  <span key={entrance.address} className="block">
                    {entrance.address}
                  </span>
                ))}
                {venue.city}
              </dd>
            </dl>
            {/* Roma Tre's identity asks for a white surface around its mark. */}
            <VenuePartnerLogo label={t("venuePartnerLabel")} className="mt-auto self-start rounded-xl bg-white px-2 pt-2" />
          </div>
        </div>
      </section>

      {/* How to get here */}
      <section aria-labelledby="how-to-heading">
        <div className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-12 md:px-16 md:pb-24 md:pt-16">
          <h2 id="how-to-heading" className="scroll-mt-28 m-0 mb-6 text-3xl font-bold text-ink md:mb-8 md:text-4xl">
            {t("howToGetHereLabel")}
          </h2>
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-12 md:gap-3.5">
            {howToCards.map((card) => (
              <article key={card.headingKey} className={`bento-tile ${card.tile}`}>
                <div className={`flex h-[52px] w-[52px] items-center justify-center rounded-[14px] ${card.iconBg}`}>
                  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={`h-6 w-6 shrink-0 ${card.color}`}>
                    {card.icon}
                  </svg>
                </div>
                <h3 className="m-0 text-[21px] font-semibold text-ink">{t(card.headingKey)}</h3>
                <p className="m-0 text-[15px] leading-[1.7] text-ink/80">{t(card.bodyKey)}</p>
              </article>
            ))}
            <article className="bento-tile bg-accent-green-soft md:col-span-6 lg:col-span-3">
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-white">
                <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 shrink-0 text-accent-green">
                  <circle cx="12" cy="4" r="2" />
                  <path d="m4 9 8 2 8-2M12 11v5m0 0-4 6m4-6 4 6" />
                </svg>
              </div>
              <h3 className="m-0 text-[21px] font-semibold text-ink">{t("accessibilityHeading")}</h3>
              <p className="m-0 text-[15px] leading-[1.7] text-ink/80">
                {t("accessibility.info")} {t("accessibility.contactLabel")}{" "}
                <a href={`mailto:${contactEmail}`} className="focus-ring rounded-sm underline">
                  {contactEmail}
                </a>
                . {t("accessibility.commitment")}
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
