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
 * - regolo.svg: regolo.ai site asset (/wp-content/themes/regolo/img/regolo-logo.svg).
 *   White lettering adapted to the site's ink color for light backgrounds.
 * - datwave.svg: datwave.ai site asset
 *   (/wp-content/uploads/2024/06/datwave-logo.svg).
 * - bc-soft.svg: provided directly by BC Soft (horizontal, positive variant).
 * - 42-roma.png: provided directly by 42 Roma (side layout, black variant).
 * - romajs.png: rasterised from the romajs.org site logo SVG (512x512).
 * - sharpcoding.png: sharpcoding.it site asset (/SharpCoding.Theme/img/core-img/logo.png), transparent.
 * - theredcode.png: theredcode.it site asset (/images/theRedCode_logo.webp), converted to PNG and scaled to 640px wide.
 * - pydata-roma-capitale.svg: pydataroma.python.it site asset
 *   (/theme/images/logos/pydata_roma_capitale_logo.svg), chapter logo.
 * - bacarotech.png: bacarotech.github.io site asset (/img/icon.png), 500x500, opaque navy background.
 * Add a file to `public/logos/` and set `logo` to its filename to show a
 * real logo for any future entry — no code change required.
 */
export const sponsors: Sponsor[] = [
  { name: "Google", url: "https://google.com", tier: "main", logo: "google.svg" },
  {
    name: "ELIS Innovation Hub",
    url: "https://www.elis.org",
    tier: "platinum",
    logo: "elis-innovation-hub.svg"
  },
  { name: "42 Roma", url: "https://42roma.it/", tier: "platinum", logo: "42-roma.png" },
  { name: "Datwave", url: "https://datwave.ai", tier: "gold", logo: "datwave.svg" },
  { name: "Regolo AI", url: "https://regolo.ai/", tier: "silver", logo: "regolo.svg" },
  { name: "BC Soft", url: "https://www.bcsoft.net/", tier: "silver", logo: "bc-soft.svg" },
  { name: "SharpCoding", url: "https://sharpcoding.it/", technical: true, logo: "sharpcoding.png" },
  { name: "TheRedCode", url: "https://theredcode.it/", technical: true, logo: "theredcode.png" },
  { name: "PyData Roma Capitale", url: "https://pydataroma.python.it/", technical: true, logo: "pydata-roma-capitale.svg" },
  { name: "JetBrains", url: "https://www.jetbrains.com", community: true, logo: "jetbrains.svg" },
  {
    name: "Women Techmakers Italia",
    url: "https://www.womentechmakers.com",
    community: true,
    logo: "women-techmakers.png"
  },
  {
    name: "Golang Roma",
    url: "https://www.golangroma.it/",
    community: true,
    logo: "golangroma.png"
  },
  { name: "RomaJS", url: "https://romajs.org/", community: true, logo: "romajs.png" },
  { name: "BacaroTech", url: "https://bacarotech.github.io/", community: true, logo: "bacarotech.png" }
];
