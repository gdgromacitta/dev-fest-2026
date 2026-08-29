import type { Sponsor } from "@/src/types/content";

/**
 * Sponsors and partners displayed on the landing page and the sponsors page.
 * Entries with a `tier` are grouped under that tier; entries with
 * `community: true` are non-monetary partners (swag, licences, etc.) shown
 * alongside the tiers rather than inside the paid ladder.
 *
 * No logo assets exist yet for any entry below, so all of them render a
 * name-based placeholder. Add a file to `public/logos/` and set `logo` to
 * its filename to show a real logo — no code change required.
 */
export const sponsors: Sponsor[] = [
  { name: "Google", url: "https://google.com", tier: "main" },
  { name: "Bip", url: "https://bip.com", tier: "gold" },
  { name: "Seeweb", url: "https://www.seeweb.it", tier: "silver" },
  { name: "JetBrains", url: "https://www.jetbrains.com", community: true }
];
