import type { PastSponsor } from "@/src/types/content";

type Props = {
  sponsors: PastSponsor[];
  heading: string;
};

// Repeat the visible sequence twice so a short list still fills wide
// viewports before the seam is reached — the loop itself only ever needs
// two equal-width copies of "the sequence" (whatever that sequence is) to
// translate seamlessly by -50%.
const SEQUENCE_REPEATS = 2;

/**
 * CSS-only auto-scrolling logo strip ("chi ha creduto in noi" — past
 * sponsors). No JavaScript and no client boundary: the loop, the
 * hover-pause, and the reduced-motion fallback are all plain CSS (see
 * `.sponsor-marquee*` rules in `app/globals.css`).
 *
 * The track renders two identical `<ul>` groups back to back and animates a
 * translateX from 0 to -50%, which is exactly one group's width — that
 * makes the wrap seamless regardless of how many items there are. The
 * second group is `aria-hidden` so screen readers don't announce every name
 * twice, and logos aren't wrapped in links here (a scrolling strip would
 * otherwise double the tab stops for the same nine names).
 */
export function PastSponsorsMarquee({ sponsors, heading }: Props) {
  if (sponsors.length === 0) return null;

  const sequence = Array.from({ length: SEQUENCE_REPEATS }, () => sponsors).flat();

  return (
    <section aria-labelledby="past-sponsors-heading">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-16 md:px-16 md:py-24">
        <h2 id="past-sponsors-heading" className="eyebrow mb-7 text-accent-gray-deep">
          {heading}
        </h2>
        <div className="sponsor-marquee">
          <div className="sponsor-marquee__track">
            <ul role="list" className="sponsor-marquee__group">
              {sequence.map((sponsor, index) => (
                <li key={`${sponsor.name}-${index}`} className="sponsor-marquee__item">
                  <img
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    width={160}
                    height={80}
                    loading="lazy"
                    className="h-20 w-40 flex-none object-contain grayscale transition-[filter] duration-200 hover:grayscale-0"
                  />
                </li>
              ))}
            </ul>
            {/* Duplicate for the seamless loop — hidden from assistive tech so names aren't announced twice. */}
            <ul role="list" aria-hidden="true" className="sponsor-marquee__group">
              {sequence.map((sponsor, index) => (
                <li key={`dup-${sponsor.name}-${index}`} className="sponsor-marquee__item">
                  <img
                    src={sponsor.logoUrl}
                    alt=""
                    width={160}
                    height={80}
                    loading="lazy"
                    className="h-20 w-40 flex-none object-contain grayscale"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
