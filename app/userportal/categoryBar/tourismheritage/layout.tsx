"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Layout({ children }:any) {
  const router = useRouter();
  const pathname = usePathname();
  const BASE_PATH = "/userportal/categoryBar";


  const categories= [
    { name: "Pyramids", path: `${BASE_PATH}/Pyramids` },
    { name: "Historic Castles", path: `${BASE_PATH}/HistoricCastles` },
    { name: "Archaeology Museum", path: `${BASE_PATH}/ArchaeologyMuseum` },
    { name: "Tourist Beach", path: `${BASE_PATH}/TouristBeach` },
    { name: "Island Resort", path: `${BASE_PATH}/IslandResort` },
    { name: "Desert Resort", path: `${BASE_PATH}/DesertResort` },
    { name: "Heritage Village", path: `${BASE_PATH}/tourismheritage` },
    { name: "Waterfall", path: `${BASE_PATH}/Waterfall` },
    { name: "Tourist Cave", path: `${BASE_PATH}/TouristCave` },
    { name: "Walking Trail", path: `${BASE_PATH}/WalkingTrail` },
    { name: "Tourist Market", path: `${BASE_PATH}/TouristMarket` },
    { name: "Historic Bridge", path: `${BASE_PATH}/HistoricBridge` },
    { name: "Religious Site", path: `${BASE_PATH}/ReligiousSite` },
    { name: "Heritage Station", path: `${BASE_PATH}/HeritageStation` },
    { name: "Palace Visit", path: `${BASE_PATH}/PalaceVisit` },
    { name: "Botanical Garden", path: `${BASE_PATH}/BotanicalGarden` },
    { name: "Film Location", path: `${BASE_PATH}/FilmLocation` },
    { name: "Literary Landmark", path: `${BASE_PATH}/LiteraryLandmark` },
    { name: "Night Market", path: `${BASE_PATH}/NightMarket` },
    { name: "Desert Safari", path: `${BASE_PATH}/DesertSafari` },
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
