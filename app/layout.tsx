import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/src/components/pwa/service-worker-registration";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "DevFest Roma by GDG Roma Città",
  description: "Official DevFest Roma website with agenda, speakers, and venue details.",
  manifest: "/manifest.json",
  openGraph: {
    title: "DevFest Roma by GDG Roma Città",
    description: "Discover sessions, speakers, and venue information for DevFest Roma.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "DevFest Roma by GDG Roma Città",
    description: "Discover sessions, speakers, and venue information for DevFest Roma."
  }
};

// Root layout — owns <html> and <body>.
// Uses getLocale() from next-intl/server so the lang attribute
// reflects the active locale set by the middleware.
// The locale layout at app/[locale]/layout.tsx wraps children
// with NextIntlClientProvider, Header, and Footer.
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body className={poppins.className}>
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
