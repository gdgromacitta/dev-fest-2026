import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/src/i18n/navigation";
import { features } from "@/src/content/features";
import { socialImage } from "@/src/content/social-image";
import { speakers } from "@/src/content/speakers";
import { getCoSpeakers, getSessionsBySpeaker, getSpeakerBySlug } from "@/src/lib/content";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// Static export: every (locale, slug) pair must be known at build time.
export const dynamicParams = false;

export function generateStaticParams() {
  if (!features.speakers) return [];
  return routing.locales.flatMap((locale) => speakers.map((speaker) => ({ locale, slug: speaker.slug })));
}

const DESCRIPTION_MAX = 160;

const toDescription = (bio: string) => {
  const flat = bio.replace(/\s+/g, " ").trim();
  return flat.length <= DESCRIPTION_MAX ? flat : `${flat.slice(0, DESCRIPTION_MAX - 1).trimEnd()}…`;
};

const toParagraphs = (text: string) =>
  text
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const speaker = getSpeakerBySlug(slug);
  if (!features.speakers || !speaker) return {};
  const t = await getTranslations({ locale, namespace: "speakerPage" });
  const tSpeakers = await getTranslations({ locale, namespace: "speakers" });
  const title = t("metaTitle", { name: speaker.name });
  const bioKey = `${speaker.id}.bioLong`;
  const description = tSpeakers.has(bioKey) ? toDescription(tSpeakers(bioKey)) : undefined;
  const path = `/speakers/${speaker.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}${path}`]))
    },
    openGraph: {
      title,
      description,
      images: [speaker.photo ? { url: speaker.photo, alt: speaker.name } : socialImage]
    }
  };
}

export default async function SpeakerDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const speaker = features.speakers ? getSpeakerBySlug(slug) : undefined;
  if (!speaker) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "speakerPage" });
  const tSpeakers = await getTranslations({ locale, namespace: "speakers" });
  const tSessions = await getTranslations({ locale, namespace: "sessions" });

  const role =
    speaker.title && speaker.company
      ? t("roleWithCompany", { title: speaker.title, company: speaker.company })
      : speaker.title || speaker.company;
  const bioKey = `${speaker.id}.bioLong`;
  const paragraphs = tSpeakers.has(bioKey) ? toParagraphs(tSpeakers(bioKey)) : [];
  const speakerSessions = getSessionsBySpeaker(speaker.id).filter((session) => !session.isBreak);

  return (
    <main>
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-9 md:px-16 md:pb-24 md:pt-20">
        <Link href="/speakers" className="focus-ring rounded text-sm font-semibold text-primary hover:underline">
          {t("backToSpeakers")}
        </Link>

        <header className="mt-6 flex flex-col gap-6 md:flex-row md:items-center">
          {speaker.photo ? (
            <img src={speaker.photo} alt={speaker.name} className="h-40 w-40 flex-none rounded-full object-cover" />
          ) : (
            <span
              aria-hidden="true"
              data-testid="speaker-photo-placeholder"
              className="flex h-40 w-40 flex-none items-center justify-center rounded-full border border-dashed border-line-strong bg-tint text-5xl font-bold text-muted"
            >
              {speaker.name.charAt(0)}
            </span>
          )}
          <div>
            <h1 className="m-0 text-4xl font-bold text-ink md:text-6xl">{speaker.name}</h1>
            {role && <p className="m-0 mt-2 text-lg text-muted">{role}</p>}
          </div>
        </header>

        {paragraphs.length > 0 && (
          <section className="mt-10 max-w-3xl space-y-4">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="m-0 text-base leading-relaxed text-ink">
                {paragraph}
              </p>
            ))}
          </section>
        )}

        {speaker.links.length > 0 && (
          <section aria-labelledby="speaker-links-heading" className="mt-8">
            <h2 id="speaker-links-heading" className="sr-only">
              {t("linksHeading")}
            </h2>
            <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
              {speaker.links.map((link) => (
                <li key={`${link.label}-${link.url}`}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="focus-ring inline-flex rounded-full border border-line-strong px-4 py-2 text-sm font-semibold text-ink hover:bg-tint"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {speakerSessions.length > 0 && (
          <section aria-labelledby="speaker-sessions-heading" className="mt-12">
            <h2 id="speaker-sessions-heading" className="m-0 mb-6 text-2xl font-bold text-ink">
              {t("sessionsHeading")}
            </h2>
            <ul className="m-0 flex list-none flex-col gap-6 p-0">
              {speakerSessions.map((session) => {
                const abstractKey = `${session.id}.abstract`;
                const coSpeakers = getCoSpeakers(session.id, speaker.id);
                return (
                  <li key={session.id} className="bento-tile flex flex-col gap-3">
                    <h3 className="m-0 text-xl font-semibold text-ink">{tSessions(`${session.id}.title`)}</h3>
                    <dl className="m-0 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
                      <div className="flex gap-1">
                        <dt className="font-semibold">{t("time")}:</dt>
                        {/* Sessionize times are Europe/Rome wall-clock strings; slice HH:MM. */}
                        <dd className="m-0">
                          {session.start.slice(11, 16)}–{session.end.slice(11, 16)}
                        </dd>
                      </div>
                      <div className="flex gap-1">
                        <dt className="font-semibold">{t("room")}:</dt>
                        <dd className="m-0">{session.room}</dd>
                      </div>
                      {session.track && (
                        <div className="flex gap-1">
                          <dt className="font-semibold">{t("track")}:</dt>
                          <dd className="m-0">{session.track}</dd>
                        </div>
                      )}
                      <div className="flex gap-1">
                        <dt className="font-semibold">{t("level")}:</dt>
                        <dd className="m-0">{t(`level_${session.level}`)}</dd>
                      </div>
                    </dl>
                    {tSessions.has(abstractKey) && (
                      <div className="space-y-3">
                        {toParagraphs(tSessions(abstractKey)).map((p, index) => (
                          <p key={index} className="m-0 text-base leading-relaxed text-ink">
                            {p}
                          </p>
                        ))}
                      </div>
                    )}
                    {coSpeakers.length > 0 && (
                      <p className="m-0 text-sm text-muted">
                        {t("coSpeakersHeading")}:{" "}
                        {coSpeakers.map((co, index) => (
                          <span key={co.id}>
                            {index > 0 && ", "}
                            <Link href={`/speakers/${co.slug}`} className="focus-ring rounded font-semibold text-primary hover:underline">
                              {co.name}
                            </Link>
                          </span>
                        ))}
                      </p>
                    )}
                    <Link href={`/agenda#${session.id}`} className="focus-ring self-start rounded text-sm font-semibold text-primary hover:underline">
                      {t("viewInAgenda")}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
