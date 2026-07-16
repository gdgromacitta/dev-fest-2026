import { navLinks } from "@/src/content/nav-links";

describe("navLinks", () => {
  test("contains exactly 4 entries", () => {
    expect(navLinks).toHaveLength(4);
  });

  test("hrefs match the restyling design nav order (agenda/speakers hidden)", () => {
    const hrefs = navLinks.map((link) => link.href);

    expect(hrefs).toEqual(["/", "/venue", "/sponsors", "/#faq"]);
  });
});
