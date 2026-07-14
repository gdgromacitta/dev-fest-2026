import { navLinks } from "@/src/content/nav-links";

describe("navLinks", () => {
  test("contains exactly 6 entries", () => {
    expect(navLinks).toHaveLength(6);
  });

  test("hrefs match the restyling design nav order", () => {
    const hrefs = navLinks.map((link) => link.href);

    expect(hrefs).toEqual(["/", "/venue", "/agenda", "/speakers", "/sponsors", "/#faq"]);
  });
});
