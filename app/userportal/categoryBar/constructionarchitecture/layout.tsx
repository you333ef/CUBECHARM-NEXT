"use client";

import { useRouter, usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
const BASE_PATH = "/userportal/categoryBar";
   const categories = [
    { name: "Building Information Modeling", path: `${BASE_PATH}/constructionarchitecture` },
    { name: "Construction Equipment", path: `${BASE_PATH}/ConstructionEquipment` },
    { name: "Green Building", path: `${BASE_PATH}/GreenBuilding` },
    { name: "Interior Design", path: `${BASE_PATH}/InteriorDesign` },
    { name: "Landscape Architecture", path: `${BASE_PATH}/LandscapeArchitecture` },
    { name: "Materials Science", path: `${BASE_PATH}/MaterialsScience` },
    { name: "Smart Buildings", path: `${BASE_PATH}/SmartBuildings` },
    { name: "Sustainable Architecture", path: `${BASE_PATH}/SustainableArchitecture` },
    { name: "Urban Planning", path: `${BASE_PATH}/UrbanPlanning` },
    { name: "Architecture Software", path: `${BASE_PATH}/ArchitectureSoftware` },
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
