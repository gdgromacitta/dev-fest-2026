import React from "react";
import { afterEach, beforeEach, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import en from "@/messages/en.json";
import itMessages from "@/messages/it.json";
import SpeakerDetailPage, { generateMetadata, generateStaticParams } from "@/app/[locale]/speakers/[slug]/page";
import { features } from "@/src/content/features";
import { sessions } from "@/src/content/sessions";
import { speakers } from "@/src/content/speakers";
import { socialImage } from "@/src/content/social-image";
import { routing } from "@/i18n/routing";
import type { Session, Speaker } from "@/src/types/content";

globalThis.React = React;

const catalogues = { en, it: itMessages } as unknown as Record<string, Record<string, Record<string, unknown>>>;

// getTranslations() only resolves inside the Next RSC runtime; mock a minimal
// translator over the real catalogues (dotted keys, {var} interpolation, has()).
vi.mock("next-intl/server", () => ({
  setRequestLocale: () => {},
  getTranslations: async ({ locale, namespace }: { locale: string; namespace: string }) => {
    const dict = catalogues[locale][namespace] ?? {};
    const lookup = (key: string): string | undefined => {
      const [head, tail] = key.split(".");
      const entry = tail === undefined ? dict[head] : (dict[head] as Record<string, unknown> | undefined)?.[tail];
      return typeof entry === "string" ? entry : undefined;
    };
    const t = (key: string, values?: Record<string, string>) =>
      (lookup(key) ?? key).replace(/\{(\w+)\}/g, (_, name: string) => values?.[name] ?? "");
    t.has = (key: string) => lookup(key) !== undefined;
    return t;
  }
}));

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  }
}));

vi.mock("@/src/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: { href: string; children?: React.ReactNode }) =>
    React.createElement("a", { href, ...props }, children)
}));

const render = async (locale: string, slug: string) =>
  renderToStaticMarkup(await SpeakerDetailPage({ params: Promise.resolve({ locale, slug }) }));

const makeSpeaker = (over: Partial<Speaker>): Speaker => ({
  id: "test-speaker",
  slug: "test-speaker",
  name: "Test Speaker",
  title: "Engineer",
  company: "",
  photo: "",
  links: [],
  sessions: [],
  ...over
});

const added: { speakers: Speaker[]; sessions: Session[] } = { speakers: [], sessions: [] };
const addSpeaker = (s: Speaker) => {
  speakers.push(s);
  added.speakers.push(s);
};
const addSession = (s: Session) => {
  sessions.push(s);
  added.sessions.push(s);
};

beforeEach(() => {
  features.speakers = true;
});

afterEach(() => {
  for (const s of added.speakers) speakers.splice(speakers.indexOf(s), 1);
  for (const s of added.sessions) sessions.splice(sessions.indexOf(s), 1);
  added.speakers = [];
  added.sessions = [];
});

describe("generateStaticParams", () => {
  it("returns locales x speakers pairs when speakers is enabled", () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(routing.locales.length * speakers.length);
    expect(params).toContainEqual({ locale: "en", slug: speakers[0].slug });
    expect(params).toContainEqual({ locale: "it", slug: speakers[0].slug });
  });

  it("returns [] when speakers is disabled", () => {
    features.speakers = false;
    expect(generateStaticParams()).toEqual([]);
  });
});

describe("SpeakerDetailPage", () => {
  it("calls notFound for an unknown slug", async () => {
    await expect(render("en", "no-such-speaker")).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("renders name, role without a stray separator, photo placeholder and no sessions section", async () => {
    addSpeaker(makeSpeaker({ links: [{ label: "Web", url: "https://example.com" }] }));
    const html = await render("en", "test-speaker");
    expect(html).toContain("Test Speaker");
    expect(html).toContain(">Engineer<");
    expect(html).not.toContain(" at ");
    expect(html).toContain("speaker-photo-placeholder");
    expect(html).toContain('href="https://example.com"');
    expect(html).not.toContain("speaker-sessions-heading");
  });

  it("lists other speakers of a shared session, never linking to itself", async () => {
    addSpeaker(makeSpeaker({ id: "a", slug: "speaker-a", name: "Speaker A" }));
    addSpeaker(makeSpeaker({ id: "b", slug: "speaker-b", name: "Speaker B" }));
    addSession({
      id: "shared-session",
      start: "2026-10-10T10:15:00",
      end: "2026-10-10T11:00:00",
      track: "Web",
      room: "Room 1",
      level: "beginner",
      tags: [],
      speakerIds: ["a", "b"]
    });
    const html = await render("en", "speaker-a");
    expect(html).toContain('href="/speakers/speaker-b"');
    expect(html).not.toContain('href="/speakers/speaker-a"');
    expect(html).toContain('href="/agenda#shared-session"');
    expect(html).toContain("10:15");
    // No abstract key exists for this session: renders without throwing.
    expect(html).toContain("Room 1");
  });

  it("renders every real speaker in both locales without throwing", async () => {
    for (const locale of routing.locales) {
      for (const speaker of speakers) {
        await expect(render(locale, speaker.slug)).resolves.toContain(speaker.name);
      }
    }
  });
});

describe("generateMetadata", () => {
  it("builds title, capped description, canonical/alternates and photo image", async () => {
    const speaker = speakers.find((s) => s.photo) ?? speakers[0];
    const meta = await generateMetadata({ params: Promise.resolve({ locale: "it", slug: speaker.slug }) });
    expect(String(meta.title)).toContain(speaker.name);
    expect((meta.description ?? "").length).toBeLessThanOrEqual(160);
    expect(meta.alternates?.canonical).toBe(`/it/speakers/${speaker.slug}`);
    expect(meta.alternates?.languages).toEqual({
      it: `/it/speakers/${speaker.slug}`,
      en: `/en/speakers/${speaker.slug}`
    });
    expect(meta.openGraph?.images).toEqual([{ url: speaker.photo, alt: speaker.name }]);
  });

  it("falls back to the social image when there is no photo", async () => {
    addSpeaker(makeSpeaker({}));
    const meta = await generateMetadata({ params: Promise.resolve({ locale: "en", slug: "test-speaker" }) });
    expect(meta.openGraph?.images).toEqual([socialImage]);
  });
});

describe("speakerPage messages", () => {
  it("has the same keys in en and it", () => {
    expect(Object.keys(itMessages.speakerPage).sort()).toEqual(Object.keys(en.speakerPage).sort());
  });
});
