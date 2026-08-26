// Social share card shown by WhatsApp, Telegram, Facebook, and X.
//
// A real .png under public/ rather than a Next `opengraph-image` metadata
// route: `output: "export"` emits that route as an extensionless file, which
// GitHub Pages serves as `application/octet-stream` — scrapers check
// Content-Type and drop it. Regenerate with `npm run generate:og`.
export const socialImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "DevFest Roma 2026 — 10 ottobre 2026, Roma"
} as const;
