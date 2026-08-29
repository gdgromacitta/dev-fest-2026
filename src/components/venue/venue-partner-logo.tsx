import { venuePartnerLogoPath } from "@/src/content/venue-partner";

type Props = {
  label: string;
  className?: string;
};

/**
 * Renders the Roma Tre venue-partner logo alongside a support label when
 * `venuePartnerLogoPath` (src/content/venue-partner.ts) is set. Renders
 * nothing while the path is `null`, so callers don't need to reserve any
 * space for it.
 */
export function VenuePartnerLogo({ label, className }: Props) {
  if (!venuePartnerLogoPath) return null;

  return (
    <div className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <span className="text-[13px] font-medium text-muted">{label}</span>
      <img
        src={venuePartnerLogoPath}
        alt="Università degli Studi Roma Tre"
        className="h-8 w-auto"
      />
    </div>
  );
}
