import { HeroHeadline } from "@/src/components/home/hero-headline";

type Props = {
  id?: string;
  eyebrow: string;
  /** Two short lines (a word or two each); the second takes the accent color. */
  lines: [string, string];
  /** Screen-reader-only words appended to the h1, e.g. the full page title. */
  srSuffix?: string;
  /** Intro copy and actions, laid out in a row under the title. */
  children?: React.ReactNode;
};

/**
 * Inner-page hero in the home page's style: an oversized Roboto Flex title
 * that condenses on scroll (HeroHeadline), followed by a ruled footer row.
 * Hook-free, so it renders from server pages and client components alike.
 */
export function PageHero({ id, eyebrow, lines, srSuffix, children }: Props) {
  return (
    <section aria-labelledby={id}>
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-8 pt-9 md:px-16 md:pb-12 md:pt-20">
        <div className="eyebrow mb-3 flex items-center gap-2.5 text-muted md:mb-6">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-primary" />
          {eyebrow}
        </div>
        <h1 id={id} className="page-title m-0">
          <HeroHeadline>
            <span className="block">{lines[0]}</span>
            <span className="block text-primary">{lines[1]}</span>
          </HeroHeadline>
          {srSuffix && <span className="sr-only"> {srSuffix}</span>}
        </h1>
        {children && (
          <div className="mt-6 grid gap-6 border-t border-line pt-5 md:mt-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-12">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
