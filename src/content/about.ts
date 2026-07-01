// `eyebrow`, `title`, and `description` are translated content and live in
// messages/{locale}.json under the `about.*` namespace. Only locale-invariant
// data (CTA hrefs, the visual asset) stays here.
export const aboutHero = {
  primaryCta: { href: "#" },
  secondaryCta: { href: "#" },
  visual: "/logos/gdg-roma-light.svg"
};

// `title`/`description` for each value are translated content and live in
// messages/{locale}.json under `about.value_<key>_title` / `value_<key>_description`.
export const aboutValues = [
  { key: "innovation", color: "#7ba8ff" },
  { key: "community", color: "#f28b82" },
  { key: "globalImpact", color: "#84c98f" }
] as const;
