import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,

  images: {
    domains: [
      "cdn.dubaiimmobilier.fr",
      "images.unsplash.com",
      "i.pravatar.cc",
      "cf.bstatic.com",
      "localhost"
    ],
    
  },

};

export default nextConfig;