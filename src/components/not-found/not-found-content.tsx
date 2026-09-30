"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";

// Shared by app/not-found.tsx (root miss) and app/[locale]/not-found.tsx.
// The iframe src is root-absolute so it resolves on deep misses such as
// /en/speakers/nonexistent. The iframe is focusable (tabIndex 0) so keyboard
// input lands inside the game document and never scrolls this page.
export function NotFoundContent() {
  const t = useTranslations("notFound");

  return (
    <main id="main-content" className="mx-auto w-full max-w-[960px] px-4 py-12 md:px-16 md:py-16">
      <h1 className="font-display text-3xl font-bold text-ink md:text-5xl">{t("title")}</h1>
      <p className="mt-4 text-lg text-muted">{t("body")}</p>
      <p className="mt-6">
        <Link href="/" className="focus-ring rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-deep">
          {t("backHome")}
        </Link>
      </p>
      <iframe
        src="/game/index.html"
        title={t("gameTitle")}
        tabIndex={0}
        className="focus-ring mt-10 block h-[220px] w-full rounded-lg border border-line bg-[#f7f7f7]"
      />
      <p className="mt-3 text-sm text-muted">{t("gameHint")}</p>
    </main>
  );
}
