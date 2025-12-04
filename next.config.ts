import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,

  experimental: {
    optimizeCss: true,
  },

  productionBrowserSourceMaps: false,

  images: {
    domains: [
      "cdn.dubaiimmobilier.fr",
      "images.unsplash.com",
      "i.pravatar.cc",
    ],
  },
};

export default nextConfig;
