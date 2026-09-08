import type { Sponsor } from "@/src/types/content";

type Props = {
  sponsor: Sponsor;
  className?: string;
};

/**
 * Renders a sponsor's logo from `public/logos/<sponsor.logo>` when set, or
 * falls back to the sponsor's name — no broken `<img>` ever renders. Adding
 * a logo file and setting `sponsor.logo` is sufficient to switch a sponsor
 * over to its real logo, no code change required.
 */
export function SponsorLogo({ sponsor, className }: Props) {
  if (!sponsor.logo) {
    return <span className={className}>{sponsor.name}</span>;
  }

  return (
    // Plain <img>, matching the rest of the app (header/footer/team-card):
    // static export with images.unoptimized makes next/image of limited use,
    // and logo files may not exist yet for every sponsor.
    <img
      src={`/logos/${sponsor.logo}`}
      alt={sponsor.name}
      className={className ? `${className} max-h-full w-auto object-contain` : "max-h-full w-auto object-contain"}
    />
  );
}
