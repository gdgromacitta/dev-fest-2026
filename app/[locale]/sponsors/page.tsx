import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { sponsors } from "@/src/content/sponsors";
import { pastSponsors } from "@/src/content/past-sponsors";
import { sponsorFormUrl } from "@/src/content/nav-links";
import { features } from "@/src/content/features";
import { SponsorLogo } from "@/src/components/sponsors/sponsor-logo";
import { PastSponsorsMarquee } from "@/src/components/sponsors/past-sponsors-marquee";
import { PageHero } from "@/src/components/layout/page-hero";
import type { Sponsor } from "@/src/types/content";

export const metadata: Metadata = {
  title: "Sponsors | DevFest Roma",
  description: "Meet the sponsors making DevFest Roma 2026 possible, and find out how to become one."
};

type Props = {
  params: Promise<{ locale: string }>;
};

// Per-tier accents from the restyling design (option 2e), laid out as one
// bento grid: higher tiers get wider, taller tiles.
const tiers: { tier: Sponsor["tier"]; labelKey: string; span: string; label: string; height: string; logo: string }[] = [
  { tier: "main", labelKey: "mainLabel", span: "md:col-span-6 lg:col-span-12", label: "text-accent-yellow-deep", height: "min-h-[240px]", logo: "h-20" },
  { tier: "platinum", labelKey: "platinumLabel", span: "md:col-span-6 lg:col-span-6", label: "text-accent-red", height: "min-h-[200px]", logo: "h-16" },
  { tier: "gold", labelKey: "goldLabel", span: "md:col-span-3 lg:col-span-3", label: "text-primary", height: "min-h-[200px]", logo: "h-12" },
  { tier: "silver", labelKey: "silverLabel", span: "md:col-span-3 lg:col-span-3", label: "text-accent-green", height: "min-h-[200px]", logo: "h-10" },
  { tier: "bronze", labelKey: "bronzeLabel", span: "md:col-span-2 lg:col-span-2", label: "text-accent-bronze", height: "min-h-[120px]", logo: "h-8" }
];

const benefits = [
  { key: "benefit1", dot: "bg-primary" },
  { key: "benefit2", dot: "bg-accent-red" },
  { key: "benefit3", dot: "bg-accent-yellow" },
  { key: "benefit4", dot: "bg-accent-green" }
];

export default async function SponsorsPage({ params }: Props) {
  if (!features.sponsors) notFound();
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "sponsorsPage" });
  const tPastSponsors = await getTranslations({ locale, namespace: "pastSponsors" });
  const hasSponsors = sponsors.length > 0;
  const communitySponsors = sponsors.filter((sponsor) => sponsor.community);

  return (
    <main>
      <PageHero id="sponsors-page-heading" eyebrow={t("badge")} lines={[t("titleLine1"), t("titleLine2")]}>
        <div className="max-w-2xl">
          <p className="m-0 font-display text-xl font-semibold text-ink md:text-2xl">
            {hasSponsors ? t("heroTitle") : t("emptyHeroTitle")}
          </p>
          <p className="m-0 mt-2 text-lg text-muted">
            {hasSponsors ? t("heroDescription") : t("emptyHeroDescription")}
          </p>
        </div>
        <a href={sponsorFormUrl} target="_blank" rel="noreferrer noopener" className="btn-primary self-start md:self-end">
          {hasSponsors ? t("becomeSponsorCta") : t("emptyBecomeSponsorCta")}
        </a>
      </PageHero>

      {/* Sponsor tiers */}
      <section aria-labelledby="sponsors-heading">
        <div className="mx-auto w-full max-w-[1440px] px-4 pb-16 md:px-16 md:pb-24">
          <h2 id="sponsors-heading" className="sr-only">
            {t("badge")}
          </h2>
          <ul role="list" className="m-0 grid list-none grid-flow-dense grid-cols-1 gap-2.5 p-0 md:grid-cols-6 md:gap-3.5 lg:grid-cols-12">
            {tiers.flatMap(({ tier, labelKey, span, label, height, logo }) =>
              sponsors
                .filter((sponsor) => sponsor.tier === tier)
                .map((sponsor) => (
                  <li key={sponsor.name} className={span}>
                    <a
                      href={sponsor.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={`bento-tile bento-link focus-ring h-full border border-line bg-white text-base font-semibold text-ink ${height}`}
                    >
                      <span className={`eyebrow ${label}`}>{t(labelKey)}</span>
                      <span className="flex flex-1 items-center justify-center py-4 text-center">
                        <SponsorLogo sponsor={sponsor} className={logo} />
                      </span>
                    </a>
                  </li>
                ))
            )}

            {/* Community & swag/licence partners — not part of the paid tier
                ladder, presented alongside it. Whether these eventually get
                their own group is an open decision (see `community` flag). */}
            {communitySponsors.map((sponsor) => (
              <li key={sponsor.name} className="md:col-span-3 lg:col-span-4">
                <a
                  href={sponsor.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="bento-tile bento-link focus-ring h-full min-h-[140px] bg-tint text-base font-semibold text-ink"
                >
                  <span className="eyebrow text-accent-gray-deep">{t("communityLabel")}</span>
                  <span className="flex flex-1 items-center justify-center py-3 text-center">
                    <SponsorLogo sponsor={sponsor} className="h-14" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Past sponsors — "chi ha creduto in noi", separate list, never inside a tier */}
      <PastSponsorsMarquee sponsors={pastSponsors} heading={tPastSponsors("heading")} />

      {/* Why sponsor + CTA */}
      <section aria-labelledby="why-sponsor-heading">
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-2.5 px-4 py-16 md:gap-3.5 md:px-16 md:py-24 lg:grid-cols-12">
          <div className="bento-tile bg-tint lg:col-span-7">
            <h2 id="why-sponsor-heading" className="m-0 mb-2 text-3xl font-bold text-ink md:text-[2.375rem]">
              {t("whyHeading")}
            </h2>
            <div className="flex flex-col gap-4">
              {benefits.map((benefit) => (
                <div key={benefit.key} className="flex items-start gap-3">
                  <span aria-hidden="true" className={`mt-[7px] h-[9px] w-[9px] flex-none rounded-full ${benefit.dot}`} />
                  <span className="text-[15.5px] text-ink">{t(benefit.key)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bento-tile justify-center bg-primary text-white lg:col-span-5">
            <div className="font-display text-2xl font-bold">{t("ctaCardTitle")}</div>
            <p className="m-0 text-[15px] leading-relaxed text-white/90">{t("ctaCardDescription")}</p>
            <a
              href={sponsorFormUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="focus-ring inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-[15px] font-semibold text-ink transition-colors duration-200 hover:bg-tint"
            >
              {t("ctaCardButton")}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
