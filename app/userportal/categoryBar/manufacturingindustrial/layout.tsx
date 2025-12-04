"use client";

import { useRouter, usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
const BASE_PATH = "/userportal/categoryBar";
 const categories = [
    { name: "3D Printing", path: `${BASE_PATH}/PrivateHomes` },
    { name: "Automation", path: `${BASE_PATH}/FamilyHouse` },
    { name: "Aerospace", path: `${BASE_PATH}/manufacturingindustrial` },
    { name: "Automotive Technology", path: `${BASE_PATH}/LuxuryPalace` },
    { name: "Building Materials", path: `${BASE_PATH}/CountryCottage` },
    { name: "Chemical Engineering", path: `${BASE_PATH}/MountainChalet` },
    { name: "Construction Equipment", path: `${BASE_PATH}/HeritageHouse` },
    { name: "Energy Efficiency", path: `${BASE_PATH}/PrivateHomes2` },
    { name: "Industrial Robotics", path: `${BASE_PATH}/FamilyHouse2` },
    { name: "Materials Science", path: `${BASE_PATH}/IndependentVilla2` },
    { name: "Packaging Innovations", path: `${BASE_PATH}/LuxuryPalace2` },
    { name: "Process Automation", path: `${BASE_PATH}/CountryCottage2` },
    { name: "Quality Control", path: `${BASE_PATH}/MountainChalet2` },
    { name: "Renewable Energy", path: `${BASE_PATH}/HeritageHouse2` },
    { name: "Smart Manufacturing", path: `${BASE_PATH}/SmartManufacturing` },
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
