import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { cfpUrl } from "@/src/content/nav-links";
import { features } from "@/src/content/features";

export const metadata: Metadata = {
  title: "Agenda | DevFest Roma",
  description: "Preview the DevFest Roma 2026 schedule — three parallel tracks, full program coming in September."
};

type Props = {
  params: Promise<{ locale: string }>;
};

// ponytail: static TBA schedule per the restyling design — swap back to the
// filterable AgendaPageContent once real sessions are published in September.
const trackChips = [
  { titleKey: "track1", chip: "bg-primary-soft text-primary-deep", header: "text-primary-deep" },
  { titleKey: "track2", chip: "bg-accent-red-soft text-accent-red-deep", header: "text-accent-red-deep" },
  { titleKey: "track3", chip: "bg-accent-green-soft text-accent-green-deep", header: "text-accent-green-deep" }
] as const;

const schedule: { time: string; labelKey: "registration" | "keynote" | "lunchBreak" | null }[] = [
  { time: "09:00", labelKey: "registration" },
  { time: "09:30", labelKey: "keynote" },
  { time: "10:30", labelKey: null },
  { time: "11:30", labelKey: null },
  { time: "13:00", labelKey: "lunchBreak" },
  { time: "14:00", labelKey: null }
];

export default async function AgendaPage({ params }: Props) {
  if (!features.agenda) notFound();
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "agenda" });

  const cell = "border-t border-line-soft px-4 py-6 text-[15px]";

  return (
    <main>
      {/* Hero */}
      <section className="bg-tint">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 py-16 md:px-16 md:py-[88px]">
          <div className="eyebrow text-primary">{t("badge")}</div>
          <h1 className="m-0 text-4xl font-bold leading-[1.1] text-ink md:text-[3.5rem]">{t("heading")}</h1>
          <p className="m-0 max-w-2xl text-lg text-muted">{t("intro")}</p>
          <div className="mt-2 flex flex-wrap gap-2.5">
            {trackChips.map((track) => (
              <span key={track.titleKey} className={`chip ${track.chip}`}>{t(track.titleKey)}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule grid */}
      <section aria-label={t("heading")}>
        <div className="mx-auto w-full max-w-[1440px] overflow-x-auto px-4 py-16 md:px-16 md:py-20">
          <div className="grid min-w-[840px] grid-cols-[120px_1fr_1fr_1fr] border-t border-line">
            <div className="py-5" />
            {trackChips.map((track) => (
              <div key={track.titleKey} className={`px-4 py-5 font-display text-base font-semibold ${track.header}`}>
                {t(track.titleKey)}
              </div>
            ))}
            {schedule.map((slot) => (
              <div key={slot.time} className="contents">
                <div className={`${cell} !px-0 text-sm font-semibold text-ink`}>{slot.time}</div>
                {slot.labelKey ? (
                  <div className={`${cell} col-span-3 text-muted`}>{t(slot.labelKey)}</div>
                ) : (
                  trackChips.map((track) => (
                    <div key={`${slot.time}-${track.titleKey}`} className={`${cell} text-faint`}>
                      {t("sessionTba")}
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CfP CTA strip */}
      <section aria-labelledby="agenda-cfp-heading" className="bg-tint">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-16 md:flex-row md:items-center md:justify-between md:px-16">
          <div>
            <h2 id="agenda-cfp-heading" className="m-0 mb-1.5 text-2xl font-bold text-ink">{t("cfpTitle")}</h2>
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
