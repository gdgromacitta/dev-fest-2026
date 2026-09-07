import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { venue } from "@/src/content/venue";
import { registerUrl, contactEmail } from "@/src/content/nav-links";
import { features } from "@/src/content/features";
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
    { headingKey: "publicTransportHeading", bodyKey: "directions.publicTransport", bar: "bg-primary" },
    { headingKey: "parkingHeading", bodyKey: "directions.parking", bar: "bg-accent-red" }
  ];

  return (
    <main>
      {/* Hero */}
      <section aria-labelledby="venue-heading" className="bg-tint">
        <div className="mx-auto grid w-full max-w-[1440px] items-center gap-10 px-4 py-16 md:px-16 md:py-[88px] lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="flex min-w-0 flex-col gap-5">
            <div className="eyebrow text-primary">{t("badge")}</div>
            <h1 id="venue-heading" className="m-0 max-w-3xl text-4xl font-bold leading-[1.1] text-ink md:text-[3.5rem]">
              {venue.name}
            </h1>
            <address className="m-0 max-w-xl text-lg not-italic leading-relaxed text-muted">
              {venue.address}
              <br />
              {venue.city}
            </address>
            <div className="mt-3 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a href={venue.mapsLinkUrl} target="_blank" rel="noreferrer noopener" className="btn-primary">
                {t("openInMapsCta")}
              </a>
              <a href={registerUrl} className="btn-outline">
                {t("registerCta")}
              </a>
            </div>
          </div>
          <VenuePartnerLogo prominent label={t("venuePartnerLabel")} className="justify-self-center lg:justify-self-end" />
        </div>
      </section>

      {/* Map + details */}
      <section aria-label={t("mapAriaLabel")}>
        <div className="mx-auto grid w-full max-w-[1440px] gap-14 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:px-16 md:py-24">
          <iframe
            src={venue.mapEmbedUrl}
            className="h-[28rem] w-full rounded-[20px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="DevFest Roma 2026 — Università degli Studi Roma Tre"
            allowFullScreen
          />
          <div className="flex flex-col justify-center gap-7">
            <div>
              <h2 className="m-0 mb-2 text-xl font-semibold text-ink">{t("addressLabel")}</h2>
              <p className="m-0 text-[15.5px] leading-relaxed text-muted">
                {venue.address}
                <br />
                {venue.city}
              </p>
            </div>
            <div>
              <h2 className="m-0 mb-2 text-xl font-semibold text-ink">{t("dateLabel")}</h2>
              <p className="m-0 text-[15.5px] leading-relaxed text-muted">{t("notes.date")}</p>
            </div>
            <div>
              <h2 className="m-0 mb-2 text-xl font-semibold text-ink">{t("timeLabel")}</h2>
              <p className="m-0 text-[15.5px] leading-relaxed text-muted">{t("notes.time")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to get here */}
      <section aria-labelledby="how-to-heading" className="bg-tint">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-16 md:px-16 md:py-24">
          <h2 id="how-to-heading" className="m-0 mb-11 text-3xl font-bold text-ink md:text-4xl">
            {t("howToGetHereLabel")}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {howToCards.map((card) => (
              <article key={card.headingKey} className="rounded-2xl bg-white p-7">
                <div aria-hidden="true" className={`mb-[18px] h-[5px] w-8 rounded-[3px] ${card.bar}`} />
                <h3 className="m-0 mb-2.5 text-[19px] font-semibold text-ink">{t(card.headingKey)}</h3>
                <p className="m-0 text-[14.5px] leading-[1.7] text-muted">{t(card.bodyKey)}</p>
              </article>
            ))}
            <article className="rounded-2xl bg-white p-7">
              <div aria-hidden="true" className="mb-[18px] h-[5px] w-8 rounded-[3px] bg-accent-green" />
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
