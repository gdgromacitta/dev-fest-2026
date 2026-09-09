import type { Sponsor } from "@/src/types/content";

/**
 * Sponsors and partners displayed on the landing page and the sponsors page.
 * Entries with a `tier` are grouped under that tier; entries with
 * `community: true` are non-monetary partners (swag, licences, etc.) shown
 * alongside the tiers rather than inside the paid ladder.
 *
 * Logo sources (current wordmarks, official):
 * - google.svg: Wikimedia Commons, "Google 2015 logo.svg" (public domain).
 * - jetbrains.svg: Wikimedia Commons, "JetBrains company logo.svg".
 * - seeweb.svg: seeweb.it site asset (/assets/images/logo-seeweb.svg).
 * - datwave.svg: datwave.ai site asset
 *   (/wp-content/uploads/2024/06/datwave-logo.svg).
 * Add a file to `public/logos/` and set `logo` to its filename to show a
 * real logo for any future entry — no code change required.
 */
export const sponsors: Sponsor[] = [
  { name: "Google", url: "https://google.com", tier: "main", logo: "google.svg" },
  { name: "Datwave", url: "https://datwave.ai", tier: "gold", logo: "datwave.svg" },
  { name: "Seeweb", url: "https://www.seeweb.it", tier: "silver", logo: "seeweb.svg" },
  { name: "JetBrains", url: "https://www.jetbrains.com", community: true, logo: "jetbrains.svg" }
];
