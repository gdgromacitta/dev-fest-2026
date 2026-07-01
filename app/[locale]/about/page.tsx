import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { aboutHero, aboutValues } from "@/src/content/about";
import { team } from "@/src/content/team";
import { TeamCard } from "@/src/components/about/team-card";

export const metadata: Metadata = {
  title: "About | DevFest Roma",
  description: "Learn about the GDG team organizing DevFest Roma."
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  // `aboutTitle` combines both heading lines separated by "\n" so the second
  // line can keep its accent color, mirroring the previous hardcoded markup.
  const [titleLine1, titleLine2] = t("aboutTitle").split("\n");

  return (
    <main className="space-y-16 pb-12">
      <section className="grid gap-12 px-4 pt-10 md:grid-cols-[1.05fr_0.95fr] md:items-center md:px-10 md:pt-14">
        <div className="max-w-[29rem] space-y-6">
          <span className="inline-flex rounded-full bg-[#e8f0fe] px-3 py-1 text-[0.64rem] font-semibold tracking-[0.16em] text-[#5f8ee7]">
            {t("eyebrow")}
          </span>
          <div className="space-y-4">
            <h1 className="m-0 max-w-sm text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-slate-950 md:text-[3.7rem]">
              {titleLine1}
              <br />
              <span className="text-[#4d8cff]">{titleLine2}</span>
            </h1>
            <p className="m-0 max-w-md text-[1rem] leading-7 text-slate-600">{t("aboutDescription")}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={aboutHero.primaryCta.href}
              className="focus-ring inline-flex rounded-lg bg-[#4d8cff] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(77,140,255,0.18)] transition-colors duration-200 hover:bg-[#3e7ff0]"
            >
              {t("joinCta")}
            </a>
            <a
              href={aboutHero.secondaryCta.href}
              className="focus-ring inline-flex rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:border-slate-300 hover:text-slate-950"
            >
              {t("manifestoCta")}
            </a>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[30rem]">
          <div className="overflow-hidden rounded-2xl bg-white p-10 shadow-[0_22px_36px_rgba(15,23,42,0.12)]">
            <img src={aboutHero.visual} alt="GDG Roma Città" className="block h-auto w-full" />
          </div>
        </div>
      </section>

      <section className="rounded-[2.5rem] bg-[#f3f4f6] px-4 py-16 md:px-6" aria-labelledby="team-heading">
        <div className="mx-auto max-w-5xl">
          <div className="space-y-4 text-center">
            <h2 id="team-heading" className="m-0 text-[2.35rem] font-semibold tracking-[-0.04em] text-slate-900">
              {t("teamHeading")}
            </h2>
            <div className="mx-auto h-1 w-16 rounded-full bg-[#4d8cff]" />
            <p className="mx-auto max-w-xl text-sm leading-6 text-slate-500">{t("teamSubtext")}</p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {team.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-2 md:px-8">
        <div className="grid gap-10 rounded-[2rem] bg-[#f3f4f6] px-8 py-14 text-center md:grid-cols-3">
          {aboutValues.map((value) => {
            const title = t(`value_${value.key}_title`);
            const description = t(`value_${value.key}_description`);

            return (
              <article key={value.key} data-about-value={title} className="mx-auto max-w-xs space-y-4">
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: `${value.color}26` }}>
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: value.color }} />
                </div>
                <div className="space-y-3">
                  <h2 className="m-0 text-xl font-semibold tracking-[-0.03em] text-slate-900">{title}</h2>
                  <p className="m-0 text-sm leading-6 text-slate-500">{description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
