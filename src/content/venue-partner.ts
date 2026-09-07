import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Path to the Roma Tre venue-partner logo, or null if the asset isn't in
 * `public/logos/` yet. Checked at build time (this is a static export) so
 * dropping the SVG into `public/logos/roma-tre.svg` is enough to enable the
 * slot — no code change needed — and removing it degrades cleanly instead
 * of rendering a broken image.
 *
 * Roma Tre adopted a new visual identity on 2 December 2024 (Humus Design);
 * this is the current horizontal mark in institutional blue #002a61,
 * viewBox 930×204 (aspect ≈ 4.56:1). Vector source: the file published on
 * Wikimedia Commons from uniroma3.it (public domain, trademark applies):
 * https://commons.wikimedia.org/wiki/File:Roma_Tre_University_logo.svg
 * The updated identity manual is still "in preparation" on
 * https://www.uniroma3.it/ateneo/comunicazione/identita-visiva/ — until it
 * ships, keep the logo on a white surface with generous clear space.
 */
const LOGO_FILENAME = "roma-tre.svg";

export const venuePartnerLogoPath: string | null = existsSync(
  join(process.cwd(), "public", "logos", LOGO_FILENAME)
)
  ? `/logos/${LOGO_FILENAME}`
  : null;
