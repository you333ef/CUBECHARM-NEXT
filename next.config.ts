// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,

  // حذفنا swcMinify لأنه مالهوش وجود دلوقتي (افتراضي true)

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.dubaiimmobilier.fr" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "cubecharm-pt9fnv6w7-yousef1.vercel.app" },
      { protocol: "https", hostname: "**.vercel.app" }, // لو عايز تفتحها على كل الـ deploys
    ],
  },

  webpack(config) {
    // الحل السحري: نجمع كل الـ CSS في ملف واحد اسمه styles.css
    config.optimization.splitChunks = {
      cacheGroups: {
        default: false,
        vendors: false,

        // كل الـ CSS (Tailwind + ملفاتك) في chunk واحد
        styles: {
          name: "styles",
          type: "css/mini-extract",
          chunks: "all",
          enforce: true,
          priority: 999,
        },
      },
    };

    return config;
  },

  experimental: {
    webpackBuildWorker: true,        // يسرّع الـ build
    // لو عندك out of memory في Vercel أثناء الـ build، فعّل السطر ده:
    // isrMemoryCacheSize: 0,
  },
};

export default nextConfig;