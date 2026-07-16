// `eyebrow`, `title`, and `description` are translated content and live in
// messages/{locale}.json under the `about.*` namespace. Only locale-invariant
// data (CTA hrefs, the visual asset) stays here.
export const aboutHero = {
  primaryCta: { href: "#" },
  secondaryCta: { href: "#" },
  visual: "/logos/devfest-roma-horizontal.svg"
};

// `title`/`description` for each value are translated content and live in
// messages/{locale}.json under `about.value_<key>_title` / `value_<key>_description`.
// Dot/soft pairs use the restyling design's accent tokens (tailwind.config.ts).
export const aboutValues = [
  { key: "innovation", dot: "bg-primary", soft: "bg-primary-soft" },
  { key: "community", dot: "bg-accent-red", soft: "bg-accent-red-soft" },
  { key: "globalImpact", dot: "bg-accent-green", soft: "bg-accent-green-soft" }
] as const;
