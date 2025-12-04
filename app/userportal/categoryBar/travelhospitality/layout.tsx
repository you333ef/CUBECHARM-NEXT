"use client";

import { useRouter, usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
const BASE_PATH = "/userportal/categoryBar";
  const categories = [
    { name: "Hotel Management", path: `${BASE_PATH}/HotelManagement` },
    { name: "Travel Technology", path: `${BASE_PATH}/TravelTechnology` },
    { name: "Tourism Marketing", path: `${BASE_PATH}/TourismMarketing` },
    { name: "Destination Management", path: `${BASE_PATH}/travelhospitality` },
    { name: "Event Planning", path: `${BASE_PATH}/EventPlanning` },
    { name: "Restaurant Management", path: `${BASE_PATH}/RestaurantManagement` },
    { name: "Hospitality Software", path: `${BASE_PATH}/HospitalitySoftware` },
    { name: "Travel Apps", path: `${BASE_PATH}/TravelApps` },
    { name: "Luxury Travel", path: `${BASE_PATH}/LuxuryTravel` },
    { name: "Sustainable Tourism", path: `${BASE_PATH}/SustainableTourism` },
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
