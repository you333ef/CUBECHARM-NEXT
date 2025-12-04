"use client";

import { useRouter, usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
const BASE_PATH = "/userportal/categoryBar";
const categories= [
  { name: "Animation", path: `${BASE_PATH}/Animation` },
  { name: "Film Production", path: `${BASE_PATH}/FilmProduction` },
  { name: "Gaming", path: `${BASE_PATH}/GamingTech` },
  { name: "Graphic Design", path: `${BASE_PATH}/GraphicDesign` },
  { name: "Music Technology", path: `${BASE_PATH}/artsentertainment` },
  { name: "Photography", path: `${BASE_PATH}/Photography` },
  { name: "Visual Effects", path: `${BASE_PATH}/VisualEffects` },
  { name: "Virtual Reality ", path: `${BASE_PATH}/VRExperiences` },
  { name: "Augmented Reality Art", path: `${BASE_PATH}/ARArt` },
  { name: "Digital Media", path: `${BASE_PATH}/DigitalMedia` },
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
