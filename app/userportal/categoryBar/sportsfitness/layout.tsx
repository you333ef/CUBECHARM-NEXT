"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Layout({ children }:any) {
  const router = useRouter();
  const pathname = usePathname();
  const BASE_PATH = "/userportal/categoryBar";


  const categories = [
    { name: "Women Gym", path: `${BASE_PATH}/WomenGym` },
    { name: "Men Gym", path: `${BASE_PATH}/MenGym` },
    { name: "Co-ed Fitness", path: `${BASE_PATH}/CoedFitness` },
    { name: "Football Stadium", path: `${BASE_PATH}/FootballStadium` },
    { name: "Tennis Court", path: `${BASE_PATH}/TennisCourt` },
    { name: "Racing Track", path: `${BASE_PATH}/RacingTrack` },
    { name: "Scuba Center", path: `${BASE_PATH}/sportsfitness` },
    { name: "Golf Club", path: `${BASE_PATH}/GolfClub` },
    { name: "Cycling Path", path: `${BASE_PATH}/CyclingPath` },
    { name: "Jogging Track", path: `${BASE_PATH}/JoggingTrack` },
    { name: "Bodybuilding Gym", path: `${BASE_PATH}/BodybuildingGym` },
    { name: "Aerial Yoga", path: `${BASE_PATH}/AerialYoga` },
    { name: "Climbing Gym", path: `${BASE_PATH}/ClimbingGym` },
    { name: "Equestrian Club", path: `${BASE_PATH}/EquestrianClub` },
    { name: "Archery Range", path: `${BASE_PATH}/ArcheryRange` },
    { name: "Ice Rink", path: `${BASE_PATH}/IceRink` },
    { name: "Olympic Pool", path: `${BASE_PATH}/OlympicPool` },
    { name: "Basketball Arena", path: `${BASE_PATH}/BasketballArena` },
    { name: "Table Tennis", path: `${BASE_PATH}/TableTennis` },
    { name: "Athlete Training", path: `${BASE_PATH}/AthleteTraining` },
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
