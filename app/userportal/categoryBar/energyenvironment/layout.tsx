"use client";

import { useRouter, usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
const BASE_PATH = "/userportal/categoryBar";
 const categories = [
  { name: "Renewable Energy", path: `${BASE_PATH}/constructionarchitecture` },
  { name: "Solar Power Systems", path: `${BASE_PATH}/ConstructionEquipment` },
  { name: "Wind Energy Technology", path: `${BASE_PATH}/GreenBuilding` },
  { name: "Hydropower Engineering", path: `${BASE_PATH}/InteriorDesign` },
  { name: "Geothermal Energy", path: `${BASE_PATH}/energyenvironment` },
  { name: "Energy Storage Solutions", path: `${BASE_PATH}/MaterialsScience` },
  { name: "Smart Grid Systems", path: `${BASE_PATH}/SmartBuildings` },
  { name: "Sustainable Energy Policy", path: `${BASE_PATH}/SustainableArchitecture` },
  { name: "Carbon Capture Technology", path: `${BASE_PATH}/UrbanPlanning` },
  { name: "Environmental Monitoring", path: `${BASE_PATH}/ArchitectureSoftware` },

  { name: "Water Resource Management", path: `${BASE_PATH}/constructionarchitecture` },
  { name: "Waste-to-Energy Technology", path: `${BASE_PATH}/ConstructionEquipment` },
  { name: "Climate Change Solutions", path: `${BASE_PATH}/GreenBuilding` },
  { name: "Air Quality Management", path: `${BASE_PATH}/InteriorDesign` },
  { name: "Sustainable Agriculture", path: `${BASE_PATH}/LandscapeArchitecture` },
  { name: "Eco-Friendly Materials", path: `${BASE_PATH}/MaterialsScience` },
  { name: "Recycling & Waste Management", path: `${BASE_PATH}/SmartBuildings` },
  { name: "Environmental Policy & Law", path: `${BASE_PATH}/SustainableArchitecture` },
  { name: "Ocean & Marine Conservation", path: `${BASE_PATH}/UrbanPlanning` },
  { name: "Biodiversity & Wildlife Protection", path: `${BASE_PATH}/ArchitectureSoftware` },
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
