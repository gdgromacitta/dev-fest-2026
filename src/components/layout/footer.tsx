"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer role="contentinfo" className="bg-ink">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 py-12 text-sm text-mist md:flex-row md:items-center md:justify-between md:px-16">
        <div className="flex items-center gap-2">
          <span>{t("poweredBy")}</span>
          <img src="/logos/gdg-roma-horizontal-light.svg" alt="GDG Roma Città" className="h-[22px] w-auto" />
        </div>
        <a className="focus-ring rounded-sm" href="mailto:gdgroma.citta@gmail.com">gdgroma.citta@gmail.com</a>
      </div>
    </footer>
  );
}
