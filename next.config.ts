import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

// createNextIntlPlugin reads i18n/request.ts by default.
// Keep the plugin instantiation separate so a PWA plugin (or any other
// wrapper) can be composed around it cleanly in a future issue.
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    unoptimized: true
  },
  async redirects() {
    // Pre-launch redirects — keep the site locked to Home and Venue.
    // After the locale restructure these paths are locale-prefixed.
    // The next-intl middleware redirects /about → /it/about first,
    // then these config redirects send /it/about → /it/ etc.
    return [
      { source: "/it/about",    destination: "/it", permanent: false },
      { source: "/it/agenda",   destination: "/it", permanent: false },
      { source: "/it/speakers", destination: "/it", permanent: false },
      { source: "/en/about",    destination: "/en", permanent: false },
      { source: "/en/agenda",   destination: "/en", permanent: false },
      { source: "/en/speakers", destination: "/en", permanent: false },
    ];
  },
};

export default withNextIntl(nextConfig);
