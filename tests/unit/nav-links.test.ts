import { navLinks } from "@/src/content/nav-links";

describe("navLinks", () => {
  test("contains exactly 5 entries", () => {
    expect(navLinks).toHaveLength(5);
  });

  test("hrefs match the restyling design nav order (agenda/speakers hidden)", () => {
    const hrefs = navLinks.map((link) => link.href);

    expect(hrefs).toEqual(["/", "/about", "/venue", "/sponsors", "/#faq"]);
  });
});
