"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer role="contentinfo" className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span>{t("poweredBy")}</span>
          <img src="/logos/gdg-roma-horizontal-light.svg" alt="GDG Roma Città" className="h-6 w-auto" />
        </div>
        <div className="flex gap-4">
          <a className="focus-ring rounded-sm" href="mailto:gdgroma.citta@gmail.com">gdgroma.citta@gmail.com</a>
        </div>
      </div>
    </footer>
  );
}
