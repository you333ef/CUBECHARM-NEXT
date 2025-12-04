"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Layout({ children }:any) {
  const router = useRouter();
  const pathname = usePathname();
  const BASE_PATH = "/userportal/categoryBar";


  const categories = [
    { name: "Standard Residential Apartment", path: `${BASE_PATH}/StandardResidentialApartment` },
    { name: "Serviced Apartment (Aparthotel)", path: `${BASE_PATH}/ServicedApartment` },
    { name: "Standalone Villa", path: `${BASE_PATH}/StandaloneVilla` },
    { name: "Twin-house Villa", path: `${BASE_PATH}/TwinHouseVilla` },
    { name: "Luxury Hotel (5-star)", path: `${BASE_PATH}/LuxuryHotel5Star` },
    { name: "Budget Hotel (2-3 stars)", path: `${BASE_PATH}/residentialaccommodations` },
    { name: "Boutique Hotel (artistic design)", path: `${BASE_PATH}/BoutiqueHotel` },
    { name: "Mountain Chalet", path: `${BASE_PATH}/MountainChalet` },
    { name: "Beachfront Chalet", path: `${BASE_PATH}/BeachfrontChalet` },
    { name: "Traveler Hostel", path: `${BASE_PATH}/TravelerHostel` },
    { name: "Traditional Heritage House", path: `${BASE_PATH}/TraditionalHeritageHouse` },
    { name: "University Student Housing", path: `${BASE_PATH}/UniversityStudentHousing` },
    { name: "Temporary Worker Accommodation", path: `${BASE_PATH}/TemporaryWorkerAccommodation` },
    { name: "Resort Complex", path: `${BASE_PATH}/ResortComplex` },
    { name: "Mobile Home (Caravan)", path: `${BASE_PATH}/MobileHomeCaravan` },
    { name: "Emergency Shelter (homeless)", path: `${BASE_PATH}/EmergencyShelter` },
    { name: "Short-term Rental (e.g., Airbnb)", path: `${BASE_PATH}/ShortTermRental` },
    { name: "Royal Palace", path: `${BASE_PATH}/RoyalPalace` },
    { name: "Rural Agritourism Homestay", path: `${BASE_PATH}/RuralAgritourismHomestay` },
    { name: "Expatriate Compound Housing", path: `${BASE_PATH}/ExpatriateCompoundHousing` },
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
