import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

// createNextIntlPlugin reads i18n/request.ts by default.
// Keep the plugin instantiation separate so a PWA plugin (or any other
// wrapper) can be composed around it cleanly in a future issue.
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true
  },
};

export default withNextIntl(nextConfig);
