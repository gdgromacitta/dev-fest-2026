import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { routing } from "@/i18n/routing";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/src/components/pwa/service-worker-registration";

// Restyling design: Poppins for display/headings, Inter for body copy.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-poppins",
  display: "swap"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
// The locale layout at app/[locale]/layout.tsx wraps children
// with NextIntlClientProvider, Header, and Footer.
// We use the default locale here; each [locale] layout sets the
// correct locale via setRequestLocale() for its subtree.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={routing.defaultLocale}>
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
