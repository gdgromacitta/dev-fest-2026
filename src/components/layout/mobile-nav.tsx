"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { navLinks } from "@/src/content/nav-links";

type MobileNavProps = {
  open: boolean;
  /** Fired when a link is chosen, so the overlay closes even on same-page links. */
  onNavigate?: () => void;
};

export function MobileNav({ open, onNavigate }: MobileNavProps) {
  const t = useTranslations("nav");

  return (
    <nav
      id="mobile-nav"
      aria-label="Mobile"
      className={`md:hidden ${open ? "block" : "hidden"} pointer-events-auto rounded-xl border border-slate-200 bg-white p-4 shadow-lg`}
    >
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              className="focus-ring block rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100"
              href={link.href}
              onClick={onNavigate}
            >
              {t(link.key)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
