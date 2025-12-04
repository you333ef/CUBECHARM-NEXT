"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Layout({ children }:any) {
  const router = useRouter();
  const pathname = usePathname();
  const BASE_PATH = "/userportal/categoryBar";


 const categories = [
    { name: "Government and Public Sector", path: `${BASE_PATH}/GovernmentAndPublicSector` },
    { name: "Cybersecurity", path: `${BASE_PATH}/Cybersecurity` },
    { name: "Digital Governance", path: `${BASE_PATH}/DigitalGovernance` },
    { name: "Emergency Response", path: `${BASE_PATH}/EmergencyResponse` },
    { name: "Government IT", path: `${BASE_PATH}/governmentpublicsector` },
    { name: "Public Health", path: `${BASE_PATH}/PublicHealth` },
    { name: "Smart Cities", path: `${BASE_PATH}/SmartCities` },
    { name: "Transportation Infrastructure", path: `${BASE_PATH}/TransportationInfrastructure` },
    { name: "Urban Planning", path: `${BASE_PATH}/UrbanPlanning` },
    { name: "Waste Management", path: `${BASE_PATH}/WasteManagement` },
    { name: "Water Conservation", path: `${BASE_PATH}/WaterConservation` },
  ];

  const isActive = (path:any) => pathname === path;

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
