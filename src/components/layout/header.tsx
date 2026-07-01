"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter, usePathname } from "@/src/i18n/navigation";
import { MobileNav } from "@/src/components/layout/mobile-nav";
import { navLinks } from "@/src/content/nav-links";

export function Header() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function toggleLocale() {
    router.replace(pathname, { locale: locale === "it" ? "en" : "it" });
  }

  return (
    <header role="banner" className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="focus-ring rounded-md px-2 py-1">
          <img src="/logos/gdg-roma-horizontal-light.svg" alt="GDG Roma Città" className="h-7 w-auto" />
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLocale}
            className="focus-ring rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            aria-label={t("langToggleAriaLabel")}
          >
            {locale === "it" ? "EN" : "IT"}
          </button>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={t("menuAriaLabel")}
            className="focus-ring rounded-md border border-slate-300 px-3 py-2 text-sm font-medium md:hidden"
            onClick={() => setOpen((current) => !current)}
          >
            {t("menuAriaLabel")}
          </button>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="m-0 flex list-none gap-2 p-0">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    className="focus-ring rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100"
                    href={link.href}
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 pb-3">
        <MobileNav open={open} />
      </div>
    </header>
  );
}
