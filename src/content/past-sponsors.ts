import type { PastSponsor } from "@/src/types/content";

/**
 * Paying sponsors and partners from the 2025 event, shown in the "chi ha
 * creduto in noi" marquee on the sponsors page and the home page. This list
 * is deliberately not divided by year and excludes the GDG Family chapters
 * and community partners from the 2025 site — only paying sponsors/partners
 * belong here.
 *
 * Logos are the same assets the 2025 site (gdgromacitta.github.io/devFest)
 * used for these sponsors, copied into `public/logos/`. "BacaroTech" is the
 * community's actual name (a Venetian wine-bar pun on "C#"/sharp) — the 2025
 * site's own asset filename ("bacaroTech.png") confirms the spelling.
 */
export const pastSponsors: PastSponsor[] = [
  { name: "Google", logoUrl: "/logos/google-2025.png" },
  { name: "Immobiliare Labs", logoUrl: "/logos/immobiliare-labs.png" },
  { name: "Ready2Use", logoUrl: "/logos/ready2use.png" },
  { name: "Bizzy Now", logoUrl: "/logos/bizzy-now.png" },
  { name: "DatWave", logoUrl: "/logos/datwave.png" },
  { name: "SharpCoding", logoUrl: "/logos/sharpcoding.png" },
  { name: "BacaroTech", logoUrl: "/logos/bacarotech.png" },
  { name: "Scry Studios", logoUrl: "/logos/scry-studios.png" },
  { name: "Welyk", logoUrl: "/logos/welyk.png" }
];
