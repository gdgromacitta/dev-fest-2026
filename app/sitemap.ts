import type { MetadataRoute } from "next";

import { features } from "@/src/content/features";
import { speakers } from "@/src/content/speakers";

const routes = [
  "/",
  "/about",
  ...(features.agenda ? ["/agenda"] : []),
  ...(features.speakers ? ["/speakers", ...speakers.map((speaker) => `/speakers/${speaker.slug}`)] : []),
  "/venue"
];
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({
    // Keep in sync with `metadataBase` in app/layout.tsx.
    url: `https://devfest2026.gdgromacitta.it${path}`,
    lastModified: new Date("2026-03-02")
  }));
}
