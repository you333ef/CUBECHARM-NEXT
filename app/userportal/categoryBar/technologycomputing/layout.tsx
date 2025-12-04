"use client";

import { useRouter, usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const categories = [
    { name: "Machine Learning (ML)", path: "/HomeList/HOTELSCONTAINER/Budget" },
    { name: "Blockchain", path: "/HomeList/HOTELSCONTAINER/Luxury" },
    { name: "Cloud Computing", path: "/HomeList/HOTELSCONTAINER/Airport" },
    { name: "Cybersecurity", path: "/HomeList/HOTELSCONTAINER/City" },
    { name: "Data Analytics", path: "/userportal/categoryBar/technologycomputing" },

    { name: "Digital Transformation", path: "/HomeList/HOTELSCONTAINER/DigitalTransformation" },
    { name: "E-commerce", path: "/HomeList/HOTELSCONTAINER/Ecommerce" },
    { name: "Entrepreneurship", path: "/HomeList/HOTELSCONTAINER/Entrepreneurship" },
    { name: "Environmental Sustainability", path: "/HomeList/HOTELSCONTAINER/EnvironmentalSustainability" },
    { name: "Global Market Trends", path: "/HomeList/HOTELSCONTAINER/GlobalMarketTrends" },
    { name: "Innovation", path: "/HomeList/HOTELSCONTAINER/Innovation" },
    { name: "Internet of Things (IoT)", path: "/HomeList/HOTELSCONTAINER/IoT" },
    { name: "Networking", path: "/HomeList/HOTELSCONTAINER/Networking" },
    { name: "Robotics", path: "/HomeList/HOTELSCONTAINER/Robotics" },
    { name: "Supply Chain Optimization", path: "/HomeList/HOTELSCONTAINER/SupplyChain" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-full">
      {/* Categories Bar */}
      <div className="w-full mt-10 py-4">
        <div className="flex flex-row gap-3 overflow-x-auto scrollbar-hide px-4 pb-2">
          {categories.map((cat, index) => (
            <button
              key={cat.name}
              onClick={() => router.push(cat.path)}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`
                group
                flex items-center justify-center
                px-5 py-2.5
                rounded-full
                cursor-pointer
                transition-all duration-300 ease-out
                text-sm font-medium
                whitespace-nowrap
                animate-fade-in
                outline-none
                focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                ${
                  isActive(cat.path)
                    ? "bg-[#D0E7FF] text-[#0B63C5]"
                    : "bg-[#F2F2F2] text-[#555] hover:bg-[#E5E5E5] hover:text-[#222]"
                }
              `}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Outlet → children */}
      <div className="px-4 mt-4">
        {children}
      </div>
    </div>
  );
}
