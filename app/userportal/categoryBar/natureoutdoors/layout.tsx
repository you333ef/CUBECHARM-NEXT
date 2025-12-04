"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Layout({ children }:any) {
  const router = useRouter();
  const pathname = usePathname();
  const BASE_PATH = "/userportal/categoryBar";


   const categories = [
    { name: "Urban Park", path: `${BASE_PATH}/UrbanPark` },
    { name: "National Park", path: `${BASE_PATH}/NationalPark` },
    { name: "Forest Reserve", path: `${BASE_PATH}/ForestReserve` },
    { name: "Desert Zone", path: `${BASE_PATH}/DesertZone` },
    { name: "Mountain Area", path: `${BASE_PATH}/MountainArea` },
    { name: "Sandy Beach", path: `${BASE_PATH}/SandyBeach` },
    { name: "Rocky Shoreline", path: `${BASE_PATH}/RockyShoreline` },
    { name: "Artificial Lake", path: `${BASE_PATH}/ArtificialLake` },
    { name: "Freshwater Lake", path: `${BASE_PATH}/FreshwaterLake` },
    { name: "River Rafting", path: `${BASE_PATH}/RiverRafting` },
    { name: "Waterfall View", path: `${BASE_PATH}/WaterfallView` },
    { name: "Cave System", path: `${BASE_PATH}/CaveSystem` },
    { name: "Bird Sanctuary", path: `${BASE_PATH}/BirdSanctuary` },
    { name: "Mountain Biking", path: `${BASE_PATH}/MountainBiking` },
    { name: "Camping Site", path: `${BASE_PATH}/CampingSite` },
    { name: "Safari Park", path: `${BASE_PATH}/SafariPark` },
    { name: "Flower Nursery", path: `${BASE_PATH}/FlowerNursery` },
    { name: "Turtle Beach", path: `${BASE_PATH}/TurtleBeach` },
    { name: "Hunting Reserve", path: `${BASE_PATH}/HuntingReserve` },
    { name: "Hiking Trail", path: `${BASE_PATH}/HikingTrail` },
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
