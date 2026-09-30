"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter, usePathname } from "@/src/i18n/navigation";
import { MobileNav } from "@/src/components/layout/mobile-nav";
import { navLinks, registerUrl } from "@/src/content/nav-links";

export function Header() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // The menu floats over the page, so Escape, the scrim, a chosen link and
  // the locale switch all close it rather than leaving the content covered.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function toggleLocale() {
    setOpen(false);
    router.replace(pathname, { locale: locale === "it" ? "en" : "it" });
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    if (href.includes("#")) return false;
    return pathname.startsWith(href);
  }

  return (
    <header role="banner" className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-4 md:h-[88px] md:px-16">
        <Link href="/" className="focus-ring rounded-md py-1">
          <img src="/logos/devfest-roma-horizontal.svg" alt="DevFest Roma" className="h-7 w-auto md:h-8" />
        </Link>
        <div className="flex items-center gap-3 md:gap-9">
          <nav aria-label="Main" className="hidden md:block">
            <ul className="m-0 flex list-none items-center gap-9 p-0 text-[15px]">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    className={`focus-ring rounded-md ${
                      isActive(link.href) ? "font-semibold text-primary" : "font-medium text-ink"
                    }`}
                    href={link.href}
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            onClick={toggleLocale}
            className="focus-ring rounded-full border border-line px-3 py-1.5 text-xs font-semibold tracking-[0.05em] text-muted hover:bg-tint"
            aria-label={t("langToggleAriaLabel")}
          >
            {locale === "it" ? "EN" : "IT"}
          </button>
          <a
            href={registerUrl}
            className="focus-ring hidden rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-deep md:inline-flex"
          >
            {t("registerCta")}
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={t("menuAriaLabel")}
            className="focus-ring rounded-md border border-line px-3 py-2 text-sm font-medium md:hidden"
            onClick={() => setOpen((current) => !current)}
          >
            {t("menuAriaLabel")}
          </button>
        </div>
      </div>
      {/* Overlay below the sticky header instead of in-flow, so opening the
          menu doesn't push the page down. `absolute` rather than `fixed`: the
          header's backdrop-blur makes it the containing block either way. */}
      {open ? (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-full h-[100dvh] bg-slate-900/20 md:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <div className="pointer-events-none absolute inset-x-0 top-full mx-auto w-full max-w-[1440px] px-4 pt-2 md:px-16">
        <MobileNav open={open} onNavigate={() => setOpen(false)} />
      </div>
    </header>
  );
}
