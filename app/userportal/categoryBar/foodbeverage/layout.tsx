"use client";

import { useRouter, usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
const BASE_PATH = "/userportal/categoryBar";
   const categories = [
    { name: "Agricultural Technology", path: `${BASE_PATH}/RoyalPalace` },
    { name: "Beverage Manufacturing", path: `${BASE_PATH}/foodbeverage` },
    { name: "Food Processing", path: `${BASE_PATH}/HistoricPalace` },
    { name: "Food Safety", path: `${BASE_PATH}/GlassPalace` },
    { name: "Hospitality Management", path: `${BASE_PATH}/DesertPalace` },
    { name: "Nutrition and Wellness", path: `${BASE_PATH}/MountainPalace` },
    { name: "Organic and Specialty Foods", path: `${BASE_PATH}/BeachPalace` },
    { name: "Packaging Innovations", path: `${BASE_PATH}/FloatingPalace` },
    { name: "Restaurant Technology", path: `${BASE_PATH}/SmartPalace` },
    { name: "Sustainable Agriculture", path: `${BASE_PATH}/PrivateEstatePalace` },
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
