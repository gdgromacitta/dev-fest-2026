import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { venue } from "@/src/content/venue";
import { registerUrl, contactEmail } from "@/src/content/nav-links";
import { features } from "@/src/content/features";

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
      headingKey: "publicTransportHeading", bodyKey: "directions.publicTransport", color: "text-primary", iconBg: "bg-primary-soft",
      icon: <><rect x="5" y="3" width="14" height="15" rx="3" /><path d="M5 10h14M12 3v7M8 18l-2 3m10-3 2 3M8 14h1m6 0h1" /></>
    },
    {
      headingKey: "parkingHeading", bodyKey: "directions.parking", color: "text-accent-red", iconBg: "bg-accent-red-soft",
      icon: <><path d="m5 10 2-6h10l2 6M3 10h18v8H3zM5 18v3m14-3v3M6 14h2m8 0h2" /></>
    }
  ];

  return (
    <main>
      {/* Hero */}
      <section className="bg-tint">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 py-16 md:px-16 md:py-[88px]">
          <div className="eyebrow text-primary">{t("badge")}</div>
          <h1 className="m-0 max-w-4xl text-4xl font-bold leading-[1.1] text-ink md:text-[3.5rem]">
            {venue.name}
          </h1>
          <p className="m-0 max-w-2xl text-lg text-muted">
            {venue.address}, {venue.city}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-3.5">
            <a href={venue.mapsLinkUrl} target="_blank" rel="noreferrer noopener" className="btn-primary">
              {t("openInMapsCta")}
            </a>
            <a href={registerUrl} className="btn-outline">{t("registerCta")}</a>
          </div>
        </div>
      </section>

      {/* Map + key details */}
      <section aria-label={t("mapAriaLabel")}>
        <div className="mx-auto w-full max-w-[1440px] px-4 py-16 md:px-16 md:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <div className="min-w-0 overflow-hidden rounded-[20px] border border-line bg-white">
              <iframe
                src={venue.mapEmbedUrl}
                className="h-72 w-full border-0 sm:h-96 lg:h-[26rem]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="DevFest Roma 2026 — Università degli Studi Roma Tre"
                allowFullScreen
              />
            </div>
            <dl className="m-0 flex flex-col gap-7">
              <div>
                <dt className="font-display text-xl font-semibold text-ink">{t("addressLabel")}</dt>
                <dd className="m-0 mt-2 text-[15.5px] leading-relaxed text-muted">
                  {venue.address}
                  <br />
                  {venue.city}
                </dd>
              </div>
              <div>
                <dt className="font-display text-xl font-semibold text-ink">{t("dateLabel")}</dt>
                <dd className="m-0 mt-2 text-[15.5px] leading-relaxed text-muted">{t("notes.date")}</dd>
              </div>
              <div>
                <dt className="font-display text-xl font-semibold text-ink">{t("timeLabel")}</dt>
                <dd className="m-0 mt-2 text-[15.5px] leading-relaxed text-muted">{t("notes.time")}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* How to get here */}
      <section aria-labelledby="how-to-heading" className="bg-tint">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-16 md:px-16 md:py-24">
          <h2 id="how-to-heading" className="scroll-mt-28 m-0 mb-11 text-3xl font-bold text-ink md:text-4xl">
            {t("howToGetHereLabel")}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {howToCards.map((card) => (
              <article key={card.headingKey} className="rounded-2xl bg-white p-7">
                <div className={`mb-[18px] flex h-[52px] w-[52px] items-center justify-center rounded-[14px] ${card.iconBg}`}>
                  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={`h-6 w-6 shrink-0 ${card.color}`}>
                    {card.icon}
                  </svg>
                </div>
                <h3 className="m-0 mb-2.5 text-[19px] font-semibold text-ink">{t(card.headingKey)}</h3>
                <p className="m-0 text-[14.5px] leading-[1.7] text-muted">{t(card.bodyKey)}</p>
              </article>
            ))}
            <article className="rounded-2xl bg-white p-7">
              <div className="mb-[18px] flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-accent-green-soft">
                <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 shrink-0 text-accent-green">
                  <circle cx="12" cy="4" r="2" />
                  <path d="m4 9 8 2 8-2M12 11v5m0 0-4 6m4-6 4 6" />
                </svg>
              </div>
              <h3 className="m-0 mb-2.5 text-[19px] font-semibold text-ink">{t("accessibilityHeading")}</h3>
              <p className="m-0 text-[14.5px] leading-[1.7] text-muted">
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
