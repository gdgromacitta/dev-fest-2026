import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Header } from "@/src/components/layout/header";
import { Footer } from "@/src/components/layout/footer";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// Locale layout — wraps every page with the NextIntlClientProvider
// (so client components can call useTranslations), the skip-link,
// the persistent Header, and the Footer.
// The <html> and <body> tags live in the root layout (app/layout.tsx).
export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Reject unknown locales — renders the closest not-found boundary.
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <a href="#main-content" className="focus-ring sr-only rounded bg-white px-3 py-2">
        Skip to content
      </a>
      <Header />
      <div className="page-shell" id="main-content">
        {children}
      </div>
      <Footer />
    </NextIntlClientProvider>
  );
}
