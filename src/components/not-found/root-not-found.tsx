"use client";

import { useSyncExternalStore } from "react";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "@/src/components/layout/header";
import { Footer } from "@/src/components/layout/footer";
import { NotFoundContent } from "@/src/components/not-found/not-found-content";
import { localeFromPath } from "@/src/components/not-found/locale-from-path";
import enMessages from "@/messages/en.json";
import itMessages from "@/messages/it.json";

const subscribeNever = () => () => {};

const catalogues = { en: enMessages, it: itMessages };

// The root 404 sits outside app/[locale], so there is no locale provider.
// Static HTML prerenders in Italian; after hydration the locale is read from
// the real URL, so /en/... misses briefly flash Italian first (accepted).
// The header's locale toggle calls router.replace(pathname, {locale}), which
// re-navigates to /<other-locale><path> — another 404 in the other language.
export function RootNotFound() {
  // Server/hydration snapshot is "/" (-> it); the client snapshot is the URL.
  const pathname = useSyncExternalStore(subscribeNever, () => window.location.pathname, () => "/");
  const locale = localeFromPath(pathname);

  return (
    <NextIntlClientProvider locale={locale} messages={catalogues[locale]} timeZone="Europe/Rome">
      <Header />
      <NotFoundContent />
      <Footer />
    </NextIntlClientProvider>
  );
}
