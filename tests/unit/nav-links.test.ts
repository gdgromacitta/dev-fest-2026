import { navLinks } from "@/src/content/nav-links";
import { features } from "@/src/content/features";

// Pinned to the feature flags rather than a fixed list of hrefs, so flipping
// features.agenda/speakers doesn't fail the suite.
const ALL_LINKS = [
  { href: "/", key: "home" },
  { href: "/venue", key: "venue" },
  { href: "/agenda", key: "agenda" },
  { href: "/speakers", key: "speakers" },
  { href: "/sponsors", key: "sponsors" },
  { href: "/about", key: "about" },
  { href: "/#faq", key: "faq" }
] as const;

const isEnabled = (key: string) => features[key as keyof typeof features] ?? true;

describe("navLinks", () => {
  test("contains exactly the links whose feature flag is on, in design order", () => {
    expect(navLinks.map((link) => link.href)).toEqual(
      ALL_LINKS.filter((link) => isEnabled(link.key)).map((link) => link.href)
    );
  });

  test("hides every link whose feature flag is off", () => {
    const hidden = ALL_LINKS.filter((link) => !isEnabled(link.key)).map((link) => link.href);
    expect(navLinks.filter((link) => hidden.includes(link.href as (typeof hidden)[number]))).toEqual([]);
  });

  test("always shows links that have no feature flag", () => {
    const hrefs = navLinks.map((link) => link.href);
    expect(hrefs).toContain("/");
  });

  test("every link has a label and a key", () => {
    for (const link of navLinks) {
      expect(link.label).toBeTruthy();
      expect(link.key).toBeTruthy();
    }
  });
});
