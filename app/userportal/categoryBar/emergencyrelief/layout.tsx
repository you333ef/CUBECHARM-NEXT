"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Layout({ children }:any) {
  const router = useRouter();
  const pathname = usePathname();
  const BASE_PATH = "/userportal/categoryBar";


    const categories = [
    { name: "Police Station", path: "/HomeList/Emergency/Police-Station" },
    { name: "Mobile Police", path: "/HomeList/Emergency/Mobile-Police" },
    { name: "Fire Headquarters", path: "/HomeList/Emergency/Fire-Headquarters" },
    { name: "Marine Rescue", path: "/HomeList/Emergency/Marine-Rescue" },
    { name: "Mountain Rescue", path: "/HomeList/Emergency/Mountain-Rescue" },
    { name: "Field Hospital", path: "/HomeList/Emergency/Field-Hospital" },
    { name: "Disaster Shelter", path: "/HomeList/Emergency/Disaster-Shelter" },
    { name: "Blood Center", path: "/HomeList/Emergency/Blood-Center" },
    { name: "Mobile Ambulance", path: "/HomeList/Emergency/Mobile-Ambulance" },
    { name: "Emergency Hotline", path: "/HomeList/Emergency/Emergency-Hotline" },
    { name: "Temporary Shelter", path: "/HomeList/Emergency/Temporary-Shelter" },
    { name: "Fire Base", path: "/HomeList/Emergency/Fire-Base" },
    { name: "Quake Station", path: "/HomeList/Emergency/Quake-Station" },
    { name: "Hurricane Alert", path: "/HomeList/Emergency/Hurricane-Alert" },
    { name: "Animal Rescue", path: "/HomeList/Emergency/Animal-Rescue" },
    { name: "Flood Relief", path: "/HomeList/Emergency/Flood-Relief" },
    { name: "Disaster Docs", path: "/HomeList/Emergency/Disaster-Docs" },
    { name: "Training Academy", path: "/HomeList/Emergency/Training-Academy" },
    { name: "Food Warehouse", path: "/HomeList/Emergency/Food-Warehouse" },
    { name: "Rehab Center", path: "/HomeList/Emergency/Rehab-Center" },
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
