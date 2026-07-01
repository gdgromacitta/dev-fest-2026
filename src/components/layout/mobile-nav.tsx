"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { navLinks } from "@/src/content/nav-links";

type MobileNavProps = {
  open: boolean;
};

export function MobileNav({ open }: MobileNavProps) {
  const t = useTranslations("nav");

  return (
    <nav
      id="mobile-nav"
      aria-label="Mobile"
      className={`md:hidden ${open ? "block" : "hidden"} rounded-xl border border-slate-200 bg-white p-4`}
    >
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              className="focus-ring block rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100"
              href={link.href}
            >
              {t(link.key)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
