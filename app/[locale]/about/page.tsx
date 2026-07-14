import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { aboutHero, aboutValues } from "@/src/content/about";
import { team } from "@/src/content/team";
import { TeamCard } from "@/src/components/about/team-card";
import { features } from "@/src/content/features";

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
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="bg-tint">
        <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-4 py-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:px-16 md:py-24">
          <div className="space-y-6">
            <div className="space-y-5">
              <h1 className="m-0 max-w-xl text-5xl font-bold leading-[1.05] text-ink md:text-[3.75rem]">
                {titleLine1}
                <br />
                <span className="text-primary">{titleLine2}</span>
              </h1>
              <p className="m-0 max-w-md text-lg leading-relaxed text-muted">{t("aboutDescription")}</p>
            </div>
            <div className="flex flex-wrap gap-3.5">
              <a href={aboutHero.primaryCta.href} className="btn-primary">
                {t("joinCta")}
              </a>
              <a href={aboutHero.secondaryCta.href} className="btn-outline">
                {t("manifestoCta")}
              </a>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[30rem]">
            <div className="overflow-hidden rounded-[20px] border border-line bg-white p-10">
              <img src={aboutHero.visual} alt="DevFest Roma" className="block h-auto w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────────────── */}
      <section aria-labelledby="team-heading">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-16 md:px-16 md:py-20">
          <h2 id="team-heading" className="m-0 mb-3 text-3xl font-bold text-ink md:text-4xl">
            {t("teamHeading")}
          </h2>
          <p className="m-0 max-w-2xl text-base text-muted">{t("teamSubtext")}</p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {team.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────── */}
      <section className="bg-tint">
        <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-4 py-16 text-center md:grid-cols-3 md:px-16 md:py-20">
          {aboutValues.map((value) => {
            const title = t(`value_${value.key}_title`);
            const description = t(`value_${value.key}_description`);

            return (
              <article key={value.key} data-about-value={title} className="mx-auto max-w-xs space-y-4">
                <div className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full ${value.soft}`}>
                  <span className={`h-3 w-3 rounded-full ${value.dot}`} />
                </div>
                <div className="space-y-3">
                  <h2 className="m-0 text-xl font-bold text-ink">{title}</h2>
                  <p className="m-0 text-[15px] leading-relaxed text-muted">{description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
