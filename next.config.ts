import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,

  images: {
    formats: ["image/avif", "image/webp"],       
    remotePatterns: [
      { protocol: "https", hostname: "cdn.dubaiimmobilier.fr" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "cf.bstatic.com" },
    ],
  },

  experimental: {
    optimizePackageImports: ["lucide-react"],   
  },
};

export default nextConfig;