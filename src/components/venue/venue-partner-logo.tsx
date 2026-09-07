import { venuePartnerLogoPath } from "@/src/content/venue-partner";

type Props = {
  label?: string;
  className?: string;
  prominent?: boolean;
};

/**
 * Renders the Roma Tre venue-partner logo alongside a support label when
 * `venuePartnerLogoPath` (src/content/venue-partner.ts) is set. Renders
 * nothing while the path is `null`, so callers don't need to reserve any
 * space for it.
 *
 * `prominent` renders a white partner card (label on top, large logo) for
 * the venue hero; the default is a small inline lockup for teasers.
 * The 2024 mark is wide (≈4.6:1), so heights stay modest to keep the
 * rendered width in check; card padding provides the clear space.
 */
export function VenuePartnerLogo({ label, className, prominent = false }: Props) {
  if (!venuePartnerLogoPath) return null;

  if (prominent) {
    return (
      <div className={`flex flex-col items-center gap-5 rounded-[20px] border border-line bg-white px-10 py-8 md:px-14 md:py-10 ${className ?? ""}`}>
        {label && <span className="eyebrow text-muted">{label}</span>}
        <img
          src={venuePartnerLogoPath}
          alt="Università degli Studi Roma Tre"
          width={930}
          height={204}
          className="h-16 w-auto md:h-20"
        />
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-start ${className ?? ""}`}>
      {label && <span className="text-[13px] font-medium text-muted">{label}</span>}
      <div className="px-3 py-2">
        <img
          src={venuePartnerLogoPath}
          alt="Università degli Studi Roma Tre"
          width={930}
          height={204}
          className="h-8 w-auto"
        />
      </div>
    </div>
  );
}
