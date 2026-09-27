import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { aboutHero, aboutValues } from "@/src/content/about";
import { team } from "@/src/content/team";
import { ShuffledTeamGrid } from "@/src/components/about/shuffled-team-grid";
import { features } from "@/src/content/features";
import { PageHero } from "@/src/components/layout/page-hero";

export const metadata: Metadata = {
  title: "About | DevFest Roma",
  description: "Learn about the GDG team organizing DevFest Roma."
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  if (!features.about) notFound();
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });

  // `aboutTitle` combines both heading lines separated by "\n" so the second
  // line can keep its accent color, mirroring the previous hardcoded markup.
  const [titleLine1, titleLine2] = t("aboutTitle").split("\n");

  return (
    <main>
      <PageHero
        id="about-heading"
        eyebrow={`${titleLine1} · ${titleLine2}`}
        lines={[t("titleLine1"), t("titleLine2")]}
      >
        <p className="m-0 max-w-2xl text-lg leading-relaxed text-muted">{t("aboutDescription")}</p>
        <img src={aboutHero.visual} alt="DevFest Roma" className="block h-14 w-auto md:h-16" />
      </PageHero>

      {/* ── Team ──────────────────────────────────────────────── */}
      <section aria-labelledby="team-heading">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-16 md:px-16 md:py-20">
          <h2 id="team-heading" className="m-0 mb-3 text-3xl font-bold text-ink md:text-4xl">
            {t("teamHeading")}
          </h2>
          <p className="m-0 max-w-2xl text-base text-muted">{t("teamSubtext")}</p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <ShuffledTeamGrid members={team} />
          </div>
        </div>
      </section>

      {/* ── Values — one bento row, each value on its own color ── */}
      <section>
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-2.5 px-4 pb-16 md:grid-cols-3 md:gap-3.5 md:px-16 md:pb-24">
          {aboutValues.map((value) => {
            const title = t(`value_${value.key}_title`);
            const description = t(`value_${value.key}_description`);

            return (
              <article key={value.key} data-about-value={title} className={`bento-tile min-h-[220px] ${value.soft}`}>
                <span aria-hidden="true" className={`h-3.5 w-3.5 rounded-full ${value.dot}`} />
                <h2 className="m-0 mt-auto font-flex text-[2rem] font-bold leading-none tracking-[-0.02em] text-ink">{title}</h2>
                <p className="m-0 text-[15px] leading-relaxed text-ink/80">{description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
