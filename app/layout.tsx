import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/src/components/layout/header";
import { Footer } from "@/src/components/layout/footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "DevFest by GDG",
  description: "Official DevFest website with agenda, speakers, and venue details.",
  openGraph: {
    title: "DevFest by GDG",
    description: "Discover sessions, speakers, and venue information for DevFest.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "DevFest by GDG",
    description: "Discover sessions, speakers, and venue information for DevFest."
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <a href="#main-content" className="focus-ring sr-only rounded bg-white px-3 py-2">
          Skip to content
        </a>
        <Header />
        <div className="page-shell" id="main-content">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
