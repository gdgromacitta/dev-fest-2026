import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { cfpUrl } from "@/src/content/nav-links";
import { features } from "@/src/content/features";

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
      {/* Hero */}
      <section className="bg-tint">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 py-16 md:px-16 md:py-[88px]">
          <div className="eyebrow text-primary">{t("badge")}</div>
          <h1 className="m-0 text-4xl font-bold leading-[1.1] text-ink md:text-[3.5rem]">{t("heading")}</h1>
          <p className="m-0 max-w-2xl text-lg text-muted">{t("intro")}</p>
        </div>
      </section>

      {/* TBA grid */}
      <section aria-label={t("heading")}>
        <div className="mx-auto w-full max-w-[1440px] px-4 py-16 md:px-16 md:py-20">
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
            {speakerSlots.map((slot, index) => (
              <div key={`${slot.label}-${index}`} className="flex flex-col items-center gap-3.5 text-center">
                <span aria-hidden="true" className="h-[104px] w-[104px] rounded-full border border-dashed border-line-strong bg-tint" />
                <div className="text-base font-semibold text-ink">{t("speakerTba")}</div>
                <span className={`chip !px-3 !py-[5px] !text-xs ${slot.chip}`}>{slot.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CfP CTA strip */}
      <section aria-labelledby="speakers-cfp-heading" className="bg-tint">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-16 md:flex-row md:items-center md:justify-between md:px-16">
          <div>
            <h2 id="speakers-cfp-heading" className="m-0 mb-1.5 text-2xl font-bold text-ink">{t("cfpTitle")}</h2>
            <p className="m-0 text-[15px] text-muted">{t("cfpSubtext")}</p>
          </div>
          <a href={cfpUrl} target="_blank" rel="noreferrer noopener" className="btn-dark flex-none self-start md:self-auto">
            {t("cfpCta")}
          </a>
        </div>
      </section>
    </main>
  );
}
