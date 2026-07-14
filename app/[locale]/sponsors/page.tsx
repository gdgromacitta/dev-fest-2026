import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { sponsors } from "@/src/content/sponsors";
import { sponsorEmail } from "@/src/content/nav-links";
import { features } from "@/src/content/features";
import type { Sponsor } from "@/src/types/content";

export const metadata: Metadata = {
  title: "Sponsors | DevFest Roma",
  description: "Meet the sponsors making DevFest Roma 2026 possible, and find out how to become one."
};

type Props = {
  params: Promise<{ locale: string }>;
};

const tiers: { tier: Sponsor["tier"]; labelKey: string; cols: string; dot: string }[] = [
  { tier: "gold", labelKey: "goldLabel", cols: "sm:grid-cols-2", dot: "bg-accent-yellow" },
  { tier: "silver", labelKey: "silverLabel", cols: "sm:grid-cols-3", dot: "bg-accent-gray-soft" },
  { tier: "bronze", labelKey: "bronzeLabel", cols: "sm:grid-cols-4", dot: "bg-accent-red" },
  { tier: "community", labelKey: "communityLabel", cols: "sm:grid-cols-4", dot: "bg-accent-green" }
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
  const hasSponsors = sponsors.length > 0;

  return (
    <main>
      {/* Hero */}
      <section className="bg-tint">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-4 px-4 py-16 text-center md:px-16 md:py-24">
          <div className="eyebrow text-primary">{t("badge")}</div>
          <h1 className="m-0 max-w-3xl text-4xl font-bold leading-[1.1] text-ink md:text-[3.5rem]">
            {t("heroTitle")}
          </h1>
          <p className="m-0 max-w-2xl text-lg text-muted">{t("heroDescription")}</p>
          <a href={`mailto:${sponsorEmail}`} className="btn-primary mt-2">
            {t("becomeSponsorCta")}
          </a>
        </div>
      </section>

      {/* Sponsor tiers */}
      <section aria-labelledby="sponsors-heading">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-16 md:px-16 md:py-24">
          <h2 id="sponsors-heading" className="sr-only">
            {t("badge")}
          </h2>
          {hasSponsors ? (
            <div className="flex flex-col gap-16">
              {tiers.map(({ tier, labelKey, cols }) => {
                const tierSponsors = sponsors.filter((sponsor) => sponsor.tier === tier);
                if (tierSponsors.length === 0) return null;

                return (
                  <div key={tier}>
                    <div className="eyebrow mb-7 text-muted">{t(labelKey)}</div>
                    <ul role="list" className={`m-0 grid list-none grid-cols-2 gap-5 p-0 ${cols}`}>
                      {tierSponsors.map((sponsor) => (
                        <li key={sponsor.name}>
                          <a
                            href={sponsor.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="focus-ring flex h-full items-center justify-center rounded-2xl border border-line bg-white p-7 text-center text-base font-semibold text-ink transition-colors duration-200 hover:border-line-strong"
                          >
                            {sponsor.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="m-0 text-center text-lg text-muted">{t("comingSoonNote")}</p>
          )}
        </div>
      </section>

      {/* Why sponsor + CTA */}
      <section aria-labelledby="why-sponsor-heading" className="bg-tint">
        <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-4 py-16 md:grid-cols-2 md:gap-[72px] md:px-16 md:py-24">
          <div>
            <h2 id="why-sponsor-heading" className="m-0 mb-5 text-3xl font-bold text-ink md:text-[2.375rem]">
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
          <div className="flex flex-col justify-center gap-4 rounded-[20px] bg-white p-9">
            <div className="text-xl font-semibold text-ink">{t("ctaCardTitle")}</div>
            <p className="m-0 text-[15px] leading-relaxed text-muted">{t("ctaCardDescription")}</p>
            <a href={`mailto:${sponsorEmail}`} className="btn-primary justify-center !text-[15px]">
              {sponsorEmail}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
