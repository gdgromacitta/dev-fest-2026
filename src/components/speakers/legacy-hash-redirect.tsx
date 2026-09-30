"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { speakers } from "@/src/content/speakers";
import type { Speaker } from "@/src/types/content";

/**
 * Maps a legacy `/speakers#<uuid>` hash to the locale-prefixed speaker page
 * path, or null when the hash is empty or matches no speaker.
 */
export function resolveLegacySpeakerPath(
  hash: string,
  locale: string,
  list: readonly Pick<Speaker, "id" | "slug">[] = speakers
): string | null {
  const id = hash.replace(/^#/, "");
  if (!id) return null;
  const speaker = list.find((item) => item.id === id);
  if (!speaker) return null;
  // localePrefix is "always" (i18n/routing.ts), matching the emitted out/<locale>/speakers/<slug>.html.
  return `/${locale}/speakers/${speaker.slug}`;
}

// GitHub Pages has no server redirects, so legacy shared links are handled
// client-side. Renders nothing.
export function LegacyHashRedirect() {
  const locale = useLocale();

  useEffect(() => {
    const target = resolveLegacySpeakerPath(window.location.hash, locale);
    if (target) window.location.replace(target);
  }, [locale]);

  return null;
}
