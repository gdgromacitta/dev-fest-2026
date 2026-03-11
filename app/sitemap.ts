import type { MetadataRoute } from "next";

const routes = ["/", "/about", "/agenda", "/speakers", "/venue"];
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({
    url: `https://example.devfest.com${path}`,
    lastModified: new Date("2026-03-02")
  }));
}
