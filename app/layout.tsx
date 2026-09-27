import type { Metadata } from "next";
import { socialImage } from "@/src/content/social-image";
import { Inter, Poppins, Roboto_Flex } from "next/font/google";
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

// Variable width + weight axes drive the home hero's scroll animation and the
// theme-word hover; Poppins has neither axis.
const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  axes: ["wdth", "opsz"],
  variable: "--font-flex",
  display: "swap"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://devfest2026.gdgromacitta.it"),
  title: "DevFest Roma by GDG Roma Città",
  description: "Official DevFest Roma website with agenda, speakers, and venue details.",
  manifest: "/manifest.json",
  openGraph: {
    title: "DevFest Roma by GDG Roma Città",
    description: "Discover sessions, speakers, and venue information for DevFest Roma.",
    images: [socialImage],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "DevFest Roma by GDG Roma Città",
    description: "Discover sessions, speakers, and venue information for DevFest Roma.",
    images: [socialImage]
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
      <body className={`${inter.variable} ${poppins.variable} ${robotoFlex.variable} font-sans`}>
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
