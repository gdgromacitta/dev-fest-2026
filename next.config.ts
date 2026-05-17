import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true
  },
  async redirects() {
    return [
      { source: "/about",    destination: "/", permanent: false },
      { source: "/agenda",   destination: "/", permanent: false },
      { source: "/speakers", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
