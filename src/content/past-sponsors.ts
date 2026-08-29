import type { PastSponsor } from "@/src/types/content";

/**
 * Paying sponsors and partners from the 2025 event, shown in the "chi ha
 * creduto in noi" marquee on the sponsors page and the home page. This list
 * is deliberately not divided by year and excludes the GDG Family chapters
 * and community partners from the 2025 site — only paying sponsors/partners
 * belong here.
 *
 * Each entry uses a https://placehold.co/ image as a stand-in until real
 * assets arrive — swapping `logoUrl` for a real asset URL/path is a
 * one-field change, no code change required.
 */
export const pastSponsors: PastSponsor[] = [
  { name: "Google", logoUrl: "https://placehold.co/160x80?text=Google" },
  { name: "Immobiliare Labs", logoUrl: "https://placehold.co/160x80?text=Immobiliare+Labs" },
  { name: "Ready2Use", logoUrl: "https://placehold.co/160x80?text=Ready2Use" },
  { name: "Bizzy Now", logoUrl: "https://placehold.co/160x80?text=Bizzy+Now" },
  { name: "DatWave", logoUrl: "https://placehold.co/160x80?text=DatWave" },
  { name: "SharpCoding", logoUrl: "https://placehold.co/160x80?text=SharpCoding" },
  { name: "BacatoTech", logoUrl: "https://placehold.co/160x80?text=BacatoTech" },
  { name: "Scry Studios", logoUrl: "https://placehold.co/160x80?text=Scry+Studios" },
  { name: "Welyk", logoUrl: "https://placehold.co/160x80?text=Welyk" }
];
