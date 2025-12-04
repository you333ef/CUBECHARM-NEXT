"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Layout({ children }:any) {
  const router = useRouter();
  const pathname = usePathname();
  const BASE_PATH = "/userportal/categoryBar";


   const categories= [
    { name: "Historic Mosque", path: `${BASE_PATH}/HistoricMosque` },
    { name: "Modern Mosque", path: `${BASE_PATH}/ModernMosque` },
    { name: "Catholic Church", path: `${BASE_PATH}/CatholicChurch` },
    { name: "Orthodox Church", path: `${BASE_PATH}/OrthodoxChurch` },
    { name: "Buddhist Temple", path: `${BASE_PATH}/BuddhistTemple` },
    { name: "Hindu Temple", path: `${BASE_PATH}/HinduTemple` },
    { name: "Protestant Church", path: `${BASE_PATH}/ProtestantChurch` },
    { name: "Sikh Gurdwara", path: `${BASE_PATH}/SikhGurdwara` },
    { name: "Sufi Shrine", path: `${BASE_PATH}/SufiShrine` },
    { name: "Coptic Church", path: `${BASE_PATH}/CopticChurch` },
    { name: "Quran Center", path: `${BASE_PATH}/QuranCenter` },
    { name: "Meditation Retreat", path: `${BASE_PATH}/MeditationRetreat` },
    { name: "Christian Monastery", path: `${BASE_PATH}/ChristianMonastery` },
    { name: "Historic Cemetery", path: `${BASE_PATH}/HistoricCemetery` },
    { name: "Ghusl Facility", path: `${BASE_PATH}/GhuslFacility` },
    { name: "Airport Prayer Room", path: `${BASE_PATH}/AirportPrayerRoom` },
    { name: "Hospital Chapel", path: `${BASE_PATH}/HospitalChapel` },
    { name: "Mall Temple", path: `${BASE_PATH}/MallTemple` },
    { name: "Interfaith Center", path: `${BASE_PATH}/InterfaithCenter` },
    { name: "Religious Library", path: `${BASE_PATH}/ReligiousLibrary` },
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
