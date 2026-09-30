import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { cfpUrl } from "@/src/content/nav-links";
import { features } from "@/src/content/features";
import { speakers } from "@/src/content/speakers";
import { LegacyHashRedirect } from "@/src/components/speakers/legacy-hash-redirect";
import { SpeakersGrid } from "@/src/components/speakers/speakers-grid";
import { PageHero } from "@/src/components/layout/page-hero";

export const metadata: Metadata = {
  title: "Speakers | DevFest Roma",
  description: "DevFest Roma 2026 speakers will be announced in August, after the Call for Papers closes."
};

type Props = {
  params: Promise<{ locale: string }>;
};

// ponytail: static TBA grid per the restyling design — swap back to the
// SpeakersPageContent showcase once real speakers are announced in August.
const speakerSlots = [
  { label: "AI/ML", chip: "bg-primary-soft text-primary-deep" },
  { label: "Cloud", chip: "bg-accent-green-soft text-accent-green-deep" },
  { label: "Mobile", chip: "bg-accent-yellow-soft text-accent-yellow-deep" },
  { label: "Frontend", chip: "bg-accent-red-soft text-accent-red-deep" },
  { label: "AI/ML", chip: "bg-primary-soft text-primary-deep" },
  { label: "Cloud", chip: "bg-accent-green-soft text-accent-green-deep" },
  { label: "Mobile", chip: "bg-accent-yellow-soft text-accent-yellow-deep" },
  { label: "Backend", chip: "bg-accent-red-soft text-accent-red-deep" }
];

export default async function SpeakersPage({ params }: Props) {
  if (!features.speakers) notFound();
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "speakersPage" });

  return (
    <main>
      <LegacyHashRedirect />
      <PageHero id="speakers-heading" eyebrow={t("badge")} lines={[t("titleLine1"), t("titleLine2")]} srSuffix={t("heading")}>
        <p className="m-0 max-w-2xl text-lg text-muted">{t("intro")}</p>
      </PageHero>

      {/* Speaker grid */}
      <section aria-label={t("heading")}>
        <div className="mx-auto w-full max-w-[1440px] px-4 pb-12 md:px-16 md:pb-16">
          {speakers.length > 0 ? (
            <SpeakersGrid />
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
              {speakerSlots.map((slot, index) => (
                <div key={`${slot.label}-${index}`} className="flex flex-col items-center gap-3.5 text-center">
                  <span aria-hidden="true" className="h-[104px] w-[104px] rounded-full border border-dashed border-line-strong bg-tint" />
                  <div className="text-base font-semibold text-ink">{t("speakerTba")}</div>
                  <span className={`chip !px-3 !py-[5px] !text-xs ${slot.chip}`}>{slot.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CfP CTA tile */}
      <section aria-labelledby="speakers-cfp-heading">
        <div className="mx-auto w-full max-w-[1440px] px-4 pb-16 md:px-16 md:pb-24">
          <div className="bento-tile bg-ink text-white md:flex-row md:items-center md:justify-between">
            <div>
              <h2 id="speakers-cfp-heading" className="m-0 mb-1.5 text-2xl font-bold">{t("cfpTitle")}</h2>
              <p className="m-0 text-[15px] text-white/70">{t("cfpSubtext")}</p>
            </div>
            <a
              href={cfpUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="focus-ring inline-flex flex-none items-center justify-center self-start rounded-full bg-white px-8 py-4 text-base font-semibold text-ink transition-colors duration-200 hover:bg-tint md:self-auto"
            >
              {t("cfpCta")}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
